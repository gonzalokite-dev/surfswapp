'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/common/image-upload'
import { createClient } from '@/lib/supabase/client'
import { productSchema, type ProductFormValues } from '@/lib/validations/product'
import { CATEGORIES, CONDITIONS } from '@/lib/types/database'
import { useToast } from '@/hooks/use-toast'

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues> & { id?: string }
  defaultImages?: string[]
  mode: 'create' | 'edit'
}

export function ProductForm({ defaultValues, defaultImages = [], mode }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(defaultImages)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...defaultValues,
      category: defaultValues?.category ?? '',
      condition: defaultValues?.condition ?? '',
      sport_type: defaultValues?.sport_type ?? '',
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      toast({ variant: 'destructive', description: 'Añade al menos una foto.' })
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const user = session.user

    if (mode === 'create') {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          price: Number(values.price),
          category: values.category,
          subcategory: values.subcategory ?? null,
          condition: values.condition,
          brand: values.brand ?? null,
          location: values.location ?? null,
          sport_type: values.sport_type,
          status: 'active',
        })
        .select('id')
        .single()

      if (error || !product) {
        toast({ variant: 'destructive', title: 'Error', description: error?.message ?? 'No se pudo publicar el anuncio.' })
        return
      }

      // Save images
      const imageInserts = images.map((url, i) => ({
        product_id: product.id,
        url,
        order_index: i,
      }))
      await supabase.from('product_images').insert(imageInserts)

      toast({ variant: 'success', title: '¡Anuncio publicado!', description: 'Tu material ya está visible.' })
      window.location.href = `/producto/${product.id}`
    } else {
      // Edit mode
      const { error } = await supabase
        .from('products')
        .update({
          title: values.title,
          description: values.description,
          price: Number(values.price),
          category: values.category,
          subcategory: values.subcategory ?? null,
          condition: values.condition,
          brand: values.brand ?? null,
          location: values.location ?? null,
          sport_type: values.sport_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', defaultValues!.id!)

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el anuncio.' })
        return
      }

      // Update images: delete all and reinsert
      await supabase.from('product_images').delete().eq('product_id', defaultValues!.id!)
      const imageInserts = images.map((url, i) => ({
        product_id: defaultValues!.id!,
        url,
        order_index: i,
      }))
      if (imageInserts.length > 0) await supabase.from('product_images').insert(imageInserts)

      toast({ variant: 'success', description: 'Anuncio actualizado correctamente.' })
      window.location.href = `/producto/${defaultValues!.id}`
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <div>
          <Label className="text-base font-semibold">Fotos</Label>
          <p className="text-sm text-muted-foreground">La primera foto será la principal. Máximo 5.</p>
        </div>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxImages={5}
          disabled={isSubmitting}
        />
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold text-base">Información del anuncio</h2>

        <div className="space-y-1.5">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            placeholder="Ej: Kite Cabrinha Switchblade 9m 2022"
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            placeholder="Describe el estado, tallas, historial de uso, qué incluye la venta..."
            rows={5}
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Precio (€) *</Label>
            <Input
              id="price"
              type="number"
              min="1"
              placeholder="Ej: 350"
              {...register('price')}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="Ej: Cabrinha, Duotone, Fanatic..."
              {...register('brand')}
            />
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold text-base">Categoría y estado</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Deporte / Categoría *</Label>
            <Select
              defaultValue={defaultValues?.category}
              onValueChange={(v) => { setValue('category', v); setValue('sport_type', v) }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Estado del producto *</Label>
            <Select
              defaultValue={defaultValues?.condition}
              onValueChange={(v) => setValue('condition', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="¿En qué estado está?" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && <p className="text-xs text-destructive">{errors.condition.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            placeholder="Ej: Tarifa, Cádiz"
            {...register('location')}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="ocean"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'create' ? 'Publicar anuncio' : 'Guardar cambios'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
