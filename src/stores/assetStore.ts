import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assets as appwriteAssets } from '@/services/appwrite'
import { useAuthStore } from './authStore'
import type { Models } from 'appwrite'

export interface Asset {
  $id: string
  name: string
  mimeType: string
  sizeOriginal: number
  $createdAt: string
  url: string
  previewUrl: string
}

export const useAssetStore = defineStore('asset', () => {
  const authStore = useAuthStore()

  const files = ref<Models.File[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const assets = computed<Asset[]>(() => {
    return files.value.map(file => ({
      $id: file.$id,
      name: file.name,
      mimeType: file.mimeType,
      sizeOriginal: file.sizeOriginal,
      $createdAt: file.$createdAt,
      url: appwriteAssets.getFileUrl(file.$id),
      previewUrl: appwriteAssets.getFilePreview(file.$id)
    }))
  })

  const imageAssets = computed(() => {
    return assets.value.filter(asset => asset.mimeType.startsWith('image/'))
  })

  const audioAssets = computed(() => {
    return assets.value.filter(asset => asset.mimeType.startsWith('audio/'))
  })

  async function fetchAssets() {
    if (!authStore.userId) {
      error.value = 'Not authenticated'
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await appwriteAssets.list(authStore.userId)
      files.value = response.files
    } catch (e: any) {
      console.error('Failed to fetch assets:', e)
      error.value = e.message || 'Failed to fetch assets'
    } finally {
      loading.value = false
    }
  }

  async function uploadAsset(file: File) {
    if (!authStore.userId) {
      error.value = 'Not authenticated'
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const uploadedFile = await appwriteAssets.upload(file, authStore.userId)
      files.value.unshift(uploadedFile)
      return uploadedFile
    } catch (e: any) {
      console.error('Failed to upload asset:', e)
      error.value = e.message || 'Failed to upload asset'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteAsset(fileId: string) {
    loading.value = true
    error.value = null

    try {
      await appwriteAssets.delete(fileId)
      files.value = files.value.filter(f => f.$id !== fileId)
    } catch (e: any) {
      console.error('Failed to delete asset:', e)
      error.value = e.message || 'Failed to delete asset'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getAssetById(id: string) {
    return assets.value.find(asset => asset.$id === id)
  }

  return {
    files,
    assets,
    imageAssets,
    audioAssets,
    loading,
    error,
    fetchAssets,
    uploadAsset,
    deleteAsset,
    getAssetById
  }
})
