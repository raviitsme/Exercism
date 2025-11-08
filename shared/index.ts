// User types
export interface User {
  _id: string
  username: string
  email: string
  phone?: string
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
}

// Tournament types
export interface Tournament {
  _id: string
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
  participants: string[]
  created_by: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// Wallet types
export interface WalletTransaction {
  _id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'winnings' | 'refund'
  amount: number
  description: string
  tournament_id?: string
  status: 'pending' | 'completed' | 'failed'
  razorpay_order_id?: string
  razorpay_payment_id?: string
  created_at: Date
  updated_at: Date
}

// Match types
export interface PlayerResult {
  user_id: string
  position: number
  kills: number
  survival_time: number
  loyalty_points_earned: number
  winnings: number
}

export interface MatchResult {
  _id: string
  tournament_id: string
  player_results: PlayerResult[]
  submitted_by: string
  verified: boolean
  verification_notes?: string
  created_at: Date
  updated_at: Date
}

// Redeem store types
export interface RedeemItem {
  _id: string
  name: string
  description: string
  category: 'topup' | 'accessory' | 'giftcard' | 'merchandise'
  points_required: number
  stock_quantity: number
  image_url: string
  redemption_type: 'automatic' | 'manual'
  redemption_details: any
  active: boolean
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface Redemption {
  _id: string
  user_id: string
  item_id: string
  points_used: number
  status: 'pending' | 'completed' | 'cancelled'
  fulfillment_data?: any
  shipping_address?: any
  created_at: Date
  updated_at: Date
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number
  user: {
    _id: string
    username: string
    avatar?: string
    rank: string
  }
  total_winnings: number
  tournaments_played: number
  win_rate: number
  average_kills: number
  loyalty_points: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Payment types
export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface PaymentVerification {
  order_id: string
  payment_id: string
  signature: string
}

// Tournament filters
export interface TournamentFilters {
  game?: 'bgmi' | 'codm' | 'freefire'
  status?: string
  min_entry_fee?: number
  max_entry_fee?: number
  search?: string
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}