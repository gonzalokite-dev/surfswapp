import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatView } from '@/components/chat/chat-view'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'

interface ChatPageProps {
  params: { id: string }
}

export default async function ConversacionPage({ params }: ChatPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      id,
      product_id,
      buyer_id,
      seller_id,
      products (id, title, price, status, product_images (url, order_index)),
      buyer:profiles!conversations_buyer_id_fkey (id, username, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey (id, username, full_name, avatar_url)
    `)
    .eq('id', params.id)
    .single()

  if (!conv) notFound()
  const c = conv as any
  if (c.buyer_id !== user!.id && c.seller_id !== user!.id) redirect('/dashboard/mensajes')

  const isbuyer = c.buyer_id === user!.id
  const otherUser: any = isbuyer ? c.seller : c.buyer
  const initials = (otherUser?.full_name ?? otherUser?.username ?? 'R')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const product: any = c.products
  const productImg = product?.product_images
    ?.sort((a: any, b: any) => a.order_index - b.order_index)?.[0]?.url

  // Fetch existing messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-2xl border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white flex-shrink-0">
        <Link href="/dashboard/mensajes" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <Avatar className="w-9 h-9">
          <AvatarImage src={otherUser?.avatar_url} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {otherUser?.full_name ?? otherUser?.username ?? 'Rider'}
          </p>
          {product && (
            <p className="text-xs text-muted-foreground truncate">
              Re: {product.title}
            </p>
          )}
        </div>

        {product && (
          <Link
            href={`/producto/${product.id}`}
            className="flex items-center gap-2 flex-shrink-0 bg-slate-50 border rounded-xl px-3 py-2 hover:border-primary/30 transition-colors"
          >
            {productImg && (
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image src={productImg} alt={product.title} width={32} height={32} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold line-clamp-1 max-w-[120px]">{product.title}</p>
              <p className="text-xs text-primary font-bold">{formatPrice(product.price)}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>
        )}
      </div>

      {/* Chat */}
      <ChatView
        conversationId={params.id}
        currentUserId={user!.id}
        initialMessages={messages ?? []}
        otherUserName={otherUser?.full_name ?? otherUser?.username ?? 'Rider'}
      />
    </div>
  )
}
