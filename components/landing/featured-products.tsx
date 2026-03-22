import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/common/product-card'
import { Button } from '@/components/ui/button'
import type { ProductWithImages } from '@/lib/types/database'

export async function FeaturedProducts() {
  let products = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        product_images (url, order_index),
        profiles (id, username, full_name, avatar_url, location)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8)
    products = data
  } catch {
    // Supabase not configured yet
  }

  if (!products || products.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Últimas incorporaciones
            </h2>
            <p className="text-muted-foreground">Material recién publicado esperándote.</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex gap-1 text-primary">
            <Link href="/explorar">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products as ProductWithImages[]).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline">
            <Link href="/explorar">Ver todo el material</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
