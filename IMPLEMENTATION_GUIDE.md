# Implementation Guide - Critical Features

Step-by-step guides for implementing the most important missing features.

## 🔴 1. Fix Collision Detection (HIGH Priority)

### Current State
The `OnCollide` node exists but doesn't actually detect collisions in Phaser.

### What You Need to Do

#### Step 1: Update GameScene to Track Colliders

Edit `src/runtime/GameScene.ts`:

```typescript
export class GameScene extends Phaser.Scene {
  private graph?: GameGraph
  private executor?: GraphExecutor
  private context?: RuntimeContext
  private isPlaying = false
  private colliders: Phaser.Physics.Arcade.Collider[] = [] // ADD THIS

  // ... existing code ...

  create() {
    if (!this.graph || !this.executor) return

    this.context = {
      scene: this,
      entities: new Map(),
      variables: new Map(),
      deltaTime: 0,
      time: 0
    }

    this.physics.world.setBounds(0, 0, 800, 600)

    // ADD: Set up collision detection after a delay (entities spawn first)
    this.time.delayedCall(100, () => {
      this.setupCollisions()
    })

    this.isPlaying = true
  }

  // ADD THIS METHOD
  private setupCollisions() {
    if (!this.context) return

    // Find all OnCollide nodes in the graph
    const collideNodes = this.graph!.nodes.filter(n => n.type === 'OnCollide')

    collideNodes.forEach(node => {
      const entityAId = node.data.properties.entityA
      const entityBId = node.data.properties.entityB

      const entityA = this.context!.entities.get(entityAId)
      const entityB = this.context!.entities.get(entityBId)

      if (entityA && entityB) {
        const collider = this.physics.add.collider(
          entityA as any,
          entityB as any,
          () => {
            // Trigger collision event
            this.handleCollision(node.id, entityAId, entityBId)
          }
        )
        this.colliders.push(collider)
      }
    })
  }

  // ADD THIS METHOD
  private handleCollision(nodeId: string, entityA: string, entityB: string) {
    const node = this.graph!.nodes.find(n => n.id === nodeId)
    if (!node) return

    // Store collision data for the node to access
    if (!node.runtime) {
      node.runtime = {}
    }
    node.runtime.collided = true
    node.runtime.entityA = entityA
    node.runtime.entityB = entityB
  }
}
```

#### Step 2: Update OnCollide Node Properties

Edit `src/runtime/nodes/collision.ts`:

```typescript
NodeRegistry.register({
  meta: {
    type: 'OnCollide',
    label: 'On Collide',
    category: 'collision',
    color: '#8b5cf6'
  },
  inputs: [],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entityA', name: 'entityA', type: 'entity' },
    { id: 'entityB', name: 'entityB', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    // Check if collision happened this frame
    if (node.runtime?.collided) {
      const entityA = node.runtime.entityA
      const entityB = node.runtime.entityB

      // Reset collision flag
      node.runtime.collided = false

      return { exec: true, entityA, entityB }
    }

    return {}
  }
} as NodeRegistryEntry)
```

#### Step 3: Add Entity Selection to Properties Panel

Edit `src/components/PropertiesPanel.vue`, add this section:

```vue
<!-- OnCollide properties -->
<div v-else-if="selectedNode.type === 'OnCollide'" class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Entity A
  </label>
  <input
    v-model="properties.entityA"
    @change="updateProperties"
    type="text"
    placeholder="e.g. player"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />

  <label class="block text-sm font-medium text-gray-700">
    Entity B
  </label>
  <input
    v-model="properties.entityB"
    @change="updateProperties"
    type="text"
    placeholder="e.g. ground, enemy"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />
</div>
```

#### Step 4: Test

1. Create a new project
2. Add OnStart → Spawn (player) → Spawn (ground)
3. Add OnCollide node with entityA: "player", entityB: "ground"
4. Connect OnCollide to a ResetGame node
5. Play - when player touches ground, game should reset

---

## 🔴 2. Fix Physics Bodies (HIGH Priority)

### Current State
All spawned objects have physics but fall through each other.

### What You Need to Do

#### Step 1: Update Spawn Node

Edit `src/runtime/nodes/world.ts`, update the Spawn node:

```typescript
NodeRegistry.register({
  meta: {
    type: 'Spawn',
    label: 'Spawn',
    category: 'world',
    color: '#10b981'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'sprite', name: 'sprite', type: 'string' },
    { id: 'x', name: 'x', type: 'number', default: 0 },
    { id: 'y', name: 'y', type: 'number', default: 0 }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'entity', name: 'entity', type: 'entity' }
  ],
  execute: (ctx, inputs, node) => {
    const sprite = inputs.sprite || node.data.properties.sprite || 'player'
    const x = inputs.x ?? node.data.properties.x ?? 100
    const y = inputs.y ?? node.data.properties.y ?? 100
    const entityId = node.data.properties.entityId || `entity_${Date.now()}_${Math.random()}`

    // NEW: Get physics settings
    const isStatic = node.data.properties.isStatic || false
    const hasGravity = node.data.properties.hasGravity !== false // default true

    if (!ctx.entities.has(entityId)) {
      const gameObject = ctx.scene.physics.add.sprite(x, y, sprite) as any
      gameObject.setName(entityId)

      // NEW: Configure physics body
      if (gameObject.body) {
        gameObject.body.setCollideWorldBounds(true)

        // Static bodies don't move (platforms, walls)
        if (isStatic) {
          gameObject.body.setImmovable(true)
          gameObject.body.setAllowGravity(false)
        }

        // Disable gravity if specified
        if (!hasGravity) {
          gameObject.body.setAllowGravity(false)
        }
      }

      ctx.entities.set(entityId, gameObject)
    }

    return { exec: true, entity: entityId }
  }
} as NodeRegistryEntry)
```

