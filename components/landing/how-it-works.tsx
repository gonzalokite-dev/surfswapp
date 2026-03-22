import { Upload, MessageCircle, Handshake } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Súbelo en minutos',
    description:
      'Fotos, precio, descripción. Publicar tu material lleva menos de 5 minutos. Sin burocracia.',
    color: 'bg-ocean-50 text-ocean-600',
    border: 'border-ocean-100',
  },
  {
    icon: MessageCircle,
    number: '02',
    title: 'Conecta con el comprador',
    description:
      'Los interesados te escriben directamente. Habla, negocia y resuelve dudas desde el chat.',
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
  },
  {
    icon: Handshake,
    number: '03',
    title: 'Ciérralo a tu manera',
    description:
      'Acordáis precio, envío y pago entre vosotros. Sin intermediarios que se lleven su parte.',
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="como-funciona">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Así de fácil funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Sin complicaciones. Del anuncio al trato, en tres pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-ocean-200 via-orange-200 to-emerald-200 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              <div
                className={`relative z-10 w-20 h-20 rounded-2xl ${step.color} border-2 ${step.border} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 shadow-sm`}
              >
                <step.icon className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
