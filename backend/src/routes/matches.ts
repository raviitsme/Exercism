import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use(authenticate)

router.get('/:tournamentId/results', (req, res) => {
  res.json({
    success: true,
    message: 'Match results endpoint - to be implemented'
  })
})

export default router