#### Step 2: Add Physics Options to Properties Panel

Edit `src/components/PropertiesPanel.vue`, update the Spawn section:

```vue
<!-- Spawn properties -->
<div v-else-if="selectedNode.type === 'Spawn'" class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Sprite
  </label>
  <select
    v-model="properties.sprite"
    @change="updateProperties"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  >
    <option value="player">Player</option>
    <option value="enemy">Enemy</option>
    <option value="bird">Bird</option>
    <option value="pipe">Pipe</option>
    <option value="ground">Ground</option>
    <option value="platform">Platform</option>
  </select>

  <label class="block text-sm font-medium text-gray-700">
    X Position
  </label>
  <input
    v-model.number="properties.x"
    @change="updateProperties"
    type="number"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />

  <label class="block text-sm font-medium text-gray-700">
    Y Position
  </label>
  <input
    v-model.number="properties.y"
    @change="updateProperties"
    type="number"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />

  <label class="block text-sm font-medium text-gray-700">
    Entity ID
  </label>
  <input
    v-model="properties.entityId"
    @change="updateProperties"
    type="text"
    placeholder="e.g. player, enemy1"
    class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
  />

  <!-- NEW: Physics options -->
  <div class="flex items-center gap-2">
    <input
      v-model="properties.isStatic"
      @change="updateProperties"
      type="checkbox"
      id="isStatic"
      class="rounded"
    />
    <label for="isStatic" class="text-sm text-gray-700">
      Static (platforms, walls)
    </label>
  </div>

  <div class="flex items-center gap-2">
    <input
      v-model="properties.hasGravity"
      @change="updateProperties"
      type="checkbox"
      id="hasGravity"
      class="rounded"
    />
    <label for="hasGravity" class="text-sm text-gray-700">
      Allow Gravity
    </label>
  </div>
</div>
```

#### Step 3: Update Templates

Edit `src/templates/platformer.json`, update ground and platform spawns:

```json
{
  "id": "spawn_ground",
  "type": "Spawn",
  "position": { "x": 650, "y": 100 },
  "data": {
    "label": "Spawn Ground",
    "properties": {
      "sprite": "ground",
      "x": 400,
      "y": 568,
      "entityId": "ground",
      "isStatic": true,
      "hasGravity": false
    }
  }
}
```

#### Step 4: Test

1. Load platformer template
2. Ground should now stop player from falling
3. Player should stand on platforms
4. Platforms should be solid

---

## 🔴 3. Wire Up Save/Load (HIGH Priority)

### Current State
Save button exists but doesn't actually save to Appwrite.

### What You Need to Do

#### Step 1: Create Auth Store

Create `src/stores/authStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account } from '@/appwrite/config'
import { ID } from 'appwrite'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)

  async function login(email: string, password: string) {
    try {
      await account.createEmailSession(email, password)
      user.value = await account.get()
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name)
      return await login(email, password)
    } catch (error) {
      console.error('Signup failed:', error)
      return false
    }
  }

  async function logout() {
    try {
      await account.deleteSession('current')
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  async function checkAuth() {
    try {
      user.value = await account.get()
      isAuthenticated.value = true
    } catch {
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth
  }
})
```

#### Step 2: Update EditorView Save Function

Edit `src/views/EditorView.vue`:

```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

async function saveProject() {
  if (!editorStore.currentProject) {
    alert('No project to save')
    return
  }

  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    alert('Please log in to save projects')
    // TODO: Show login modal
    return
  }

  try {
    const project = {
      ...editorStore.currentProject,
      graph: editorStore.graph
    }

    if (project.id) {
      // Update existing project
      await projectStore.saveProject(project)
    } else {
      // Create new project - need userId
      await projectStore.saveProject(project)
    }

    alert('Project saved successfully!')
  } catch (e) {
    console.error('Save failed:', e)
    alert('Failed to save project: ' + (e as Error).message)
  }
}
```

#### Step 3: Fix projectStore to Actually Call Appwrite

Edit `src/stores/projectStore.ts`:

