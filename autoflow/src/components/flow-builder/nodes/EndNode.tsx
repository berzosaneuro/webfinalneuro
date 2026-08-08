'use client'
import { Handle, Position } from '@xyflow/react'
import { CheckCircle } from 'lucide-react'

export function EndNode({ selected }: any) {
  return (
    <div className={`bg-dark-card border rounded-2xl p-4 min-w-[160px] transition-all shadow-lg text-center ${
      selected ? 'border-success shadow-success/20' : 'border-dark-border'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-dark-border !w-3 !h-3" />
      <div className="flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4 text-success" />
        <span className="text-sm font-medium text-success">Flow End</span>
      </div>
    </div>
  )
}
