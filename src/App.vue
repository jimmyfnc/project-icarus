<template>
  <div id="app">
    <RouterView />
    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthModal from '@/components/AuthModal.vue'

const authStore = useAuthStore()
const showAuthModal = ref(false)

// Initialize auth on app start
onMounted(async () => {
  await authStore.initialize()
})

// Provide a method to show auth modal from anywhere
function openAuthModal() {
  showAuthModal.value = true
}

provide('openAuthModal', openAuthModal)
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
