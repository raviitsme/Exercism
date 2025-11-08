import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// All user routes require authentication
router.use(authenticate)

// User profile routes will be implemented later
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    message: 'User stats endpoint - to be implemented'
  })
})

export default router