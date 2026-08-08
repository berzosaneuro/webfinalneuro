'use client'
import { useState, useCallback } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Connection, type Edge, BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Save, Play, Pause, ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TriggerNode } from './nodes/TriggerNode'
import { MessageNode } from './nodes/MessageNode'
import { ConditionNode } from './nodes/ConditionNode'
import { EndNode } from './nodes/EndNode'
import { NodePanel } from './NodePanel'
import { FlowConfig } from './FlowConfig'

const NODE_TYPES = {
  trigger:      TriggerNode,
  send_message: MessageNode,
  send_dm:      MessageNode,
  condition:    ConditionNode,
  end:          EndNode,
}

const DEFAULT_NODES = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Trigger', triggerType: 'dm_keyword', keywords: [] },
  },
]

interface FlowBuilderProps {
  flow: any | null
  accounts: Array<{ id: string; username: string }>
}

export function FlowBuilder({ flow, accounts }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flow?.nodes?.length ? flow.nodes : DEFAULT_NODES
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow?.edges ?? [])
  const [flowName, setFlowName] = useState(flow?.name ?? 'Untitled Flow')
  const [isActive, setIsActive] = useState(flow?.isActive ?? false)
  const [triggerType, setTriggerType] = useState(flow?.triggerType ?? 'dm_keyword')
  const [accountId, setAccountId] = useState(flow?.accountId ?? accounts[0]?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(!flow)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  )

  function addNode(type: string) {
    const id = `${type}-${Date.now()}`
    const newNode = {
      id,
      type,
      position: { x: 250 + Math.random() * 100, y: 200 + nodes.length * 120 },
      data: { label: type.replace('_', ' ') },
    }
    setNodes((nds) => [...nds, newNode])
  }

  async function save() {
    setSaving(true)
    const method = flow?.id ? 'PATCH' : 'POST'
    const url = flow?.id ? `/api/flows/${flow.id}` : '/api/flows'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: flowName,
        triggerType,
        accountId: accountId || null,
        nodes,
        edges,
        isActive,
      }),
    })
    setSaving(false)
  }

  async function toggleActive() {
    const next = !isActive
    setIsActive(next)
    if (flow?.id) {
      await fetch(`/api/flows/${flow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: next }),
      })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Topbar */}
      <div className="h-14 border-b border-dark-border bg-dark-surface flex items-center gap-4 px-4 flex-shrink-0">
        <Link href="/flows">
          <button className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>

        <input
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="bg-transparent text-base font-semibold focus:outline-none border-b border-transparent focus:border-brand/50 transition-colors px-1 py-0.5 min-w-0"
        />

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleActive}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-dark-card text-text-muted border border-dark-border hover:text-text-primary'
            }`}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isActive ? 'Active' : 'Draft'}
          </button>

          <Button size="sm" onClick={save} loading={saving}>
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — add nodes */}
        <div className="w-52 border-r border-dark-border bg-dark-surface p-3 flex flex-col gap-1 flex-shrink-0 overflow-y-auto">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">Add Block</p>
          {[
            { type: 'send_message', label: 'Send Message', color: 'brand' },
            { type: 'send_dm', label: 'Send DM', color: 'instagram' },
            { type: 'condition', label: 'Condition', color: 'warning' },
            { type: 'wait', label: 'Wait / Delay', color: 'default' },
            { type: 'tag_contact', label: 'Tag Contact', color: 'success' },
            { type: 'collect_input', label: 'Collect Input', color: 'brand' },
            { type: 'ai_reply', label: 'AI Reply', color: 'brand' },
            { type: 'end', label: 'End Flow', color: 'danger' },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card px-3 py-2 rounded-lg transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </button>
          ))}

          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">Flow Config</p>
            <div className="space-y-2 px-2">
              <div>
                <label className="text-xs text-text-muted mb-1 block">Account</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-lg text-xs px-2 py-1.5 text-text-primary focus:outline-none focus:border-brand"
                >
                  <option value="">No account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>@{a.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Trigger</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-lg text-xs px-2 py-1.5 text-text-primary focus:outline-none focus:border-brand"
                >
                  <option value="dm_keyword">DM Keyword</option>
                  <option value="comment_keyword">Comment Keyword</option>
                  <option value="story_mention">Story Mention</option>
                  <option value="first_dm">First DM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            nodeTypes={NODE_TYPES as any}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1E1E2E" />
            <Controls />
            <MiniMap
              nodeColor="#6366F1"
              maskColor="rgba(10,10,15,0.8)"
              style={{ background: '#111118', border: '1px solid #1E1E2E' }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
