# Project TODO - From MVP to Production

This document outlines all areas that need to be fleshed out to move from the current MVP to a production-ready application.

**Last Updated**: 2025-10-02

## ✅ Recently Completed

### 1. ✅ Collision Detection System (COMPLETED!)
**Status**: ✅ Fully Implemented
**Completed**: 2025-10-02

**What Was Done**:
- ✅ Implemented Phaser arcade physics colliders
- ✅ Created OnCollide node for entity-to-entity collisions
- ✅ Created OnCollideWithTag node for tag-based collision groups
- ✅ Added setupCollisions() method to GameScene
- ✅ Collision tracking with runtime flags
- ✅ Tested with player-ground, player-platform collisions

**Files Modified**:
- ✅ `src/runtime/GameScene.ts` - Added setupCollisions() method
- ✅ `src/runtime/nodes/collision.ts` - Added OnCollideWithTag node
- ✅ `src/components/PropertiesPanel.vue` - Added collision UI

### 2. ✅ Physics Body Configuration (COMPLETED!)
**Status**: ✅ Fully Implemented
**Completed**: 2025-10-02

**What Was Done**:
- ✅ Added `isStatic` property for immovable objects
- ✅ Added `hasGravity` property to control gravity
- ✅ Added `collideWorldBounds` property
- ✅ Added `tag` property for collision groups
- ✅ UI checkboxes in PropertiesPanel
- ✅ Automatically configured on Spawn

**Files Modified**:
- ✅ `src/runtime/nodes/world.ts` - Updated Spawn node with physics config
- ✅ `src/components/PropertiesPanel.vue` - Added physics checkboxes and tag input

### 3. ✅ localStorage Persistence (COMPLETED!)
**Status**: ✅ Fully Implemented
**Completed**: 2025-10-02

