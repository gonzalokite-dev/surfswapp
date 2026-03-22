import { z } from 'zod'

export const productSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .min(5, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .min(20, 'Mínimo 20 caracteres')
    .max(2000, 'Máximo 2000 caracteres'),
  price: z
    .string()
    .min(1, 'El precio es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Precio no válido'),
  category: z.string().min(1, 'Selecciona una categoría'),
  subcategory: z.string().optional(),
  condition: z.string().min(1, 'Selecciona el estado'),
  brand: z.string().max(60, 'Máximo 60 caracteres').optional(),
  location: z.string().max(100, 'Máximo 100 caracteres').optional(),
  sport_type: z.string().min(1, 'Selecciona el deporte'),
})

export type ProductFormValues = z.infer<typeof productSchema>
