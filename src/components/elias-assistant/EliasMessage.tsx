'use client'

import EliasAvatar from './EliasAvatar'

type Props = {
  role: 'user' | 'assistant'
  text: string
}

export default function EliasMessage({ role, text }: Props) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent-blue/20 px-4 py-3">
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <EliasAvatar size={36} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 rounded-2xl rounded-bl-md glass-light px-4 py-3">
        <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  )
}
