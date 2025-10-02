import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { GameGraph, GraphNode, GraphEdge, GameProject } from '@/types/graph'
import { NodeRegistry } from '@/runtime/NodeRegistry'

export const useEditorStore = defineStore('editor', () => {
  // Try to restore from localStorage
  const savedProject = localStorage.getItem('currentProject')
  const savedNodes = localStorage.getItem('currentNodes')
  const savedEdges = localStorage.getItem('currentEdges')

  // State
  const currentProject = ref<GameProject | null>(savedProject ? JSON.parse(savedProject) : null)
  const nodes = ref<GraphNode[]>(savedNodes ? JSON.parse(savedNodes) : [])
  const edges = ref<GraphEdge[]>(savedEdges ? JSON.parse(savedEdges) : [])
  const selectedNode = ref<GraphNode | null>(null)
  const isPlaying = ref(false)
  const debugMode = ref(false)

  // Computed
  const graph = computed<GameGraph>(() => ({
    nodes: nodes.value,
    edges: edges.value
  }))

  // Get all entity IDs from Spawn nodes
  const spawnedEntities = computed<string[]>(() => {
    const entityIds: string[] = []

    nodes.value.forEach(node => {
      if (node.type === 'Spawn') {
        const entityId = node.data.properties.entityId
        if (entityId && entityId.trim() !== '') {
          entityIds.push(entityId)
        }
      }
    })

    // Return unique entity IDs
    return [...new Set(entityIds)].sort()
  })

  // Actions
  function createNewProject(name: string, slug: string) {
    currentProject.value = {
      name,
      slug,
      description: '',
      graph: {
        nodes: [],
        edges: []
      }
    }
    nodes.value = []
    edges.value = []
    selectedNode.value = null
  }

  function loadProject(project: GameProject) {
    currentProject.value = project
    nodes.value = project.graph.nodes
    edges.value = project.graph.edges
    selectedNode.value = null
  }

  function addNode(type: string, position: { x: number; y: number }) {
    const entry = NodeRegistry.get(type)
    if (!entry) return

    const newNode: GraphNode = {
      id: `node_${Date.now()}_${Math.random()}`,
      type,
      position,
      data: {
        label: entry.meta.label,
        properties: {}
      }
    }

    nodes.value.push(newNode)
    return newNode
  }

  function removeNode(nodeId: string) {
    nodes.value = nodes.value.filter((n) => n.id !== nodeId)
    edges.value = edges.value.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )
    if (selectedNode.value?.id === nodeId) {
      selectedNode.value = null
    }
  }

  function updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    const node = nodes.value.find((n) => n.id === nodeId)
    if (node) {
      node.position = position
    }
  }

  function updateNodeProperties(nodeId: string, properties: Record<string, any>) {
    const node = nodes.value.find((n) => n.id === nodeId)
    if (node) {
      node.data.properties = { ...node.data.properties, ...properties }
    }
  }

  function addEdge(edge: GraphEdge) {
    // Check if edge already exists
    const exists = edges.value.some(
      (e) =>
        e.source === edge.source &&
        e.sourceHandle === edge.sourceHandle &&
        e.target === edge.target &&
        e.targetHandle === edge.targetHandle
    )

    if (!exists) {
      edges.value.push(edge)
    }
  }

  function removeEdge(edgeId: string) {
    edges.value = edges.value.filter((e) => e.id !== edgeId)
  }

  function selectNode(node: GraphNode | null) {
    selectedNode.value = node
  }

  function setPlaying(playing: boolean) {
    isPlaying.value = playing
  }

  function setDebugMode(debug: boolean) {
    debugMode.value = debug
  }

  function clearGraph() {
    nodes.value = []
    edges.value = []
    selectedNode.value = null
  }

  function saveAsNewProject(name: string) {
    if (!currentProject.value) return

    const slug = name.toLowerCase().replace(/\s+/g, '-')

    // Create a copy of the current project without the isTemplate flag
    currentProject.value = {
      ...currentProject.value,
      name,
      slug,
      isTemplate: false
    }

    // This will trigger auto-save since isTemplate is now false
  }

  // Auto-save to localStorage when data changes (but not for templates)
  watch(currentProject, (project) => {
    if (project && !project.isTemplate) {
      localStorage.setItem('currentProject', JSON.stringify(project))
    } else if (!project) {
      localStorage.removeItem('currentProject')
    }
  }, { deep: true })

  watch(nodes, (newNodes) => {
    // Only auto-save if not a template
    if (!currentProject.value?.isTemplate) {
      localStorage.setItem('currentNodes', JSON.stringify(newNodes))
    }
  }, { deep: true })

  watch(edges, (newEdges) => {
    // Only auto-save if not a template
    if (!currentProject.value?.isTemplate) {
      localStorage.setItem('currentEdges', JSON.stringify(newEdges))
    }
  }, { deep: true })

  return {
    // State
    currentProject,
    nodes,
    edges,
    selectedNode,
    isPlaying,
    debugMode,

    // Computed
    graph,
    spawnedEntities,

    // Actions
    createNewProject,
    loadProject,
    addNode,
    removeNode,
    updateNodePosition,
    updateNodeProperties,
    addEdge,
    removeEdge,
    selectNode,
    setPlaying,
    setDebugMode,
    clearGraph,
    saveAsNewProject
  }
})
