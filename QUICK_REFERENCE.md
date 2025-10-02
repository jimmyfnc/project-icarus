# Quick Reference Guide

Quick answers to common questions and tasks.

## 📁 File Locations

| What | Where |
|------|-------|
| Add new node type | `src/runtime/nodes/*.ts` |
| Modify UI component | `src/components/*.vue` |
| Add page/route | `src/views/*.vue` + `src/main.ts` |
| Change styles | `src/style.css` or component `<style>` |
| Add game template | `src/templates/*.json` |
| Modify store state | `src/stores/*.ts` |
| Appwrite config | `src/appwrite/config.ts` |
| Type definitions | `src/types/*.ts` |

## 🔧 Common Tasks

### Add a New Node Type

1. Edit or create file in `src/runtime/nodes/`
2. Register with `NodeRegistry.register({ ... })`
3. Import in `src/runtime/nodes/index.ts`
4. (Optional) Add properties UI in `PropertiesPanel.vue`

**Template**:
```typescript
NodeRegistry.register({
  meta: {
    type: 'MyNode',
    label: 'My Node',
    category: 'logic',
    color: '#f59e0b'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    // Your logic here
    return { exec: true }
  }
})
```

### Add Properties to Existing Node

Edit `src/components/PropertiesPanel.vue`:

```vue
<div v-else-if="selectedNode.type === 'MyNode'" class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    My Property
  </label>
  <input
    v-model="properties.myProperty"
    @change="updateProperties"
    type="text"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />
</div>
```

### Create a New Template

1. Create JSON file in `src/templates/`
2. Follow structure of existing templates
3. Add to `src/utils/templates.ts`
4. Add button in `HomeView.vue`

### Add a New Route

Edit `src/main.ts`:

```typescript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... existing routes ...
    { path: '/my-route', name: 'myRoute', component: MyView }
  ]
})
```

### Modify Phaser Game

Edit `src/runtime/GameScene.ts` for game-level logic.
Edit node executors in `src/runtime/nodes/` for node-specific logic.

## 🎮 Testing

### Test a Single Node

1. Create new project
2. Add OnStart node
3. Add your node
4. Connect them
5. Set properties
6. Click Play

### Test a Full Game

1. Load a template
2. Modify it
3. Click Play
4. Check for errors in console

### Test Save/Load

1. Set up Appwrite (see APPWRITE_SETUP.md)
2. Create/edit project
3. Click Save
4. Refresh page
5. Load project from database

## 🐛 Debugging

### Node Not Executing

```typescript
// Add to execute function
execute: (ctx, inputs, node) => {
  console.log('Node executing:', node.type, inputs)
  // ... rest of code
}
```

### Graph Not Running

Check `GamePreview.vue` console for:
- Graph loaded?
- Phaser errors?
- Node errors?

### Phaser Object Not Found

```typescript
execute: (ctx, inputs, node) => {
  const entity = ctx.entities.get(entityId)
  if (!entity) {
    console.warn('Entity not found:', entityId)
    return {}
  }
  // ... use entity
}
```

## 📊 Data Access

### In Node Executors

```typescript
execute: (ctx, inputs, node) => {
  // Phaser scene
  ctx.scene.physics.add.sprite(...)

  // All spawned entities
  const player = ctx.entities.get('player')

  // Game variables
  const score = ctx.variables.get('score')

  // Time
  ctx.time        // Total time
  ctx.deltaTime   // Frame delta

  // Node properties
  const speed = node.data.properties.speed

  // Connected inputs
  const value = inputs.myInput
}
```

### In Vue Components

```typescript
// Editor state
import { useEditorStore } from '@/stores/editorStore'
const editorStore = useEditorStore()

editorStore.nodes          // All nodes
editorStore.edges          // All edges
editorStore.selectedNode   // Currently selected
editorStore.graph          // Complete graph

// Project state
import { useProjectStore } from '@/stores/projectStore'
const projectStore = useProjectStore()

projectStore.projects      // Project list
projectStore.saveProject(project)
projectStore.loadProject(slug)

// Auth state
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

authStore.user            // Current user
authStore.isAuthenticated // Login status
```

## 🎨 Styling

### Node Colors

Edit `meta.color` in node definition:

```typescript
meta: {
  color: '#ef4444'  // Red
  color: '#3b82f6'  // Blue
  color: '#10b981'  // Green
  color: '#f59e0b'  // Orange
  color: '#8b5cf6'  // Purple
  color: '#ec4899'  // Pink
}
```

### Port Colors

Edit `src/components/CustomNode.vue`:

```typescript
function getHandleColor(type: string): string {
  switch (type) {
    case 'exec': return '#ffffff'
    case 'number': return '#3b82f6'
    case 'string': return '#10b981'
    case 'boolean': return '#f59e0b'
    case 'entity': return '#8b5cf6'
    default: return '#6b7280'
  }
}
```

