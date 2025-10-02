import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'
import { debugMode } from '../GameScene'

// ApplyGravity Node
NodeRegistry.register({
  meta: {
    type: 'ApplyGravity',
    label: 'Apply Gravity',
    category: 'movement',
    color: '#3b82f6'
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
    const gravity = node.data.properties.gravity || 800

    if (entity && entity.body) {
      entity.body.setGravityY(gravity)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// Impulse Node
NodeRegistry.register({
  meta: {
    type: 'Impulse',
    label: 'Impulse',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'dx', name: 'dx', type: 'number', default: 0 },
    { id: 'dy', name: 'dy', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any
    const dx = inputs.dx ?? node.data.properties.dx ?? 0
    const dy = inputs.dy ?? node.data.properties.dy ?? 0

    if (entity && entity.body) {
      entity.body.setVelocity(dx, dy)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// Move Node
NodeRegistry.register({
  meta: {
    type: 'Move',
    label: 'Move',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'dx', name: 'dx', type: 'number', default: 0 },
    { id: 'dy', name: 'dy', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any
    const dx = inputs.dx ?? node.data.properties.dx ?? 0
    const dy = inputs.dy ?? node.data.properties.dy ?? 0

    if (debugMode) {
      console.log(`🏃 Move node: entityId="${entityId}", dx=${dx}, dy=${dy}, entity=${!!entity}`)
    }

    if (entity && entity.body) {
      entity.body.setVelocityX(dx)
      entity.body.setVelocityY(dy)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)

// SetAngle Node - Set rotation/angle of an entity
NodeRegistry.register({
  meta: {
    type: 'SetAngle',
    label: 'Set Angle',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'angle', name: 'angle', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any
    const angle = inputs.angle ?? node.data.properties.angle ?? 0

    if (entity) {
      // Convert degrees to radians for Phaser
      entity.setAngle(angle)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)

// ShootProjectile Node - Spawn projectile with angle and power
NodeRegistry.register({
  meta: {
    type: 'ShootProjectile',
    label: 'Shoot Projectile',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'fromEntity', name: 'fromEntity', type: 'entity' },
    { id: 'angle', name: 'angle', type: 'number', default: 45 },
    { id: 'power', name: 'power', type: 'number', default: 300 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'projectile', name: 'projectile', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const fromEntityId = inputs.fromEntity || node.data.properties.fromEntity
    const fromEntity = ctx.entities.get(fromEntityId) as any
    const angle = inputs.angle ?? node.data.properties.angle ?? 45
    const power = inputs.power ?? node.data.properties.power ?? 300
    const sprite = node.data.properties.sprite || 'cannonball'
    const tag = node.data.properties.tag || 'projectile'

    if (!fromEntity) {
      return { exec: true }
    }

    // Generate unique ID for projectile
    const projectileId = `projectile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Calculate velocity from angle and power
    const angleRad = (angle * Math.PI) / 180
    const vx = Math.cos(angleRad) * power
    const vy = Math.sin(angleRad) * power

    // Spawn projectile at entity position
    const projectile = ctx.scene.physics.add.sprite(fromEntity.x, fromEntity.y, sprite)
    projectile.setName(projectileId)

    if (tag) {
      (projectile as any).tag = tag
    }

    // Apply velocity
    if (projectile.body) {
      projectile.body.setVelocity(vx, vy)
      projectile.body.setGravityY(node.data.properties.gravity || 400)
      projectile.body.setAllowGravity(true)
    }

    ctx.entities.set(projectileId, projectile)

    return { exec: true, projectile: projectileId }
  }
} as NodeRegistryEntry)

// GetVariable Node - Read a variable value and output it
NodeRegistry.register({
  meta: {
    type: 'GetVariable',
    label: 'Get Variable',
    category: 'logic',
    color: '#a855f7'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'number' }
  ],
  execute: (ctx, _inputs, node) => {
    const variableName = node.data.properties.variable
    const value = ctx.variables.get(variableName) || 0

    return { exec: true, value }
  }
} as NodeRegistryEntry)

// ApplyForce Node - Apply continuous force (wind effect)
NodeRegistry.register({
  meta: {
    type: 'ApplyForce',
    label: 'Apply Force',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'fx', name: 'fx', type: 'number', default: 0 },
    { id: 'fy', name: 'fy', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any
    const fx = inputs.fx ?? node.data.properties.fx ?? 0
    const fy = inputs.fy ?? node.data.properties.fy ?? 0

    if (entity && entity.body) {
      // Apply acceleration (force) to the body
      const body = entity.body as Phaser.Physics.Arcade.Body
      body.setAccelerationX(fx)
      body.setAccelerationY(fy)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)

// SetGravityScale Node - Adjust gravity scale per entity
NodeRegistry.register({
  meta: {
    type: 'SetGravityScale',
    label: 'Set Gravity Scale',
    category: 'movement',
    color: '#3b82f6'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' },
    { id: 'scale', name: 'scale', type: 'number', default: 1 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any
    const scale = inputs.scale ?? node.data.properties.scale ?? 1

    if (entity && entity.body) {
      const body = entity.body as Phaser.Physics.Arcade.Body
      body.setGravityY(body.gravity.y * scale)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)
