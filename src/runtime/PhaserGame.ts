import Phaser from 'phaser'
import { GameScene } from './GameScene'
import type { GameGraph } from '@/types/graph'

export class PhaserGame {
  private game?: Phaser.Game
  private scene?: GameScene
  private currentGraph?: GameGraph
  private sceneReady = false

  constructor(parent: string | HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scene: GameScene,
      backgroundColor: '#87ceeb'
    }

    this.game = new Phaser.Game(config)

    // Wait for scene to be ready using Phaser lifecycle events
    this.game.events.once('ready', () => {
      this.scene = this.game!.scene.scenes[0] as GameScene
      this.sceneReady = true
      console.log('PhaserGame: Scene acquired and ready')

      // Apply graph if it was queued
      if (this.currentGraph && this.scene) {
        console.log('Applying queued graph with', this.currentGraph.nodes.length, 'nodes')
        this.scene.setGraph(this.currentGraph)
      }
    })

    console.log('PhaserGame constructed')
  }

  loadGraph(graph: GameGraph) {
    console.log('PhaserGame.loadGraph called with', graph.nodes.length, 'nodes')
    this.currentGraph = graph

    if (!this.scene) {
      console.error('No scene available!')
      return
    }

    if (this.sceneReady) {
      console.log('Scene already ready, setting graph immediately')
      this.scene.setGraph(graph)
    } else {
      console.log('Scene not ready yet, graph will be applied on create')
    }
  }

  play() {
    if (this.scene && this.sceneReady) {
      this.scene.play()
    } else {
      console.warn('Cannot play, scene not ready yet')
    }
  }

  stop() {
    if (this.scene && this.sceneReady) {
      this.scene.stop()
    } else {
      console.warn('Cannot stop, scene not ready yet')
    }
  }

  reset() {
    if (this.scene && this.sceneReady) {
      this.scene.reset()
      // No need to reload graph - scene.reset() no longer restarts the scene
    } else {
      console.warn('Cannot reset, scene not ready yet')
    }
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true)
    }
    this.scene = undefined
    this.sceneReady = false
  }
}
