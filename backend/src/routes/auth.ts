import express from 'express'
import { body } from 'express-validator'
import { asyncHandler } from '../middleware/errorHandler'
import * as authController from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
]

// Routes
router.post('/register', registerValidation, asyncHandler(authController.register))
router.post('/login', loginValidation, asyncHandler(authController.login))
router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.get('/profile', authenticate, asyncHandler(authController.getProfile))
router.put('/profile', authenticate, updateProfileValidation, asyncHandler(authController.updateProfile))
router.post('/logout', authenticate, asyncHandler(authController.logout))

export default router