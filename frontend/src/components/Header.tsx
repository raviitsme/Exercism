'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Trophy, Wallet, User, LogOut, Settings, Gamepad2 } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Tournaments', href: '/tournaments', icon: Trophy },
    { name: 'Leaderboard', href: '/leaderboard', icon: Gamepad2 },
    { name: 'Redeem Store', href: '/redeem', icon: Wallet },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">X8</span>
            </div>
            <span className="text-white font-bold text-xl">XLR8 Arena</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-300 hover:text-white bg-transparent hover:bg-transparent">
                  Games
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/tournaments?game=bgmi" className="block p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <h4 className="text-white font-semibold">BGMI</h4>
                        <p className="text-gray-400 text-sm">BattleGrounds Mobile India</p>
                      </Link>
                      <Link href="/tournaments?game=codm" className="block p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <h4 className="text-white font-semibold">COD Mobile</h4>
                        <p className="text-gray-400 text-sm">Call of Duty Mobile</p>
                      </Link>
                      <Link href="/tournaments?game=freefire" className="block p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <h4 className="text-white font-semibold">Free Fire</h4>
                        <p className="text-gray-400 text-sm">Garena Free Fire</p>
                      </Link>
                      <Link href="/tournaments" className="block p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <h4 className="text-white font-semibold">All Games</h4>
                        <p className="text-gray-400 text-sm">Browse all tournaments</p>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-800 data-[state=open]:bg-gray-800 ${
                          isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Wallet Balance */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span className="text-white font-semibold">₹{user.wallet_balance.toFixed(2)}</span>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {user.username}
                        </p>
                        <p className="text-xs leading-none text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Wallet</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}

            {user ? (
              <>
                <div className="flex items-center px-3 py-2 bg-gray-800 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-white font-semibold">₹{user.wallet_balance.toFixed(2)}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/wallet"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}