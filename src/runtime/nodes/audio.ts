import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// PlaySound Node
NodeRegistry.register({
  meta: {
    type: 'PlaySound',
    label: 'Play Sound',
    category: 'audio',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, node) => {
    const soundKey = node.data.properties.soundKey || 'jump'
    const volume = node.data.properties.volume ?? 1.0
    const loop = node.data.properties.loop ?? false

    // Play sound using our mock sound system or Phaser's sound manager
    const mockSounds = (ctx.scene.sound as any).sounds
    if (mockSounds && mockSounds[soundKey]) {
      // Use our procedurally generated sound
      mockSounds[soundKey].play()
    } else if (ctx.scene.sound) {
      // Fall back to Phaser's sound system (for loaded audio files)
      try {
        ctx.scene.sound.play(soundKey, {
          volume,
          loop
        })
      } catch (e) {
        console.warn(`Sound "${soundKey}" not found`)
      }
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// StopSound Node
NodeRegistry.register({
  meta: {
    type: 'StopSound',
    label: 'Stop Sound',
    category: 'audio',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, node) => {
    const soundKey = node.data.properties.soundKey || 'jump'

    // Stop specific sound
    if (ctx.scene.sound) {
      ctx.scene.sound.stopByKey(soundKey)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// PlayMusic Node (for background music)
NodeRegistry.register({
  meta: {
    type: 'PlayMusic',
    label: 'Play Music',
    category: 'audio',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, node) => {
    const musicKey = node.data.properties.musicKey || 'bgm'
    const volume = node.data.properties.volume ?? 0.5
    const loop = node.data.properties.loop ?? true

    // Stop any currently playing music first
    if (ctx.scene.sound.get('current_music')) {
      ctx.scene.sound.get('current_music').stop()
    }

    // Play new music
    const music = ctx.scene.sound.add(musicKey, {
      volume,
      loop
    })

    music.play()

    // Store reference so we can stop it later
    ;(music as any).key = 'current_music'

    return { exec: true }
  }
} as NodeRegistryEntry)

// StopMusic Node
NodeRegistry.register({
  meta: {
    type: 'StopMusic',
    label: 'Stop Music',
    category: 'audio',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, _node) => {
    // Stop currently playing music
    if (ctx.scene.sound.get('current_music')) {
      ctx.scene.sound.get('current_music').stop()
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// SetVolume Node
NodeRegistry.register({
  meta: {
    type: 'SetVolume',
    label: 'Set Volume',
    category: 'audio',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'volume', name: 'volume', type: 'number' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const volume = inputs.volume ?? node.data.properties.volume ?? 1.0

    // Set master volume
    if (ctx.scene.sound) {
      ctx.scene.sound.volume = Math.max(0, Math.min(1, volume))
    }

    return { exec: true }
  }
} as NodeRegistryEntry)
