import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    value: 'surf',
    label: 'Surf',
    emoji: '🏄',
    description: 'Shortboards, longboards, fish, funboards…',
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
  },
  {
    value: 'kitesurf',
    label: 'Kitesurf',
    emoji: '🪁',
    description: 'Kites, barras, arneses, tablas twin tip…',
    color: 'from-purple-500 to-blue-500',
    bgLight: 'bg-purple-50',
  },
  {
    value: 'windsurf',
    label: 'Windsurf',
    emoji: '🌬️',
    description: 'Tablas, velas, mástiles, botavaras…',
    color: 'from-teal-500 to-green-500',
    bgLight: 'bg-teal-50',
  },
  {
    value: 'wing',
    label: 'Wing',
    emoji: '🦅',
    description: 'Wings, tablas wing, handles, bolsas…',
    color: 'from-orange-400 to-amber-500',
    bgLight: 'bg-orange-50',
  },
  {
    value: 'foil',
    label: 'Foil',
    emoji: '⚡',
    description: 'Fuselajes, alas, mástiles, planchas de foil…',
    color: 'from-slate-600 to-slate-800',
    bgLight: 'bg-slate-50',
  },
  {
    value: 'accesorios',
    label: 'Accesorios',
    emoji: '🎒',
    description: 'Neoprenos, leashes, bombas, bolsas de viaje…',
    color: 'from-coral-500 to-orange-500',
    bgLight: 'bg-orange-50',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-slate-50" id="categorias">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Todo el material en un sitio
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Desde una tabla de surf hasta un foil completo. Si lo usas en el agua o con el viento, aquí lo encuentras.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/explorar?category=${cat.value}`}
              className="group relative overflow-hidden rounded-2xl border bg-white p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{cat.emoji}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{cat.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>

              {/* Gradient accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
