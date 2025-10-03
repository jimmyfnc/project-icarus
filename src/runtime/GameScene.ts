import Phaser from 'phaser'
import type { GameGraph } from '@/types/graph'
import type { RuntimeContext } from '@/types/runtime'
import { GraphExecutor } from './GraphExecutor'
import { AudioGenerator } from './AudioGenerator'
import '@/runtime/nodes' // Register all nodes

// Global debug flag that can be set from the editor
export let debugMode = false
export function setDebugMode(enabled: boolean) {
  debugMode = enabled
}

export class GameScene extends Phaser.Scene {
  private graph?: GameGraph
  private executor?: GraphExecutor
  private context?: RuntimeContext
  private isPlaying = false
  private colliders: Phaser.Physics.Arcade.Collider[] = []
  private collisionHandlers: Map<string, Set<string>> = new Map()
  
  // Input manager for tracking key states
  private previousKeyStates: Map<string, boolean> = new Map()
  private currentKeyStates: Map<string, boolean> = new Map()
  
  // Touch input manager
  private isTouchActive = false
  private touchStartPos = { x: 0, y: 0 }
  private touchCurrentPos = { x: 0, y: 0 }
  private previousTouchStates: Map<string, boolean> = new Map()
  private currentTouchStates: Map<string, boolean> = new Map()
  private swipeDetected = false
  private swipeDirection: string | null = null

  constructor() {
    super({ key: 'GameScene' })
  }
  
  // Check if key was pressed this frame (not held)
  isKeyJustPressed(key: string): boolean {
    const current = this.currentKeyStates.get(key) || false
    const previous = this.previousKeyStates.get(key) || false
    return current && !previous
  }
  
  // Check if key is currently held down
  isKeyDown(key: string): boolean {
    return this.currentKeyStates.get(key) || false
  }
  
  // Check if screen is currently being touched
  isTouching(): boolean {
    return this.isTouchActive
  }
  
  // Check if touch just started this frame
  isTouchJustPressed(): boolean {
    const current = this.isTouchActive
    const previous = this.previousTouchStates.get('active') || false
    return current && !previous
  }
  
  // Get current touch position
  getTouchPosition(): { x: number; y: number } {
    return { ...this.touchCurrentPos }
  }
  
  // Check if touch is in a specific zone
  isTouchingZone(zone: string): boolean {
    if (!this.isTouchActive) return false
    
    const x = this.touchCurrentPos.x
    const y = this.touchCurrentPos.y
    const width = 800 // Game width
    const height = 600 // Game height
    
    const leftThird = width / 3
    const rightThird = (width * 2) / 3
    const topThird = height / 3
    const bottomThird = (height * 2) / 3
    
    switch (zone) {
      case 'left':
        return x < leftThird
      case 'right':
        return x > rightThird
      case 'top':
        return y < topThird
      case 'bottom':
        return y > bottomThird
      case 'center':
        return x >= leftThird && x <= rightThird && y >= topThird && y <= bottomThird
      case 'topleft':
        return x < leftThird && y < topThird
      case 'topright':
        return x > rightThird && y < topThird
      case 'bottomleft':
        return x < leftThird && y > bottomThird
      case 'bottomright':
        return x > rightThird && y > bottomThird
      default:
        return false
    }
  }
  
  // Check if touch zone was just pressed this frame
  isTouchZoneJustPressed(zone: string): boolean {
    const current = this.isTouchingZone(zone)
    const previous = this.currentTouchStates.get(zone) || false
    return current && !previous
  }
  
  // Get detected swipe direction
  getSwipeDirection(): string | null {
    return this.swipeDirection
  }
  
  // Check if swipe was detected this frame
  isSwipeDetected(): boolean {
    return this.swipeDetected
  }

  setGraph(graph: GameGraph) {
    console.log('GameScene.setGraph called, graph has', graph.nodes.length, 'nodes')
    this.graph = graph
    this.executor = new GraphExecutor(graph)

    // Always initialize context when graph is set
    // This handles the case where create() ran before setGraph()
    this.initializeContext()
    console.log('Context initialized after setGraph')
  }

