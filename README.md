# XLR8 Arena - Esports Tournament Platform

A comprehensive esports tournament platform for BGMI, CODM, and Free Fire where players can register, pay entry fees, compete, and earn rewards based on match positions.

## Features

- 🎮 Multi-game tournament support (BGMI, CODM, Free Fire)
- 👤 User authentication (Email, Google, Phone OTP)
- 💳 Integrated payment system (Razorpay)
- 🏆 Tournament management and registration
- 💰 Wallet system with automatic rewards
- 🎁 Loyalty points and redeem store
- 📊 Real-time leaderboards
- 🛡️ Admin dashboard
- 📱 Fully responsive dark-themed UI

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth, Firebase Auth
- **Payments**: Razorpay
- **Real-time**: Socket.io

## Project Structure

```
xl8r-arena/
├── frontend/          # Next.js application
├── backend/           # Express.js API server
├── shared/            # Shared types and utilities
├── admin-dashboard/   # Admin React application
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Redis (for caching)

### Installation

1. Clone the repository
2. Install dependencies in each directory
3. Set up environment variables
4. Run development servers

## License

MIT License