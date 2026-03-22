import Link from 'next/link'
import { ArrowRight, Search, TrendingDown, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60C240 100 480 20 720 60C960 100 1200 20 1440 60V120H0V60Z"
            fill="white"
            fillOpacity="0.05"
          />
          <path
            d="M0 80C240 120 480 40 720 80C960 120 1200 40 1440 80V120H0V80Z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0 100C240 120 480 80 720 100C960 120 1200 80 1440 100V120H0V100Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-24 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            El marketplace para riders, de riders
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            El material no se jubila.{' '}
            <span className="text-ocean-300">Se traspasa.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/75 max-w-xl mx-auto leading-relaxed mb-10">
            Compra y vende material de surf, kitesurf, windsurf, wing y foil entre riders.
            Sin intermediarios. Sin comisiones.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Button asChild size="xl" variant="coral" className="w-full sm:w-auto shadow-lg">
              <Link href="/dashboard/productos/nuevo">
                Empieza a vender
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/explorar">
                <Search className="w-5 h-5" />
                Explorar material
              </Link>
            </Button>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Sin comisiones ahora</span>
            </div>
            <span className="hidden sm:block">·</span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-ocean-300" />
              <span>Contacto directo entre riders</span>
            </div>
            <span className="hidden sm:block">·</span>
            <div className="flex items-center gap-2">
              <span className="text-ocean-300">🏄</span>
              <span>Material técnico especializado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
