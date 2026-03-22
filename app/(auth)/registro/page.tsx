'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Waves, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
      },
    })

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error al registrarse',
        description: error.message === 'User already registered'
          ? 'Ya existe una cuenta con este email'
          : error.message,
      })
      return
    }

    toast({
      variant: 'success',
      title: '¡Bienvenido a SURFSWAPP!',
      description: 'Cuenta creada correctamente.',
    })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl gradient-ocean flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">SURFSWAPP</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold mb-1">Únete a la comunidad</h1>
              <p className="text-muted-foreground text-sm">
                Crea tu cuenta y empieza a comprar o vender material
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Tu nombre</Label>
                <Input
                  id="full_name"
                  placeholder="Nombre o alias"
                  autoComplete="name"
                  {...register('full_name')}
                />
                {errors.full_name && (
                  <p className="text-xs text-destructive">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Al registrarte aceptas los{' '}
                <Link href="/legal/terminos" className="underline">términos de uso</Link>
                {' '}y la{' '}
                <Link href="/legal/privacidad" className="underline">política de privacidad</Link>.
              </p>

              <Button
                type="submit"
                variant="ocean"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Crear cuenta gratis
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </>
  )
}
