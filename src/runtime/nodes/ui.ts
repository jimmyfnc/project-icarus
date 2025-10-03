import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

// ShowText Node - Display text on screen
NodeRegistry.register({
  meta: {
    type: 'ShowText',
    label: 'Show Text',
    category: 'ui',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'text', name: 'text', type: 'string' },
    { id: 'x', name: 'x', type: 'number', default: 400 },
    { id: 'y', name: 'y', type: 'number', default: 50 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const text = inputs.text ?? node.data.properties.text ?? 'Text'
    const x = inputs.x ?? node.data.properties.x ?? 400
    const y = inputs.y ?? node.data.properties.y ?? 50
    const fontSize = node.data.properties.fontSize ?? 32
    const color = node.data.properties.color ?? '#ffffff'
    const fontFamily = node.data.properties.fontFamily ?? 'Arial'
    const textId = node.data.properties.textId || `text_${node.id}`

    // Check if text object already exists
    let textObject = ctx.entities.get(textId) as Phaser.GameObjects.Text | undefined

    if (!textObject) {
      // Create new text object
      textObject = ctx.scene.add.text(x, y, text, {
        fontSize: `${fontSize}px`,
        color: color,
        fontFamily: fontFamily
      })
      textObject.setName(textId)
      textObject.setScrollFactor(0) // Fix to camera (UI element)
      ctx.entities.set(textId, textObject)
    } else {
      // Update existing text object
      textObject.setText(text)
      textObject.setPosition(x, y)
      textObject.setStyle({
        fontSize: `${fontSize}px`,
        color: color,
        fontFamily: fontFamily
      })
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// ShowScore Node - Display and update score counter
NodeRegistry.register({
  meta: {
    type: 'ShowScore',
    label: 'Show Score',
    category: 'ui',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'score', name: 'score', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const score = inputs.score ?? node.data.properties.score ?? 0
    const x = node.data.properties.x ?? 50
    const y = node.data.properties.y ?? 30
    const fontSize = node.data.properties.fontSize ?? 24
    const color = node.data.properties.color ?? '#ffffff'
    const prefix = node.data.properties.prefix ?? 'Score: '
    const scoreId = node.data.properties.scoreId || `score_${node.id}`

    // Check if score text object already exists
    let scoreText = ctx.entities.get(scoreId) as Phaser.GameObjects.Text | undefined

    if (!scoreText) {
      // Create new score text object
      scoreText = ctx.scene.add.text(x, y, `${prefix}${score}`, {
        fontSize: `${fontSize}px`,
        color: color,
        fontFamily: 'Arial'
      })
      scoreText.setName(scoreId)
      scoreText.setScrollFactor(0) // Fix to camera (UI element)
      ctx.entities.set(scoreId, scoreText)
    } else {
      // Update existing score text
      scoreText.setText(`${prefix}${score}`)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)

// Button Node - Create clickable UI button
NodeRegistry.register({
  meta: {
    type: 'Button',
    label: 'Button',
    category: 'ui',
    color: '#10b981'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, _inputs, node) => {
    const x = node.data.properties.x ?? 400
    const y = node.data.properties.y ?? 300
    const width = node.data.properties.width ?? 120
    const height = node.data.properties.height ?? 40
    const text = node.data.properties.text ?? 'Button'
    const fontSize = node.data.properties.fontSize ?? 18
    const textColor = node.data.properties.textColor ?? '#ffffff'
    const bgColor = node.data.properties.bgColor ?? '#3b82f6'
    const buttonId = node.data.properties.buttonId || `button_${node.id}`

    // Check if button already exists
    let button = ctx.entities.get(buttonId) as any

    if (!button) {
      // Create button graphics (rectangle)
      const graphics = ctx.scene.add.graphics()
      const colorNum = parseInt(bgColor.replace('#', ''), 16)
      graphics.fillStyle(colorNum, 1)
      graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)
      graphics.setScrollFactor(0) // Fix to camera
      graphics.setName(`${buttonId}_bg`)

      // Create button text
      const buttonText = ctx.scene.add.text(x, y, text, {
        fontSize: `${fontSize}px`,
        color: textColor,
        fontFamily: 'Arial'
      })
      buttonText.setOrigin(0.5, 0.5)
      buttonText.setScrollFactor(0) // Fix to camera
      buttonText.setName(`${buttonId}_text`)

      // Create interactive zone for clicking
      const zone = ctx.scene.add.zone(x, y, width, height)
      zone.setInteractive()
      zone.setScrollFactor(0)
      zone.setName(buttonId)

      // Store click state in runtime
      if (!node.runtime) {
        node.runtime = { wasClicked: false, isClicked: false }
      }

      zone.on('pointerdown', () => {
        node.runtime.isClicked = true
      })

      // Store all button parts as a container reference
      const buttonContainer = { graphics, buttonText, zone }
      ctx.entities.set(buttonId, buttonContainer as any)

      button = buttonContainer
    }

    // Check if button was clicked this frame
    const clicked = node.runtime?.isClicked || false
    
    // Reset click state after processing
    if (node.runtime?.isClicked) {
      node.runtime.wasClicked = true
      node.runtime.isClicked = false
    }

    // Fire exec output if clicked
    return clicked ? { exec: true } : {}
  }
} as NodeRegistryEntry)

// HealthBar Node - Display health/progress bar
NodeRegistry.register({
  meta: {
    type: 'HealthBar',
    label: 'Health Bar',
    category: 'ui',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'number', default: 100 },
    { id: 'maxValue', name: 'maxValue', type: 'number', default: 100 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const value = Math.max(0, inputs.value ?? node.data.properties.value ?? 100)
    const maxValue = Math.max(1, inputs.maxValue ?? node.data.properties.maxValue ?? 100)
    const x = node.data.properties.x ?? 50
    const y = node.data.properties.y ?? 70
    const width = node.data.properties.width ?? 200
    const height = node.data.properties.height ?? 20
    const fillColor = node.data.properties.fillColor ?? '#22c55e'
    const bgColor = node.data.properties.bgColor ?? '#374151'
    const healthBarId = node.data.properties.healthBarId || `healthbar_${node.id}`

    // Calculate fill percentage
    const fillPercentage = Math.min(1, value / maxValue)
    const fillWidth = width * fillPercentage

    // Check if health bar already exists
    let healthBar = ctx.entities.get(healthBarId) as any

    if (!healthBar) {
      // Create background bar
      const bgGraphics = ctx.scene.add.graphics()
      const bgColorNum = parseInt(bgColor.replace('#', ''), 16)
      bgGraphics.fillStyle(bgColorNum, 1)
      bgGraphics.fillRect(x, y, width, height)
      bgGraphics.setScrollFactor(0) // Fix to camera
      bgGraphics.setName(`${healthBarId}_bg`)

      // Create fill bar
      const fillGraphics = ctx.scene.add.graphics()
      const fillColorNum = parseInt(fillColor.replace('#', ''), 16)
      fillGraphics.fillStyle(fillColorNum, 1)
      fillGraphics.fillRect(x, y, fillWidth, height)
      fillGraphics.setScrollFactor(0) // Fix to camera
      fillGraphics.setName(`${healthBarId}_fill`)

      // Store both graphics
      const healthBarContainer = { bgGraphics, fillGraphics, x, y, width, height, fillColor }
      ctx.entities.set(healthBarId, healthBarContainer as any)

      healthBar = healthBarContainer
    } else {
      // Update existing health bar fill
      const fillColorNum = parseInt(healthBar.fillColor?.replace('#', '') || fillColor.replace('#', ''), 16)
      healthBar.fillGraphics.clear()
      healthBar.fillGraphics.fillStyle(fillColorNum, 1)
      healthBar.fillGraphics.fillRect(healthBar.x, healthBar.y, fillWidth, healthBar.height)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)