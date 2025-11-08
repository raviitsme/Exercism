'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Users, Gift, Shield } from 'lucide-react'

export default function Hero() {
  const [email, setEmail] = useState('')

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300ff88" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            India's Trusted Esports Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Level Up Your
            </span>
            <br />
            <span className="text-white">Gaming Experience</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Compete in BGMI, COD Mobile & Free Fire tournaments. Win real cash prizes,
            earn loyalty points, and join the ultimate esports community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="gaming-button text-base px-8 py-4" asChild>
              <Link href="/tournaments">
                Browse Tournaments
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gaming-button-secondary text-base px-8 py-4" asChild>
              <Link href="/auth/register">
                Start Playing Free
              </Link>
            </Button>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto mb-16">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <Button className="gaming-button px-6">
                Get Started
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Join 10,000+ gamers already competing
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">₹50L+</div>
              <div className="text-gray-400">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">10K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">500+</div>
              <div className="text-gray-400">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Win Real Cash</h3>
            <p className="text-gray-400">
              Compete in tournaments and win real cash prizes directly to your wallet
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fair Competition</h3>
            <p className="text-gray-400">
              Verified players and anti-cheat measures ensure fair gameplay
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Earn Rewards</h3>
            <p className="text-gray-400">
              Get loyalty points and redeem them for gaming rewards and merchandise
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}