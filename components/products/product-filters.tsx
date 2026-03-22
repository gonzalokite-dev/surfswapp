'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, CONDITIONS } from '@/lib/types/database'
import { cn } from '@/lib/utils/cn'

interface ProductFiltersProps {
  searchParams: {
    q?: string
    category?: string
    condition?: string
    min_price?: string
    max_price?: string
    sort?: string
  }
}

export function ProductFilters({ searchParams }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [showMobile, setShowMobile] = useState(false)

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilters = Object.values(searchParams).some(Boolean)

  const filtersContent = (
    <div className="space-y-5">
      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Buscar
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            defaultValue={searchParams.q}
            placeholder="Tabla, kite, vela…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                update('q', (e.target as HTMLInputElement).value)
              }
            }}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ordenar
        </Label>
        <Select
          defaultValue={searchParams.sort ?? 'newest'}
          onValueChange={(v) => update('sort', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categoría
        </Label>
        <Select
          defaultValue={searchParams.category ?? 'all'}
          onValueChange={(v) => update('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Estado
        </Label>
        <Select
          defaultValue={searchParams.condition ?? 'all'}
          onValueChange={(v) => update('condition', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cualquier estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier estado</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Precio (€)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Mín"
            defaultValue={searchParams.min_price}
            onBlur={(e) => update('min_price', e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Máx"
            defaultValue={searchParams.max_price}
            onBlur={(e) => update('max_price', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clearAll}
        >
          <X className="w-4 h-4 mr-1" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowMobile(!showMobile)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showMobile ? 'Ocultar filtros' : 'Filtros'}
        </Button>
        {showMobile && (
          <div className="mt-4 bg-white rounded-xl border p-4">
            {filtersContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:block bg-white rounded-xl border p-5', isPending && 'opacity-60')}>
        <h3 className="font-semibold mb-5">Filtros</h3>
        {filtersContent}
      </div>
    </>
  )
}
