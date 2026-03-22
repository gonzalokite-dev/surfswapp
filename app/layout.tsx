import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SURFSWAPP — Compra y vende material de surf de segunda mano',
    template: '%s | SURFSWAPP',
  },
  description:
    'El marketplace especializado en material de surf, kitesurf, windsurf, wing y foil de segunda mano. Compra y vende tablas, kites, velas, foils y accesorios entre riders.',
  keywords: [
    'material surf segunda mano',
    'kitesurf segunda mano',
    'windsurf segunda mano',
    'wing foil segunda mano',
    'compra venta material surf',
    'marketplace surf',
    'tablas surf segunda mano',
    'kite segunda mano España',
    'foil segunda mano',
  ],
  openGraph: {
    title: 'SURFSWAPP — Marketplace de material náutico de segunda mano',
    description:
      'Compra y vende tu material de surf, kitesurf, windsurf, wing y foil. La comunidad de riders que cuida el material.',
    type: 'website',
    locale: 'es_ES',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
