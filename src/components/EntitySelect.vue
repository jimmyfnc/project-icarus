<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      :class="{ 'border-yellow-400': !isValid && modelValue }"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="entity in entities" :key="entity" :value="entity">
        {{ entity }}
      </option>
      <option v-if="allowCustom" value="__custom__" class="text-blue-600">
        ➕ Enter custom ID...
      </option>
    </select>

    <!-- Custom input when user selects custom -->
    <input
      v-if="showCustomInput"
      :value="customValue"
      @input="handleCustomInput"
      @blur="hideCustomInput"
      type="text"
      :placeholder="customPlaceholder"
      class="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
      autofocus
    />

    <!-- Validation warning -->
    <p v-if="!isValid && modelValue" class="text-xs text-yellow-600 flex items-center gap-1">
      <span>⚠️</span>
      <span>Entity "{{ modelValue }}" not found. It may not be spawned yet.</span>
    </p>

    <!-- Helper text -->
    <p v-if="helperText" class="text-xs text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editorStore'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  customPlaceholder?: string
  helperText?: string
  allowCustom?: boolean
  validate?: boolean
}>(), {
  placeholder: 'Select entity...',
  customPlaceholder: 'e.g. player, enemy',
  allowCustom: true,
  validate: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorStore = useEditorStore()
const showCustomInput = ref(false)
const customValue = ref('')

const entities = computed(() => editorStore.spawnedEntities)

const isValid = computed(() => {
  if (!props.validate || !props.modelValue) return true
  return entities.value.includes(props.modelValue)
})

function handleCustomInput(event: Event) {
  const target = event.target as HTMLInputElement
  customValue.value = target.value
}

function hideCustomInput() {
  if (customValue.value.trim()) {
    emit('update:modelValue', customValue.value.trim())
  }
  showCustomInput.value = false
  customValue.value = ''
}

// Watch for __custom__ selection
function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target.value === '__custom__') {
    showCustomInput.value = true
    target.value = props.modelValue // Reset select
  } else {
    emit('update:modelValue', target.value)
  }
}
</script>
