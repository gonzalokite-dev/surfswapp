'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function MarkSoldButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const markSold = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('products')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', productId)

    setLoading(false)

    if (error) {
      toast({ variant: 'destructive', description: 'Error al actualizar el estado.' })
      return
    }

    toast({ variant: 'success', description: '¡Marcado como vendido! 🎉' })
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Marcar como vendido"
      onClick={markSold}
      disabled={loading}
      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
    </Button>
  )
}
