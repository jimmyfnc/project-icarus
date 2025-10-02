/**
 * Generates procedural audio effects using Web Audio API
 * No external files needed - all sounds are generated in code
 */

import Phaser from 'phaser'

export class AudioGenerator {
  /**
   * Generate a jump/bounce sound effect
   */
  static generateJumpSound(scene: Phaser.Scene): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = 0.15

    // Create oscillator for the "boing" sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Jump sound: quick frequency sweep from high to low
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration)

    // Volume envelope: quick attack, quick decay
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.type = 'sine'
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)

    // Store as Phaser sound (mock)
    const mockSound = {
      play: () => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain)
        gain.connect(audioContext.destination)
        osc.frequency.setValueAtTime(800, audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration)
        gain.gain.setValueAtTime(0.3, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
        osc.type = 'sine'
        osc.start(audioContext.currentTime)
        osc.stop(audioContext.currentTime + duration)
      },
      stop: () => {},
      key: 'jump'
    }

    ;(scene.sound as any).sounds = (scene.sound as any).sounds || {}
    ;(scene.sound as any).sounds['jump'] = mockSound
  }

  /**
   * Generate a coin/pickup sound effect
   */
  static generateCoinSound(scene: Phaser.Scene): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = 0.1

    const mockSound = {
      play: () => {
        // Create two oscillators for a richer sound
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(audioContext.destination)

        // Coin sound: quick high frequency blip
        osc1.frequency.setValueAtTime(988, audioContext.currentTime) // B5
        osc2.frequency.setValueAtTime(1319, audioContext.currentTime) // E6

        gain.gain.setValueAtTime(0.2, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        osc1.type = 'square'
        osc2.type = 'square'

        osc1.start(audioContext.currentTime)
        osc2.start(audioContext.currentTime)
        osc1.stop(audioContext.currentTime + duration)
        osc2.stop(audioContext.currentTime + duration)
      },
      stop: () => {},
      key: 'coin'
    }

    ;(scene.sound as any).sounds = (scene.sound as any).sounds || {}
    ;(scene.sound as any).sounds['coin'] = mockSound
  }

  /**
   * Generate an explosion/hit sound effect
   */
  static generateExplosionSound(scene: Phaser.Scene): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = 0.3

    const mockSound = {
      play: () => {
        // Create noise buffer for explosion
        const bufferSize = audioContext.sampleRate * duration
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const data = buffer.getChannelData(0)

        // Fill with noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }

        const noise = audioContext.createBufferSource()
        const filter = audioContext.createBiquadFilter()
        const gain = audioContext.createGain()

        noise.buffer = buffer
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(audioContext.destination)

        // Low-pass filter for bass-heavy explosion
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1000, audioContext.currentTime)
        filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration)

        // Volume envelope
        gain.gain.setValueAtTime(0.4, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        noise.start(audioContext.currentTime)
        noise.stop(audioContext.currentTime + duration)
      },
      stop: () => {},
      key: 'explosion'
    }

    ;(scene.sound as any).sounds = (scene.sound as any).sounds || {}
    ;(scene.sound as any).sounds['explosion'] = mockSound
  }

  /**
   * Generate a simple background music loop
   */
  static generateBackgroundMusic(scene: Phaser.Scene): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    let currentOscillators: OscillatorNode[] = []

    const mockSound = {
      play: () => {
        // Simple C major arpeggio loop
        const notes = [261.63, 329.63, 392.00, 523.25] // C, E, G, C (octave up)
        const noteDuration = 0.3
        let time = audioContext.currentTime

        const playNote = (frequency: number, startTime: number) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()

          osc.connect(gain)
          gain.connect(audioContext.destination)

          osc.frequency.value = frequency
          osc.type = 'sine'

          // Smooth envelope
          gain.gain.setValueAtTime(0, startTime)
          gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05)
          gain.gain.linearRampToValueAtTime(0, startTime + noteDuration)

          osc.start(startTime)
          osc.stop(startTime + noteDuration)
          currentOscillators.push(osc)

          return osc
        }

        // Play arpeggio pattern
        notes.forEach((note, index) => {
          playNote(note, time + index * noteDuration)
        })
      },
      stop: () => {
        currentOscillators.forEach(osc => {
          try {
            osc.stop()
          } catch (e) {
            // Already stopped
          }
        })
        currentOscillators = []
      },
      key: 'bgm'
    }

    ;(scene.sound as any).sounds = (scene.sound as any).sounds || {}
    ;(scene.sound as any).sounds['bgm'] = mockSound
  }

  /**
   * Initialize all mock sounds for a scene
   */
  static initializeMockSounds(scene: Phaser.Scene): void {
    this.generateJumpSound(scene)
    this.generateCoinSound(scene)
    this.generateExplosionSound(scene)
    this.generateBackgroundMusic(scene)

    console.log('Mock audio sounds generated:', ['jump', 'coin', 'explosion', 'bgm'])
  }
}
