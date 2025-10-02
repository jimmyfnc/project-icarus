import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'
import { debugMode } from '../GameScene'

// GetEntity Node - Get entity reference by ID
NodeRegistry.register({
  meta: {
    type: 'GetEntity',
    label: 'Get Entity',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'exists', name: 'exists', type: 'boolean' }
  ],
  execute: (ctx, _inputs, node) => {
    const entityId = node.data.properties.entity || ''
    const entity = ctx.entities.get(entityId)

    return {
      exec: true,
      entity: entityId,
      exists: !!entity
    }
  }
} as NodeRegistryEntry)

// Spawn Node
NodeRegistry.register({
  meta: {
    type: 'Spawn',
    label: 'Spawn',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'sprite', name: 'sprite', type: 'string' },
    { id: 'x', name: 'x', type: 'number', default: 0 },
    { id: 'y', name: 'y', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const sprite = inputs.sprite || node.data.properties.sprite || 'player'
    const x = inputs.x ?? node.data.properties.x ?? 100
    const y = inputs.y ?? node.data.properties.y ?? 100
    const entityId = node.data.properties.entityId || `entity_${Date.now()}_${Math.random()}`
    const isStatic = node.data.properties.isStatic ?? false
    const hasGravity = node.data.properties.hasGravity ?? true
    const collideWorldBounds = node.data.properties.collideWorldBounds ?? false
    const tag = node.data.properties.tag || ''

    if (debugMode) {
      console.log(`🎮 Spawn node: entityId="${entityId}", sprite="${sprite}", x=${x}, y=${y}, tag="${tag}"`)
    }

    // Check if entity already exists
    if (!ctx.entities.has(entityId)) {
      let gameObject: Phaser.Physics.Arcade.Sprite | any

      // Create true static body or dynamic body
      if (isStatic) {
        // True static body (more efficient, cannot move)
        gameObject = ctx.scene.physics.add.staticSprite(x, y, sprite)
      } else {
        // Dynamic body (can move, affected by physics)
        gameObject = ctx.scene.physics.add.sprite(x, y, sprite)

        // Configure dynamic body properties
        if (gameObject.body) {
          gameObject.body.setAllowGravity(hasGravity)
          gameObject.setCollideWorldBounds(collideWorldBounds)
        }
      }

      gameObject.setName(entityId)

      // Store tag on the game object for collision detection
      if (tag) {
        (gameObject as any).tag = tag
      }

      ctx.entities.set(entityId, gameObject)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)

// Destroy Node
NodeRegistry.register({
  meta: {
    type: 'Destroy',
    label: 'Destroy',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId)

    if (entity) {
      entity.destroy()
      ctx.entities.delete(entityId)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// SetCameraFollow Node
NodeRegistry.register({
  meta: {
    type: 'SetCameraFollow',
    label: 'Set Camera Follow',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any

    if (entity) {
      ctx.scene.cameras.main.startFollow(entity)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)
