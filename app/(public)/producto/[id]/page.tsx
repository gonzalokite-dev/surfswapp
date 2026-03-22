import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Tag, Package, ArrowLeft, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPrice, formatDate, getConditionLabel, getStatusColor, getStatusLabel } from '@/lib/utils/format'
import { ContactSellerButton } from '@/components/products/contact-seller-button'
import { ProductImageGallery } from '@/components/products/product-image-gallery'
import type { ProductWithImages } from '@/lib/types/database'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('title, description, price')
    .eq('id', params.id)
    .single()

  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.title} — ${formatPrice(product.price)}`,
    description: product.description.slice(0, 155),
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  surf: 'Surf',
  kitesurf: 'Kitesurf',
  windsurf: 'Windsurf',
  wing: 'Wing',
  foil: 'Foil',
  accesorios: 'Accesorios',
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, url, order_index),
      profiles (id, username, full_name, avatar_url, location, created_at)
    `)
    .eq('id', params.id)
    .single()

  if (!product) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === product.user_id
  const images = [...(product.product_images ?? [])].sort((a, b) => a.order_index - b.order_index)
  const sellerInitials = (product.profiles?.full_name ?? product.profiles?.username ?? 'R')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images (url, order_index), profiles (id, username, full_name, avatar_url, location)')
    .eq('category', product.category)
    .eq('status', 'active')
    .neq('id', product.id)
    .limit(4)

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back */}
        <Link
          href="/explorar"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Images — left */}
          <div className="lg:col-span-3">
            <ProductImageGallery images={images.map((i) => i.url)} title={product.title} />
          </div>

          {/* Info — right */}
          <div className="lg:col-span-2 space-y-5">
            {/* Status */}
            {product.status !== 'active' && (
              <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(product.status)}`}>
                {getStatusLabel(product.status)}
              </span>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1 capitalize">
                {CATEGORY_LABELS[product.category] ?? product.category}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                {product.title}
              </h1>
            </div>

            <p className="font-display text-4xl font-black text-primary">
              {formatPrice(product.price)}
            </p>

            {/* Metadata pills */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="ocean" className="gap-1">
                <Package className="w-3 h-3" />
                {getConditionLabel(product.condition)}
              </Badge>
              {product.location && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </Badge>
              )}
              {product.brand && (
                <Badge variant="outline" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {product.brand}
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(product.created_at)}
              </Badge>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border p-4">
              <h2 className="font-semibold text-sm mb-2">Descripción</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-xl border p-4">
              <h2 className="font-semibold text-sm mb-3">Vendedor</h2>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={product.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>{sellerInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {product.profiles?.full_name ?? product.profiles?.username ?? 'Rider'}
                  </p>
                  {product.profiles?.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.profiles.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            {isOwner ? (
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/productos/${product.id}/editar`}>
                    <Edit className="w-4 h-4" />
                    Editar anuncio
                  </Link>
                </Button>
              </div>
            ) : (
              <ContactSellerButton
                productId={product.id}
                sellerId={product.user_id}
                sellerName={product.profiles?.full_name ?? product.profiles?.username ?? 'el vendedor'}
                isSold={product.status === 'sold'}
              />
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">
              Más material de {CATEGORY_LABELS[product.category] ?? product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(relatedProducts as ProductWithImages[]).map((p) => {
                const img = p.product_images?.[0]?.url
                return (
                  <Link key={p.id} href={`/producto/${p.id}`} className="group block rounded-xl border bg-white overflow-hidden card-hover">
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {img && <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                      <p className="text-primary font-bold text-sm">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
