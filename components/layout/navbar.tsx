'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Plus, MessageCircle, User, LogOut, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isLanding = pathname === '/'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding && !scrolled
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-ocean flex items-center justify-center">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span
              className={cn(
                'font-display font-bold text-xl tracking-tight transition-colors',
                isLanding && !scrolled ? 'text-white' : 'text-foreground'
              )}
            >
              SURFSWAPP
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explorar"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isLanding && !scrolled
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              Explorar
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="ocean"
                  className="gap-1.5"
                >
                  <Link href="/dashboard/productos/nuevo">
                    <Plus className="w-4 h-4" />
                    Publicar
                  </Link>
                </Button>

                <Link href="/dashboard/mensajes">
                  <Button variant="ghost" size="icon" className={cn(
                    isLanding && !scrolled ? 'text-white hover:bg-white/10' : ''
                  )}>
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="relative group">
                  <Link href="/dashboard">
                    <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  </Link>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className={cn(
                    isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-muted-foreground'
                  )}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    isLanding && !scrolled ? 'text-white hover:bg-white/10' : ''
                  )}
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm" variant="ocean">
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg animate-fade-in">
          <div className="container p-4 space-y-2">
            <Link
              href="/explorar"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Explorar material
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard/productos/nuevo"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <Plus className="w-4 h-4 text-primary" />
                  Publicar anuncio
                </Link>
                <Link
                  href="/dashboard/mensajes"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Mensajes
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-primary" />
                  Mi perfil
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium text-muted-foreground w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
                </Button>
                <Button asChild variant="ocean" className="w-full">
                  <Link href="/registro" onClick={() => setMenuOpen(false)}>Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
