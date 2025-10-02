import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'
import { debugMode } from '../GameScene'

// OnStart Node
NodeRegistry.register({
  meta: {
    type: 'OnStart',
    label: 'On Start',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (_ctx, _inputs, node) => {
    // Only execute once at game start
    if (node.runtime?.hasRun) {
      return {}
    }

    node.runtime = { hasRun: true }
    if (debugMode) {
      console.log('🎬 OnStart node fired!')
    }
    return { exec: true }
  }
} as NodeRegistryEntry)

// OnKey Node
NodeRegistry.register({
  meta: {
    type: 'OnKey',
    label: 'On Key',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'key', name: 'key', type: 'string' }
  ],
  execute: (ctx, _inputs, node) => {
    const key = node.data.properties.key || 'SPACE'
    const cursors = ctx.scene.input.keyboard?.createCursorKeys()

    if (!cursors) return {}

    let pressed = false
    switch (key) {
      case 'SPACE':
        pressed = ctx.scene.input.keyboard?.addKey('SPACE').isDown || false
        break
      case 'UP':
        pressed = cursors.up.isDown
        break
      case 'DOWN':
        pressed = cursors.down.isDown
        break
      case 'LEFT':
        pressed = cursors.left.isDown
        break
      case 'RIGHT':
        pressed = cursors.right.isDown
        break
    }

    return pressed ? { exec: true, key } : {}
  }
} as NodeRegistryEntry)

// Every Node (Timer)
NodeRegistry.register({
  meta: {
    type: 'Every',
    label: 'Every (ms)',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, node) => {
    const interval = node.data.properties.interval || 1000
    const lastTick = node.runtime?.lastTick || 0

    if (ctx.time - lastTick >= interval) {
      node.runtime = { lastTick: ctx.time }
      if (debugMode) {
        console.log(`⏱️ Every node fired! interval=${interval}ms, time=${ctx.time}`)
      }
      return { exec: true }
    }

    return {}
  }
} as NodeRegistryEntry)
