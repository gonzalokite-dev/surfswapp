'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Clock, ArchiveRestore, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface StatusActionsProps {
  productId: string
  currentStatus: string
}

export function StatusActions({ productId, currentStatus }: StatusActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const updateStatus = async (newStatus: 'active' | 'reserved' | 'sold') => {
    setLoading(newStatus)
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', productId)

    setLoading(null)

    if (error) {
      toast({ variant: 'destructive', description: 'Error al actualizar el estado.' })
      return
    }

    const labels: Record<string, string> = {
      active: 'Anuncio marcado como activo.',
      reserved: 'Anuncio marcado como reservado.',
      sold: '¡Anuncio marcado como vendido!',
    }
    toast({ variant: 'success', description: labels[newStatus] })
    router.refresh()
  }

  const deleteProduct = async () => {
    setLoading('delete')
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    setLoading(null)

    if (error) {
      toast({ variant: 'destructive', description: 'Error al eliminar el anuncio.' })
      setShowDeleteConfirm(false)
      return
    }

    toast({ variant: 'success', description: 'Anuncio eliminado correctamente.' })
    router.refresh()
  }

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">¿Seguro?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={deleteProduct}
          disabled={loading === 'delete'}
          className="h-7 text-xs px-2"
        >
          {loading === 'delete' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            'Sí, eliminar'
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(false)}
          disabled={loading === 'delete'}
          className="h-7 text-xs px-2"
        >
          Cancelar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Mark as reserved — only if active */}
      {currentStatus === 'active' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateStatus('reserved')}
          disabled={loading !== null}
          title="Marcar como reservado"
          className="h-8 text-xs px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          {loading === 'reserved' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          <span className="hidden sm:inline ml-1">Reservar</span>
        </Button>
      )}

      {/* Mark as sold — if active or reserved */}
      {(currentStatus === 'active' || currentStatus === 'reserved') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateStatus('sold')}
          disabled={loading !== null}
          title="Marcar como vendido"
          className="h-8 text-xs px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          {loading === 'sold' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <CheckCircle className="w-3 h-3" />
          )}
          <span className="hidden sm:inline ml-1">Vendido</span>
        </Button>
      )}

      {/* Mark as active — if reserved or sold */}
      {(currentStatus === 'reserved' || currentStatus === 'sold') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateStatus('active')}
          disabled={loading !== null}
          title="Marcar como activo"
          className="h-8 text-xs px-2 text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50"
        >
          {loading === 'active' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <ArchiveRestore className="w-3 h-3" />
          )}
          <span className="hidden sm:inline ml-1">Activar</span>
        </Button>
      )}

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={loading !== null}
        title="Eliminar anuncio"
        className="h-8 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-3 h-3" />
        <span className="hidden sm:inline ml-1">Eliminar</span>
      </Button>
    </div>
  )
}
