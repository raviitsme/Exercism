import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryProvider } from '@/components/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XLR8 Arena - Esports Tournament Platform',
  description: 'Compete in BGMI, CODM, and Free Fire tournaments. Win prizes and earn rewards!',
  keywords: 'esports, tournaments, gaming, BGMI, CODM, Free Fire, prizes',
  authors: [{ name: 'XLR8 Arena Team' }],
  openGraph: {
    title: 'XLR8 Arena - Esports Tournament Platform',
    description: 'Compete in BGMI, CODM, and Free Fire tournaments. Win prizes and earn rewards!',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}