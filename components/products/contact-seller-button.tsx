'use client'

import { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  const handleContact = async () => {
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, sellerId }),
      })

      const data = await res.json()

      if (res.status === 401) {
        window.location.href = `/login?redirectTo=/producto/${productId}`
        return
      }

      if (data.error === 'is_owner') {
        window.location.href = `/dashboard/productos/${productId}/editar`
        return
      }

      if (data.error) {
        setErrorMsg(`Error: ${data.error}`)
        setLoading(false)
        return
      }

      window.location.href = `/dashboard/mensajes/${data.id}`
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Error de conexión')
      setLoading(false)
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
