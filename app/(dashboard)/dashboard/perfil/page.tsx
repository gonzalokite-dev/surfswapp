'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils/cn'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const profileSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(60),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Solo letras minúsculas, números y _')
    .optional()
    .or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function PerfilPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) })

  const bioValue = watch('bio') ?? ''

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        const profileData = data as any
        setProfile(profileData)
        setAvatarUrl(profileData?.avatar_url ?? user.user_metadata?.avatar_url ?? null)
        reset({
          full_name: profileData?.full_name ?? user.user_metadata?.full_name ?? '',
          username: profileData?.username ?? '',
          location: profileData?.location ?? '',
          bio: profileData?.bio ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarClick = () => {
    if (!avatarUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('Solo se permiten imágenes JPG, PNG o WEBP.')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setAvatarError(`La imagen debe pesar menos de ${MAX_SIZE_MB}MB.`)
      return
    }

    setAvatarUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    // Remove old avatar if exists
    await supabase.storage.from('avatars').remove([path])

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      setAvatarError('Error al subir la imagen. Inténtalo de nuevo.')
      setAvatarUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(data.path)

    // Add cache-buster to force refresh
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`

    // Update profile with new avatar_url
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      setAvatarError('Error al actualizar el perfil.')
      setAvatarUploading(false)
      return
    }

    setAvatarUrl(urlWithCacheBust)
    setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }))
    setAvatarUploading(false)
    toast({ variant: 'success', description: 'Foto de perfil actualizada.' })

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveAvatar = async () => {
    if (!avatarUrl || avatarUploading) return
    setAvatarUploading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      toast({ variant: 'destructive', description: 'Error al eliminar la foto.' })
      setAvatarUploading(false)
      return
    }

    setAvatarUrl(null)
    setProfile((prev: any) => ({ ...prev, avatar_url: null }))
    setAvatarUploading(false)
    toast({ variant: 'success', description: 'Foto de perfil eliminada.' })
  }

  const onSubmit = async (values: ProfileFormValues) => {
    const { error } = await supabase.from('profiles').upsert({
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
        description: error.message.includes('unique')
          ? 'Ese nombre de usuario ya está en uso.'
          : error.message,
      })
      return
    }

    setProfile((prev: any) => ({
      ...prev,
      full_name: values.full_name,
      username: values.username || null,
      location: values.location || null,
      bio: values.bio || null,
    }))

    toast({ variant: 'success', description: 'Perfil actualizado correctamente.' })
  }

  const displayName =
    profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email ?? ''

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'R'

  if (loading) {
    return (
      <div className="space-y-4 max-w-lg animate-pulse">
        <div className="h-8 bg-slate-100 rounded-xl w-48" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="font-display text-2xl font-bold">Mi perfil</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Así te ven otros riders en SURFSWAPP.
          </p>
        </div>

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-sm mb-4">Foto de perfil</h2>
          <div className="flex items-center gap-5">
            <div className="relative group flex-shrink-0">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFile}
                disabled={avatarUploading}
              />

              {/* Avatar with click overlay */}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="relative w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                title="Cambiar foto de perfil"
              >
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-2xl gradient-ocean text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Hover overlay */}
                <div
                  className={cn(
                    'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity',
                    avatarUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {avatarUploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>

              {/* Remove avatar button */}
              {avatarUrl && !avatarUploading && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                  title="Eliminar foto"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold truncate">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="mt-2 h-8 text-xs"
              >
                {avatarUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3" />
                    {avatarUrl ? 'Cambiar foto' : 'Subir foto'}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG o WEBP · Máx. {MAX_SIZE_MB}MB
              </p>
              {avatarError && (
                <p className="text-xs text-destructive mt-1">{avatarError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border p-6 space-y-4"
        >
          <h2 className="font-semibold text-sm mb-2">Información personal</h2>

          <div className="space-y-1.5">
            <Label htmlFor="full_name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input id="full_name" placeholder="Tu nombre completo" {...register('full_name')} />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Nombre de usuario</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                @
              </span>
              <Input
                id="username"
                className="pl-7"
                placeholder="mi_alias_rider"
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Solo letras minúsculas, números y guion bajo. Mínimo 3 caracteres.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ej: Tarifa, Cádiz"
              {...register('location')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">
              Bio
              <span className="text-muted-foreground text-xs ml-2">
                ({bioValue.length}/300)
              </span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Cuéntanos algo de ti como rider..."
              rows={3}
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="ocean"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar cambios
          </Button>
        </form>

        {/* Account info */}
        <div className="bg-white rounded-2xl border p-6 space-y-3">
          <h2 className="font-semibold text-sm">Cuenta</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Para cambiar tu email o contraseña, contacta con soporte.
          </p>
        </div>
      </div>
      <Toaster />
    </>
  )
}
