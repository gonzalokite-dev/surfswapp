'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(60),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(30).regex(/^[a-z0-9_]+$/, 'Solo letras, números y _').optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function PerfilPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
        reset({
          full_name: data?.full_name ?? user.user_metadata?.full_name ?? '',
          username: data?.username ?? '',
          location: data?.location ?? '',
          bio: data?.bio ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const onSubmit = async (values: ProfileFormValues) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: values.full_name,
        username: values.username || null,
        location: values.location || null,
        bio: values.bio || null,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      toast({
        variant: 'destructive',
        description: error.message.includes('unique') ? 'Ese nombre de usuario ya está en uso.' : error.message,
      })
      return
    }

    toast({ variant: 'success', description: 'Perfil actualizado correctamente.' })
  }

  const initials = (profile?.full_name ?? user?.user_metadata?.full_name ?? 'R')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-2xl" /></div>

  return (
    <>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="font-display text-2xl font-bold">Mi perfil</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Así te ven otros riders en SURFSWAPP.
          </p>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{profile?.full_name ?? user?.user_metadata?.full_name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Nombre</Label>
            <Input id="full_name" {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Nombre de usuario</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <Input id="username" className="pl-7" placeholder="mi_alias_rider" {...register('username')} />
            </div>
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" placeholder="Ej: Tarifa, Cádiz" {...register('location')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Cuéntanos algo de ti como rider..." rows={3} {...register('bio')} />
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          <Button type="submit" variant="ocean" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </Button>
        </form>
      </div>
      <Toaster />
    </>
  )
}
