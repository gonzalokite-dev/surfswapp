import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/common/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatRelativeTime } from '@/lib/utils/format'
import { MessageCircle } from 'lucide-react'

export default async function MensajesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      product_id,
      buyer_id,
      seller_id,
      updated_at,
      products (id, title, price, status, product_images (url, order_index)),
      buyer:profiles!conversations_buyer_id_fkey (id, username, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey (id, username, full_name, avatar_url),
      messages (content, created_at, sender_id)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Mensajes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Conversaciones con compradores y vendedores.
        </p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Sin mensajes todavía"
          description="Cuando alguien se interese por tu material o tú contactes con un vendedor, las conversaciones aparecerán aquí."
          action={{ label: 'Explorar material', href: '/explorar' }}
        />
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: any) => {
            const isbuyer = conv.buyer_id === userId
            const otherUser = isbuyer ? conv.seller : conv.buyer
            const lastMsg = [...(conv.messages ?? [])].sort(
              (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            const productImg = conv.products?.product_images
              ?.sort((a: any, b: any) => a.order_index - b.order_index)?.[0]?.url
            const initials = (otherUser?.full_name ?? otherUser?.username ?? 'R')
              .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

            return (
              <Link
                key={conv.id}
                href={`/dashboard/mensajes/${conv.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={otherUser?.avatar_url} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-sm">
                      {otherUser?.full_name ?? otherUser?.username ?? 'Rider'}
                    </p>
                    {lastMsg && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatRelativeTime(lastMsg.created_at)}
                      </span>
                    )}
                  </div>
                  {conv.products && (
                    <p className="text-xs text-muted-foreground truncate mb-0.5">
                      Re: {conv.products.title}
                    </p>
                  )}
                  {lastMsg && (
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMsg.sender_id === userId ? 'Tú: ' : ''}
                      {lastMsg.content}
                    </p>
                  )}
                </div>

                {productImg && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={productImg} alt="producto" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
