import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Toaster } from '@/components/ui/toaster'
import { LayoutDashboard, Package, MessageCircle, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/productos', label: 'Mis anuncios', icon: Package },
  { href: '/dashboard/mensajes', label: 'Mensajes', icon: MessageCircle },
  { href: '/dashboard/perfil', label: 'Mi perfil', icon: User },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <nav className="bg-white rounded-2xl border p-2 space-y-1">
                {navItems.map((item) => (
                  <DashboardNavLink key={item.href} {...item} />
                ))}
                <div className="pt-2 mt-2 border-t">
                  <Link
                    href="/dashboard/productos/nuevo"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white gradient-ocean"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo anuncio
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

function DashboardNavLink({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
}) {
  // We use a client component trick: since layout is server, we pass active state via class
  // In Next.js App Router, we can use usePathname only in client components.
  // So this is a server-rendered link — active state is handled via client wrapper.
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}
