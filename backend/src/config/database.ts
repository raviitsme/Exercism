import mongoose from 'mongoose'
import { logger } from '../utils/logger'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xlr8-arena'

export async function connectDatabase(): Promise<void> {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    }

    await mongoose.connect(MONGODB_URI, options)

    logger.info('MongoDB connected successfully')

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })

  } catch (error) {
    logger.error('Database connection failed:', error)
    throw error
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    logger.info('MongoDB disconnected successfully')
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error)
    throw error
  }
}