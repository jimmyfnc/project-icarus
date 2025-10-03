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
    const mode = node.data.properties.mode || 'press' // 'press' or 'hold'
    
    let keyState = false
    
    // Use the new input manager for proper "pressed this frame" detection
    if (mode === 'press') {
      keyState = ctx.scene.isKeyJustPressed(key)
    } else {
      keyState = ctx.scene.isKeyDown(key)
    }

    return keyState ? { exec: true, key } : {}
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
    const once = node.data.properties.once || false
    
    // Initialize runtime state
    if (!node.runtime) {
      node.runtime = { lastTick: 0, hasRun: false }
    }
    
    // If "once" is enabled and already ran, don't fire again
    if (once && node.runtime.hasRun) {
      return {}
    }

    const lastTick = node.runtime.lastTick || 0

    if (ctx.time - lastTick >= interval) {
      node.runtime.lastTick = ctx.time
      node.runtime.hasRun = true
      
      if (debugMode) {
        console.log(`⏱️ Every node fired! interval=${interval}ms, time=${ctx.time}, once=${once}`)
      }
      return { exec: true }
    }

    return {}
  }
} as NodeRegistryEntry)

// OnTouch Node (tap anywhere)
NodeRegistry.register({
  meta: {
    type: 'OnTouch',
    label: 'On Touch',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'x', name: 'x', type: 'number' },
    { id: 'y', name: 'y', type: 'number' }
  ],
  execute: (ctx, _inputs, node) => {
    const mode = node.data.properties.mode || 'press' // 'press' or 'hold'
    
    let touchState = false
    
    if (mode === 'press') {
      touchState = ctx.scene.isTouchJustPressed()
    } else {
      touchState = ctx.scene.isTouching()
    }
    
    if (touchState) {
      const pos = ctx.scene.getTouchPosition()
      return { exec: true, x: pos.x, y: pos.y }
    }
    
    return {}
  }
} as NodeRegistryEntry)

// OnTouchArea Node (virtual buttons/zones)
NodeRegistry.register({
  meta: {
    type: 'OnTouchArea',
    label: 'On Touch Area',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'x', name: 'x', type: 'number' },
    { id: 'y', name: 'y', type: 'number' }
  ],
  execute: (ctx, _inputs, node) => {
    const zone = node.data.properties.zone || 'center'
    const mode = node.data.properties.mode || 'press' // 'press' or 'hold'
    
    let touchState = false
    
    if (mode === 'press') {
      touchState = ctx.scene.isTouchZoneJustPressed(zone)
    } else {
      touchState = ctx.scene.isTouchingZone(zone)
    }
    
    if (touchState) {
      const pos = ctx.scene.getTouchPosition()
      return { exec: true, x: pos.x, y: pos.y }
    }
    
    return {}
  }
} as NodeRegistryEntry)

// OnSwipe Node (swipe gestures)
NodeRegistry.register({
  meta: {
    type: 'OnSwipe',
    label: 'On Swipe',
    category: 'event',
    color: '#ef4444'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'direction', name: 'direction', type: 'string' }
  ],
  execute: (ctx, _inputs, node) => {
    const targetDirection = node.data.properties.direction || 'any'
    
    if (!ctx.scene.isSwipeDetected()) {
      return {}
    }
    
    const detectedDirection = ctx.scene.getSwipeDirection()
    
    // If target is 'any', fire on any swipe
    if (targetDirection === 'any') {
      return { exec: true, direction: detectedDirection || '' }
    }
    
    // Otherwise, check if detected direction matches target
    if (detectedDirection === targetDirection) {
      return { exec: true, direction: detectedDirection }
    }
    
    return {}
  }
} as NodeRegistryEntry)
