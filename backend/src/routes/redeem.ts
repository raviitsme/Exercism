import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use(authenticate)

router.get('/items', (req, res) => {
  res.json({
    success: true,
    message: 'Redeem items endpoint - to be implemented'
  })
})

router.post('/redeem', (req, res) => {
  res.json({
    success: true,
    message: 'Redeem item endpoint - to be implemented'
  })
})

export default router