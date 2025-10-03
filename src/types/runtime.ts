import type Phaser from 'phaser'
import type { GameScene } from '@/runtime/GameScene'

// Runtime Context
export interface RuntimeContext {
  scene: GameScene
  entities: Map<string, Phaser.GameObjects.GameObject>
  variables: Map<string, any>
  deltaTime: number
  time: number
}

// Node Executor
export type NodeExecutor = (
  ctx: RuntimeContext,
  inputs: Record<string, any>,
  node: any
) => Record<string, any> | void

// Node Registry Entry
export interface NodeRegistryEntry {
  meta: {
    type: string
    label: string
    category: string
    color: string
  }
  inputs: Array<{
    id: string
    name: string
    type: string
    default?: any
  }>
  outputs: Array<{
    id: string
    name: string
    type: string
  }>
  execute: NodeExecutor
}

// Event Types
export interface GameEvent {
  type: 'start' | 'keydown' | 'keyup' | 'collision' | 'timer'
  data?: any
}

// Entity State
export interface EntityState {
  id: string
  sprite: string
  x: number
  y: number
  velocityX?: number
  velocityY?: number
  collider?: string
  [key: string]: any
}
