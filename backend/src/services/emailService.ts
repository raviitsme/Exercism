import nodemailer from 'nodemailer'
import { logger } from '../utils/logger'

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendVerificationEmail(email: string, userId: string) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${userId}`

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@xlr8arena.com',
        to: email,
        subject: 'Verify your XLR8 Arena account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff88; text-align: center;">Welcome to XLR8 Arena!</h2>
            <p style="color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
              Thank you for registering! Please click the button below to verify your email address and activate your account.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background: linear-gradient(45deg, #00ff88, #00cc6a);
                        color: #000;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #a0a0a0; font-size: 14px;">
              If the button doesn't work, you can also click this link:
              <a href="${verificationUrl}" style="color: #00ff88;">${verificationUrl}</a>
            </p>
            <p style="color: #a0a0a0; font-size: 12px; margin-top: 30px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
        `,
      })

      logger.info(`Verification email sent to: ${email}`)
    } catch (error) {
      logger.error('Failed to send verification email:', error)
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@xlr8arena.com',
        to: email,
        subject: 'Reset your XLR8 Arena password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff88; text-align: center;">Reset Your Password</h2>
            <p style="color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: linear-gradient(45deg, #ff006e, #cc0058);
                        color: #fff;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #a0a0a0; font-size: 14px;">
              If the button doesn't work, you can also click this link:
              <a href="${resetUrl}" style="color: #00ff88;">${resetUrl}</a>
            </p>
            <p style="color: #a0a0a0; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        `,
      })

      logger.info(`Password reset email sent to: ${email}`)
    } catch (error) {
      logger.error('Failed to send password reset email:', error)
      throw error
    }
  }

  async sendTournamentJoinedEmail(email: string, tournamentName: string, startTime: Date) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@xlr8arena.com',
        to: email,
        subject: `Successfully registered for ${tournamentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff88; text-align: center;">Tournament Registration Confirmed!</h2>
            <div style="color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
              <h3 style="color: #ffbe0b; margin-top: 0;">${tournamentName}</h3>
              <p><strong>Start Time:</strong> ${startTime.toLocaleString()}</p>
              <p>You've successfully registered for this tournament. Get ready to compete!</p>
            </div>
            <div style="margin: 30px 0;">
              <p style="color: #a0a0a0;">Make sure to:</p>
              <ul style="color: #ffffff; background-color: #2a2a2a; padding: 15px; border-radius: 8px;">
                <li>Be online 15 minutes before the tournament starts</li>
                <li>Check your game settings and ensure stable connection</li>
                <li>Join the tournament lobby when invited</li>
              </ul>
            </div>
            <p style="color: #a0a0a0; font-size: 12px;">
              Good luck, and may the best player win! 🏆
            </p>
          </div>
        `,
      })

      logger.info(`Tournament joined email sent to: ${email}`)
    } catch (error) {
      logger.error('Failed to send tournament joined email:', error)
      throw error
    }
  }

  async sendWinningsEmail(email: string, tournamentName: string, amount: number, position: number) {
    try {
      const positionEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🎮'

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@xlr8arena.com',
        to: email,
        subject: `Congratulations! You won ${amount} in ${tournamentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff88; text-align: center;">Congratulations! ${positionEmoji}</h2>
            <div style="color: #ffffff; background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
              <h3 style="color: #ffbe0b; margin-top: 0;">${tournamentName}</h3>
              <p style="font-size: 18px; margin: 20px 0;">
                <strong>Position:</strong> ${position}${position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'} place<br>
                <strong>Winnings:</strong> <span style="color: #00ff88; font-size: 24px;">₹${amount}</span>
              </p>
              <p>The winnings have been credited to your wallet and are ready for withdrawal!</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/wallet"
                 style="background: linear-gradient(45deg, #00ff88, #00cc6a);
                        color: #000;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;">
                View Wallet
              </a>
            </div>
            <p style="color: #a0a0a0; font-size: 12px;">
              Thanks for participating in XLR8 Arena tournaments!
            </p>
          </div>
        `,
      })

      logger.info(`Winnings email sent to: ${email}`)
    } catch (error) {
      logger.error('Failed to send winnings email:', error)
      throw error
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify()
      logger.info('Email service connection successful')
      return true
    } catch (error) {
      logger.error('Email service connection failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()