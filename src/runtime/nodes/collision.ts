import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// OnCollide Node
NodeRegistry.register({
  meta: {
    type: 'OnCollide',
    label: 'On Collide',
    category: 'collision',
    color: '#8b5cf6'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entityA', name: 'entityA', type: 'entity' },
    { id: 'entityB', name: 'entityB', type: 'entity' }
  ],
  execute: (_ctx, _inputs, node) => {
    // Collision detection is handled in the runtime engine
    // This node is triggered by collision events
    if (node.runtime?.collided) {
      const entityA = node.runtime.entityA
      const entityB = node.runtime.entityB

      // Clear collision flag after reading
      node.runtime.collided = false

      return { exec: true, entityA, entityB }
    }

    return {}
  }
} as NodeRegistryEntry)

// OnCollideWithTag Node (entity-to-tag collision)
NodeRegistry.register({
  meta: {
    type: 'OnCollideWithTag',
    label: 'On Collide With Tag',
    category: 'collision',
    color: '#8b5cf6'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'collidedWith', name: 'collidedWith', type: 'entity' }
  ],
  execute: (_ctx, _inputs, node) => {
    // Collision detection is handled in the runtime engine
    // This node is triggered when an entity collides with any entity that has the specified tag
    if (node.runtime?.collided) {
      const entity = node.runtime.entity
      const collidedWith = node.runtime.collidedWith

      // Clear collision flag after reading
      node.runtime.collided = false

      return { exec: true, entity, collidedWith }
    }

    return {}
  }
} as NodeRegistryEntry)
