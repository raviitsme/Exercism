'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Trophy, ArrowRight, Gamepad2 } from 'lucide-react'

interface Tournament {
  _id: string
  name: string
  game: 'bgmi' | 'codm' | 'freefire'
  entry_fee: number
  prize_pool: number
  max_players: number
  current_players: number
  start_time: string
  status: string
  map: string
  mode: string
}

const gameIcons = {
  bgmi: '🎯',
  codm: '🪖',
  freefire: '🔥'
}

const gameColors = {
  bgmi: 'bg-orange-500',
  codm: 'bg-green-500',
  freefire: 'bg-red-500'
}

export default function FeaturedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - in real app, this would fetch from API
    const mockTournaments: Tournament[] = [
      {
        _id: '1',
        name: 'Weekend Warriors Championship',
        game: 'bgmi',
        entry_fee: 50,
        prize_pool: 50000,
        max_players: 100,
        current_players: 87,
        start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'registration',
        map: 'Erangel',
        mode: 'Squad'
      },
      {
        _id: '2',
        name: 'COD Mobile Sprint Series',
        game: 'codm',
        entry_fee: 30,
        prize_pool: 30000,
        max_players: 50,
        current_players: 42,
        start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'registration',
        map: 'Hijacked',
        mode: 'Domination'
      },
      {
        _id: '3',
        name: 'Free Fire Battle Royale',
        game: 'freefire',
        entry_fee: 20,
        prize_pool: 20000,
        max_players: 80,
        current_players: 76,
        start_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        status: 'registration',
        map: 'Bermuda',
        mode: 'Solo'
      }
    ]

    setTimeout(() => {
      setTournaments(mockTournaments)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      registration: { label: 'Open', className: 'status-registration' },
      upcoming: { label: 'Upcoming', className: 'status-upcoming' },
      ongoing: { label: 'Live', className: 'status-ongoing' },
      completed: { label: 'Completed', className: 'status-completed' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const diff = start.getTime() - now.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return 'Starting soon'
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Tournaments
            </h2>
            <p className="text-gray-400">
              Compete in the hottest tournaments right now
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="gaming-card animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Tournaments
          </h2>
          <p className="text-gray-400 text-lg">
            Compete in the hottest tournaments right now
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tournaments.map((tournament) => {
            const fillPercentage = (tournament.current_players / tournament.max_players) * 100
            const isAlmostFull = fillPercentage >= 80

            return (
              <div key={tournament._id} className="tournament-card group hover:scale-[1.02] transition-transform">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${gameColors[tournament.game]} rounded-lg flex items-center justify-center text-lg`}>
                      {gameIcons[tournament.game]}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold line-clamp-1">
                        {tournament.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {tournament.map} • {tournament.mode}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(tournament.status)}
                </div>

                {/* Prize Pool */}
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-4 mb-4 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Prize Pool</p>
                      <p className="text-2xl font-bold text-green-400">
                        ₹{tournament.prize_pool.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Entry Fee</span>
                    <span className="text-white font-semibold">₹{tournament.entry_fee}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Starts In</span>
                    <span className="text-white font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {getTimeUntilStart(tournament.start_time)}
                    </span>
                  </div>

                  {/* Players */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Players
                      </span>
                      <span className="text-white font-semibold">
                        {tournament.current_players}/{tournament.max_players}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isAlmostFull ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      ></div>
                    </div>
                    {isAlmostFull && (
                      <p className="text-red-400 text-xs mt-1">
                        Almost full! Only {tournament.max_players - tournament.current_players} spots left
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full gaming-button group" asChild>
                  <Link href={`/tournaments/${tournament._id}`}>
                    Join Tournament
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="gaming-button-secondary px-8 py-3" asChild>
            <Link href="/tournaments">
              <Gamepad2 className="w-5 h-5 mr-2" />
              View All Tournaments
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}