```typescript
import { projectService } from '@/appwrite/services'
import { useAuthStore } from './authStore'

async function saveProject(project: GameProject) {
  isLoading.value = true
  error.value = null

  try {
    const authStore = useAuthStore()

    if (!authStore.user?.$id) {
      throw new Error('User not authenticated')
    }

    let saved: GameProject

    if (project.id) {
      // Update existing
      saved = await projectService.update(project.id, project)
    } else {
      // Create new
      saved = await projectService.create(project, authStore.user.$id)
    }

    // Update local list
    const index = projects.value.findIndex(p => p.id === saved.id)
    if (index >= 0) {
      projects.value[index] = saved
    } else {
      projects.value.push(saved)
    }

    return saved
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save project'
    throw e
  } finally {
    isLoading.value = false
  }
}
```

#### Step 4: Create Simple Login UI

Create `src/components/AuthModal.vue`:

```vue
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">{{ isLogin ? 'Login' : 'Sign Up' }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
        >
          {{ isLogin ? 'Login' : 'Sign Up' }}
        </button>
      </form>

      <button
        @click="isLogin = !isLogin"
        class="mt-4 text-sm text-blue-600 hover:underline"
      >
        {{ isLogin ? 'Need an account? Sign up' : 'Have an account? Login' }}
      </button>

      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const authStore = useAuthStore()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''

  try {
    let success = false

    if (isLogin.value) {
      success = await authStore.login(email.value, password.value)
    } else {
      success = await authStore.signup(email.value, password.value, name.value)
    }

    if (success) {
      emit('close')
    } else {
      errorMsg.value = 'Authentication failed'
    }
  } catch (e) {
    errorMsg.value = (e as Error).message
  }
}
</script>
```

#### Step 5: Add Auth Modal to EditorView

Edit `src/views/EditorView.vue`:

```vue
<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <!-- ... existing header ... -->

    <div class="flex items-center gap-2">
      <span v-if="authStore.isAuthenticated" class="text-sm text-gray-600">
        {{ authStore.user?.name }}
      </span>

      <button
        v-if="!authStore.isAuthenticated"
        @click="showAuthModal = true"
        class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
      >
        Login
      </button>

      <button
        @click="saveProject"
        :disabled="!authStore.isAuthenticated"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:bg-gray-400"
      >
        Save
      </button>
    </div>

    <!-- ... rest of template ... -->

    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup lang="ts">
import AuthModal from '@/components/AuthModal.vue'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'

const showAuthModal = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>
```

---

## 🟡 4. Add Audio Nodes (MEDIUM Priority)

Quick wins - these are easy to add!

### PlaySound Node

Create or edit `src/runtime/nodes/audio.ts`:

```typescript
import { NodeRegistry } from '../NodeRegistry'
import type { NodeRegistryEntry } from '@/types/runtime'

NodeRegistry.register({
  meta: {
    type: 'PlaySound',
    label: 'Play Sound',
    category: 'audio',
    color: '#a855f7'
  },
  inputs: [
    { id: 'exec', name: 'exec', type: 'exec' },
    { id: 'sound', name: 'sound', type: 'string' }
  ],
  outputs: [
    { id: 'exec', name: 'exec', type: 'exec' }
  ],
  execute: (ctx, inputs, node) => {
    const soundKey = inputs.sound || node.data.properties.sound || 'jump'
    const volume = node.data.properties.volume ?? 1.0
    const loop = node.data.properties.loop || false

    try {
      ctx.scene.sound.play(soundKey, { volume, loop })
    } catch (e) {
      console.warn(`Sound '${soundKey}' not loaded`)
    }

    return { exec: true }
  }
} as NodeRegistryEntry)
```

Don't forget to import in `src/runtime/nodes/index.ts`:
```typescript
import './audio'
```

---

## 📊 Time Estimates

| Task | Difficulty | Time | Priority |
|------|-----------|------|----------|
| Collision Detection | Medium | 2-3h | ⭐⭐⭐ |
| Physics Bodies | Easy | 1-2h | ⭐⭐⭐ |
| Save/Load UI | Medium | 3-4h | ⭐⭐⭐ |
| Audio Nodes | Easy | 30min | ⭐⭐ |
| Entity Selector | Easy | 1h | ⭐⭐ |
| Visual Debugging | Medium | 2h | ⭐⭐ |
| Export to HTML | Hard | 3-4h | ⭐ |

## 🎯 Recommended Order

For hackathon submission, do in this order:

1. **Physics Bodies** (1-2h) - Quick win, makes templates actually work
2. **Collision Detection** (2-3h) - Core feature needed
3. **Save/Load UI** (3-4h) - Showcase Appwrite integration
4. **Audio Nodes** (30min) - Quick polish
5. **Polish templates** (1h) - Make sure demos work perfectly

Total: ~8-10 hours to have a solid, demo-able product.

## 🐛 Debugging Tips

### Collision Not Working?
- Check browser console for errors
- Verify entity IDs match exactly
- Make sure physics bodies exist (`gameObject.body`)
- Try adding `debug: true` to physics config

### Save Failing?
- Check Appwrite console for the document
- Verify collection permissions (Any = Read, Users = Write)
- Check browser Network tab for failed requests
- Make sure `.env` IDs are correct

### Nodes Not Executing?
- Check if nodes are connected properly
- Verify execution flow in console
- Add `console.log()` in node execute functions
- Check if event nodes are triggering

Good luck! 🚀
