import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// GetEntityPosition Node - Get x, y coordinates of an entity
NodeRegistry.register({
  meta: {
    type: 'GetEntityPosition',
    label: 'Get Entity Position',
    category: 'ai',
    color: '#ec4899'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'x', name: 'x', type: 'number' },
    { id: 'y', name: 'y', type: 'number' }
  ],
  execute: (ctx, inputs, node) => {
    const entityId = inputs.entity || node.data.properties.entity
    const entity = ctx.entities.get(entityId) as any

    if (entity) {
      return { exec: true, x: entity.x, y: entity.y }
    }

    return { exec: true, x: 0, y: 0 }
  }
} as NodeRegistryEntry)

// CalculateAngle Node - Calculate angle between two points
NodeRegistry.register({
  meta: {
    type: 'CalculateAngle',
    label: 'Calculate Angle',
    category: 'ai',
    color: '#ec4899'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'fromX', name: 'fromX', type: 'number', default: 0 },
    { id: 'fromY', name: 'fromY', type: 'number', default: 0 },
    { id: 'toX', name: 'toX', type: 'number', default: 0 },
    { id: 'toY', name: 'toY', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'angle', name: 'angle', type: 'number' },
    { id: 'distance', name: 'distance', type: 'number' }
  ],
  execute: (_ctx, inputs, node) => {
    const fromX = inputs.fromX ?? node.data.properties.fromX ?? 0
    const fromY = inputs.fromY ?? node.data.properties.fromY ?? 0
    const toX = inputs.toX ?? node.data.properties.toX ?? 0
    const toY = inputs.toY ?? node.data.properties.toY ?? 0

    const dx = toX - fromX
    const dy = toY - fromY

    // Calculate angle in degrees (0° = right, 90° = down)
    const angleRad = Math.atan2(dy, dx)
    const angleDeg = (angleRad * 180) / Math.PI

    // Calculate distance
    const distance = Math.sqrt(dx * dx + dy * dy)

    return { exec: true, angle: angleDeg, distance }
  }
} as NodeRegistryEntry)

// RandomRange Node - Generate random number in range
NodeRegistry.register({
  meta: {
    type: 'RandomRange',
    label: 'Random Range',
    category: 'ai',
    color: '#ec4899'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'min', name: 'min', type: 'number', default: 0 },
    { id: 'max', name: 'max', type: 'number', default: 100 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'number' }
  ],
  execute: (_ctx, inputs, node) => {
    const min = inputs.min ?? node.data.properties.min ?? 0
    const max = inputs.max ?? node.data.properties.max ?? 100

    const value = Math.floor(Math.random() * (max - min + 1)) + min

    return { exec: true, value }
  }
} as NodeRegistryEntry)

// AIAimAt Node - Calculate aim angle and power to hit target
NodeRegistry.register({
  meta: {
    type: 'AIAimAt',
    label: 'AI Aim At Target',
    category: 'ai',
    color: '#ec4899'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'fromEntity', name: 'fromEntity', type: 'entity' },
    { id: 'toEntity', name: 'toEntity', type: 'entity' },
    { id: 'accuracy', name: 'accuracy', type: 'number', default: 0.5 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'angle', name: 'angle', type: 'number' },
    { id: 'power', name: 'power', type: 'number' }
  ],
  execute: (ctx, inputs, node) => {
    const fromEntityId = inputs.fromEntity || node.data.properties.fromEntity
    const toEntityId = inputs.toEntity || node.data.properties.toEntity
    const accuracy = inputs.accuracy ?? node.data.properties.accuracy ?? 0.5

    const fromEntity = ctx.entities.get(fromEntityId) as any
    const toEntity = ctx.entities.get(toEntityId) as any

    if (!fromEntity || !toEntity) {
      return { exec: true, angle: 45, power: 300 }
    }

    const dx = toEntity.x - fromEntity.x
    const dy = toEntity.y - fromEntity.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Calculate angle
    const angleRad = Math.atan2(dy, dx)
    let angleDeg = (angleRad * 180) / Math.PI

    // Adjust angle for arc trajectory (add upward angle based on distance)
    const arcAdjustment = Math.min(distance / 20, 30) // Max 30° upward arc
    angleDeg -= arcAdjustment

    // Calculate power based on distance
    const power = Math.min(distance * 0.8, 500) // Scale power with distance, max 500

    // Add accuracy-based randomness
    // accuracy = 1.0 → perfect aim (±0°)
    // accuracy = 0.5 → medium (±10°)
    // accuracy = 0.0 → terrible (±20°)
    const maxError = 20 * (1 - accuracy) // Max error decreases with accuracy
    const randomOffset = (Math.random() - 0.5) * 2 * maxError
    angleDeg += randomOffset

    return { exec: true, angle: angleDeg, power }
  }
} as NodeRegistryEntry)

// CompareNumbers Node - Compare two numbers
NodeRegistry.register({
  meta: {
    type: 'CompareNumbers',
    label: 'Compare Numbers',
    category: 'logic',
    color: '#a855f7'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'a', name: 'a', type: 'number', default: 0 },
    { id: 'b', name: 'b', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'greater', name: '>', type: 'exec' },
    { id: 'less', name: '<', type: 'exec' },
    { id: 'equal', name: '=', type: 'exec' }
  ],
  execute: (_ctx, inputs, node) => {
    const a = inputs.a ?? node.data.properties.a ?? 0
    const b = inputs.b ?? node.data.properties.b ?? 0

    const result: any = { exec: true }

    if (a > b) {
      result.greater = true
    } else if (a < b) {
      result.less = true
    } else {
      result.equal = true
    }

    return result
  }
} as NodeRegistryEntry)
