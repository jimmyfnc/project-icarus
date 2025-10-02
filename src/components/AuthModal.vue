<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">{{ isLogin ? 'Login' : 'Sign Up' }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="At least 8 characters"
          />
        </div>

        <div v-if="authStore.error" class="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium"
        >
          {{ authStore.loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up') }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <button
          @click="toggleMode"
          class="text-blue-600 hover:underline text-sm"
        >
          {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')

function toggleMode() {
  isLogin.value = !isLogin.value
  authStore.clearError()
}

async function handleSubmit() {
  authStore.clearError()

  let success = false
  if (isLogin.value) {
    success = await authStore.login(email.value, password.value)
  } else {
    success = await authStore.signup(email.value, password.value, name.value)
  }

  if (success) {
    emit('close')
  }
}
</script>
