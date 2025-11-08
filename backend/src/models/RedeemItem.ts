import mongoose, { Document, Schema } from 'mongoose'

export interface IRedeemItem extends Document {
  name: string
  description: string
  category: 'topup' | 'accessory' | 'giftcard' | 'merchandise'
  points_required: number
  stock_quantity: number
  image_url: string
  redemption_type: 'automatic' | 'manual'
  redemption_details: any
  active: boolean
  created_by: mongoose.Types.ObjectId
  created_at: Date
  updated_at: Date
  isInStock(): boolean
  canRedeem(userPoints: number): boolean
}

const redeemItemSchema = new Schema<IRedeemItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['topup', 'accessory', 'giftcard', 'merchandise'],
      message: 'Category must be one of: topup, accessory, giftcard, merchandise'
    }
  },
  points_required: {
    type: Number,
    required: [true, 'Points required is required'],
    min: [0, 'Points required cannot be negative']
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative']
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Image URL must be a valid URL'
    }
  },
  redemption_type: {
    type: String,
    required: [true, 'Redemption type is required'],
    enum: {
      values: ['automatic', 'manual'],
      message: 'Redemption type must be either automatic or manual'
    }
  },
  redemption_details: {
    type: Schema.Types.Mixed,
    default: {}
  },
  active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for better performance
redeemItemSchema.index({ category: 1, active: 1 })
redeemItemSchema.index({ points_required: 1 })
redeemItemSchema.index({ created_at: -1 })

// Instance methods
redeemItemSchema.methods.isInStock = function() {
  return this.stock_quantity > 0
}

redeemItemSchema.methods.canRedeem = function(userPoints: number) {
  return this.active &&
         this.isInStock() &&
         userPoints >= this.points_required
}

// Static methods
redeemItemSchema.statics.findActiveItems = function(category?: string) {
  const query: any = { active: true }

  if (category) {
    query.category = category
  }

  return this.find(query).sort({ points_required: 1 })
}

redeemItemSchema.statics.findByCategory = function(category: string) {
  return this.find({
    category,
    active: true,
    stock_quantity: { $gt: 0 }
  }).sort({ points_required: 1 })
}

redeemItemSchema.statics.findAffordableItems = function(userPoints: number) {
  return this.find({
    active: true,
    stock_quantity: { $gt: 0 },
    points_required: { $lte: userPoints }
  }).sort({ points_required: 1 })
}

export const RedeemItem = mongoose.model<IRedeemItem>('RedeemItem', redeemItemSchema)