import { CheckCircle2, Tag, MessageCircle, Zap, ShieldCheck, TrendingUp, Search } from 'lucide-react'

const sellerBenefits = [
  {
    icon: Tag,
    title: 'Pon el precio tú',
    description: 'Sin subastas ni regateos forzados. Fijas el precio y negocias directamente.',
  },
  {
    icon: Zap,
    title: 'Publicar en minutos',
    description: 'Formulario rápido, fotos desde el móvil. Tu anuncio activo en un momento.',
  },
  {
    icon: TrendingUp,
    title: 'Audiencia especializada',
    description: 'Riders que saben lo que buscan. No expliques qué es un kite de 9m.',
  },
]

const buyerBenefits = [
  {
    icon: Search,
    title: 'Material curado',
    description: 'Solo material de deportes acuáticos. Sin ruido ni anuncios de segunda mano genérica.',
  },
  {
    icon: MessageCircle,
    title: 'Habla con el vendedor',
    description: 'Pregunta sobre el estado, la talla o los detalles técnicos. Chat directo.',
  },
  {
    icon: ShieldCheck,
    title: 'Trato entre riders',
    description: 'Comunidad de apasionados. El material llega con honestidad y sin sorpresas.',
  },
]

export function Benefits() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pensado para compradores y vendedores
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Dos lados del mismo trato. Los dos salen ganando.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sellers */}
          <div className="rounded-2xl border-2 border-ocean-100 bg-ocean-50/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold">Para vendedores</h3>
            </div>
            <ul className="space-y-5">
              {sellerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-ocean-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <b.icon className="w-4 h-4 text-ocean-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyers */}
          <div className="rounded-2xl border-2 border-orange-100 bg-orange-50/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold">Para compradores</h3>
            </div>
            <ul className="space-y-5">
              {buyerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <b.icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
