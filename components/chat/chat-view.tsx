'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { Message } from '@/lib/types/database'

const MAX_CHARS = 2000

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatGroupDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isToday) return 'Hoy'
  if (isYesterday) return 'Ayer'
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

interface ChatViewProps {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
  otherUserName?: string
}

export function ChatView({
  conversationId,
  currentUserId,
  initialMessages,
  otherUserName,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior })
  }, [])

  // Scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom('instant')
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages])

  // Real-time subscription
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
    if (!content || sending || content.length > MAX_CHARS) return

    setSending(true)
    setText('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
    })

    if (error) {
      // Restore text on error
      setText(content)
    }

    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (val.length <= MAX_CHARS) {
      setText(val)
      // Auto-resize textarea
      e.target.style.height = 'auto'
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
    }
  }

  // Group messages by date for separators
  const groupedMessages: Array<{ type: 'date'; date: string } | { type: 'message'; msg: Message }> = []
  let lastDate = ''

  for (const msg of messages) {
    const msgDate = new Date(msg.created_at).toDateString()
    if (msgDate !== lastDate) {
      groupedMessages.push({ type: 'date', date: msg.created_at })
      lastDate = msgDate
    }
    groupedMessages.push({ type: 'message', msg })
  }

  // Group consecutive messages by same sender
  const getMessageGrouping = (index: number) => {
    const item = groupedMessages[index]
    if (item.type !== 'message') return { isFirst: false, isLast: false }

    const prevItem = groupedMessages[index - 1]
    const nextItem = groupedMessages[index + 1]

    const prevMsg = prevItem?.type === 'message' ? prevItem.msg : null
    const nextMsg = nextItem?.type === 'message' ? nextItem.msg : null

    const isFirst = !prevMsg || prevMsg.sender_id !== item.msg.sender_id
    const isLast = !nextMsg || nextMsg.sender_id !== item.msg.sender_id

    return { isFirst, isLast }
  }

  const charsLeft = MAX_CHARS - text.length
  const isNearLimit = charsLeft < 100

  return (
    <>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
            <div className="text-5xl mb-4">👋</div>
            <p className="font-semibold text-sm">Empieza la conversación</p>
            <p className="text-xs mt-1.5 max-w-xs leading-relaxed">
              Pregunta sobre el estado del material, negocia el precio o acuerda el método de entrega.
            </p>
          </div>
        )}

        {groupedMessages.map((item, index) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${item.date}`} className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium px-2">
                  {formatGroupDate(item.date)}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )
          }

          const { msg } = item
          const isMe = msg.sender_id === currentUserId
          const { isFirst, isLast } = getMessageGrouping(index)

          return (
            <div
              key={msg.id}
              className={cn(
                'flex',
                isMe ? 'justify-end' : 'justify-start',
                isLast ? 'mb-3' : 'mb-0.5'
              )}
            >
              <div className={cn('max-w-[75%] flex flex-col', isMe ? 'items-end' : 'items-start')}>
                {/* Sender name for other person — first message in group */}
                {!isMe && isFirst && otherUserName && (
                  <span className="text-xs text-muted-foreground font-medium mb-1 px-1">
                    {otherUserName}
                  </span>
                )}

                <div
                  className={cn(
                    'px-4 py-2.5 text-sm leading-relaxed break-words',
                    isMe
                      ? 'gradient-ocean text-white'
                      : 'bg-slate-100 text-foreground',
                    // Bubble shape
                    isMe && isFirst && isLast && 'rounded-2xl rounded-br-sm',
                    isMe && isFirst && !isLast && 'rounded-2xl rounded-br-sm',
                    isMe && !isFirst && isLast && 'rounded-2xl rounded-tr-sm rounded-br-sm',
                    isMe && !isFirst && !isLast && 'rounded-lg rounded-r-sm',
                    !isMe && isFirst && isLast && 'rounded-2xl rounded-bl-sm',
                    !isMe && isFirst && !isLast && 'rounded-2xl rounded-bl-sm',
                    !isMe && !isFirst && isLast && 'rounded-2xl rounded-tl-sm rounded-bl-sm',
                    !isMe && !isFirst && !isLast && 'rounded-lg rounded-l-sm'
                  )}
                >
                  {msg.content}
                </div>

                {/* Timestamp — only on last message of group */}
                {isLast && (
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {formatMessageTime(msg.created_at)}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-3 bg-white flex-shrink-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              className={cn(
                'w-full resize-none rounded-xl border bg-slate-50 px-3 py-2.5 text-sm',
                'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'min-h-[42px] max-h-[120px] overflow-y-auto transition-colors',
                sending && 'opacity-60'
              )}
              rows={1}
              disabled={sending}
            />
            {/* Character count */}
            {text.length > 0 && (
              <span
                className={cn(
                  'absolute bottom-2 right-2 text-[10px] pointer-events-none',
                  isNearLimit ? 'text-destructive' : 'text-muted-foreground/60'
                )}
              >
                {charsLeft}
              </span>
            )}
          </div>

          <Button
            onClick={sendMessage}
            disabled={!text.trim() || sending || text.length > MAX_CHARS}
            variant="ocean"
            size="icon"
            className="flex-shrink-0 w-10 h-10 rounded-xl"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isNearLimit && text.length > 0 && (
          <p className="text-xs text-destructive mt-1.5 px-1">
            {charsLeft <= 0 ? 'Has alcanzado el límite de caracteres.' : `Te quedan ${charsLeft} caracteres.`}
          </p>
        )}
      </div>
    </>
  )
}
