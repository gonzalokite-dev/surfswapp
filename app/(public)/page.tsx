import type { Metadata } from 'next'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CategoriesSection } from '@/components/landing/categories-section'
import { Benefits } from '@/components/landing/benefits'
import { TrustSection } from '@/components/landing/trust-section'
import { CtaFinal } from '@/components/landing/cta-final'
import { FeaturedProducts } from '@/components/landing/featured-products'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SURFSWAPP — Compra y vende material de surf de segunda mano',
  description:
    'El marketplace especializado en material de surf, kitesurf, windsurf, wing y foil de segunda mano. Compra y vende tablas, kites, velas y accesorios entre riders.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CategoriesSection />
      <FeaturedProducts />
      <Benefits />
      <TrustSection />
      <CtaFinal />
    </>
  )
}
