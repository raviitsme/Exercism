import mongoose, { Document, Schema } from 'mongoose'

export interface IPlayerResult {
  user_id: mongoose.Types.ObjectId
  position: number
  kills: number
  survival_time: number
  loyalty_points_earned: number
  winnings: number
}

export interface IMatchResult extends Document {
  tournament_id: mongoose.Types.ObjectId
  player_results: IPlayerResult[]
  submitted_by: mongoose.Types.ObjectId
  verified: boolean
  verification_notes?: string
  created_at: Date
  updated_at: Date
  calculatePlayerStats(userId: mongoose.Types.ObjectId): IPlayerResult | null
  getTopPlayers(limit?: number): IPlayerResult[]
  getTotalPrizeDistributed(): number
}

const playerResultSchema = new Schema<IPlayerResult>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  position: {
    type: Number,
    required: [true, 'Position is required'],
    min: [1, 'Position must be at least 1']
  },
  kills: {
    type: Number,
    required: [true, 'Kills is required'],
    min: [0, 'Kills cannot be negative']
  },
  survival_time: {
    type: Number,
    required: [true, 'Survival time is required'],
    min: [0, 'Survival time cannot be negative']
  },
  loyalty_points_earned: {
    type: Number,
    required: [true, 'Loyalty points earned is required'],
    min: [0, 'Loyalty points cannot be negative']
  },
  winnings: {
    type: Number,
    required: [true, 'Winnings is required'],
    min: [0, 'Winnings cannot be negative']
  }
})

const matchResultSchema = new Schema<IMatchResult>({
  tournament_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament ID is required']
  },
  player_results: [playerResultSchema],
  submitted_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Submitted by is required']
  },
  verified: {
    type: Boolean,
    default: false
  },
  verification_notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Verification notes cannot exceed 500 characters']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for better performance
matchResultSchema.index({ tournament_id: 1 })
matchResultSchema.index({ submitted_by: 1 })
matchResultSchema.index({ verified: 1 })
matchResultSchema.index({ created_at: -1 })
matchResultSchema.index({ 'player_results.user_id': 1 })

// Virtual for total players
matchResultSchema.virtual('total_players').get(function() {
  return this.player_results.length
})

// Virtual for unique players (in case of duplicates)
matchResultSchema.virtual('unique_players').get(function() {
  const uniqueUserIds = new Set(this.player_results.map(result => result.user_id.toString()))
  return uniqueUserIds.size
})

// Instance methods
matchResultSchema.methods.calculatePlayerStats = function(userId: mongoose.Types.ObjectId) {
  return this.player_results.find(result =>
    result.user_id.toString() === userId.toString()
  ) || null
}

matchResultSchema.methods.getTopPlayers = function(limit: number = 10) {
  return this.player_results
    .sort((a, b) => a.position - b.position)
    .slice(0, limit)
}

matchResultSchema.methods.getTotalPrizeDistributed = function() {
  return this.player_results.reduce((total, result) => total + result.winnings, 0)
}

// Pre-save middleware to validate player positions
matchResultSchema.pre('save', function(next) {
  const positions = this.player_results.map(result => result.position)
  const uniquePositions = new Set(positions)

  if (positions.length !== uniquePositions.size) {
    return next(new Error('Player positions must be unique'))
  }

  // Check if positions are sequential starting from 1
  const sortedPositions = Array.from(uniquePositions).sort((a, b) => a - b)
  for (let i = 0; i < sortedPositions.length; i++) {
    if (sortedPositions[i] !== i + 1) {
      return next(new Error('Player positions must be sequential starting from 1'))
    }
  }

  next()
})

// Static methods
matchResultSchema.statics.findByTournament = function(tournamentId: mongoose.Types.ObjectId) {
  return this.findOne({ tournament_id: tournamentId })
    .populate('player_results.user_id', 'username avatar')
    .populate('submitted_by', 'username')
}

matchResultSchema.statics.findUserResults = function(userId: mongoose.Types.ObjectId) {
  return this.find({
    'player_results.user_id': userId
  })
    .populate('tournament_id', 'name game entry_fee')
    .sort({ created_at: -1 })
}

matchResultSchema.statics.getVerifiedResults = function() {
  return this.find({ verified: true })
    .populate('tournament_id', 'name game')
    .populate('player_results.user_id', 'username avatar')
    .sort({ created_at: -1 })
}

matchResultSchema.statics.getUnverifiedResults = function() {
  return this.find({ verified: false })
    .populate('tournament_id', 'name game')
    .populate('player_results.user_id', 'username avatar')
    .populate('submitted_by', 'username')
    .sort({ created_at: -1 })
}

export const MatchResult = mongoose.model<IMatchResult>('MatchResult', matchResultSchema)