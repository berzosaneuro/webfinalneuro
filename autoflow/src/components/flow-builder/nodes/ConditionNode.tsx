'use client'
import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'

export function ConditionNode({ data, selected }: any) {
  return (
    <div className={`bg-dark-card border rounded-2xl p-4 min-w-[200px] transition-all shadow-lg ${
      selected ? 'border-warning shadow-warning/20' : 'border-dark-border'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-dark-border !w-3 !h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-warning/20 rounded-lg flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-warning" />
        </div>
        <span className="text-xs font-semibold text-warning uppercase tracking-wider">Condition</span>
      </div>

      <p className="text-sm text-text-primary">{data.condition || 'Set condition...'}</p>

      <div className="flex justify-between mt-3 text-xs text-text-muted">
        <span className="text-success">✓ Yes</span>
        <span className="text-danger">✗ No</span>
      </div>

      {/* Two outputs: yes (left) and no (right) */}
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '30%' }} className="!bg-success !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '70%' }} className="!bg-danger !w-3 !h-3" />
    </div>
  )
}
