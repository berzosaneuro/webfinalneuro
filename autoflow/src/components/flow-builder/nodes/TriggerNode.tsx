'use client'
import { Handle, Position } from '@xyflow/react'
import { Zap } from 'lucide-react'

export function TriggerNode({ data, selected }: any) {
  return (
    <div className={`bg-dark-card border rounded-2xl p-4 min-w-[200px] transition-all shadow-lg ${
      selected ? 'border-brand shadow-brand/20' : 'border-dark-border'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-brand/20 rounded-lg flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-brand" />
        </div>
        <span className="text-xs font-semibold text-brand uppercase tracking-wider">Trigger</span>
      </div>
      <p className="text-sm font-medium text-text-primary">
        {data.triggerType?.replace('_', ' ') ?? 'DM Keyword'}
      </p>
      {data.keywords?.length > 0 && (
        <p className="text-xs text-text-muted mt-1">
          Keywords: {data.keywords.join(', ')}
        </p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-brand !border-brand/50 !w-3 !h-3" />
    </div>
  )
}
