import Link from 'next/link'
import Image from 'next/image'
import { MapPin, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getConditionLabel, getStatusColor, getStatusLabel } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { ProductWithImages } from '@/lib/types/database'

interface ProductCardProps {
  product: ProductWithImages
  className?: string
}

const CATEGORY_EMOJI: Record<string, string> = {
  surf: '🏄',
  kitesurf: '🪁',
  windsurf: '🌬️',
  wing: '🦅',
  foil: '⚡',
  accesorios: '🎒',
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mainImage = product.product_images?.[0]?.url
  const isSold = product.status === 'sold'

  return (
    <Link
      href={`/producto/${product.id}`}
      className={cn(
        'group block rounded-2xl border bg-white overflow-hidden card-hover',
        isSold && 'opacity-70',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-slate-100">
            {CATEGORY_EMOJI[product.category] ?? '📦'}
          </div>
        )}

        {/* Status badge */}
        {product.status !== 'active' && (
          <div className="absolute top-2 left-2">
            <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', getStatusColor(product.status))}>
              {getStatusLabel(product.status)}
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur font-medium capitalize">
            {CATEGORY_EMOJI[product.category]} {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-lg text-foreground">{formatPrice(product.price)}</p>
          <Badge variant="outline" className="text-xs">
            {getConditionLabel(product.condition)}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {product.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {product.location}
            </span>
          )}
          <span className="flex items-center gap-1 flex-shrink-0">
            <User className="w-3 h-3" />
            {product.profiles?.username ?? product.profiles?.full_name ?? 'Rider'}
          </span>
        </div>
      </div>
    </Link>
  )
}
