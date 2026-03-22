import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Email no válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Email no válido'),
  password: z
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(72, 'Máximo 72 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
