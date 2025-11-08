import express from 'express'

const router = express.Router()

router.get('/global', (req, res) => {
  res.json({
    success: true,
    message: 'Global leaderboard endpoint - to be implemented'
  })
})

router.get('/game/:game', (req, res) => {
  res.json({
    success: true,
    message: 'Game-specific leaderboard endpoint - to be implemented'
  })
})

export default router