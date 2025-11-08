'use client'

import { CheckCircle, Play, Trophy, Wallet } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Play,
      title: 'Register & Login',
      description: 'Create your account in seconds with email, Google, or phone verification.',
      number: '1'
    },
    {
      icon: Trophy,
      title: 'Join Tournaments',
      description: 'Browse active tournaments, pay entry fees, and secure your spot.',
      number: '2'
    },
    {
      icon: CheckCircle,
      title: 'Compete & Win',
      description: 'Give your best performance, climb the leaderboard, and win cash prizes.',
      number: '3'
    },
    {
      icon: Wallet,
      title: 'Withdraw Earnings',
      description: 'Instantly withdraw your winnings to your bank account or UPI.',
      number: '4'
    }
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How XLR8 Arena Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in minutes and join India's fastest-growing esports community
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative group">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Card */}
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-500/10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-6 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-300">
                    <Icon className="w-8 h-8 text-green-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Why Gamers Trust XLR8 Arena
            </h3>
            <p className="text-gray-400">
              Built by gamers, for gamers with security and fairness at our core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-white font-semibold mb-2">100% Secure Payments</h4>
              <p className="text-gray-400 text-sm">
                Military-grade encryption and Razorpay secure payment gateway
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-white font-semibold mb-2">Instant Withdrawals</h4>
              <p className="text-gray-400 text-sm">
                Get your winnings transferred instantly to your bank account
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-white font-semibold mb-2">Fair Play Guaranteed</h4>
              <p className="text-gray-400 text-sm">
                Anti-cheat measures and verified players ensure fair competition
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}