import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/services/appwrite'
import type { Models } from 'appwrite'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<Models.User<Models.Preferences> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.$id || null)

  // Actions
  async function initialize() {
    loading.value = true
    try {
      user.value = await auth.getCurrentUser()
    } catch (e) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await auth.login(email, password)
      user.value = await auth.getCurrentUser()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to login'
      return false
    } finally {
      loading.value = false
    }
  }

  async function signup(email: string, password: string, name: string) {
    loading.value = true
    error.value = null
    try {
      await auth.signup(email, password, name)
      user.value = await auth.getCurrentUser()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to create account'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null
    try {
      await auth.logout()
      user.value = null
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to logout'
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    userId,

    // Actions
    initialize,
    login,
    signup,
    logout,
    clearError
  }
})