**What Was Done**:
- ✅ Auto-save to localStorage on changes
- ✅ Auto-restore on page load
- ✅ Template protection (won't save templates)
- ✅ "Save As New Project" functionality

**Files Modified**:
- ✅ `src/stores/editorStore.ts` - Added localStorage watchers
- ✅ `src/views/EditorView.vue` - Added template warning banner
- ✅ `src/types/graph.ts` - Added isTemplate flag

## 🔴 Critical (Required for Production)

### 1. ✅ Fix Entity Reference System (COMPLETED)
**Status**: COMPLETE - Implemented with EntitySelect component
**Priority**: HIGH
**Effort**: Completed

**Implementation**:
- ✅ EntitySelect component with dropdown selector
- ✅ Dropdown auto-populates from spawned entities
- ✅ Validation warnings when entity doesn't exist
- ✅ GetEntity node for entity validation
- ✅ Custom input option for dynamic IDs

**Files Modified**:
- `src/components/EntitySelect.vue` - NEW reusable component
- `src/components/PropertiesPanel.vue` - Integrated EntitySelect
- `src/stores/editorStore.ts` - Added spawnedEntities computed
- `src/runtime/nodes/world.ts` - Added GetEntity node

## 🟡 Important (Needed for Usability)

### 2. ✅ Implement Cloud Save/Load with Appwrite (COMPLETED!)
**Status**: ✅ Fully Implemented & Deployed
**Completed**: 2025-10-02
**Priority**: HIGH
**Effort**: Completed

**What Was Done**:
- ✅ Add authentication UI (login/signup modal)
- ✅ Create auth store with user state
- ✅ Wire up save button to save to Appwrite cloud
- ✅ Implement load project from database
- ✅ Add "My Projects" list to HomeView
- ✅ Handle errors gracefully
- ✅ Add loading states
- ✅ Test with real Appwrite instance
- ✅ Deploy to production at Appwrite Sites
- ✅ Fix TypeScript build errors
- ✅ Add bundle optimization (code splitting)

**Files Created**:
- ✅ `src/stores/authStore.ts` - User authentication state
- ✅ `src/components/AuthModal.vue` - Login/signup modal
- ✅ `src/services/appwrite.ts` - Complete Appwrite SDK integration

**Files Modified**:
- ✅ `src/views/EditorView.vue` - Wire up save button with auth check
- ✅ `src/views/HomeView.vue` - Added projects list and auth UI
- ✅ `src/stores/projectStore.ts` - Implemented all API calls
- ✅ `src/App.vue` - Auth initialization on mount
- ✅ `vite.config.ts` - Added code splitting for better performance

**Production Deployment**:
- ✅ Repository: https://github.com/jimmyfnc/project-icarus
- ✅ Deployed to Appwrite Sites
- ✅ Environment variables configured
- ✅ Successfully tested cloud save/load

### 5. Add Asset Upload System
**Status**: Storage service ready, no UI
**Priority**: MEDIUM
**Effort**: 3-4 hours

**Tasks**:
- [ ] Create asset manager component
- [ ] File upload interface (drag & drop)
- [ ] Preview uploaded sprites
- [ ] Use uploaded sprites in Spawn node
- [ ] Audio file upload
- [ ] Delete assets
- [ ] Asset library view

**Files to Create**:
- `src/components/AssetManager.vue` - Asset library UI
- `src/components/AssetUpload.vue` - Upload interface

**Files to Modify**:
- `src/runtime/GameScene.ts` - Load assets from Appwrite
- `src/components/PropertiesPanel.vue` - Show uploaded assets in sprite selector

### 6. Improve Node Execution Flow
**Status**: Basic execution only
**Priority**: MEDIUM
**Effort**: 2-3 hours

**Current Issues**:
- Event nodes execute every frame (inefficient)
- Key events don't have proper "pressed this frame" logic
- Timer nodes don't clean up properly

**Tasks**:
- [ ] Add execution state (executed this frame)
- [ ] Implement proper key press detection (down vs held)
- [ ] Fix timer nodes to track last execution
- [ ] Add "once" flag for one-time events
- [ ] Optimize execution to skip unchanged branches

**Files to Modify**:
- `src/runtime/GraphExecutor.ts` - Add execution state
- `src/runtime/nodes/events.ts` - Fix key detection
- `src/runtime/GameScene.ts` - Add input manager

### 7. Add Visual Feedback & Debugging
**Status**: None
**Priority**: MEDIUM
**Effort**: 2-3 hours

**Tasks**:
- [ ] Highlight executing nodes in real-time
- [ ] Show variable values during runtime
- [ ] Display entity positions overlay
- [ ] Console output node for debugging
- [ ] Error highlighting for broken nodes
- [ ] Execution step-through (pause/step)

**Files to Create**:
- `src/components/DebugPanel.vue` - Debug info display

**Files to Modify**:
- `src/runtime/GraphExecutor.ts` - Emit execution events
- `src/components/GraphCanvas.vue` - Highlight executing nodes

## 🟢 Nice to Have (Polish & Features)

### 8. Add More Node Types
**Priority**: LOW
**Effort**: 1-2 hours each

**Audio Nodes**:
- [ ] PlaySound (with volume, loop)
- [ ] StopSound
- [ ] PlayMusic
- [ ] SetVolume

**UI Nodes**:
- [ ] ShowText (display text on screen)
- [ ] ShowScore
- [ ] Button (clickable UI element)
- [ ] Health Bar

**Advanced Movement**:
- [ ] LookAt (rotate towards target)
- [ ] Follow (follow another entity)
- [ ] Patrol (move between waypoints)
- [ ] Platformer Controller (complete movement)

**Math Nodes**:
- [ ] Add, Subtract, Multiply, Divide
- [ ] Random (random number)
- [ ] Clamp (limit value)

**Time Nodes**:
- [ ] Delay (wait N seconds)
- [ ] Sequence (execute nodes in order with delays)

**Files to Create**:
- `src/runtime/nodes/audio.ts`
- `src/runtime/nodes/ui.ts`
- `src/runtime/nodes/math.ts`
- `src/runtime/nodes/time.ts`

### 9. Improve Editor UX
**Priority**: LOW
**Effort**: 4-5 hours

**Tasks**:
- [ ] Undo/redo system
- [ ] Copy/paste nodes
- [ ] Multi-select nodes
- [ ] Align nodes (distribute, align)
- [ ] Node search/filter
- [ ] Minimap improvements
- [ ] Keyboard shortcuts
- [ ] Node comments/notes
- [ ] Color-code wires by type
- [ ] Bezier curves for edges

**Files to Modify**:
- `src/stores/editorStore.ts` - Add history
- `src/components/GraphCanvas.vue` - Add shortcuts
- `src/components/NodePalette.vue` - Add search

### 10. Add More Templates
**Priority**: LOW
**Effort**: 1-2 hours each

**Games to Add**:
- [ ] Snake game
- [ ] Pong/Breakout
- [ ] Space Shooter
- [ ] Tower Defense (basic)
- [ ] Endless Runner
- [ ] Match-3 puzzle

**Files to Create**:
- `src/templates/snake.json`
- `src/templates/pong.json`
- `src/templates/shooter.json`
- etc.

### 11. Improve Play Mode
**Priority**: LOW
**Effort**: 2-3 hours

**Tasks**:
- [ ] Fullscreen mode
- [ ] Restart button
- [ ] Share button (copy link)
- [ ] Embed code generator
- [ ] Mobile touch controls
- [ ] Gamepad support
- [ ] Leaderboard integration
- [ ] Comments section

**Files to Modify**:
- `src/views/PlayView.vue` - Add controls
- `src/runtime/GameScene.ts` - Add input methods

### 12. Add Export Functionality
**Priority**: LOW
**Effort**: 3-4 hours

**Tasks**:
- [ ] Export to standalone HTML file
- [ ] Export to JSON (download graph)
- [ ] Import JSON graph
- [ ] Export to PNG (screenshot)
- [ ] Export to GIF (recording)
- [ ] Package as executable (Electron)

**Files to Create**:
- `src/utils/export.ts` - Export functions

## 🔧 Technical Debt & Improvements

### 13. Add Testing
**Priority**: MEDIUM
**Effort**: 8-10 hours

**Tasks**:
- [ ] Set up Vitest
- [ ] Unit tests for node executors
- [ ] Integration tests for graph execution
- [ ] Component tests for Vue components
- [ ] E2E tests with Playwright
- [ ] Test coverage reporting

**Files to Create**:
- `vitest.config.ts`
- `tests/unit/nodes/*.test.ts`
- `tests/integration/executor.test.ts`
- `tests/e2e/editor.spec.ts`

### 14. Performance Optimization
**Priority**: LOW
**Effort**: 2-3 hours

**Tasks**:
- [ ] Memoize node execution results
- [ ] Use Web Workers for graph execution
- [ ] Lazy load node definitions
- [ ] Virtual scrolling for large graphs
- [ ] Debounce graph updates
- [ ] Profile and optimize hot paths

**Files to Modify**:
- `src/runtime/GraphExecutor.ts`
- `src/components/GraphCanvas.vue`

### 15. Error Handling & Validation
**Priority**: MEDIUM
**Effort**: 2-3 hours

**Tasks**:
- [ ] Validate graph before execution
- [ ] Check for circular dependencies
- [ ] Warn on disconnected nodes
- [ ] Type checking for connections
- [ ] Better error messages
- [ ] Error recovery (continue on error)

**Files to Modify**:
- `src/runtime/GraphExecutor.ts` - Add validation
- `src/stores/editorStore.ts` - Validate on add edge

### 16. Documentation Improvements
**Priority**: LOW
**Effort**: 2-3 hours

**Tasks**:
- [ ] Video tutorial (YouTube)
- [ ] Interactive tutorial in-app
- [ ] Node reference documentation
- [ ] API documentation (JSDoc)
- [ ] Example gallery
- [ ] FAQ section

**Files to Create**:
- `docs/tutorial.md`
- `docs/node-reference.md`
- `docs/api.md`

### 17. Accessibility
**Priority**: LOW
**Effort**: 2-3 hours

**Tasks**:
- [ ] Keyboard navigation for canvas
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Font size options
- [ ] ARIA labels
- [ ] Focus indicators

**Files to Modify**:
- All Vue components

### 18. Mobile Support
**Priority**: LOW
**Effort**: 4-5 hours

**Tasks**:
- [ ] Touch-friendly node editing
- [ ] Mobile-optimized layout
- [ ] Responsive design improvements
- [ ] Touch gestures (pinch to zoom)
- [ ] Mobile preview mode
- [ ] PWA support

**Files to Modify**:
- `src/components/GraphCanvas.vue`
- `src/views/EditorView.vue`
- Add `manifest.json`

## 📊 Priority Matrix

### Do First (This Week)
1. Fix collision detection ⭐⭐⭐
2. Implement physics body config ⭐⭐⭐
3. Fix entity reference system ⭐⭐⭐
4. Wire up save/load UI ⭐⭐

### Do Next (Next Week)
5. Add asset upload system ⭐⭐
6. Improve node execution flow ⭐⭐
7. Add visual feedback ⭐⭐
8. Error handling & validation ⭐⭐

### Do Later (Month 2)
9. Add more node types ⭐
10. Improve editor UX ⭐
11. Add more templates ⭐
12. Testing suite ⭐

### Future Roadmap
13. Performance optimization
14. Mobile support
15. Export functionality
16. Documentation improvements

## 🎯 Suggested Implementation Order

### Week 1: Core Functionality
```
Day 1-2: Collision detection + Physics bodies
Day 3: Entity reference system
Day 4-5: Save/Load UI + Auth
Day 6-7: Testing & bug fixes
```

### Week 2: Enhanced Features
```
Day 1-2: Asset upload system
Day 3: Node execution improvements
Day 4-5: Visual feedback & debugging
Day 6-7: Error handling
```

### Week 3: Content & Polish
```
Day 1-3: Add 5-10 new node types
Day 4-5: Create 3-4 new templates
Day 6-7: Editor UX improvements
```

### Week 4: Production Ready
```
Day 1-2: Performance optimization
Day 3-4: Mobile responsiveness
Day 5: Testing & QA
Day 6-7: Documentation & deployment
```

## 📝 Notes

### Quick Wins (< 1 hour each)
- Add console.log node for debugging
- Add random number node
- Add delay node
- Fix template loading in HomeView
- Add keyboard shortcut for play/stop
- Add project name in header
- Add "New Project" button in editor

### Known Bugs to Fix
- [ ] Phaser game not resizing properly
- [ ] Node position not saving correctly
- [ ] Edge deletion sometimes doesn't work
- [ ] Properties panel not updating on node change
- [ ] Template images (bird, player) need proper sprites

### Feature Requests from Users
- Multiplayer support (complex, 2-3 weeks)
- Visual scripting for shaders (complex, 1-2 weeks)
- Timeline/animation editor (complex, 1-2 weeks)
- AI behavior trees (medium, 3-5 days)
- Particle system (medium, 2-3 days)

## 🚀 MVP+ (Hackathon Polish)

If you only have time for hackathon submission, focus on these:

### Must Have (8 hours)
1. ✅ Fix collision detection (3 hours)
2. ✅ Fix physics bodies (2 hours)
3. ✅ Wire up save button (2 hours)
4. ✅ Fix known bugs (1 hour)

### Should Have (4 hours)
5. ✅ Add 2-3 audio nodes (1 hour)
6. ✅ Add visual debugging (1 hour)
7. ✅ Add one more template (1 hour)
8. ✅ Polish UI (1 hour)

### Could Have (2 hours)
9. ✅ Add export to HTML (1 hour)
10. ✅ Record demo video (1 hour)

## 📦 Production Checklist

Before deploying to production:
- [ ] All critical issues fixed
- [ ] Save/load working with Appwrite
- [ ] At least 3 working templates
- [ ] Basic error handling in place
- [ ] No console errors
- [ ] Mobile-responsive
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] Privacy policy & terms (if collecting data)
- [ ] Analytics set up
- [ ] SEO optimized
- [ ] Social media cards

## 💡 Tips

- **Start small**: Fix collision first, everything else builds on it
- **Test often**: Run preview after every change
- **Use templates**: Test fixes with existing templates
- **Document as you go**: Update docs when adding features
- **Get feedback**: Share with friends early

## 🤝 Community Contributions

If this becomes open source, here are good first issues:
- Add a new simple node (PlaySound)
- Create a new template game
- Improve error messages
- Add keyboard shortcuts
- Fix specific bugs
- Write documentation

Good luck building! 🚀
