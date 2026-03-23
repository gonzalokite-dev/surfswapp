'use client'

import { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ContactSellerButtonProps {
  productId: string
  sellerId: string
  sellerName: string
  isSold: boolean
}

export function ContactSellerButton({
  productId,
  sellerId,
  sellerName,
  isSold,
}: ContactSellerButtonProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const handleContact = async () => {
    setErrorMsg(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = `/login?redirectTo=/producto/${productId}`
        return
      }

      if (user.id === sellerId) {
        window.location.href = `/dashboard/productos/${productId}/editar`
        return
      }

      setLoading(true)

      // Check if conversation already exists
      const { data: existing, error: existingError } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .maybeSingle()

      if (existingError) {
        setLoading(false)
        setErrorMsg(`Error: ${existingError.message}`)
        return
      }

      if (existing) {
        window.location.href = `/dashboard/mensajes/${existing.id}`
        return
      }

      // Create new conversation
      const { data: conversation, error: insertError } = await supabase
        .from('conversations')
        .insert({ product_id: productId, buyer_id: user.id, seller_id: sellerId })
        .select('id')
        .single()

      setLoading(false)

      if (insertError) {
        setErrorMsg(`Error: ${insertError.message}`)
        return
      }

      window.location.href = `/dashboard/mensajes/${conversation.id}`
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err?.message ?? 'Error inesperado al contactar')
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleContact}
        variant="ocean"
        size="lg"
        className="w-full"
        disabled={loading || isSold}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )}
        {isSold ? 'Este artículo ya está vendido' : `Contactar con ${sellerName}`}
      </Button>
      {errorMsg && (
        <p className="text-sm text-destructive text-center">{errorMsg}</p>
      )}
    </div>
  )
}
