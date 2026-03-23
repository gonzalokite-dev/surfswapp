'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ value, onChange, maxImages = 5, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFiles = async (files: FileList) => {
    if (value.length + files.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes`)
      return
    }

    setUploading(true)
    setError(null)
    const newUrls: string[] = []

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Debes iniciar sesión para subir imágenes.')
        setUploading(false)
        return
      }

      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) { setError('Solo se permiten imágenes'); return false }
        if (file.size > 5 * 1024 * 1024) { setError('Cada imagen debe pesar menos de 5MB'); return false }
        return true
      })

      const uploads = await Promise.all(
        validFiles.map(async (file) => {
          const ext = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const path = `${user.id}/${fileName}`

          const { data, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(path, file, { cacheControl: '3600', upsert: false })

          if (uploadError) {
            setError(`Error: ${uploadError.message}`)
            return null
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path)

          return publicUrl
        })
      )

      newUrls.push(...uploads.filter((u): u is string => u !== null))
    } catch (err: any) {
      setError(err?.message ?? 'Error inesperado al subir la imagen.')
    }

    onChange([...value, ...newUrls])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
              <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="100px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < maxImages && (
        <div
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            disabled || uploading
              ? 'opacity-50 cursor-not-allowed border-slate-200'
              : 'border-slate-200 hover:border-primary hover:bg-primary/5'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={disabled || uploading}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Subiendo...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Añadir fotos</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {value.length}/{maxImages} · JPG, PNG o WEBP · Máx. 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
