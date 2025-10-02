# Entity Reference System

## Overview

The Entity Reference System provides **smart entity selection** with dropdown menus, validation, and error detection to prevent typos and improve usability.

---

## ✅ What Was Implemented

### 1. **Entity Tracking in Editor Store**
- `spawnedEntities` computed property automatically collects all entity IDs from Spawn nodes
- Updates in real-time as you add/remove Spawn nodes
- Returns unique, sorted list of entity IDs

### 2. **EntitySelect Component**
- **Reusable dropdown component** for entity selection
- Shows all spawned entities in dropdown
- **Validation**: Yellow warning if entity doesn't exist
- **Custom input**: Option to enter custom entity ID
- **Auto-complete**: No more typos!

### 3. **GetEntity Node** ⭐ NEW
- Retrieve entity reference by ID
- Outputs:
  - `entity` - The entity ID (for passing to other nodes)
  - `exists` - Boolean (true if entity exists, false if not found)
- Perfect for conditional logic and validation

### 4. **Updated UI for All Entity Inputs**
- **Movement nodes**: Impulse, Move, ApplyGravity
- **Collision nodes**: OnCollide (both entityA and entityB), OnCollideWithTag
- **World nodes**: Destroy, SetCameraFollow, GetEntity, GetEntityPosition
- **AI nodes**: EntitySelect available for all entity references

---

## 🎯 Features

### **Smart Dropdown Selection**
- Shows all spawned entities from the graph
- Alphabetically sorted
- Updates automatically when Spawn nodes change
- No manual typing required!

### **Validation & Error Detection**
```
⚠️ Entity "playerr" not found. It may not be spawned yet.
```
- Yellow border on invalid entity
- Warning message explains the issue
- Still allows custom IDs (for dynamic entities)

### **Custom Entity Input**
- Select "➕ Enter custom ID..." from dropdown
- Type custom entity name
- Useful for:
  - Dynamically spawned entities
  - Entities from other scenes
  - Placeholder IDs

---

## 📚 Usage Examples

### **Example 1: Using Entity Dropdown**

**Before (Manual typing - error prone):**
```
1. Add Move node
2. Type "player" in Entity ID field
3. Typo: "playar" → Runtime error!
```

**After (Dropdown - safe):**
```
1. Add Move node
2. Click Entity ID dropdown
3. Select "player" from list
4. ✅ Guaranteed to work!
```

---

### **Example 2: GetEntity Node for Validation**

Check if entity exists before using it:

```
Node Graph:
1. GetEntity (entity: "player")
   ↓ outputs: entity, exists
2. CheckVariable (exists == true)
   ↓ (if true)
3. Move (entity: [from GetEntity])
   ↓ (if false)
4. Debug log "Player not found!"
```

**Use Cases:**
- Conditional entity operations
- Error handling
- Dynamic entity spawning

---

### **Example 3: Entity Data Flow**

Pass entity references between nodes:

```
1. GetEntity (entity: "player") → entity
   ↓
2. GetEntityPosition (entity: [from GetEntity]) → x, y
   ↓
3. CalculateAngle (fromX: x, fromY: y, ...) → angle
   ↓
4. AIAimAt (toEntity: [from GetEntity])
```

---

## 🛠️ How It Works

### **Entity Tracking**
```typescript
// editorStore.ts
const spawnedEntities = computed<string[]>(() => {
  const entityIds: string[] = []

  nodes.value.forEach(node => {
    if (node.type === 'Spawn') {
      const entityId = node.data.properties.entityId
      if (entityId && entityId.trim() !== '') {
        entityIds.push(entityId)
      }
    }
  })

  return [...new Set(entityIds)].sort()
})
```

### **EntitySelect Component**
```vue
<EntitySelect
  v-model="properties.entity"
  @update:modelValue="updateProperties"
  label="Entity ID"
  placeholder="Select entity..."
  helperText="Choose from spawned entities"
  :validate="true"  <!-- Show warning if not found -->
  :allowCustom="true"  <!-- Allow custom input -->
/>
```

