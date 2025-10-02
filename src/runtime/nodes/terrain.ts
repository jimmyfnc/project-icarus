import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// DestroyTerrainCircle Node - Remove circular area from terrain
NodeRegistry.register({
  meta: {
    type: 'DestroyTerrainCircle',
    label: 'Destroy Terrain (Circle)',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'x', name: 'x', type: 'number', default: 400 },
    { id: 'y', name: 'y', type: 'number', default: 300 },
    { id: 'radius', name: 'radius', type: 'number', default: 30 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const x = inputs.x ?? node.data.properties.x ?? 400
    const y = inputs.y ?? node.data.properties.y ?? 300
    const radius = inputs.radius ?? node.data.properties.radius ?? 30
    const terrainId = node.data.properties.terrainEntity || 'terrain'

    // Get terrain entity
    const terrain = ctx.entities.get(terrainId) as any

    if (!terrain) {
      console.warn('Terrain entity not found:', terrainId)
      return { exec: true }
    }

    // Use RenderTexture to create destructible terrain
    const scene = ctx.scene as any

    // Check if we've already converted this to a RenderTexture
    if (!terrain.isRenderTexture) {
      // Convert sprite to RenderTexture for pixel-level destruction
      const rt = scene.add.renderTexture(terrain.x - terrain.width / 2, terrain.y - terrain.height / 2, terrain.width, terrain.height)

      // Draw the original texture to the RenderTexture
      rt.draw(terrain.texture.key, 0, 0)
      rt.setOrigin(0, 0)

      // Mark it as static physics body
      scene.physics.add.existing(rt, true) // true = static

      // Transfer properties
      rt.setName(terrainId)
      rt.isRenderTexture = true

      // Replace in entities map
      terrain.destroy()
      ctx.entities.set(terrainId, rt)

      // Use the new RenderTexture for destruction
      destroyCircleFromTexture(rt, x - rt.x, y - rt.y, radius, scene)
    } else {
      // Already a RenderTexture, just destroy the circle
      destroyCircleFromTexture(terrain, x - terrain.x, y - terrain.y, radius, scene)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// Helper function to destroy a circular area from RenderTexture
function destroyCircleFromTexture(renderTexture: any, x: number, y: number, radius: number, scene: any) {
  // Create a temporary graphics object for the erase mask
  const graphics = scene.add.graphics()

  // Draw a circle
  graphics.fillStyle(0xffffff, 1)
  graphics.fillCircle(x, y, radius)

  // Erase the circle from the RenderTexture
  renderTexture.erase(graphics, x - radius, y - radius)

  // Clean up
  graphics.destroy()

  // Update physics body (this is simplified - in a full implementation
  // you'd need to recalculate the actual collision shape)
  if (renderTexture.body) {
    // For now, we keep the same physics body
    // A full implementation would use matter.js or custom collision detection
    console.log('Terrain destroyed at', x, y, 'radius', radius)
  }
}

// GetProjectileImpactPosition Node - Get position where projectile hit
NodeRegistry.register({
  meta: {
    type: 'GetProjectileImpactPosition',
    label: 'Get Impact Position',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'projectile', name: 'projectile', type: 'entity' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'x', name: 'x', type: 'number' },
    { id: 'y', name: 'y', type: 'number' }
  ],
  execute: (ctx, inputs, node) => {
    const projectileId = inputs.projectile || node.data.properties.projectile
    const projectile = ctx.entities.get(projectileId) as any

    if (projectile) {
      return { exec: true, x: projectile.x, y: projectile.y }
    }

    return { exec: true, x: 0, y: 0 }
  }
} as NodeRegistryEntry)
