<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <header class="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">{{ project?.name || 'Loading...' }}</h1>
        <p class="text-sm text-gray-400">{{ project?.description }}</p>
      </div>
      <button
        @click="reset"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
      >
        Restart
      </button>
    </header>

    <main class="flex-1 flex items-center justify-center p-8">
      <div ref="gameContainer" class="bg-white rounded-lg shadow-2xl"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { PhaserGame } from '@/runtime/PhaserGame'
import { projects } from '@/services/appwrite'
import type { GameProject } from '@/types/graph'

const route = useRoute()
const gameContainer = ref<HTMLElement | null>(null)
const project = ref<GameProject | null>(null)
let game: PhaserGame | null = null

onMounted(async () => {
  const slug = route.params.slug as string

  // Load project
  project.value = await projects.getBySlug(slug)

  if (!project.value || !gameContainer.value) {
    alert('Project not found!')
    return
  }

  // Initialize Phaser game
  game = new PhaserGame(gameContainer.value)
  game.loadGraph(project.value.graph)
})

onUnmounted(() => {
  if (game) {
    game.destroy()
  }
})

function reset() {
  if (game) {
    game.reset()
  }
}
</script>
