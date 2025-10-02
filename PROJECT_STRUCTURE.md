# Project Structure

Complete overview of the Visual Scripting Game Editor codebase.

## Directory Tree

```
project-icarus/
├── public/                          # Static assets
├── src/
│   ├── appwrite/                    # Appwrite integration
│   │   ├── config.ts                # Client setup & configuration
│   │   └── services.ts              # Project & storage CRUD operations
│   │
│   ├── components/                  # Vue components
│   │   ├── CustomNode.vue           # Visual node component for canvas
│   │   ├── GamePreview.vue          # Phaser game preview panel
│   │   ├── GraphCanvas.vue          # Vue Flow canvas wrapper
│   │   ├── NodePalette.vue          # Left sidebar - node library
│   │   └── PropertiesPanel.vue      # Right sidebar - node properties
│   │
│   ├── runtime/                     # Game execution engine
│   │   ├── nodes/                   # Node type definitions
│   │   │   ├── collision.ts         # OnCollide
│   │   │   ├── events.ts            # OnStart, OnKey, Every
│   │   │   ├── index.ts             # Node exports
│   │   │   ├── logic.ts             # If, SetVar, AddVar, Compare
│   │   │   ├── movement.ts          # ApplyGravity, Impulse, Move
│   │   │   ├── scene.ts             # ResetGame
│   │   │   └── world.ts             # Spawn, Destroy, SetCameraFollow
│   │   │
│   │   ├── GameScene.ts             # Phaser scene implementation
│   │   ├── GraphExecutor.ts         # Graph traversal & execution
│   │   ├── NodeRegistry.ts          # Node type registry system
│   │   └── PhaserGame.ts            # Phaser game wrapper
│   │
│   ├── stores/                      # Pinia state stores
│   │   ├── editorStore.ts           # Canvas, nodes, edges state
│   │   └── projectStore.ts          # Project CRUD state
│   │
│   ├── templates/                   # Starter game templates
│   │   ├── flappy-bird.json         # Flappy Bird clone graph
│   │   └── platformer.json          # Mario-style platformer graph
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── appwrite.ts              # Appwrite document types
│   │   ├── graph.ts                 # Graph, node, edge types
│   │   └── runtime.ts               # Runtime context & executor types
│   │
│   ├── utils/                       # Helper utilities
│   │   └── templates.ts             # Template loading utilities
│   │
│   ├── views/                       # Page components
│   │   ├── EditorView.vue           # Main editor page
│   │   ├── HomeView.vue             # Landing page
│   │   └── PlayView.vue             # Public game player
│   │
│   ├── App.vue                      # Root app component
│   ├── main.ts                      # App entry point
│   ├── style.css                    # Global styles + Tailwind
│   └── vite-env.d.ts                # TypeScript declarations
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── APPWRITE_SETUP.md                # Appwrite configuration guide
├── CONTRIBUTING.md                  # Contribution guidelines
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── PROJECT_STRUCTURE.md             # This file
├── QUICKSTART.md                    # Quick start guide
├── README.md                        # Main documentation
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node TypeScript config
└── vite.config.ts                   # Vite build configuration
```

## Key Files Explained

### Application Entry

- **`index.html`** - HTML shell, loads Vue app
- **`src/main.ts`** - Initializes Vue, Pinia, Router, and registers nodes
- **`src/App.vue`** - Root component with router view

### Type System

All TypeScript types are in `src/types/`:

- **`graph.ts`** - Defines graph structure (nodes, edges, projects)
- **`runtime.ts`** - Runtime execution context and node executor types
- **`appwrite.ts`** - Appwrite document schemas

### Runtime Engine

The `src/runtime/` folder contains the game execution system:

- **`NodeRegistry.ts`** - Registry for all node types
- **`GraphExecutor.ts`** - Traverses and executes node graph
- **`GameScene.ts`** - Phaser scene that runs the graph
- **`PhaserGame.ts`** - Wrapper for Phaser game instance

### Node Definitions

Each file in `src/runtime/nodes/` defines node types:

- **Events** - Trigger points (OnStart, OnKey, Every)
- **Movement** - Physics (ApplyGravity, Impulse, Move)
- **World** - Object management (Spawn, Destroy, SetCameraFollow)
- **Logic** - Variables & conditions (If, SetVar, AddVar, Compare)
- **Collision** - Collision detection (OnCollide)
- **Scene** - Game control (ResetGame)

### State Management

Pinia stores in `src/stores/`:

- **`editorStore.ts`** - Current graph, selected node, play state
- **`projectStore.ts`** - Project list, loading, saving

### UI Components

Vue components in `src/components/`:

- **`GraphCanvas.vue`** - Main canvas using Vue Flow
- **`CustomNode.vue`** - Individual node rendering
- **`NodePalette.vue`** - Sidebar with available nodes
- **`PropertiesPanel.vue`** - Node property editor
- **`GamePreview.vue`** - Phaser preview with controls

### Views (Pages)

- **`HomeView.vue`** - Landing page with templates
- **`EditorView.vue`** - Main editor layout
- **`PlayView.vue`** - Public game player

### Backend Integration

- **`src/appwrite/config.ts`** - Appwrite client setup
- **`src/appwrite/services.ts`** - CRUD operations for projects & assets

### Configuration Files

- **`vite.config.ts`** - Build tool configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`tailwind.config.js`** - CSS framework setup
- **`package.json`** - Dependencies and scripts

## Data Flow

### Editor Flow

1. User opens `/editor`
2. `EditorView.vue` renders layout
3. `NodePalette.vue` shows available nodes
4. User drags node → `GraphCanvas.vue` adds to canvas
5. User connects nodes → `editorStore` updates edges
6. User clicks node → `PropertiesPanel.vue` shows properties
7. User edits properties → `editorStore` updates node data

### Runtime Flow

1. User clicks "Play" in `GamePreview.vue`
2. Current graph passed to `PhaserGame`
3. `GameScene` creates `GraphExecutor` with graph
4. `GraphExecutor` finds event nodes (OnStart, OnKey, etc.)
5. Each frame, executor runs event nodes
6. Event nodes trigger connected nodes via edges
7. Nodes execute via `NodeRegistry` definitions
8. Execution continues until no more nodes to run

### Save/Load Flow

1. User clicks "Save" in `EditorView.vue`
2. `editorStore.graph` serialized to JSON
3. `projectService.create()` or `update()` called
4. Appwrite saves to database
5. To load: `projectService.getBySlug()` fetches JSON
6. `editorStore.loadProject()` deserializes graph

## Module Dependencies

```
main.ts
  ├─> App.vue
  ├─> Router (views)
  ├─> Pinia (stores)
  └─> runtime/nodes (registers all nodes)

EditorView.vue
  ├─> NodePalette.vue
  ├─> GraphCanvas.vue
  │     └─> CustomNode.vue
  ├─> PropertiesPanel.vue
  └─> GamePreview.vue
        └─> PhaserGame
              └─> GameScene
                    └─> GraphExecutor
                          └─> NodeRegistry

PlayView.vue
  └─> PhaserGame (same as above)

Stores
  ├─> editorStore (graph state)
  └─> projectStore (uses appwrite/services)

Services
  └─> appwrite/services (uses appwrite/config)
```

## Adding New Features

### New Node Type
1. Add to `src/runtime/nodes/` (or create new category file)
2. Import in `src/runtime/nodes/index.ts`
3. Add property UI in `src/components/PropertiesPanel.vue` (optional)

### New UI Component
1. Create in `src/components/`
2. Import in parent component or view
3. Use Tailwind for styling

### New Page
1. Create in `src/views/`
2. Add route in `src/main.ts`
3. Add navigation link

### New Store
1. Create in `src/stores/`
2. Use in components via `useStoreName()`

## Build Output

```
dist/
├── assets/
│   ├── index.[hash].js       # Compiled JS bundle
│   └── index.[hash].css      # Compiled CSS
└── index.html                # HTML entry point
```

## Development vs Production

**Development** (`npm run dev`):
- Hot module replacement
- Source maps
- Dev server on port 5173

**Production** (`npm run build`):
- Minified bundles
- Optimized assets
- Static files in `dist/`

## Performance Considerations

- **Graph Execution**: Runs every frame (60 FPS)
- **Node Registry**: Static map, O(1) lookup
- **State Updates**: Pinia reactive, minimal re-renders
- **Canvas**: Vue Flow handles virtualization
- **Phaser**: Hardware-accelerated rendering

## Security Notes

- Environment variables for sensitive data
- Appwrite handles auth & permissions
- No eval() or dynamic code execution
- User graphs are sandboxed in Phaser

## Future Architecture Ideas

- Web Workers for graph execution
- WebAssembly for performance-critical code
- IndexedDB for offline project storage
- WebRTC for multiplayer support