  preload() {
    // Create placeholder sprites
    this.createPlaceholderSprites()

    // Preload any custom asset sprites from the graph
    if (this.graph) {
      this.preloadCustomAssets()
    }
  }

  private preloadCustomAssets() {
    if (!this.graph) return

    // Find all Spawn nodes with custom assets
    const spawnNodes = this.graph.nodes.filter(n => n.type === 'Spawn')

    spawnNodes.forEach(node => {
      const sprite = node.data.properties.sprite
      if (sprite && sprite.startsWith('asset:')) {
        const assetId = sprite.replace('asset:', '')
        // Load the asset from Appwrite
        const assetUrl = this.getAssetUrl(assetId)
        this.load.image(sprite, assetUrl)
      }
    })
  }

  private getAssetUrl(assetId: string): string {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
    const bucketId = import.meta.env.VITE_APPWRITE_ASSETS_BUCKET_ID || 'assets'
    return `${endpoint}/storage/buckets/${bucketId}/files/${assetId}/view?project=${projectId}`
  }

  create() {
    console.log('GameScene.create called, graph exists:', !!this.graph)

    // Set up physics world
    this.physics.world.setBounds(0, 0, 800, 600)

    // Generate mock audio sounds
    AudioGenerator.initializeMockSounds(this)

    // Set up touch/pointer input listeners
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isTouchActive = true
      this.touchStartPos = { x: pointer.x, y: pointer.y }
      this.touchCurrentPos = { x: pointer.x, y: pointer.y }
      this.swipeDetected = false
      this.swipeDirection = null
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouchActive) {
        this.touchCurrentPos = { x: pointer.x, y: pointer.y }
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouchActive) {
        // Detect swipe
        const dx = pointer.x - this.touchStartPos.x
        const dy = pointer.y - this.touchStartPos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 50) { // Minimum swipe distance
          this.swipeDetected = true
          
          // Determine primary swipe direction
          if (Math.abs(dx) > Math.abs(dy)) {
            this.swipeDirection = dx > 0 ? 'right' : 'left'
          } else {
            this.swipeDirection = dy > 0 ? 'down' : 'up'
          }
        }
      }
      
      this.isTouchActive = false
    })

    // Initialize context only if we have a graph
    if (this.graph && this.executor) {
      this.initializeContext()
    } else {
      console.warn('No graph loaded in create(), waiting for setGraph()')
    }
  }

  private initializeContext() {
    console.log('Initializing runtime context, exists:', !!this.context)

    // Always create fresh context
    this.context = {
      scene: this,
      entities: new Map(),
      variables: new Map(),
      deltaTime: 0,
      time: 0
    }

    this.isPlaying = false
  }

  update(time: number, delta: number) {
    if (!this.isPlaying || !this.executor || !this.context) return

    // Update input manager - copy current to previous before updating current
    this.previousKeyStates.clear()
    this.currentKeyStates.forEach((value, key) => {
      this.previousKeyStates.set(key, value)
    })
    
    // Update current key states
    const cursors = this.input.keyboard?.createCursorKeys()
    if (cursors) {
      this.currentKeyStates.set('UP', cursors.up.isDown)
      this.currentKeyStates.set('DOWN', cursors.down.isDown)
      this.currentKeyStates.set('LEFT', cursors.left.isDown)
      this.currentKeyStates.set('RIGHT', cursors.right.isDown)
    }
    
    const spaceKey = this.input.keyboard?.addKey('SPACE')
    if (spaceKey) {
      this.currentKeyStates.set('SPACE', spaceKey.isDown)
    }

    // Update touch states - copy current to previous
    this.previousTouchStates.clear()
    this.previousTouchStates.set('active', this.isTouchActive)
    this.currentTouchStates.forEach((value, key) => {
      this.previousTouchStates.set(key, value)
    })
    
    // Update current touch zone states
    this.currentTouchStates.clear()
    if (this.isTouchActive) {
      const zones = ['left', 'right', 'top', 'bottom', 'center', 'topleft', 'topright', 'bottomleft', 'bottomright']
      zones.forEach(zone => {
        this.currentTouchStates.set(zone, this.isTouchingZone(zone))
      })
    }
    
    // Clear swipe after one frame
    if (this.swipeDetected) {
      this.swipeDetected = false
      this.swipeDirection = null
    }

    // Update context
    this.context.deltaTime = delta
    this.context.time = time

    // Execute graph
    this.executor.execute(this.context)

    // Set up collisions after first frame (entities are spawned)
    if (time > 100 && this.colliders.length === 0) {
      this.setupCollisions()
    }
  }

  private setupCollisions() {
    if (!this.graph || !this.context) return

    console.log('Setting up collisions...')

    // Find all OnCollide nodes (entity-to-entity)
    const collideNodes = this.graph.nodes.filter(n => n.type === 'OnCollide')

    collideNodes.forEach(node => {
      const entityAId = node.data.properties.entityA
      const entityBId = node.data.properties.entityB

      if (!entityAId || !entityBId) {
        console.warn('OnCollide node missing entity IDs:', node.id)
        return
      }

      // Try to get entities (they might not be spawned yet)
      const entityA = this.context!.entities.get(entityAId)
      const entityB = this.context!.entities.get(entityBId)

      if (!entityA || !entityB) {
        console.log(`Entities not ready for collision: ${entityAId}, ${entityBId}`)
        return
      }

      console.log(`Creating collider between ${entityAId} and ${entityBId}`)

      // Create Phaser collider
      const collider = this.physics.add.collider(
        entityA as any,
        entityB as any,
        () => {
          // Mark collision in the node's runtime data
          if (!node.runtime) {
            node.runtime = {}
          }
          node.runtime.collided = true
          node.runtime.entityA = entityAId
          node.runtime.entityB = entityBId

          if (debugMode) {
            console.log(`Collision detected: ${entityAId} <-> ${entityBId}`)
          }
        }
      )

      this.colliders.push(collider)
    })

    // Find all OnCollideWithTag nodes (entity-to-tag)
    const tagCollideNodes = this.graph.nodes.filter(n => n.type === 'OnCollideWithTag')

    tagCollideNodes.forEach(node => {
      const entityId = node.data.properties.entity
      const tag = node.data.properties.tag

      if (!entityId || !tag) {
        console.warn('OnCollideWithTag node missing entity or tag:', node.id)
        return
      }

      const entity = this.context!.entities.get(entityId)

      if (!entity) {
        console.log(`Entity not ready for tag collision: ${entityId}`)
        return
      }

      // Find all entities with the specified tag
      const taggedEntities: any[] = []
      this.context!.entities.forEach((obj) => {
        if ((obj as any).tag === tag) {
          taggedEntities.push(obj)
        }
      })

      if (taggedEntities.length === 0) {
        console.log(`No entities found with tag: ${tag}`)
        return
      }

      console.log(`Creating tag collider: ${entityId} vs tag "${tag}" (${taggedEntities.length} entities)`)

      // Create collider for each tagged entity
      taggedEntities.forEach(taggedEntity => {
        const collider = this.physics.add.collider(
          entity as any,
          taggedEntity,
          () => {
            // Mark collision in the node's runtime data
            if (!node.runtime) {
              node.runtime = {}
            }
            node.runtime.collided = true
            node.runtime.entity = entityId
            node.runtime.collidedWith = taggedEntity.name

            if (debugMode) {
              console.log(`Tag collision: ${entityId} <-> ${taggedEntity.name} (tag: ${tag})`)
            }
          }
        )

        this.colliders.push(collider)
      })
    })

    console.log(`Set up ${this.colliders.length} colliders`)
  }

  play() {
    this.isPlaying = true
  }

  stop() {
    this.isPlaying = false

    // Pause all physics bodies to freeze movement
    if (this.context) {
      this.context.entities.forEach((entity) => {
        const body = (entity as any).body as Phaser.Physics.Arcade.Body | undefined
        if (body && typeof body.setVelocity === 'function') {
          body.setVelocity(0, 0)
        }
      })
    }
  }

  reset() {
    console.log('GameScene.reset called, graph exists:', !!this.graph)

    if (this.executor) {
      this.executor.reset()
    }
    if (this.context) {
      this.context.entities.forEach((entity) => entity.destroy())
      this.context.entities.clear()
      this.context.variables.clear()
    }

    // Clear all colliders
    this.colliders.forEach(collider => collider.destroy())
    this.colliders = []
    this.collisionHandlers.clear()

    // Reinitialize the context
    this.context = {
      scene: this,
      entities: new Map(),
      variables: new Map(),
      deltaTime: 0,
      time: 0
    }

    this.isPlaying = false
  }

  private createPlaceholderSprites() {
    // Create placeholder graphics for common sprites
    const graphics = this.add.graphics()

    // Player sprite (blue square)
    graphics.fillStyle(0x3b82f6, 1)
    graphics.fillRect(0, 0, 32, 32)
    graphics.generateTexture('player', 32, 32)

    // Enemy sprite (red square)
    graphics.clear()
    graphics.fillStyle(0xef4444, 1)
    graphics.fillRect(0, 0, 32, 32)
    graphics.generateTexture('enemy', 32, 32)

    // Bird sprite (yellow circle)
    graphics.clear()
    graphics.fillStyle(0xfbbf24, 1)
    graphics.fillCircle(16, 16, 16)
    graphics.generateTexture('bird', 32, 32)

    // Pipe sprite (green rectangle)
    graphics.clear()
    graphics.fillStyle(0x10b981, 1)
    graphics.fillRect(0, 0, 64, 400)
    graphics.generateTexture('pipe', 64, 400)

    // Ground sprite (brown rectangle)
    graphics.clear()
    graphics.fillStyle(0x92400e, 1)
    graphics.fillRect(0, 0, 800, 64)
    graphics.generateTexture('ground', 800, 64)

    // Platform sprite (gray rectangle)
    graphics.clear()
    graphics.fillStyle(0x6b7280, 1)
    graphics.fillRect(0, 0, 128, 32)
    graphics.generateTexture('platform', 128, 32)

    // Ship sprite (white triangle)
    graphics.clear()
    graphics.fillStyle(0xf8fafc, 1)
    graphics.fillTriangle(16, 0, 0, 32, 32, 32)
    graphics.generateTexture('ship', 32, 32)

    // Bullet sprite (yellow small rectangle)
    graphics.clear()
    graphics.fillStyle(0xfde047, 1)
    graphics.fillRect(0, 0, 4, 12)
    graphics.generateTexture('bullet', 4, 12)

    // Paddle sprite (cyan rectangle)
    graphics.clear()
    graphics.fillStyle(0x06b6d4, 1)
    graphics.fillRect(0, 0, 100, 16)
    graphics.generateTexture('paddle', 100, 16)

    // Ball sprite (white circle)
    graphics.clear()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(8, 8, 8)
    graphics.generateTexture('ball', 16, 16)

    // Brick sprite (orange rectangle)
    graphics.clear()
    graphics.fillStyle(0xf97316, 1)
    graphics.fillRect(0, 0, 60, 20)
    graphics.generateTexture('brick', 60, 20)

    // Tank sprite (green tank shape)
    graphics.clear()
    graphics.fillStyle(0x22c55e, 1)
    // Tank body
    graphics.fillRect(2, 10, 28, 12)
    // Tank turret
    graphics.fillRect(10, 4, 12, 8)
    // Tank barrel
    graphics.fillRect(22, 6, 8, 4)
    graphics.generateTexture('tank', 32, 24)

    // Cannonball sprite (black circle)
    graphics.clear()
    graphics.fillStyle(0x1f2937, 1)
    graphics.fillCircle(6, 6, 6)
    graphics.generateTexture('cannonball', 12, 12)

    // Terrain sprite (brown platform for destructible ground)
    graphics.clear()
    graphics.fillStyle(0x78350f, 1)
    graphics.fillRect(0, 0, 800, 200)
    graphics.generateTexture('terrain', 800, 200)

    graphics.destroy()
  }
}
