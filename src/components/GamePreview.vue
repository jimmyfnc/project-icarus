<template>
  <div class="h-full flex flex-col bg-gray-900">
    <!-- Preview Controls -->
    <div class="px-4 py-2 bg-gray-800 flex items-center gap-2">
      <button
        @click="play"
        :disabled="isPlaying"
        class="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm font-medium"
      >
        ▶ Play
      </button>
      <button
        @click="stop"
        :disabled="!isPlaying"
        class="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm font-medium"
      >
        ■ Stop
      </button>
      <button
        @click="reset"
        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
      >
        ↻ Reset
      </button>
      <button
        @click="$emit('toggleFullscreen')"
        class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
        :title="isExpanded ? 'Exit fullscreen' : 'Fullscreen preview'"
      >
        {{ isExpanded ? '⊗' : '⊕' }} {{ isExpanded ? 'Exit' : 'Expand' }}
      </button>
      <button
        @click="toggleDebug"
        :class="editorStore.debugMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'"
        class="px-3 py-1 text-white rounded text-sm font-medium"
        title="Toggle debug logging"
      >
        🐛 Debug
      </button>
      <span class="ml-auto text-xs text-gray-400">
        Game Preview (800x600)
      </span>
    </div>

    <!-- Game Container -->
    <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
      <div ref="gameContainer" class="bg-black rounded shadow-2xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useEditorStore } from '@/stores/editorStore'
import { PhaserGame } from '@/runtime/PhaserGame'
import { setDebugMode } from '@/runtime/GameScene'

defineProps<{
  isExpanded?: boolean
}>()

defineEmits<{
  toggleFullscreen: []
}>()

const editorStore = useEditorStore()
const gameContainer = ref<HTMLElement | null>(null)
const isPlaying = ref(false)

let game: PhaserGame | null = null

onMounted(() => {
  if (gameContainer.value) {
    game = new PhaserGame(gameContainer.value)

    // Load current graph if it exists and has nodes
    if (editorStore.graph && editorStore.graph.nodes.length > 0) {
      console.log('Loading graph on mount:', editorStore.graph.nodes.length, 'nodes')
      game.loadGraph(editorStore.graph)
    } else {
      console.log('No graph on mount, will load when available')
    }
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy()
  }
})

// Watch for graph changes and reload
watch(
  () => editorStore.graph,
  (newGraph) => {
    if (game && newGraph) {
      game.loadGraph(newGraph)
      if (isPlaying.value) {
        game.reset()
        game.play()
      }
    }
  },
  { deep: true }
)

function play() {
  if (!game) {
    console.warn('Game not initialized')
    return
  }

  if (!editorStore.graph || editorStore.graph.nodes.length === 0) {
    console.warn('No graph or empty graph', editorStore.graph)
    alert('No game loaded! Please load a template or create nodes first.')
    return
  }

  console.log('Playing game with graph:', editorStore.graph)
  console.log('Node count:', editorStore.graph.nodes.length)
  console.log('Edge count:', editorStore.graph.edges.length)

  game.loadGraph(editorStore.graph)

  // Small delay to let the graph load before resetting
  setTimeout(() => {
    if (game) {
      game.reset()
      game.play()
      isPlaying.value = true
      editorStore.setPlaying(true)
    }
  }, 100)
}

function stop() {
  if (game) {
    game.stop()
    isPlaying.value = false
    editorStore.setPlaying(false)
  }
}

function reset() {
  if (game) {
    game.reset()
    if (isPlaying.value) {
      game.play()
    }
  }
}

function toggleDebug() {
  editorStore.setDebugMode(!editorStore.debugMode)
  setDebugMode(editorStore.debugMode)
  console.log(`Debug mode ${editorStore.debugMode ? 'enabled' : 'disabled'}`)
}
</script>
