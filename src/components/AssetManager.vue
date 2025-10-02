<template>
  <div class="flex flex-col h-full bg-white border-l border-gray-200">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Asset Library</h3>
      <p class="text-xs text-gray-500 mt-1">Upload sprites and audio files</p>
    </div>

    <!-- Upload Area -->
    <div class="p-4 border-b border-gray-200">
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        ]"
        @click="fileInput?.click()"
      >
        <div class="text-gray-600">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="mt-2 text-sm">
            <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WAV, MP3 (max 10MB)</p>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*,audio/*"
        @change="handleFileSelect"
        class="hidden"
        multiple
      />
    </div>

    <!-- Loading State -->
    <div v-if="assetStore.loading" class="p-4 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-sm">Loading assets...</p>
    </div>

    <!-- Error State -->
    <div v-if="assetStore.error" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
      {{ assetStore.error }}
    </div>

    <!-- Asset Grid -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="assetStore.assets.length === 0 && !assetStore.loading" class="text-center text-gray-500 py-8">
        <p>No assets uploaded yet</p>
        <p class="text-xs mt-1">Upload images and audio to use in your game</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="asset in assetStore.assets"
          :key="asset.$id"
          class="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="selectAsset(asset)"
          :class="{ 'ring-2 ring-blue-500': selectedAsset?.$id === asset.$id }"
        >
          <!-- Image Preview -->
          <div v-if="asset.mimeType.startsWith('image/')" class="aspect-square bg-gray-100">
            <img :src="asset.previewUrl" :alt="asset.name" class="w-full h-full object-contain" />
          </div>

          <!-- Audio Preview -->
          <div v-else-if="asset.mimeType.startsWith('audio/')" class="aspect-square bg-gray-100 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>

          <!-- Asset Info -->
          <div class="p-2 bg-white">
            <p class="text-xs font-medium text-gray-900 truncate" :title="asset.name">
              {{ asset.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatFileSize(asset.sizeOriginal) }}
            </p>
          </div>

          <!-- Delete Button -->
          <button
            @click.stop="confirmDelete(asset)"
            class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Delete asset"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Asset Footer -->
    <div v-if="selectedAsset" class="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <p class="text-sm font-medium text-gray-900 truncate">{{ selectedAsset.name }}</p>
      <p class="text-xs text-gray-500 mt-1">ID: {{ selectedAsset.$id }}</p>
      <button
        @click="copyAssetId(selectedAsset.$id)"
        class="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Copy Asset ID
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAssetStore } from '@/stores/assetStore'
import { useAuthStore } from '@/stores/authStore'
import type { Asset } from '@/stores/assetStore'

const assetStore = useAssetStore()
const authStore = useAuthStore()

const isDragging = ref(false)
const selectedAsset = ref<Asset | null>(null)
const fileInput = ref<HTMLInputElement>()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await assetStore.fetchAssets()
  }
})

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  uploadFiles(files)
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  uploadFiles(files)
  target.value = '' // Reset input
}

async function uploadFiles(files: File[]) {
  if (!authStore.isAuthenticated) {
    alert('Please login to upload assets')
    return
  }

  for (const file of files) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert(`File ${file.name} is too large (max 10MB)`)
      continue
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
      alert(`File ${file.name} is not an image or audio file`)
      continue
    }

    try {
      await assetStore.uploadAsset(file)
    } catch (e: any) {
      alert(`Failed to upload ${file.name}: ${e.message}`)
    }
  }
}

function selectAsset(asset: Asset) {
  selectedAsset.value = asset
}

async function confirmDelete(asset: Asset) {
  if (confirm(`Delete ${asset.name}?`)) {
    try {
      await assetStore.deleteAsset(asset.$id)
      if (selectedAsset.value?.$id === asset.$id) {
        selectedAsset.value = null
      }
    } catch (e: any) {
      alert(`Failed to delete: ${e.message}`)
    }
  }
}

function copyAssetId(id: string) {
  navigator.clipboard.writeText(id)
  alert('Asset ID copied to clipboard!')
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>
