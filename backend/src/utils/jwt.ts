import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

export interface JWTPayload {
  userId: string
  email: string
  username: string
  type: 'access' | 'refresh'
}

export class JWTService {
  static generateAccessToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      type: 'access'
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'xlr8-arena',
      audience: 'xlr8-arena-users'
    })
  }

  static generateRefreshToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      type: 'refresh'
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'xlr8-arena',
      audience: 'xlr8-arena-users'
    })
  }

  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'xlr8-arena',
        audience: 'xlr8-arena-users'
      }) as JWTPayload

      return decoded
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired')
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      } else {
        throw new Error('Token verification failed')
      }
    }
  }

  static generateTokenPair(user: IUser) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    }
  }

  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    return authHeader.substring(7)
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any
      return decoded.exp < Date.now() / 1000
    } catch {
      return true
    }
  }

  static getTokenRemainingTime(token: string): number {
    try {
      const decoded = jwt.decode(token) as any
      return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000))
    } catch {
      return 0
    }
  }
}