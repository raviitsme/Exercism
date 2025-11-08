import mongoose, { Document, Schema } from 'mongoose'

export interface IWalletTransaction extends Document {
  user_id: mongoose.Types.ObjectId
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'winnings' | 'refund'
  amount: number
  description: string
  tournament_id?: mongoose.Types.ObjectId
  status: 'pending' | 'completed' | 'failed'
  razorpay_order_id?: string
  razorpay_payment_id?: string
  created_at: Date
  updated_at: Date
}

const walletTransactionSchema = new Schema<IWalletTransaction>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['deposit', 'withdrawal', 'entry_fee', 'winnings', 'refund'],
      message: 'Transaction type must be one of: deposit, withdrawal, entry_fee, winnings, refund'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  tournament_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null
  },
  status: {
    type: String,
    default: 'pending',
    enum: {
      values: ['pending', 'completed', 'failed'],
      message: 'Status must be one of: pending, completed, failed'
    }
  },
  razorpay_order_id: {
    type: String,
    default: null
  },
  razorpay_payment_id: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for better performance
walletTransactionSchema.index({ user_id: 1, created_at: -1 })
walletTransactionSchema.index({ type: 1, status: 1 })
walletTransactionSchema.index({ razorpay_order_id: 1 })
walletTransactionSchema.index({ tournament_id: 1 })

// Static methods
walletTransactionSchema.statics.getUserTransactions = function(
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 10
) {
  return this.find({ user_id: userId })
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('tournament_id', 'name game')
}

walletTransactionSchema.statics.getUserBalance = async function(userId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    {
      $match: {
        user_id: userId,
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $cond: [
              { $in: ['$type', ['deposit', 'winnings', 'refund']] },
              '$amount',
              { $multiply: ['$amount', -1] }
            ]
          }
        }
      }
    }
  ])

  return result.length > 0 ? result[0].total : 0
}

walletTransactionSchema.statics.getTotalDeposits = function(userId: mongoose.Types.ObjectId) {
  return this.aggregate([
    {
      $match: {
        user_id: userId,
        type: 'deposit',
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ])
}

walletTransactionSchema.statics.getTotalWithdrawals = function(userId: mongoose.Types.ObjectId) {
  return this.aggregate([
    {
      $match: {
        user_id: userId,
        type: 'withdrawal',
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ])
}

walletTransactionSchema.statics.getTotalWinnings = function(userId: mongoose.Types.ObjectId) {
  return this.aggregate([
    {
      $match: {
        user_id: userId,
        type: 'winnings',
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ])
}

export const WalletTransaction = mongoose.model<IWalletTransaction>('WalletTransaction', walletTransactionSchema)