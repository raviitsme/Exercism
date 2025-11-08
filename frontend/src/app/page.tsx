import Hero from '@/components/Hero'
import FeaturedTournaments from '@/components/FeaturedTournaments'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <Hero />
        <Stats />
        <FeaturedTournaments />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}