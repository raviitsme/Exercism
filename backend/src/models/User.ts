import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  username: string
  email: string
  phone?: string
  password?: string
  avatar?: string
  auth_providers: string[]
  email_verified: boolean
  phone_verified: boolean
  rank: string
  wallet_balance: number
  loyalty_points: number
  total_winnings: number
  games_played: {
    bgmi: number
    codm: number
    freefire: number
  }
  is_banned: boolean
  banned_until?: Date
  last_login?: Date
  created_at: Date
  updated_at: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  auth_providers: [{
    type: String,
    enum: ['email', 'google', 'phone']
  }],
  email_verified: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  rank: {
    type: String,
    default: 'Bronze',
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster']
  },
  wallet_balance: {
    type: Number,
    default: 0,
    min: [0, 'Wallet balance cannot be negative']
  },
  loyalty_points: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  total_winnings: {
    type: Number,
    default: 0,
    min: [0, 'Total winnings cannot be negative']
  },
  games_played: {
    bgmi: { type: Number, default: 0, min: 0 },
    codm: { type: Number, default: 0, min: 0 },
    freefire: { type: Number, default: 0, min: 0 }
  },
  is_banned: {
    type: Boolean,
    default: false
  },
  banned_until: {
    type: Date,
    default: null
  },
  last_login: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for better performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ phone: 1 })
userSchema.index({ created_at: -1 })
userSchema.index({ total_winnings: -1 })
userSchema.index({ loyalty_points: -1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false
  }
  return bcrypt.compare(candidatePassword, this.password)
}

// Virtual for user's full stats
userSchema.virtual('total_games_played').get(function() {
  return this.games_played.bgmi + this.games_played.codm + this.games_played.freefire
})

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  })
}

export const User = mongoose.model<IUser>('User', userSchema)