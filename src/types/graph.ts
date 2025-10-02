// Node Graph Types
export type NodePortType = 'exec' | 'string' | 'number' | 'boolean' | 'entity' | 'any'

export interface NodePort {
  id: string
  name: string
  type: NodePortType
}

export interface NodeMetadata {
  id: string
  type: string
  label: string
  category: 'event' | 'movement' | 'world' | 'logic' | 'collision' | 'scene'
  color: string
  inputs: NodePort[]
  outputs: NodePort[]
  properties: Record<string, any>
}

export interface GraphNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    properties: Record<string, any>
  }
  runtime?: any
}

export interface GraphEdge {
  id: string
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
  type?: string
}

export interface GameGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GameProject {
  id?: string
  name: string
  slug: string
  description: string
  graph: GameGraph
  createdAt?: string
  updatedAt?: string
  userId?: string
  isTemplate?: boolean
}