### **GetEntity Node**
```typescript
execute: (ctx, _inputs, node) => {
  const entityId = node.data.properties.entity || ''
  const entity = ctx.entities.get(entityId)

  return {
    exec: true,
    entity: entityId,
    exists: !!entity  // true if exists, false if not
  }
}
```

---

## 📊 Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Entity Selection** | Manual typing | Dropdown with all entities |
| **Validation** | None (runtime errors) | Real-time with warnings |
| **Typo Protection** | ❌ Prone to errors | ✅ Impossible with dropdown |
| **Entity Discovery** | Remember IDs manually | Auto-populated list |
| **Error Detection** | Runtime crash | Yellow warning before running |
| **Custom Entities** | ✅ Supported | ✅ Still supported |
| **Data Flow** | String passing only | GetEntity node for references |

---

## 🎨 Visual Features

### **Dropdown UI**
```
Entity ID
┌─────────────────────────────────┐
│ Select entity...              ▼ │
├─────────────────────────────────┤
│ bird                            │
│ ground                          │
│ platform1                       │
│ platform2                       │
│ player                          │
│ tank1                           │
│ tank2                           │
│ ───────────────────────         │
│ ➕ Enter custom ID...           │
└─────────────────────────────────┘
```

### **Validation Warning**
```
Entity ID
┌─────────────────────────────────┐
│ playerr                       ⚠ │ ← Yellow border
└─────────────────────────────────┘
⚠️ Entity "playerr" not found. It may not be spawned yet.
```

### **Custom Input**
```
Entity ID
┌─────────────────────────────────┐
│ ➕ Enter custom ID...          ▼ │
└─────────────────────────────────┘
     ↓ (after selecting)
┌─────────────────────────────────┐
│ my_custom_entity                │ ← Blue border, focused
└─────────────────────────────────┘
e.g. player, enemy
```

---

## 🔗 Integration Points

### **Files Created**
1. `src/components/EntitySelect.vue` - Reusable entity dropdown component

### **Files Modified**
1. `src/stores/editorStore.ts` - Added `spawnedEntities` computed property
2. `src/components/PropertiesPanel.vue` - Replaced text inputs with EntitySelect
3. `src/runtime/nodes/world.ts` - Added GetEntity node

### **Nodes Updated**
- ✅ Impulse
- ✅ Move
- ✅ ApplyGravity
- ✅ OnCollide (entityA & entityB)
- ✅ OnCollideWithTag
- ✅ Destroy
- ✅ SetCameraFollow
- ✅ GetEntityPosition
- ✅ GetEntity (new)

---

## 💡 Best Practices

### **When to Use Dropdown**
- ✅ Referencing existing entities
- ✅ When entity is spawned in same graph
- ✅ When you want validation/error checking

### **When to Use Custom Input**
- ✅ Dynamic entity IDs (generated at runtime)
- ✅ Entities from other scenes/graphs
- ✅ Placeholder IDs during development

### **Using GetEntity for Safety**
```
Good Pattern:
1. GetEntity → Check exists
2. Conditional logic based on exists
3. Only operate on entity if it exists

Bad Pattern:
1. Directly reference entity (may not exist)
2. Runtime crash if missing
```

---

## 🚀 Future Enhancements

### **Possible Additions**
1. **Entity type filtering** - Show only "player" type entities
2. **Entity preview** - Thumbnail of sprite in dropdown
3. **Entity search** - Filter dropdown by typing
4. **Entity grouping** - Group by tag or type
5. **Auto-fix suggestions** - "Did you mean: player?"
6. **Entity inspector** - Click to see entity properties

---

## 🎉 Summary

The Entity Reference System provides:

- ✅ **Smart dropdowns** - No more typos
- ✅ **Real-time validation** - Catch errors before running
- ✅ **Better UX** - Auto-complete from spawned entities
- ✅ **GetEntity node** - Conditional entity operations
- ✅ **Error prevention** - Yellow warnings for missing entities

**Result**: More reliable, easier to use, and fewer runtime errors!
