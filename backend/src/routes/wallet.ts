import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use(authenticate)

router.get('/balance', (req, res) => {
  res.json({
    success: true,
    message: 'Wallet balance endpoint - to be implemented'
  })
})

router.get('/transactions', (req, res) => {
  res.json({
    success: true,
    message: 'Wallet transactions endpoint - to be implemented'
  })
})

export default router