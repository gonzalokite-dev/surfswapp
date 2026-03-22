'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

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
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleContact = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/login?redirectTo=/producto/${productId}`)
      return
    }

    if (user.id === sellerId) {
      toast({ description: 'Este anuncio es tuyo.' })
      return
    }

    setLoading(true)

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('product_id', productId)
      .eq('buyer_id', user.id)
      .eq('seller_id', sellerId)
      .maybeSingle()

    if (existing) {
      router.push(`/dashboard/mensajes/${existing.id}`)
      return
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({ product_id: productId, buyer_id: user.id, seller_id: sellerId })
      .select('id')
      .single()

    setLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo iniciar la conversación.',
      })
      return
    }

    router.push(`/dashboard/mensajes/${conversation.id}`)
  }

  return (
    <>
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
      <Toaster />
    </>
  )
}
