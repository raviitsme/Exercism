'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, TrendingUp, Shield } from 'lucide-react'

interface StatCounterProps {
  end: number
  suffix?: string
  duration?: number
}

function StatCounter({ end, suffix = '', duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export default function Stats() {
  const stats = [
    {
      icon: Trophy,
      value: 5000000,
      suffix: '+',
      label: 'Total Prize Pool Distributed',
      description: 'Real money won by players',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Users,
      value: 10000,
      suffix: '+',
      label: 'Active Gamers',
      description: 'Players competing daily',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: TrendingUp,
      value: 500,
      suffix: '+',
      label: 'Tournaments Hosted',
      description: 'Competitions organized',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: Shield,
      value: 99,
      suffix: '.9%',
      label: 'Trust Score',
      description: 'Based on user reviews',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900/50 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by India's Gaming Community
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of gamers who've already won big on XLR8 Arena
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-6 border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm group hover:scale-105 transition-all duration-300`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Counter */}
                  <div className="text-3xl font-bold text-white mb-2">
                    <StatCounter end={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              </div>
            )
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 px-8 py-4 bg-gray-800 rounded-full border border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Live Tournaments</span>
            </div>
            <div className="text-gray-600">•</div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-gray-300 text-sm">SSL Secured</span>
            </div>
            <div className="text-gray-600">•</div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-green-500" />
              <span className="text-gray-300 text-sm">Verified Winners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}