import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use(authenticate)

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard endpoint - to be implemented'
  })
})

export default router