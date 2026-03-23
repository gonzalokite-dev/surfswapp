import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { formatPrice, getStatusColor, getStatusLabel, formatRelativeTime, formatDate } from '@/lib/utils/format'
import { Package, MessageCircle, Plus, TrendingUp, Edit, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id

  const [productsRes, conversationsRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, title, price, status, category, created_at, product_images (url, order_index)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('conversations')
      .select(`
        id,
        updated_at,
        buyer_id,
        seller_id,
        products (id, title),
        buyer:profiles!conversations_buyer_id_fkey (id, full_name, username, avatar_url),
        seller:profiles!conversations_seller_id_fkey (id, full_name, username, avatar_url),
        messages (content, created_at, sender_id)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false }),
  ])

  const products = (productsRes.data ?? []) as any[]
  const conversations = (conversationsRes.data ?? []) as any[]

  const activeCount = products.filter((p) => p.status === 'active').length
  const soldCount = products.filter((p) => p.status === 'sold').length
  const recentProducts = products.slice(0, 4)
  const recentConversations = conversations.slice(0, 3)

  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'rider'

  return (
    <div className="space-y-6">
      {/* Welcome block */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Hola, {name} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Bienvenido de vuelta a SURFSWAPP. Aquí tienes un resumen de tu actividad.
            </p>
          </div>
          <Button asChild variant="ocean" size="sm" className="shrink-0">
            <Link href="/dashboard/productos/nuevo">
              <Plus className="w-4 h-4" />
              Publicar anuncio
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Anuncios activos"
          value={activeCount}
          color="text-ocean-600 bg-ocean-50"
          href="/dashboard/productos?estado=active"
        />
        <StatCard
          icon={TrendingUp}
          label="Vendidos"
          value={soldCount}
          color="text-emerald-600 bg-emerald-50"
          href="/dashboard/productos?estado=sold"
        />
        <StatCard
          icon={MessageCircle}
          label="Conversaciones"
          value={conversations.length}
          color="text-orange-600 bg-orange-50"
          href="/dashboard/mensajes"
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-base">Mis anuncios recientes</h2>
            <Link
              href="/dashboard/productos"
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Ver todos
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="text-3xl mb-3">📦</div>
              <p className="font-medium text-sm">Todavía no tienes anuncios</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Publica tu primer anuncio y empieza a vender.
              </p>
              <Button asChild variant="ocean" size="sm">
                <Link href="/dashboard/productos/nuevo">
                  <Plus className="w-3.5 h-3.5" />
                  Publicar ahora
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {recentProducts.map((product: any) => {
                const img = (product.product_images ?? [])
                  .sort((a: any, b: any) => a.order_index - b.order_index)[0]?.url

                return (
                  <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      {img ? (
                        <Image
                          src={img}
                          alt={product.title}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getStatusColor(product.status)}`}>
                          {getStatusLabel(product.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button asChild variant="ghost" size="icon" className="w-8 h-8" title="Editar">
                        <Link href={`/dashboard/productos/${product.id}/editar`}>
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent conversations */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-base">Conversaciones recientes</h2>
            <Link
              href="/dashboard/mensajes"
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Ver todas
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="font-medium text-sm">Sin conversaciones todavía</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Cuando alguien contacte contigo, aparecerá aquí.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/explorar">
                  Explorar material
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {recentConversations.map((conv: any) => {
                const isBuyer = conv.buyer_id === userId
                const otherUser: any = isBuyer ? conv.seller : conv.buyer
                const lastMsg = [...(conv.messages ?? [])].sort(
                  (a: any, b: any) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )[0]

                const displayName = otherUser?.full_name ?? otherUser?.username ?? 'Rider'
                const initials = displayName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <Link
                    key={conv.id}
                    href={`/dashboard/mensajes/${conv.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full gradient-ocean flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{displayName}</p>
                        {lastMsg && (
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {formatRelativeTime(lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      {conv.products && (
                        <p className="text-xs text-muted-foreground truncate">
                          Re: {conv.products.title}
                        </p>
                      )}
                      {lastMsg ? (
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMsg.sender_id === userId ? 'Tú: ' : ''}
                          {lastMsg.content}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Sin mensajes aún</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA to publish */}
      <div className="gradient-ocean rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h3 className="font-semibold text-lg">¿Tienes material que ya no usas?</h3>
            <p className="text-white/80 text-sm mt-1">
              Publica en minutos y llega a miles de riders en España.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm" className="shrink-0 bg-white text-ocean-700 hover:bg-white/90">
            <Link href="/dashboard/productos/nuevo">
              <Plus className="w-4 h-4" />
              Publicar anuncio
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
  href,
  className,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
  href: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`bg-white rounded-2xl border p-5 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all ${className ?? ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  )
}
