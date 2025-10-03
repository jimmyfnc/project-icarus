<template>
  <!-- Asset Upload System Integrated -->
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="text-gray-600 hover:text-gray-900">
          ← Back
        </RouterLink>
        <h1 class="text-xl font-bold">{{ editorStore.currentProject?.name || 'Untitled' }}</h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showAssets = !showAssets"
          :class="showAssets ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'"
          class="px-4 py-2 text-white rounded text-sm font-medium"
        >
          📦 Assets
        </button>
        <button
          @click="saveProject"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
        >
          Save
        </button>
      </div>
    </header>

    <!-- Template Warning Banner -->
    <div
      v-if="editorStore.currentProject?.isTemplate"
      class="bg-yellow-100 border-b border-yellow-200 px-4 py-2 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <span class="text-yellow-800 font-medium">⚠️ Viewing Template</span>
        <span class="text-yellow-700 text-sm">Changes won't be saved. Save as a new project to edit.</span>
      </div>
      <button
        @click="saveAsNew"
        class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium"
      >
        Save As New Project
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Node Palette -->
      <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <NodePalette />
      </aside>

      <!-- Center - Canvas -->
      <main class="flex-1 flex flex-col">
        <div :class="previewExpanded ? 'h-0' : 'flex-1'" class="bg-gray-50 overflow-hidden">
          <GraphCanvas v-if="!previewExpanded" />
        </div>

        <!-- Bottom - Preview -->
        <div
          :class="previewExpanded ? 'flex-1' : 'h-80'"
          class="border-t border-gray-200 bg-gray-900 transition-all"
        >
          <GamePreview @toggle-fullscreen="togglePreviewSize" :is-expanded="previewExpanded" />
        </div>
      </main>

      <!-- Right Sidebar - Properties / Assets -->
      <aside class="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <PropertiesPanel v-show="!showAssets" />
        <AssetManager v-show="showAssets" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, markRaw } from 'vue'
import { RouterLink } from 'vue-router'
import { useEditorStore } from '@/stores/editorStore'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'
import NodePalette from '@/components/NodePalette.vue'
import GraphCanvas from '@/components/GraphCanvas.vue'
import PropertiesPanel from '@/components/PropertiesPanel.vue'
import GamePreview from '@/components/GamePreview.vue'
import AssetManager from '@/components/AssetManager.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const previewExpanded = ref(false)
const showAssets = ref(false)
const openAuthModal = inject<() => void>('openAuthModal')!

// Force AssetManager to be included in build (prevent tree-shaking)
// @ts-ignore - Intentionally unused to prevent tree-shaking
const _assetManagerComponent = markRaw(AssetManager)

function togglePreviewSize() {
  previewExpanded.value = !previewExpanded.value
}

function saveAsNew() {
  const name = prompt('Enter a name for your new project:')
  if (!name) return

  editorStore.saveAsNewProject(name)
  alert(`Project saved as "${name}"! Your changes will now auto-save.`)
}

async function saveProject() {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    alert('Please login to save projects')
    openAuthModal()
    return
  }

  if (!editorStore.currentProject) {
    alert('No project to save')
    return
  }

  // If it's a template, prompt to save as new
  if (editorStore.currentProject.isTemplate) {
    saveAsNew()
    return
  }

  try {
    const project = {
      ...editorStore.currentProject,
      graph: editorStore.graph
    }

    await projectStore.saveProject(project)
    alert('Project saved!')
  } catch (e: any) {
    console.error('Save error:', e)
    alert('Failed to save project: ' + (e.message || 'Unknown error'))
  }
}
</script>
