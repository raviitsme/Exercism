import express from 'express'
import { authenticate, optionalAuth } from '../middleware/auth'

const router = express.Router()

// Public routes
router.get('/', optionalAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Tournaments listing endpoint - to be implemented'
  })
})

router.get('/:id', optionalAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Tournament details endpoint - to be implemented'
  })
})

// Protected routes
router.post('/:id/join', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Join tournament endpoint - to be implemented'
  })
})

export default router