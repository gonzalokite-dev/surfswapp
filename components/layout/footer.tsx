import Link from 'next/link'
import { Waves } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-ocean flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">SURFSWAPP</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              El marketplace especializado en material de surf de segunda mano.
              Compra, vende y conecta con riders de toda España.
            </p>
            <p className="text-xs mt-4 text-slate-500">
              Dale una segunda vida. Coge la próxima ola.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explorar" className="hover:text-white transition-colors">Explorar material</Link></li>
              <li><Link href="/explorar?category=surf" className="hover:text-white transition-colors">Surf</Link></li>
              <li><Link href="/explorar?category=kitesurf" className="hover:text-white transition-colors">Kitesurf</Link></li>
              <li><Link href="/explorar?category=windsurf" className="hover:text-white transition-colors">Windsurf</Link></li>
              <li><Link href="/explorar?category=wing" className="hover:text-white transition-colors">Wing</Link></li>
              <li><Link href="/explorar?category=foil" className="hover:text-white transition-colors">Foil</Link></li>
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tu cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/registro" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
              <li><Link href="/dashboard/productos/nuevo" className="hover:text-white transition-colors">Publicar anuncio</Link></li>
              <li><Link href="/dashboard/mensajes" className="hover:text-white transition-colors">Mis mensajes</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SURFSWAPP. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/legal/privacidad" className="hover:text-slate-300 transition-colors">Privacidad</Link>
            <Link href="/legal/terminos" className="hover:text-slate-300 transition-colors">Términos de uso</Link>
            <Link href="/legal/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
