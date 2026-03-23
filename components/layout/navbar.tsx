'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  Plus,
  MessageCircle,
  User,
  LogOut,
  Waves,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ full_name?: string | null; avatar_url?: string | null } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLanding = pathname === '/'

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single()
        setProfile(profileData)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const displayName =
    profile?.full_name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Rider'

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url

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
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
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

          {/* Desktop center nav */}
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

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Publish button */}
                <Button asChild size="sm" variant="ocean" className="gap-1.5">
                  <Link href="/dashboard/productos/nuevo">
                    <Plus className="w-4 h-4" />
                    Publicar
                  </Link>
                </Button>

                {/* Messages icon */}
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'relative',
                    isLanding && !scrolled ? 'text-white hover:bg-white/10' : ''
                  )}
                  title="Mensajes"
                >
                  <Link href="/dashboard/mensajes">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </Button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-xs gradient-ocean text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'text-sm font-medium max-w-[100px] truncate hidden lg:block',
                        isLanding && !scrolled ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {displayName}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isLanding && !scrolled ? 'text-white/80' : 'text-muted-foreground',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border shadow-lg py-1 animate-fade-in">
                      <div className="px-3 py-2 border-b mb-1">
                        <p className="text-sm font-semibold truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/mensajes"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        Mensajes
                      </Link>

                      <Link
                        href="/dashboard/perfil"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Mi perfil
                      </Link>

                      <div className="border-t mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
              isLanding && !scrolled
                ? 'text-white hover:bg-white/10'
                : 'text-foreground hover:bg-muted'
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg animate-fade-in">
          <div className="container p-4 space-y-1">
            {/* User info if logged in */}
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-xl">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-sm gradient-ocean text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}

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
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/mensajes"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  Mensajes
                </Link>

                <Link
                  href="/dashboard/perfil"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Mi perfil
                </Link>

                <div className="pt-2 mt-1 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-sm font-medium text-destructive w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Entrar
                  </Link>
                </Button>
                <Button asChild variant="ocean" className="w-full">
                  <Link href="/registro" onClick={() => setMenuOpen(false)}>
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
