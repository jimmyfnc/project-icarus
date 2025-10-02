import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// If Node
NodeRegistry.register({
  meta: {
    type: 'If',
    label: 'If',
    category: 'logic',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'condition', name: 'condition', type: 'boolean' }
  ],
  outputs: [
    { id: 'true', name: 'true', type: 'exec' },
    { id: 'false', name: 'false', type: 'exec' }
  ],
  execute: (_ctx, inputs, node) => {
    const condition = inputs.condition ?? node.data.properties.condition ?? false

    if (condition) {
      return { true: true }
    } else {
      return { false: true }
    }
  }
} as NodeRegistryEntry)

// SetVar Node
NodeRegistry.register({
  meta: {
    type: 'SetVar',
    label: 'Set Variable',
    category: 'logic',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'any' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const varName = node.data.properties.varName || 'variable'
    const value = inputs.value ?? node.data.properties.value ?? 0

    ctx.variables.set(varName, value)

    return { exec: true }
  }
} as NodeRegistryEntry)

// AddVar Node
NodeRegistry.register({
  meta: {
    type: 'AddVar',
    label: 'Add to Variable',
    category: 'logic',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'number', default: 1 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'result', name: 'result', type: 'number' }
  ],
  execute: (ctx, inputs, node) => {
    const varName = node.data.properties.varName || 'variable'
    const value = inputs.value ?? node.data.properties.value ?? 1
    const currentValue = ctx.variables.get(varName) || 0
    const newValue = currentValue + value

    ctx.variables.set(varName, newValue)

    return { exec: true, result: newValue }
  }
} as NodeRegistryEntry)

// Compare Node
NodeRegistry.register({
  meta: {
    type: 'Compare',
    label: 'Compare',
    category: 'logic',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'a', name: 'a', type: 'any' },
    { id: 'b', name: 'b', type: 'any' }
  ],
  outputs: [
    { id: 'result', name: 'result', type: 'boolean' },
    { id: 'equal', name: '==', type: 'boolean' },
    { id: 'greater', name: '>', type: 'boolean' },
    { id: 'less', name: '<', type: 'boolean' }
  ],
  execute: (_ctx, inputs, node) => {
    const a = inputs.a ?? node.data.properties.a ?? 0
    const b = inputs.b ?? node.data.properties.b ?? 0
    const operator = node.data.properties.operator || '=='

    let result = false
    switch (operator) {
      case '==':
        result = a == b
        break
      case '>':
        result = a > b
        break
      case '<':
        result = a < b
        break
      case '>=':
        result = a >= b
        break
      case '<=':
        result = a <= b
        break
      case '!=':
        result = a != b
        break
    }

    return {
      result,
      equal: a == b,
      greater: a > b,
      less: a < b
    }
  }
} as NodeRegistryEntry)
