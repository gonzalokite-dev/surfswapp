import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/common/product-card'
import { EmptyState } from '@/components/common/empty-state'
import { PageLoader } from '@/components/common/loading-spinner'
import { ProductFilters } from '@/components/products/product-filters'
import type { ProductWithImages } from '@/lib/types/database'

export const metadata: Metadata = {
  title: 'Explorar material de surf de segunda mano',
  description:
    'Encuentra tablas de surf, kites, velas, foils y accesorios de segunda mano en España. Compra directamente de otros riders.',
}

interface ExplorarPageProps {
  searchParams: {
    q?: string
    category?: string
    condition?: string
    min_price?: string
    max_price?: string
    sort?: string
  }
}

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Explorar material
          </h1>
          <p className="text-muted-foreground">
            Segunda mano para primera ola. Encuentra tu próximo material.
          </p>
        </div>

        <Suspense fallback={<PageLoader />}>
          <ExplorarContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function ExplorarContent({ searchParams }: ExplorarPageProps) {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return <EmptyState icon="🔧" title="Supabase no configurado" description="Añade tus credenciales de Supabase en .env.local para ver los productos." action={{ label: 'Ver README', href: '/' }} />
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (url, order_index),
      profiles (id, username, full_name, avatar_url, location)
    `)
    .eq('status', 'active')

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.condition) {
    query = query.eq('condition', searchParams.condition)
  }
  if (searchParams.min_price) {
    query = query.gte('price', Number(searchParams.min_price))
  }
  if (searchParams.max_price) {
    query = query.lte('price', Number(searchParams.max_price))
  }

  const sort = searchParams.sort ?? 'newest'
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  let products = null
  try {
    const { data } = await query.limit(48)
    products = data
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <ProductFilters searchParams={searchParams} />
      </aside>

      {/* Products grid */}
      <div className="flex-1">
        {products && products.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {products.length} anuncio{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {(products as ProductWithImages[]).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="🔍"
            title="Sin resultados"
            description="No encontramos material con esos filtros. Prueba a cambiar la búsqueda."
            action={{ label: 'Ver todo el material', href: '/explorar' }}
          />
        )}
      </div>
    </div>
  )
}
