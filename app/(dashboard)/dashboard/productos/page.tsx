import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { formatPrice, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils/format'
import { Plus, Edit, Eye } from 'lucide-react'
import { MarkSoldButton } from '@/components/products/mark-sold-button'

export default async function MisProductosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images (url, order_index)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Mis anuncios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products?.length ?? 0} anuncio{products?.length !== 1 ? 's' : ''} publicado{products?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="ocean" size="sm">
          <Link href="/dashboard/productos/nuevo">
            <Plus className="w-4 h-4" />
            Nuevo
          </Link>
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Todavía no tienes anuncios"
          description="Publica tu primer anuncio y empieza a vender material que ya no usas."
          action={{ label: 'Publicar primer anuncio', href: '/dashboard/productos/nuevo' }}
        />
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const img = product.product_images?.sort((a: {order_index: number}, b: {order_index: number}) => a.order_index - b.order_index)?.[0]?.url
            return (
              <div key={product.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  {img ? (
                    <Image src={img} alt={product.title} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                  </div>
                  <p className="font-semibold text-sm line-clamp-1">{product.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(product.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button asChild variant="ghost" size="icon" title="Ver anuncio">
                    <Link href={`/producto/${product.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" title="Editar">
                    <Link href={`/dashboard/productos/${product.id}/editar`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  {product.status === 'active' && (
                    <MarkSoldButton productId={product.id} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
