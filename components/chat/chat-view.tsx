'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Message } from '@/lib/types/database'

interface ChatViewProps {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
}

export function ChatView({ conversationId, currentUserId, initialMessages }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = async () => {
    const content = text.trim()
    if (!content || sending) return

    setSending(true)
    setText('')

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
    })

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
            <div className="text-4xl mb-3">👋</div>
            <p className="font-medium text-sm">Empieza la conversación</p>
            <p className="text-xs mt-1 max-w-xs">
              Pregunta sobre el estado del material, negocia el precio o acuerda el envío.
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId
          const prevMsg = messages[i - 1]
          const showTime = !prevMsg ||
            new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60 * 1000

          return (
            <div key={msg.id}>
              {showTime && (
                <div className="text-center text-xs text-muted-foreground my-3">
                  {formatRelativeTime(msg.created_at)}
                </div>
              )}
              <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                    isMe
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-slate-100 text-foreground rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-3 bg-white flex-shrink-0">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="flex-1"
          disabled={sending}
        />
        <Button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          variant="ocean"
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
}
