'use client'
import { Handle, Position } from '@xyflow/react'
import { MessageCircle, Bot } from 'lucide-react'

export function MessageNode({ data, selected, type }: any) {
  const isAI = type === 'ai_reply'
  return (
    <div className={`bg-dark-card border rounded-2xl p-4 min-w-[220px] max-w-[280px] transition-all shadow-lg ${
      selected ? 'border-brand shadow-brand/20' : 'border-dark-border'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-dark-border !w-3 !h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isAI ? 'bg-purple-500/20' : 'bg-instagram/20'}`}>
          {isAI
            ? <Bot className="w-3.5 h-3.5 text-purple-400" />
            : <MessageCircle className="w-3.5 h-3.5 text-instagram" />
          }
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${isAI ? 'text-purple-400' : 'text-instagram'}`}>
          {isAI ? 'AI Reply' : type === 'send_dm' ? 'Send DM' : 'Send Message'}
        </span>
      </div>

      <p className="text-sm text-text-primary line-clamp-3 leading-relaxed">
        {data.message || <span className="text-text-muted italic">Click to add message...</span>}
      </p>

      <Handle type="source" position={Position.Bottom} className="!bg-dark-border !w-3 !h-3" />
    </div>
  )
}
