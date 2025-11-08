import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { User } from '../models/User'
import { JWTService } from '../utils/jwt'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'
import { emailService } from '../services/emailService'

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { username, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      phone,
      auth_providers: ['email'],
      email_verified: false,
      phone_verified: false
    })

    await user.save()

    // Generate tokens
    const tokens = JWTService.generateTokenPair(user)

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, user._id.toString())
    } catch (emailError) {
      logger.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails
    }

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    logger.info(`User registered: ${user.email}`)

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      data: {
        user: userResponse,
        ...tokens
      }
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { email, password } = req.body

    // Find user with password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check if user is banned
    if (user.is_banned) {
      if (user.banned_until && user.banned_until > new Date()) {
        return res.status(403).json({
          success: false,
          error: 'Account is temporarily banned',
          bannedUntil: user.banned_until
        })
      } else if (!user.banned_until) {
        return res.status(403).json({
          success: false,
          error: 'Account is permanently banned'
        })
      }
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Generate tokens
    const tokens = JWTService.generateTokenPair(user)

    // Update last login
    user.last_login = new Date()
    await user.save()

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    logger.info(`User logged in: ${user.email}`)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        ...tokens
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      })
    }

    const decoded = JWTService.verifyToken(refreshToken)

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      })
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        error: 'Account is banned'
      })
    }

    // Generate new tokens
    const tokens = JWTService.generateTokenPair(user)

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      success: true,
      data: {
        user: userResponse,
        ...tokens
      }
    })
  } catch (error) {
    logger.error('Token refresh error:', error)
    res.status(401).json({
      success: false,
      error: 'Token refresh failed'
    })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userResponse = req.user.toObject()
    delete userResponse.password

    res.json({
      success: true,
      data: userResponse
    })
  } catch (error) {
    logger.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { username, phone } = req.body
    const userId = req.user._id

    // Check if username is already taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken'
        })
      }
    }

    // Check if phone is already taken by another user
    if (phone && phone !== req.user.phone) {
      const existingUser = await User.findOne({ phone })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already registered'
        })
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, phone },
      { new: true, runValidators: true }
    ).select('-password')

    logger.info(`Profile updated: ${updatedUser.email}`)

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    })
  } catch (error) {
    logger.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    })
  }
}

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    })
  }
}