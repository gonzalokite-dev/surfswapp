import { ProductForm } from '@/components/products/product-form'

export default function NuevoProductoPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Publicar anuncio</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sube fotos, describe tu material y pon precio. En minutos estará visible.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
