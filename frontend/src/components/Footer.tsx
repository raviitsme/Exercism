import Link from 'next/link'
import { Shield, Trophy, Users, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Tournaments', href: '/tournaments' },
      { name: 'Leaderboard', href: '/leaderboard' },
      { name: 'Redeem Store', href: '/redeem' },
      { name: 'How It Works', href: '/how-it-works' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Report Issue', href: '/report' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Fair Play Policy', href: '/fair-play' },
      { name: 'Refund Policy', href: '/refund' }
    ],
    games: [
      { name: 'BGMI Tournaments', href: '/tournaments?game=bgmi' },
      { name: 'COD Mobile', href: '/tournaments?game=codm' },
      { name: 'Free Fire', href: '/tournaments?game=freefire' },
      { name: 'Game Rules', href: '/game-rules' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Github', href: '#', icon: Github },
  ]

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">X8</span>
              </div>
              <span className="text-white font-bold text-xl">XLR8 Arena</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              India's most trusted esports tournament platform. Compete, win real cash prizes,
              and join the ultimate gaming community.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                100% Secure Payments
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Trophy className="w-4 h-4 text-green-500 mr-2" />
                Verified Winners Only
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                10,000+ Active Players
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-gray-700 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Games</h3>
            <ul className="space-y-2">
              {footerLinks.games.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">Email Support</p>
                <p className="text-gray-400 text-sm">support@xlr8arena.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">Phone Support</p>
                <p className="text-gray-400 text-sm">+91 91234 56789</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">24/7 Support</p>
                <p className="text-gray-400 text-sm">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} XLR8 Arena. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ for Indian gamers</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible Gaming Notice */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              This platform is only for users 18+ years of age. Please play responsibly.
              Gaming involves financial risk and can be addictive.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}