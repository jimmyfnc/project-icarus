import type { GameProject } from '@/types/graph'
import flappyBirdTemplate from '@/templates/flappy-bird.json'
import platformerTemplate from '@/templates/platformer.json'
import spaceShooterTemplate from '@/templates/space-shooter.json'
import breakoutTemplate from '@/templates/breakout.json'
import tankWarsTemplate from '@/templates/tank-wars.json'

export const templates: Record<string, GameProject> = {
  'flappy-bird': flappyBirdTemplate as GameProject,
  'platformer': platformerTemplate as GameProject,
  'space-shooter': spaceShooterTemplate as GameProject,
  'breakout': breakoutTemplate as GameProject,
  'tank-wars': tankWarsTemplate as GameProject
}

export function getTemplate(id: string): GameProject | null {
  return templates[id] || null
}

export function createSimpleExample(): GameProject {
  return {
    name: 'Simple Movement Example',
    slug: 'simple-movement',
    description: 'A basic example showing player movement with arrow keys',
    graph: {
      nodes: [
        {
          id: 'start',
          type: 'OnStart',
          position: { x: 50, y: 100 },
          data: {
            label: 'On Start',
            properties: {}
          }
        },
        {
          id: 'spawn_player',
          type: 'Spawn',
          position: { x: 250, y: 100 },
          data: {
            label: 'Spawn Player',
            properties: {
              sprite: 'player',
              x: 400,
              y: 300,
              entityId: 'player'
            }
          }
        },
        {
          id: 'on_right',
          type: 'OnKey',
          position: { x: 50, y: 250 },
          data: {
            label: 'On Right Key',
            properties: {
              key: 'RIGHT'
            }
          }
        },
        {
          id: 'move_right',
          type: 'Move',
          position: { x: 250, y: 250 },
          data: {
            label: 'Move Right',
            properties: {
              entity: 'player',
              dx: 200,
              dy: 0
            }
          }
        },
        {
          id: 'on_left',
          type: 'OnKey',
          position: { x: 50, y: 400 },
          data: {
            label: 'On Left Key',
            properties: {
              key: 'LEFT'
            }
          }
        },
        {
          id: 'move_left',
          type: 'Move',
          position: { x: 250, y: 400 },
          data: {
            label: 'Move Left',
            properties: {
              entity: 'player',
              dx: -200,
              dy: 0
            }
          }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: 'start',
          sourceHandle: 'exec',
          target: 'spawn_player',
          targetHandle: 'exec'
        },
        {
          id: 'e2',
          source: 'on_right',
          sourceHandle: 'exec',
          target: 'move_right',
          targetHandle: 'exec'
        },
        {
          id: 'e3',
          source: 'on_left',
          sourceHandle: 'exec',
          target: 'move_left',
          targetHandle: 'exec'
        }
      ]
    }
  }
}
