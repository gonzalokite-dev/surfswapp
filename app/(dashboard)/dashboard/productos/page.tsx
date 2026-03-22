import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { StatusActions } from '@/components/products/status-actions'
import { formatPrice, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils/format'
import { Plus, Edit, Eye } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const STATUS_TABS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'reserved', label: 'Reservados' },
  { value: 'sold', label: 'Vendidos' },
]

interface PageProps {
  searchParams: { estado?: string }
}

export default async function MisProductosPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const estado = searchParams.estado ?? ''

  let query = supabase
    .from('products')
    .select('*, product_images (url, order_index)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (estado && ['active', 'reserved', 'sold'].includes(estado)) {
    query = query.eq('status', estado) as any
  }

  const { data: products } = await query

  const emptyMessages: Record<string, { title: string; description: string }> = {
    '': {
      title: 'Todavía no tienes anuncios',
      description: 'Publica tu primer anuncio y empieza a vender material que ya no usas.',
    },
    active: {
      title: 'Sin anuncios activos',
      description: 'No tienes ningún anuncio activo en este momento.',
    },
    reserved: {
      title: 'Sin anuncios reservados',
      description: 'No tienes ningún anuncio marcado como reservado.',
    },
    sold: {
      title: 'Todavía no has vendido nada',
      description: 'Cuando vendas un artículo, aparecerá aquí.',
    },
  }

  const empty = emptyMessages[estado] ?? emptyMessages['']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Mis anuncios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products?.length ?? 0} anuncio{(products?.length ?? 0) !== 1 ? 's' : ''}{' '}
            {estado ? `· filtro: ${getStatusLabel(estado)}` : ''}
          </p>
        </div>
        <Button asChild variant="ocean" size="sm">
          <Link href="/dashboard/productos/nuevo">
            <Plus className="w-4 h-4" />
            Nuevo
          </Link>
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/dashboard/productos?estado=${tab.value}` : '/dashboard/productos'}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              estado === tab.value
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Products list */}
      {!products || products.length === 0 ? (
        <EmptyState
          icon="📦"
          title={empty.title}
          description={empty.description}
          action={{ label: 'Publicar primer anuncio', href: '/dashboard/productos/nuevo' }}
        />
      ) : (
        <div className="space-y-3">
          {products.map((product: any) => {
            const img = (product.product_images ?? [])
              .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)[0]?.url

            return (
              <div key={product.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4 hover:border-primary/20 transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  {img ? (
                    <Image
                      src={img}
                      alt={product.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(product.status)}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                    <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                      {product.category}
                    </span>
                  </div>
                  <p className="font-semibold text-sm line-clamp-1">{product.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(product.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" title="Ver anuncio" className="w-8 h-8">
                      <Link href={`/producto/${product.id}`}>
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" title="Editar" className="w-8 h-8">
                      <Link href={`/dashboard/productos/${product.id}/editar`}>
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>

                  <StatusActions
                    productId={product.id}
                    currentStatus={product.status}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
