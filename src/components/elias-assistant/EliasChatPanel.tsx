'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import EliasAvatar from './EliasAvatar'
import EliasMessage from './EliasMessage'
import EliasSuggestions from './EliasSuggestions'
import { getProgressContext } from '@/lib/elias-progress'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola. Soy Elías, tu guía en el Método N.E.U.R.O. Puedo recomendarte prácticas, explicarte conceptos y ayudarte con lo que necesites ahora.\n\n¿Cómo te sientes hoy?',
}

type Props = {
  onClose: () => void
  isMobile?: boolean
}

export default function EliasChatPanel({ onClose, isMobile }: Props) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const allMessages = [...messages, userMsg]
      const progress = getProgressContext()
      const res = await fetch('/api/ia-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role === 'assistant' ? 'coach' : 'user', text: m.text })),
          progress: progress?.summary ?? 'Sin datos de progreso.',
        }),
      })

      const data = await res.json()
      const reply = (data as { text?: string }).text || 'No he podido procesar tu mensaje. ¿Puedes reformularlo?'

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: 'Ha habido un error. ¿Puedes intentarlo de nuevo?' },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [messages, isTyping])

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const panelClasses = isMobile
    ? 'fixed inset-x-0 bottom-0 rounded-t-3xl animate-slide-up'
    : 'fixed inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-[420px] md:max-h-[80vh] md:rounded-2xl md:animate-scale-in'

  return (
    <div className={`glass border border-white/10 flex flex-col ${panelClasses}`} style={{ height: isMobile ? '85vh' : '100vh', maxHeight: isMobile ? '85vh' : undefined }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 shrink-0">
        <EliasAvatar size={40} />
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-semibold text-white text-base">Habla con Elías</h2>
          <p className="text-text-muted text-xs">Tu guía en el Método N.E.U.R.O.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {messages.map((m) => (
          <EliasMessage key={m.id} role={m.role} text={m.text} />
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <EliasAvatar size={36} className="mt-0.5 shrink-0" />
            <div className="rounded-2xl rounded-bl-md glass-light px-4 py-3">
              <Loader2 className="w-5 h-5 text-accent-blue animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (show when few messages) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 shrink-0">
          <EliasSuggestions onSelect={handleSuggestion} disabled={isTyping} progress={getProgressContext()} />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue/50 border border-white/5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-accent-blue text-white hover:bg-accent-blue-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
