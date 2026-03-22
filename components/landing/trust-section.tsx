import { Users, Award, MessageSquare, TrendingDown } from 'lucide-react'

const trustItems = [
  {
    icon: Award,
    title: 'Especializado al 100%',
    description: 'Solo material técnico de deportes acuáticos. Nada más, nada menos.',
  },
  {
    icon: Users,
    title: 'Comunidad de riders',
    description: 'Vendedores que usan lo que venden y compradores que saben lo que buscan.',
  },
  {
    icon: MessageSquare,
    title: 'Contacto directo',
    description: 'Chat interno para hablar sin compartir datos personales hasta que tú quieras.',
  },
  {
    icon: TrendingDown,
    title: 'Sin comisiones',
    description: 'En esta fase inicial, publicar y comprar es completamente gratuito.',
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Por qué confiar en SURFSWAPP
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Un marketplace hecho por y para la comunidad rider.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-ocean-500/50 hover:bg-slate-800 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-ocean-900/60 border border-ocean-700/50 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-ocean-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
