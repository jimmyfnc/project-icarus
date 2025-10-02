import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// ResetGame Node
NodeRegistry.register({
  meta: {
    type: 'ResetGame',
    label: 'Reset Game',
    category: 'scene',
    color: '#ec4899'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, _node) => {
    // Clear all entities
    ctx.entities.forEach((entity) => {
      entity.destroy()
    })
    ctx.entities.clear()

    // Reset variables
    ctx.variables.clear()

    // Restart the scene
    ctx.scene.scene.restart()

    return { exec: true }
  }
} as NodeRegistryEntry)
