<template>
  <div class="relative w-full h-full">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      @node-click="onNodeClick"
      @node-drag-stop="onNodeDragStop"
      @connect="onConnect"
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
      class="bg-gray-50"
    >
      <template #node-custom="{ data, id }">
        <CustomNode :id="id" :data="data" />
      </template>

      <Background pattern-color="#e5e7eb" :gap="15" />
      <Controls />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { useEditorStore } from '@/stores/editorStore'
import { NodeRegistry } from '@/runtime/NodeRegistry'
import CustomNode from './CustomNode.vue'
import type { Connection, Node, Edge } from '@vue-flow/core'

const editorStore = useEditorStore()

// Convert store nodes to VueFlow format
const nodes = computed({
  get: () => {
    return editorStore.nodes.map((node) => {
      const entry = NodeRegistry.get(node.type)
      return {
        id: node.id,
        type: 'custom',
        position: node.position,
        data: {
          ...node.data,
          nodeType: node.type,
          color: entry?.meta.color || '#6b7280',
          inputs: entry?.inputs || [],
          outputs: entry?.outputs || []
        }
      }
    })
  },
  set: (value: Node[]) => {
    // Update positions when nodes are moved
    value.forEach((vfNode) => {
      const storeNode = editorStore.nodes.find((n) => n.id === vfNode.id)
      if (storeNode && vfNode.position) {
        editorStore.updateNodePosition(vfNode.id, vfNode.position)
      }
    })
  }
})

const edges = computed({
  get: () => {
    return editorStore.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
      type: 'default',
      animated: edge.sourceHandle === 'exec'
    }))
  },
  set: (value: Edge[]) => {
    // Handle edge removal
    const currentIds = new Set(value.map((e) => e.id))
    editorStore.edges.forEach((edge) => {
      if (!currentIds.has(edge.id)) {
        editorStore.removeEdge(edge.id)
      }
    })
  }
})

function onNodeClick(event: any) {
  const node = editorStore.nodes.find((n) => n.id === event.node.id)
  editorStore.selectNode(node || null)
}

function onNodeDragStop(event: any) {
  if (event.node && event.node.position) {
    editorStore.updateNodePosition(event.node.id, event.node.position)
  }
}

function onConnect(connection: Connection) {
  if (!connection.source || !connection.target) return

  const edge = {
    id: `edge_${Date.now()}_${Math.random()}`,
    source: connection.source,
    sourceHandle: connection.sourceHandle || '',
    target: connection.target,
    targetHandle: connection.targetHandle || ''
  }

  editorStore.addEdge(edge)
}
</script>
