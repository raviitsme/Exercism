import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use(authenticate)

router.post('/create-order', (req, res) => {
  res.json({
    success: true,
    message: 'Create payment order endpoint - to be implemented'
  })
})

router.post('/verify', (req, res) => {
  res.json({
    success: true,
    message: 'Payment verification endpoint - to be implemented'
  })
})

export default router