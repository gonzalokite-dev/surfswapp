import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/products/product-form'

interface EditProductPageProps {
  params: { id: string }
}

export default async function EditarProductoPage({ params }: EditProductPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images (url, order_index)')
    .eq('id', params.id)
    .single()

  if (!product) notFound()
  if (product.user_id !== user?.id) redirect('/dashboard/productos')

  const images = [...(product.product_images ?? [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map((i) => i.url)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Editar anuncio</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Actualiza los detalles de tu anuncio.
        </p>
      </div>
      <ProductForm
        mode="edit"
        defaultValues={{
          id: product.id,
          title: product.title,
          description: product.description,
          price: String(product.price),
          category: product.category,
          subcategory: product.subcategory ?? undefined,
          condition: product.condition,
          brand: product.brand ?? undefined,
          location: product.location ?? undefined,
          sport_type: product.sport_type,
        }}
        defaultImages={images}
      />
    </div>
  )
}
