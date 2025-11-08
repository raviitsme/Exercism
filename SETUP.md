# XLR8 Arena - Installation & Setup Guide

This guide will help you set up the XLR8 Arena esports tournament platform on your local development environment.

## Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn** (v1.22 or higher)
- **MongoDB** (v6 or higher)
- **Git**

### Optional Software
- **Redis** (for caching and session storage)
- **Postman** or similar API testing tool

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Exercise
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Shared Types Dependencies
```bash
cd ../shared
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/xlr8-arena
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

#### Frontend Environment Variables
```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit the `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB

#### Option A: Using MongoDB Atlas (Recommended for development)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend `.env` file

#### Option B: Local MongoDB Installation
```bash
# On macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# On Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# On Windows
# Download and install MongoDB from https://www.mongodb.com/try/download/community
```

### 5. Start the Development Servers

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

#### Start Frontend Server
In a new terminal:
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

## Verification

### 1. Backend Health Check
Open your browser or use curl to check:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### 2. Frontend Access
Open your browser and navigate to `http://localhost:3000`

You should see the XLR8 Arena landing page with:
- Hero section with gaming-themed design
- Featured tournaments section
- Statistics and trust indicators
- Navigation menu

## Development Features

### Currently Implemented
✅ **Project Structure**: Complete folder structure for frontend, backend, and shared types
✅ **Frontend Framework**: Next.js 14 with TypeScript and Tailwind CSS
✅ **Backend Framework**: Express.js with TypeScript
✅ **Database Models**: MongoDB schemas for Users, Tournaments, Wallet, etc.
✅ **Authentication System**: JWT-based auth with email/password login
✅ **UI Components**: Gaming-themed dark interface with neon accents
✅ **Landing Page**: Complete hero section, features, and trust indicators
✅ **Header Navigation**: Responsive navigation with user authentication state
✅ **Type Safety**: Shared TypeScript types across frontend and backend

### Features Ready for Implementation
🔧 **Tournament Management**: Full CRUD operations for tournaments
🔧 **Payment Integration**: Razorpay integration for deposits and entry fees
🔧 **Wallet System**: Complete wallet functionality with transaction history
🔧 **Real-time Updates**: Socket.io for live tournament updates
🔧 **Leaderboard System**: Global and game-specific leaderboards
🔧 **Redeem Store**: Loyalty points system with product redemption
🔧 **Admin Dashboard**: Complete admin interface for platform management
🔧 **Match Results**: System for uploading and verifying tournament results

## Testing the Authentication System

### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testplayer",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Next Steps

### For Development
1. **Set up email service** (Optional): Configure email for verification and notifications
2. **Set up Redis** (Optional): For caching and real-time features
3. **Set up Razorpay**: For payment processing
4. **Set up Firebase**: For phone OTP authentication

### For Production
1. **Environment Variables**: Use production-ready secrets
2. **Database**: Use MongoDB Atlas or production-ready MongoDB instance
3. **Domain**: Configure custom domain and SSL certificates
4. **Monitoring**: Set up logging and monitoring services

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Error**: `MongoNetworkError: failed to connect to server`
**Solution**: Ensure MongoDB is running and connection string is correct

#### 2. Port Already in Use
**Error**: `Error: listen EADDRINUSE :::5000`
**Solution**: Kill the process using the port or change the PORT in .env

#### 3. Module Not Found
**Error**: `Cannot find module 'module-name'`
**Solution**: Run `npm install` in the respective directory

#### 4. TypeScript Compilation Error
**Error**: Multiple TypeScript compilation errors
**Solution**: Check for missing dependencies or incorrect import paths

### Getting Help

1. **Check logs**: Look at terminal output for detailed error messages
2. **Verify environment**: Ensure all environment variables are set correctly
3. **Check dependencies**: Make sure all node_modules are installed properly
4. **Network issues**: Verify firewall and network configurations

## Contributing

When contributing to the codebase:
1. Follow the existing code style and patterns
2. Add TypeScript types for new functionality
3. Test your changes before submitting
4. Update documentation as needed

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Enable HTTPS in production
- Implement rate limiting on authentication endpoints
- Validate all user inputs
- Use parameterized queries to prevent injection attacks

## Performance Considerations

- Use database indexes for frequently queried fields
- Implement caching for expensive operations
- Optimize images and assets for the web
- Use CDN for static assets in production
- Monitor and optimize database queries

---

Happy Gaming! 🎮✨