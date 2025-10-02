<template>
  <div
    :style="{ borderColor: data.color }"
    class="bg-white border-2 rounded-lg shadow-md p-3 min-w-[180px]"
  >
    <!-- Node Header -->
    <div class="font-semibold text-sm mb-2">{{ data.label }}</div>

    <!-- Input Handles -->
    <div v-if="data.inputs && data.inputs.length" class="space-y-1 mb-2">
      <div
        v-for="input in data.inputs"
        :key="input.id"
        class="flex items-center text-xs"
      >
        <Handle
          :id="input.id"
          type="target"
          :position="Position.Left"
          :style="{ background: getHandleColor(input.type) }"
          class="w-3 h-3 -ml-5"
        />
        <span class="ml-2 text-gray-600">{{ input.name }}</span>
      </div>
    </div>

    <!-- Output Handles -->
    <div v-if="data.outputs && data.outputs.length" class="space-y-1">
      <div
        v-for="output in data.outputs"
        :key="output.id"
        class="flex items-center justify-end text-xs"
      >
        <span class="mr-2 text-gray-600">{{ output.name }}</span>
        <Handle
          :id="output.id"
          type="source"
          :position="Position.Right"
          :style="{ background: getHandleColor(output.type) }"
          class="w-3 h-3 -mr-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  id: string
  data: {
    label: string
    color: string
    nodeType: string
    inputs: Array<{ id: string; name: string; type: string }>
    outputs: Array<{ id: string; name: string; type: string }>
  }
}>()

function getHandleColor(type: string): string {
  switch (type) {
    case 'exec':
      return '#ffffff'
    case 'number':
      return '#3b82f6'
    case 'string':
      return '#10b981'
    case 'boolean':
      return '#f59e0b'
    case 'entity':
      return '#8b5cf6'
    default:
      return '#6b7280'
  }
}
</script>
