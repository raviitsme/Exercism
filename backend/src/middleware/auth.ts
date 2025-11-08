import { Request, Response, NextFunction } from 'express'
import { JWTService } from '../utils/jwt'
import { User } from '../models/User'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = JWTService.extractTokenFromHeader(req.headers.authorization)

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      })
    }

    const decoded = JWTService.verifyToken(token)

    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      })
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

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

    req.user = user
    next()
  } catch (error) {
    logger.error('Authentication error:', error)

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          error: 'Token has expired'
        })
      } else if (error.message.includes('invalid')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        })
      }
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    // For now, we'll use a simple role system. This can be extended
    const userRole = req.user.role || 'user'

    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      })
    }

    next()
  }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = JWTService.extractTokenFromHeader(req.headers.authorization)

    if (token) {
      const decoded = JWTService.verifyToken(token)

      if (decoded.type === 'access') {
        const user = await User.findById(decoded.userId).select('-password')
        if (user && !user.is_banned) {
          req.user = user
        }
      }
    }

    next()
  } catch (error) {
    // Optional auth means we don't return errors, just continue without user
    logger.warn('Optional authentication failed:', error)
    next()
  }
}

export const requireEmailVerification = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    })
  }

  if (!req.user.email_verified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required'
    })
  }

  next()
}