import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameProject } from '@/types/graph'
import { projects as appwriteProjects } from '@/services/appwrite'
import { useAuthStore } from './authStore'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<GameProject[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchProjects() {
    const authStore = useAuthStore()
    if (!authStore.userId) {
      error.value = 'Not authenticated'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const docs = await appwriteProjects.list(authStore.userId)
      projects.value = docs.map(doc => ({
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        graph: JSON.parse(doc.graph),
        updatedAt: doc.$updatedAt
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch projects'
    } finally {
      isLoading.value = false
    }
  }

  async function saveProject(project: GameProject) {
    const authStore = useAuthStore()
    if (!authStore.userId) {
      error.value = 'Not authenticated'
      throw new Error('Not authenticated')
    }

    isLoading.value = true
    error.value = null

    try {
      if (project.id) {
        // Update existing
        await appwriteProjects.update(project.id, {
          name: project.name,
          slug: project.slug,
          description: project.description || '',
          graph: project.graph
        })
      } else {
        // Create new
        const doc = await appwriteProjects.create({
          name: project.name,
          slug: project.slug,
          description: project.description || '',
          graph: project.graph,
          userId: authStore.userId
        })
        project.id = doc.$id
      }

      await fetchProjects()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save project'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loadProject(projectId: string): Promise<GameProject | null> {
    isLoading.value = true
    error.value = null

    try {
      const doc = await appwriteProjects.get(projectId)
      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        graph: JSON.parse(doc.graph)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load project'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProject(id: string) {
    isLoading.value = true
    error.value = null

    try {
      await appwriteProjects.delete(id)
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete project'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    projects,
    isLoading,
    error,

    // Actions
    fetchProjects,
    saveProject,
    loadProject,
    deleteProject
  }
})
