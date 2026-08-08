export type Plan = 'free' | 'pro' | 'agency'

export type TriggerType =
  | 'dm_keyword'
  | 'comment_keyword'
  | 'story_mention'
  | 'first_dm'

export type NodeType =
  | 'trigger'
  | 'send_message'
  | 'send_dm'
  | 'condition'
  | 'wait'
  | 'tag_contact'
  | 'collect_input'
  | 'ai_reply'
  | 'end'

export interface FlowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: Record<string, unknown>
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface DashboardStats {
  totalContacts: number
  activeFlows: number
  messagesToday: number
  conversionRate: number
}

export interface WebhookPayload {
  object: string
  entry: Array<{
    id: string
    time: number
    changes?: Array<{
      field: string
      value: Record<string, unknown>
    }>
    messaging?: Array<{
      sender: { id: string }
      recipient: { id: string }
      timestamp: number
      message?: { mid: string; text: string }
    }>
  }>
}