### UI Colors

Use Tailwind classes in Vue components:

```vue
<button class="bg-blue-600 hover:bg-blue-700 text-white">
  Save
</button>
```

## 🔌 Appwrite

### Get Current User

```typescript
import { account } from '@/appwrite/config'

const user = await account.get()
console.log(user.$id, user.email)
```

### Save Document

```typescript
import { databases, config } from '@/appwrite/config'
import { ID } from 'appwrite'

const doc = await databases.createDocument(
  config.databaseId,
  config.projectsCollectionId,
  ID.unique(),
  { name: 'My Project', ... }
)
```

### Upload File

```typescript
import { storage, config } from '@/appwrite/config'
import { ID } from 'appwrite'

const file = await storage.createFile(
  config.storageBucketId,
  ID.unique(),
  fileInput.files[0]
)
```

## ⚡ Performance Tips

### Optimize Node Execution

```typescript
// Cache lookups
const entity = ctx.entities.get(entityId)
if (!entity) return {}

// Early return if nothing to do
if (!inputs.exec) return {}

// Avoid creating new objects every frame
if (!node.runtime) {
  node.runtime = { counter: 0 }
}
```

### Optimize Vue Components

```vue
<script setup lang="ts">
import { computed } from 'vue'

// Use computed for derived state
const nodeCount = computed(() => editorStore.nodes.length)

// Not this (recalculates every render)
const nodeCount = editorStore.nodes.length
</script>
```

## 🚀 Build & Deploy

### Development

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

### Environment Variables

Development: `.env`
Production: Set in hosting platform

```env
VITE_APPWRITE_ENDPOINT=...
VITE_APPWRITE_PROJECT_ID=...
# etc.
```

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Deploy to Netlify

```bash
npm run build
```
Drag `dist` folder to Netlify

## 📝 Common Code Snippets

### Access Entity in Node

```typescript
const entityId = node.data.properties.entity || 'player'
const entity = ctx.entities.get(entityId) as any

if (!entity || !entity.body) {
  console.warn('Entity has no physics body')
  return {}
}

entity.body.setVelocity(100, 0)
```

### Get/Set Variable

```typescript
// Get
const score = ctx.variables.get('score') || 0

// Set
ctx.variables.set('score', score + 1)
```

### Create Sprite

```typescript
const sprite = ctx.scene.physics.add.sprite(x, y, 'player')
sprite.setName('player')
ctx.entities.set('player', sprite)
```

### Handle Input

```typescript
const cursors = ctx.scene.input.keyboard?.createCursorKeys()
if (cursors?.left.isDown) {
  // Move left
}
```

### Play Sound

```typescript
ctx.scene.sound.play('jump', { volume: 0.5 })
```

## 🆘 Error Solutions

### "Cannot read property 'body' of undefined"
Entity doesn't exist. Check entity ID matches spawn.

### "Module not found"
Run `npm install` or check import path.

### "Appwrite service is unavailable"
Check `.env` file exists and IDs are correct.

### "CORS error"
Add your domain to Appwrite Platform settings.

### "Graph not updating in preview"
Click Reset button, then Play again.

### Tailwind classes not working
Check `src/style.css` has `@tailwind` directives.

## 📚 Documentation Links

- [README.md](README.md) - Main docs
- [QUICKSTART.md](QUICKSTART.md) - Getting started
- [TODO.md](TODO.md) - What needs to be built
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - How to build critical features
- [APPWRITE_SETUP.md](APPWRITE_SETUP.md) - Backend setup
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

## 🎯 Keyboard Shortcuts (to implement)

These don't exist yet but would be good to add:

- `Space` - Play/Stop
- `R` - Reset
- `Ctrl/Cmd + S` - Save
- `Delete` - Delete selected node
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + C/V` - Copy/Paste

## 💡 Pro Tips

1. **Test incrementally** - Add one node, test, repeat
2. **Use templates** - Start from working example
3. **Check console** - Errors show up there first
4. **Name entities clearly** - "player", "enemy1", not "entity_123"
5. **Document your nodes** - Future you will thank you
6. **Start simple** - Get movement working before physics
7. **Use Reset often** - Clean slate for testing
8. **Save frequently** - If using Appwrite

## 🎓 Learning Resources

- **Phaser 3 Docs**: https://photonstorm.github.io/phaser3-docs/
- **Vue 3 Docs**: https://vuejs.org/
- **Appwrite Docs**: https://appwrite.io/docs
- **Vue Flow**: https://vueflow.dev/
- **Pinia**: https://pinia.vuejs.org/

---

**Last Updated**: 2025-10-01
**Version**: MVP 0.1.0
