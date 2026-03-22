import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaFinal() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-ocean-50 to-orange-50 -z-10" />
          <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-ocean-100 -z-10" />

          <div className="py-16 px-8">
            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
              ¿Tienes material{' '}
              <span className="text-gradient">cogiendo polvo?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
              Ponlo a la venta hoy. Algún rider está buscando exactamente lo que tú ya no usas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="xl" variant="ocean" className="w-full sm:w-auto shadow-md">
                <Link href="/registro">
                  <Plus className="w-5 h-5" />
                  Crear cuenta gratis
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <Link href="/explorar">
                  Ver el material disponible
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Gratis. Sin comisiones. Sin tarjeta de crédito.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
