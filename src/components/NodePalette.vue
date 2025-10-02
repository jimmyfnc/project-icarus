<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-4">Node Palette</h2>

    <div class="space-y-4">
      <div v-for="category in categories" :key="category">
        <h3 class="text-sm font-medium text-gray-700 mb-2 capitalize">
          {{ category }}
        </h3>
        <div class="space-y-1">
          <button
            v-for="node in getNodesByCategory(category)"
            :key="node.meta.type"
            @click="addNode(node.meta.type)"
            :style="{ borderColor: node.meta.color }"
            class="w-full p-2 text-left text-sm bg-white border-2 rounded hover:bg-gray-50 transition-colors"
          >
            {{ node.meta.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NodeRegistry } from '@/runtime/NodeRegistry'
import { useEditorStore } from '@/stores/editorStore'

const editorStore = useEditorStore()

const categories = ['event', 'movement', 'world', 'logic', 'collision', 'scene']

function getNodesByCategory(category: string) {
  return NodeRegistry.getByCategory(category)
}

function addNode(type: string) {
  // Add node at center of viewport
  editorStore.addNode(type, { x: 250, y: 150 })
}
</script>
