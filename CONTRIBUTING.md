# Contributing Guide

Thank you for your interest in contributing to the Visual Scripting Game Editor!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/project-icarus.git`
3. Install dependencies: `npm install`
4. Create a `.env` file (see `.env.example`)
5. Run dev server: `npm run dev`

## Project Structure

```
src/
├── appwrite/          # Backend services
├── components/        # Vue UI components
├── runtime/           # Game engine & execution
│   └── nodes/         # Node type definitions
├── stores/            # State management
├── templates/         # Starter game templates
├── types/             # TypeScript definitions
├── utils/             # Helper functions
└── views/             # Page components
```

## Adding a New Node Type

To add a new node type (e.g., "PlaySound"):

### 1. Create Node Definition

Create or edit a file in `src/runtime/nodes/`:

```typescript
// src/runtime/nodes/audio.ts
import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

NodeRegistry.register({
  meta: {
    type: 'PlaySound',
    label: 'Play Sound',
    category: 'audio',  // New category
    color: '#a855f7'    // Purple for audio
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'sound', name: 'sound', type: 'string' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const soundKey = inputs.sound || node.data.properties.sound || 'default'

    // Play sound using Phaser
    ctx.scene.sound.play(soundKey)

    return { exec: true }
  }
} as NodeRegistryEntry)
```

### 2. Import in Index

Add to `src/runtime/nodes/index.ts`:

```typescript
import './audio'
```

### 3. Add to Node Palette

The node will automatically appear in the sidebar under its category!

### 4. Add Properties UI (Optional)

If your node has custom properties, add a section in `src/components/PropertiesPanel.vue`:

```vue
<div v-else-if="selectedNode.type === 'PlaySound'" class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Sound ID
  </label>
  <input
    v-model="properties.sound"
    @change="updateProperties"
    type="text"
    placeholder="e.g. jump, coin"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />
</div>
```

### 5. Test Your Node

1. Run `npm run dev`
2. Create a new project
3. Find your node in the palette under the category
4. Add it to the canvas
5. Connect it to an event node
6. Set properties
7. Click Play and test!

## Node Categories

Current categories and their colors:

- `event` - Red (#ef4444) - Things that trigger actions
- `movement` - Blue (#3b82f6) - Physics and motion
- `world` - Green (#10b981) - Spawning and managing objects
- `logic` - Orange (#f59e0b) - Decisions and variables
- `collision` - Purple (#8b5cf6) - Collision detection
- `scene` - Pink (#ec4899) - Game-level controls

To add a new category, just use it in your node's `meta.category` field.

## Port Types

Available port types:

- `exec` - Execution flow (white)
- `number` - Numeric values (blue)
- `string` - Text values (green)
- `boolean` - True/false (orange)
- `entity` - Entity references (purple)
- `any` - Any value (gray)

Colors are defined in `src/components/CustomNode.vue`.

## Runtime Context

Your node's `execute` function receives:

```typescript
execute: (ctx, inputs, node) => {
  // ctx.scene - Phaser scene instance
  // ctx.entities - Map of all spawned entities
  // ctx.variables - Map of game variables
  // ctx.deltaTime - Time since last frame (ms)
  // ctx.time - Total elapsed time (ms)

  // inputs - Values from connected nodes
  // node - The node instance with properties

  return { /* outputs */ }
}
```

## Testing

Currently, testing is manual:

1. Create a test graph in the editor
2. Run it in the preview panel
3. Check browser console for errors

Future: Add unit tests for node execution.

## Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use Tailwind CSS for styling
- Keep components small and focused

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-new-node`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add PlaySound node"`
5. Push to your fork: `git push origin feature/my-new-node`
6. Open a Pull Request on GitHub

### PR Checklist

- [ ] Code follows existing style
- [ ] New nodes are documented
- [ ] Tested in the editor
- [ ] No console errors
- [ ] Updated README if needed

## Ideas for Contributions

### New Nodes
- Audio nodes (PlaySound, StopSound, SetVolume)
- UI nodes (ShowText, Button, ScoreDisplay)
- Particle effects
- Animation controls
- More collision types

### Features
- Export game to HTML file
- Custom sprite upload
- Multiplayer support
- Mobile touch controls
- Gamepad support

### Improvements
- Undo/redo in editor
- Node search/filter
- Keyboard shortcuts
- Better error messages
- Performance optimization

### Documentation
- Video tutorials
- More game templates
- Node reference guide
- Best practices guide

## Getting Help

- Check existing code for examples
- Read the [README.md](README.md)
- Open an issue if you're stuck
- Join discussions on GitHub

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. Happy coding! 🚀
