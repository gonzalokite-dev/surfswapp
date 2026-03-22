import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { Package, MessageCircle, Plus, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [productsRes, conversationsRes] = await Promise.all([
    supabase.from('products').select('id, status').eq('user_id', user!.id),
    supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`),
  ])

  const products = productsRes.data ?? []
  const conversations = conversationsRes.data ?? []
  const activeCount = products.filter((p) => p.status === 'active').length
  const soldCount = products.filter((p) => p.status === 'sold').length

  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'rider'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Hola, {name} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Anuncios activos"
          value={activeCount}
          color="text-ocean-600 bg-ocean-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Vendidos"
          value={soldCount}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          icon={MessageCircle}
          label="Conversaciones"
          value={conversations.length}
          color="text-orange-600 bg-orange-50"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="ocean" className="flex-1">
            <Link href="/dashboard/productos/nuevo">
              <Plus className="w-4 h-4" />
              Publicar anuncio
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/productos">
              <Package className="w-4 h-4" />
              Ver mis anuncios
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/mensajes">
              <MessageCircle className="w-4 h-4" />
              Mis mensajes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
