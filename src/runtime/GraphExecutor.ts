import type { GameGraph, GraphNode, GraphEdge } from '@/types/graph'
import type { RuntimeContext } from '@/types/runtime'
import { NodeRegistry } from './NodeRegistry'

export class GraphExecutor {
  private graph: GameGraph
  private nodeMap: Map<string, GraphNode>
  private edgeMap: Map<string, GraphEdge[]>
  private startNodes: GraphNode[] = []
  private nodeRuntimes: Map<string, any> = new Map()
  private executedThisFrame: Set<string> = new Set()

  constructor(graph: GameGraph) {
    this.graph = graph
    this.nodeMap = new Map()
    this.edgeMap = new Map()

    // Build node map
    graph.nodes.forEach((node) => {
      this.nodeMap.set(node.id, node)
    })

    // Build edge map (source -> edges)
    graph.edges.forEach((edge) => {
      const edges = this.edgeMap.get(edge.source) || []
      edges.push(edge)
      this.edgeMap.set(edge.source, edges)
    })

    // Find start nodes (event nodes with no exec inputs)
    this.startNodes = graph.nodes.filter((node) => {
      const entry = NodeRegistry.get(node.type)
      if (!entry) return false

      // Event nodes typically have no exec inputs
      const hasExecInput = entry.inputs.some((input) => input.type === 'exec')
      return !hasExecInput && entry.meta.category === 'event'
    })
  }

  execute(ctx: RuntimeContext) {
    // Clear execution state for this frame
    this.executedThisFrame.clear()
    
    // Execute all event nodes
    this.startNodes.forEach((node) => {
      this.executeNode(node, ctx, {})
    })
  }

  private executeNode(
    node: GraphNode,
    ctx: RuntimeContext,
    inputs: Record<string, any>
  ): void {
    const entry = NodeRegistry.get(node.type)
    if (!entry) {
      console.warn(`Node type ${node.type} not found in registry`)
      return
    }

    // Skip if this node was already executed this frame (prevents redundant execution)
    // But allow event nodes to execute multiple times if needed
    const isEventNode = entry.meta.category === 'event'
    if (!isEventNode && this.executedThisFrame.has(node.id)) {
      return
    }
    
    // Mark as executed this frame
    this.executedThisFrame.add(node.id)

    // Attach runtime state to node
    if (!this.nodeRuntimes.has(node.id)) {
      this.nodeRuntimes.set(node.id, {})
    }
    const nodeWithRuntime = {
      ...node,
      runtime: this.nodeRuntimes.get(node.id)
    }

    // Execute the node
    const outputs = entry.execute(ctx, inputs, nodeWithRuntime)

    // Update runtime state
    this.nodeRuntimes.set(node.id, nodeWithRuntime.runtime)

    if (!outputs) return

    // Find connected nodes via edges
    const edges = this.edgeMap.get(node.id) || []

    edges.forEach((edge) => {
      const outputValue = outputs[edge.sourceHandle]

      // Only follow exec connections if they're truthy
      if (edge.sourceHandle === 'exec' || edge.sourceHandle === 'true' || edge.sourceHandle === 'false') {
        if (!outputValue) return
      }

      const targetNode = this.nodeMap.get(edge.target)
      if (!targetNode) return

      // Collect inputs for target node
      const targetInputs: Record<string, any> = {}

      // Get all edges pointing to this target node
      this.graph.edges
        .filter((e) => e.target === edge.target)
        .forEach((e) => {
          const sourceNode = this.nodeMap.get(e.source)
          if (!sourceNode) return

          const sourceEntry = NodeRegistry.get(sourceNode.type)
          if (!sourceEntry) return

          // Re-execute source node to get its outputs (for data flow)
          if (e.sourceHandle !== 'exec') {
            const sourceNodeWithRuntime = {
              ...sourceNode,
              runtime: this.nodeRuntimes.get(sourceNode.id) || {}
            }
            const sourceOutputs = sourceEntry.execute(ctx, {}, sourceNodeWithRuntime)
            if (sourceOutputs && sourceOutputs[e.sourceHandle] !== undefined) {
              targetInputs[e.targetHandle] = sourceOutputs[e.sourceHandle]
            }
          }
        })

      // Execute target node
      this.executeNode(targetNode, ctx, targetInputs)
    })
  }

  reset() {
    this.nodeRuntimes.clear()
  }
}
