'use client'

import { useState, useRef, useEffect } from 'react'
import Container from '@/components/Container'
import {
  Brain, Send, Sparkles, Wind, Moon, Sun, Eye, Award
} from 'lucide-react'
import { getProgressContext } from '@/lib/elias-progress'
import { useUser } from '@/context/UserContext'

type Message = {
  id: string
  role: 'user' | 'coach'
  text: string
  timestamp: Date
}

type QuickAction = {
  label: string
  icon: React.ElementType
  prompt: string
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Ansiedad', icon: Wind, prompt: 'Siento ansiedad ahora mismo, necesito ayuda para calmarme', color: 'text-cyan-400' },
  { label: 'Meditar', icon: Moon, prompt: 'Quiero hacer una meditación guiada ahora', color: 'text-purple-400' },
  { label: 'Despertar', icon: Sun, prompt: 'Quiero un ejercicio para despertar mi consciencia', color: 'text-teal-400' },
  { label: 'Observar', icon: Eye, prompt: 'Enséñame la técnica del observador consciente', color: 'text-accent-blue' },
]

export default function IACoachPage() {
  const { isCertified } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'coach',
      text: 'Hola. Coach con el marco del Método N.E.U.R.O.\n\nRespiración, micro-pausas y siguientes pasos cuando la cabeza acelera. Lenguaje directo.\n\n¿Qué necesitas ahora?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      const progress = getProgressContext()
      const res = await fetch('/api/ia-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            text: m.text,
          })),
          progress: progress?.summary ?? 'Sin datos de progreso.',
        }),
      })

      const data = await res.json()

      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        role: 'coach',
        text: data.text || 'No he podido procesar tu mensaje. Inténtalo de nuevo.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, coachMsg])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'coach',
          text: 'Ha habido un error de conexión. Inténtalo de nuevo en unos segundos.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="relative overflow-hidden flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
      <div className="orb w-72 h-72 bg-purple-600 -top-20 -right-20" />

      {/* Header */}
      <div className="shrink-0 pt-6 md:pt-10 pb-4 px-4">
        <Container>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-accent-blue/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                IA Coach
                <Sparkles className="w-4 h-4 text-purple-400" />
                {isCertified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-semibold">
                    <Award className="w-3 h-3" /> Moderador
                  </span>
                )}
              </h1>
              <p className="text-text-muted text-xs">IA que habla claro, como una persona</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Quick actions */}
      <div className="shrink-0 px-4 pb-3">
        <Container>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                disabled={isTyping}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 glass rounded-full text-xs font-medium text-white active:scale-95 transition-transform disabled:opacity-40"
              >
                <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                {action.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Chat messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 pb-4">
        <Container>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-accent-blue/20 text-white rounded-br-md'
                      : 'glass text-white rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-6 md:pb-4 pt-2">
        <Container>
          <div className="glass rounded-2xl flex items-center gap-2 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="¿Cómo te sientes? ¿Qué necesitas?"
              disabled={isTyping}
              className="flex-1 bg-transparent text-white text-sm px-3 py-2 placeholder:text-text-muted focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 active:scale-90 transition-transform disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </div>
    </div>
  )
}
