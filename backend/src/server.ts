import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database'
import { logger } from './utils/logger'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import tournamentRoutes from './routes/tournaments'
import walletRoutes from './routes/wallet'
import paymentRoutes from './routes/payments'
import matchRoutes from './routes/matches'
import leaderboardRoutes from './routes/leaderboard'
import redeemRoutes from './routes/redeem'
import adminRoutes from './routes/admin'
import { errorHandler } from './middleware/errorHandler'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tournaments', tournamentRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/redeem', redeemRoutes)
app.use('/api/admin', adminRoutes)

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)

  socket.on('join-tournament', (tournamentId) => {
    socket.join(`tournament-${tournamentId}`)
    logger.info(`User ${socket.id} joined tournament ${tournamentId}`)
  })

  socket.on('leave-tournament', (tournamentId) => {
    socket.leave(`tournament-${tournamentId}`)
    logger.info(`User ${socket.id} left tournament ${tournamentId}`)
  })

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Make io available to other modules
app.set('io', io)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDatabase()

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
  })
})

startServer()

export default app