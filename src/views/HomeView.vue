<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Header with Auth -->
    <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">Visual Scripting Game Editor</h2>
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
      <button
        v-else
        @click="openAuthModal()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
      >
        Login / Sign Up
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-8">
      <div class="max-w-4xl w-full">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Create Your Game</h1>
        <p class="text-xl text-gray-600 mb-8">
          Node-based visual scripting. No coding required.
        </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          @click="createNewProject"
          class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500 text-left"
        >
          <div class="text-3xl mb-2">✨</div>
          <h3 class="text-lg font-semibold mb-2">New Project</h3>
          <p class="text-sm text-gray-600">Start from scratch</p>
        </button>

        <button
          @click="loadTemplate('flappy-bird')"
          class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <div class="text-3xl mb-2">🐦</div>
          <h3 class="text-lg font-semibold mb-2">Flappy Bird</h3>
          <p class="text-sm text-gray-600">Clone template</p>
        </button>

        <button
          @click="loadTemplate('platformer')"
          class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <div class="text-3xl mb-2">🎮</div>
          <h3 class="text-lg font-semibold mb-2">Platformer</h3>
          <p class="text-sm text-gray-600">Mario-style template</p>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Features</h2>
        <ul class="space-y-2 text-gray-700">
          <li>✓ Node-based visual scripting</li>
          <li>✓ Real-time preview with Phaser</li>
          <li>✓ Save projects to Appwrite</li>
          <li>✓ Share your games with a public link</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/editorStore'
import { useAuthStore } from '@/stores/authStore'
import { getTemplate, createSimpleExample } from '@/utils/templates'

const router = useRouter()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const openAuthModal = inject<() => void>('openAuthModal')!

async function handleLogout() {
  await authStore.logout()
  alert('Logged out successfully!')
}

function createNewProject() {
  const name = prompt('Project name:')
  if (!name) return

  const slug = name.toLowerCase().replace(/\s+/g, '-')

  // Load with a simple example
  const example = createSimpleExample()
  example.name = name
  example.slug = slug

  editorStore.loadProject(example)
  router.push('/editor')
}

function loadTemplate(templateId: string) {
  const template = getTemplate(templateId)
  if (!template) {
    alert('Template not found!')
    return
  }

  editorStore.loadProject(template)
  router.push('/editor')
}
</script>
