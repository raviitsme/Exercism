import mongoose, { Document, Schema } from 'mongoose'

export interface ITournament extends Document {
  game: 'bgmi' | 'codm' | 'freefire'
  name: string
  description: string
  entry_fee: number
  prize_pool: number
  map: string
  mode: string
  max_players: number
  current_players: number
  start_time: Date
  end_time: Date
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed' | 'cancelled'
  prize_structure: {
    position_1: number
    position_2: number
    position_3: number
    [key: string]: number
  }
  loyalty_points: {
    participation: number
    per_kill: number
  }
  participants: mongoose.Types.ObjectId[]
  created_by: mongoose.Types.ObjectId
  is_active: boolean
  created_at: Date
  updated_at: Date
  addParticipant(userId: mongoose.Types.ObjectId): Promise<void>
  removeParticipant(userId: mongoose.Types.ObjectId): Promise<void>
  isFull(): boolean
  canJoin(): boolean
}

const tournamentSchema = new Schema<ITournament>({
  game: {
    type: String,
    required: [true, 'Game is required'],
    enum: {
      values: ['bgmi', 'codm', 'freefire'],
      message: 'Game must be one of: bgmi, codm, freefire'
    }
  },
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    maxlength: [100, 'Tournament name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  entry_fee: {
    type: Number,
    required: [true, 'Entry fee is required'],
    min: [0, 'Entry fee cannot be negative']
  },
  prize_pool: {
    type: Number,
    required: [true, 'Prize pool is required'],
    min: [0, 'Prize pool cannot be negative']
  },
  map: {
    type: String,
    required: [true, 'Map is required'],
    trim: true
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    trim: true
  },
  max_players: {
    type: Number,
    required: [true, 'Maximum players is required'],
    min: [2, 'Tournament must have at least 2 players'],
    max: [1000, 'Tournament cannot have more than 1000 players']
  },
  current_players: {
    type: Number,
    default: 0,
    min: [0, 'Current players cannot be negative']
  },
  start_time: {
    type: Date,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(this: ITournament, value: Date) {
        return value > new Date()
      },
      message: 'Start time must be in the future'
    }
  },
  end_time: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(this: ITournament, value: Date) {
        return value > this.start_time
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    default: 'upcoming',
    enum: {
      values: ['upcoming', 'registration', 'ongoing', 'completed', 'cancelled'],
      message: 'Status must be one of: upcoming, registration, ongoing, completed, cancelled'
    }
  },
  prize_structure: {
    position_1: {
      type: Number,
      required: true,
      min: [0, 'Prize amount cannot be negative']
    },
    position_2: {
      type: Number,
      min: [0, 'Prize amount cannot be negative']
    },
    position_3: {
      type: Number,
      min: [0, 'Prize amount cannot be negative']
    }
  },
  loyalty_points: {
    participation: {
      type: Number,
      default: 10,
      min: [0, 'Participation points cannot be negative']
    },
    per_kill: {
      type: Number,
      default: 1,
      min: [0, 'Kill points cannot be negative']
    }
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for better performance
tournamentSchema.index({ game: 1, status: 1 })
tournamentSchema.index({ start_time: 1 })
tournamentSchema.index({ entry_fee: 1 })
tournamentSchema.index({ created_at: -1 })
tournamentSchema.index({ participants: 1 })

// Virtual for available slots
tournamentSchema.virtual('available_slots').get(function() {
  return this.max_players - this.current_players
})

// Virtual for registration status
tournamentSchema.virtual('is_registration_open').get(function() {
  const now = new Date()
  return this.status === 'registration' &&
         this.current_players < this.max_players &&
         this.start_time > now
})

// Instance methods
tournamentSchema.methods.addParticipant = async function(userId: mongoose.Types.ObjectId) {
  if (this.participants.includes(userId)) {
    throw new Error('User already registered for this tournament')
  }

  if (this.current_players >= this.max_players) {
    throw new Error('Tournament is full')
  }

  this.participants.push(userId)
  this.current_players += 1

  // Auto change status to ongoing if tournament is full
  if (this.current_players === this.max_players && this.status === 'registration') {
    this.status = 'ongoing'
  }

  await this.save()
}

tournamentSchema.methods.removeParticipant = async function(userId: mongoose.Types.ObjectId) {
  const participantIndex = this.participants.indexOf(userId)

  if (participantIndex === -1) {
    throw new Error('User not registered for this tournament')
  }

  this.participants.splice(participantIndex, 1)
  this.current_players -= 1

  await this.save()
}

tournamentSchema.methods.isFull = function() {
  return this.current_players >= this.max_players
}

tournamentSchema.methods.canJoin = function() {
  const now = new Date()
  return this.status === 'registration' &&
         !this.isFull() &&
         this.start_time > now &&
         this.is_active
}

// Pre-save middleware to validate prize distribution
tournamentSchema.pre('save', function(next) {
  const totalPrizes = Object.values(this.prize_structure).reduce((sum, prize) => sum + prize, 0)

  if (totalPrizes > this.prize_pool) {
    return next(new Error('Total prize distribution cannot exceed prize pool'))
  }

  next()
})

// Static methods
tournamentSchema.statics.findActiveTournaments = function(game?: string) {
  const query: any = {
    is_active: true,
    status: { $in: ['registration', 'upcoming'] },
    start_time: { $gt: new Date() }
  }

  if (game) {
    query.game = game
  }

  return this.find(query).sort({ start_time: 1 })
}

tournamentSchema.statics.findByGame = function(game: string) {
  return this.find({
    game,
    is_active: true
  }).sort({ created_at: -1 })
}

export const Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema)