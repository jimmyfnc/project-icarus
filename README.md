# Visual Scripting 2D Game Editor

A node-based visual scripting editor for creating 2D games without coding. Built for the Appwrite Hackathon.

## Features

- 🎨 **Node-Based Visual Scripting** - Drag, drop, and connect nodes to create game logic
- 🎮 **Real-Time Preview** - See your game run instantly with Phaser
- 💾 **Cloud Storage** - Save and load projects with Appwrite
- 🔗 **Share Games** - Public play mode with unique URLs
- 📦 **Starter Templates** - Flappy Bird and Platformer examples included

## Tech Stack

- **Frontend**: Vue 3 + Vite + TypeScript + TailwindCSS
- **State Management**: Pinia
- **Node Editor**: Vue Flow
- **Game Engine**: Phaser 3
- **Backend**: Appwrite (Auth, Database, Storage)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Appwrite

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PROJECTS_COLLECTION_ID=your_collection_id
VITE_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id
```

#### Appwrite Setup Instructions

1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a database and note the Database ID
3. Create a collection named "projects" with the following attributes:
   - `name` (String, required)
   - `slug` (String, required, unique)
   - `description` (String)
   - `graph` (String, required, size: 100000)
   - `userId` (String, required)
4. Create a storage bucket for game assets
5. Update the `.env` file with your IDs

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── appwrite/          # Appwrite client & services
│   ├── config.ts      # Client configuration
│   └── services.ts    # Project & storage services
├── components/        # Vue components
│   ├── CustomNode.vue        # Node visualization
│   ├── GamePreview.vue       # Phaser preview panel
│   ├── GraphCanvas.vue       # Vue Flow canvas
│   ├── NodePalette.vue       # Node library sidebar
│   └── PropertiesPanel.vue   # Node properties editor
├── runtime/           # Game runtime engine
│   ├── nodes/         # Node implementations
│   │   ├── events.ts          # OnStart, OnKey, Every
│   │   ├── movement.ts        # ApplyGravity, Impulse, Move
│   │   ├── world.ts           # Spawn, Destroy, SetCameraFollow
│   │   ├── logic.ts           # If, SetVar, AddVar, Compare
│   │   ├── collision.ts       # OnCollide
│   │   └── scene.ts           # ResetGame
│   ├── GameScene.ts          # Phaser scene
│   ├── GraphExecutor.ts      # Graph execution engine
│   ├── NodeRegistry.ts       # Node registry system
│   └── PhaserGame.ts         # Phaser game wrapper
├── stores/            # Pinia stores
│   ├── editorStore.ts        # Editor state
│   └── projectStore.ts       # Project CRUD
├── templates/         # Starter templates
│   ├── flappy-bird.json
│   └── platformer.json
├── types/             # TypeScript types
│   ├── graph.ts              # Graph & node types
│   ├── runtime.ts            # Runtime & executor types
│   └── appwrite.ts           # Appwrite types
└── views/             # Vue pages
    ├── HomeView.vue          # Landing page
    ├── EditorView.vue        # Node editor
    └── PlayView.vue          # Public play mode
```

## Node Types

### Events
- **OnStart** - Executes once when the game starts
- **OnKey(key)** - Executes when a key is pressed (SPACE, UP, DOWN, LEFT, RIGHT)
- **Every(ms)** - Executes repeatedly at an interval

### Movement & Physics
- **ApplyGravity(entity)** - Applies gravity to an entity
- **Impulse(entity, dx, dy)** - Applies an instant velocity change
- **Move(entity, dx, dy)** - Sets continuous velocity

### World
- **Spawn(sprite, x, y)** - Creates a new game object
- **Destroy(entity)** - Removes an entity
- **SetCameraFollow(entity)** - Makes camera follow an entity

### Logic & State
- **If(condition)** - Conditional branching (true/false outputs)
- **SetVar(name, value)** - Sets a variable
- **AddVar(name, value)** - Adds to a variable
- **Compare(a, b)** - Compares two values (==, >, <, etc.)

### Collisions
- **OnCollide(A, B)** - Executes when two entities collide

### Scene
- **ResetGame()** - Restarts the game scene

## Example: Simple Movement

This example spawns a player and moves it right when the RIGHT arrow key is pressed:

1. Add **OnStart** node
2. Connect to **Spawn** node (sprite: "player", entityId: "player")
3. Add **OnKey** node (key: RIGHT)
4. Connect to **Move** node (entity: "player", dx: 160, dy: 0)

## Starter Templates

### Flappy Bird Clone
- Tap SPACE to jump
- Gravity pulls the bird down
- Pipes spawn every 2 seconds

Load with: Click "Flappy Bird" on the home page

### Mario-Style Platformer
- LEFT/RIGHT arrows to move
- UP arrow to jump
- Platforms to jump on

Load with: Click "Platformer" on the home page

## Development Tips

### Adding New Node Types

1. Create node definition in `src/runtime/nodes/`
2. Register with `NodeRegistry.register()`
3. Define `meta`, `inputs`, `outputs`, and `execute()` function
4. Import in `src/runtime/nodes/index.ts`

Example:

```typescript
NodeRegistry.register({
  meta: {
    type: 'MyNode',
    label: 'My Custom Node',
    category: 'logic',
    color: '#ff0000'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'value', name: 'value', type: 'number' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'result', name: 'result', type: 'number' }
  ],
  execute: (ctx, inputs, node) => {
    const value = inputs.value ?? 0
    return { exec: true, result: value * 2 }
  }
})
```

### Testing Runtime Changes

1. Make changes to node definitions or executor
2. Click "Reset" in the preview panel
3. Click "Play" to test

### Debugging

- Check browser console for errors
- Use `console.log()` in node `execute()` functions
- Inspect Phaser objects in browser DevTools

## Appwrite Integration

### Project Save/Load Flow

1. User creates/edits graph in editor
2. Click "Save" → `projectService.create()` or `projectService.update()`
3. Graph JSON is stringified and stored in Appwrite Database
4. Unique slug is generated for public sharing

### Public Play Mode

1. User shares `/play/:slug` URL
2. `PlayView` loads project by slug via `projectService.getBySlug()`
3. Phaser initializes with loaded graph
4. Game runs in read-only mode

## Roadmap

- [ ] User authentication
- [ ] Asset upload (custom sprites & audio)
- [ ] Collision detection between entities
- [ ] More node types (audio, UI, particles)
- [ ] Export to standalone HTML file
- [ ] Community template gallery

## License

MIT

## Built With

This project was created for the [Appwrite Hackathon](https://appwrite.io/hackathon) 🚀
