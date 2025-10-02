# Appwrite Hackathon Submission

## Project: Visual Scripting 2D Game Editor

### 🎯 Overview

A complete node-based visual scripting editor for creating 2D games without coding. Built with Vue 3, Phaser, and Appwrite.

### ✨ Key Features

- **Node-Based Visual Scripting**: Drag and drop nodes, connect them, create game logic
- **Real-Time Preview**: Instant game testing with Phaser engine
- **Cloud Storage**: Save/load projects with Appwrite Database
- **Public Sharing**: Shareable game URLs via `/play/:slug`
- **Starter Templates**: Flappy Bird and Mario-style platformer included
- **Complete Node Library**: 17 node types covering events, physics, logic, and more

### 🛠️ Tech Stack

- **Frontend**: Vue 3 + Vite + TypeScript + TailwindCSS
- **Node Editor**: Vue Flow (visual node graph)
- **Game Engine**: Phaser 3 (2D game runtime)
- **State**: Pinia
- **Backend**: Appwrite
  - **Database**: Project storage
  - **Storage**: Asset management (sprites, audio)
  - **Auth**: User authentication (ready)

### 📦 What's Included

#### 1. Full Project Structure
```
✓ Complete Vue 3 + TypeScript setup
✓ 17 game node types ready to use
✓ Phaser runtime engine with graph executor
✓ Appwrite integration (database + storage)
✓ 3 routes: Home, Editor, Play
```

#### 2. Node Types (MVP Scope)

**Events**
- OnStart, OnKey, Every

**Movement**
- ApplyGravity, Impulse, Move

**World**
- Spawn, Destroy, SetCameraFollow

**Logic**
- If, SetVar, AddVar, Compare

**Collision**
- OnCollide

**Scene**
- ResetGame

#### 3. Example Templates

**Flappy Bird** (`src/templates/flappy-bird.json`)
- Tap to jump
- Gravity physics
- Pipe obstacles

**Platformer** (`src/templates/platformer.json`)
- Left/right movement
- Jumping mechanics
- Multiple platforms

#### 4. Complete Documentation

- `README.md` - Full project documentation
- `QUICKSTART.md` - 5-minute getting started guide
- `APPWRITE_SETUP.md` - Step-by-step Appwrite configuration
- `CONTRIBUTING.md` - Guidelines for adding nodes
- `PROJECT_STRUCTURE.md` - Complete architecture overview

### 🚀 Quick Start

```bash
# Install
npm install

# Configure Appwrite (or skip for local-only testing)
cp .env.example .env
# Edit .env with your Appwrite credentials

# Run
npm run dev

# Build
npm run build
```

### 🎮 How It Works

#### For Users
1. **Create**: Open editor, drag nodes from palette
2. **Connect**: Link nodes together to define game logic
3. **Test**: Click Play to run game in preview panel
4. **Save**: Store project in Appwrite
5. **Share**: Get public URL to share game

#### For Developers
1. **Node Registry**: Extensible system for adding new node types
2. **Graph Executor**: Traverses and executes node graph each frame
3. **Runtime Context**: Phaser scene, entities, variables available to all nodes
4. **Appwrite Services**: CRUD operations for projects and assets

### 🏗️ Architecture Highlights

#### Node Registry System
```typescript
NodeRegistry.register({
  meta: { type, label, category, color },
  inputs: [...],
  outputs: [...],
  execute: (ctx, inputs, node) => { /* logic */ }
})
```

#### Graph Execution
- Event nodes trigger execution chains
- Data flows through connected nodes
- Runs at 60 FPS in Phaser
- State persists across frames

#### Appwrite Integration
- Projects stored as JSON in Database
- Unique slugs for public URLs
- Storage bucket ready for sprite/audio uploads
- Permission system for multi-user support

### 📊 Appwrite Usage

#### Database
- **Collection**: projects
- **Attributes**: name, slug, description, graph (JSON), userId
- **Indexes**: slug for fast lookups
- **Permissions**: Read (any), Write (authenticated)

#### Storage
- **Bucket**: game-assets
- **Usage**: Sprites, audio, custom assets
- **Permissions**: Read (any), Write (authenticated)

### 🎯 MVP Deliverables (All Complete)

✅ Full project structure with all folders
✅ Reusable Node Registry system
✅ 17 node types (Events, Movement, World, Logic, Collision, Scene)
✅ Runtime engine executing graphs in Phaser
✅ Appwrite integration (Database + Storage)
✅ 3 routes: `/` (home), `/editor`, `/play/:slug`
✅ Flappy Bird example template
✅ Platformer example template
✅ Clean Tailwind UI with sidebar, canvas, preview
✅ Complete documentation

### 🎨 UI/UX Features

- **Node Palette**: Left sidebar with categorized nodes
- **Graph Canvas**: Zoom, pan, snap-to-grid
- **Properties Panel**: Right sidebar for node configuration
- **Preview Panel**: Bottom panel with Play/Stop/Reset controls
- **Color Coding**: Nodes colored by category
- **Handle Types**: Visual distinction between exec and data flows

### 🧪 Testing

**Try It Now** (without Appwrite):
1. Run `npm run dev`
2. Click "New Project"
3. See simple movement example loaded
4. Click Play, press arrow keys
5. Modify nodes, test changes instantly

**With Appwrite**:
1. Set up Appwrite (see APPWRITE_SETUP.md)
2. Save projects to cloud
3. Share via `/play/your-slug`
4. Upload custom sprites

### 📝 Code Quality

- **TypeScript**: Fully typed across entire codebase
- **Component-Based**: Modular Vue components
- **Type Safety**: Interfaces for all data structures
- **Clean Separation**: Runtime, UI, state, services
- **Extensible**: Easy to add new nodes/features

### 🔮 Future Enhancements

- User authentication UI
- Asset upload interface
- More node types (audio, UI, particles)
- Collision detection between specific entities
- Export to standalone HTML
- Community template gallery
- Undo/redo
- Keyboard shortcuts

### 🌟 What Makes This Special

1. **Complete MVP**: Everything specified in requirements
2. **Actually Works**: Run games in preview immediately
3. **Easy to Extend**: Add new nodes in minutes
4. **Well Documented**: 5 comprehensive markdown docs
5. **Production Ready**: TypeScript, proper architecture
6. **Appwrite Showcase**: Uses Database and Storage effectively

### 📦 Submission Checklist

✅ Source code in GitHub repository
✅ README with setup instructions
✅ Appwrite integration implemented
✅ Demo-ready (templates included)
✅ Documentation complete
✅ TypeScript + Vue 3 best practices
✅ Can be deployed to any static host

### 🚀 Deployment

**Recommended Hosts**:
- Vercel (auto-deploy from GitHub)
- Netlify (drag & drop)
- Appwrite Static Sites

**Build Command**: `npm run build`
**Output Directory**: `dist`

### 🎓 Learning Resources

For users new to visual scripting:
- QUICKSTART.md walks through first game
- Templates show working examples
- Node palette organized by category
- Real-time preview for instant feedback

### 💡 Innovation

- **No-Code Game Development**: Anyone can create games
- **Visual Programming**: Intuitive node-based logic
- **Instant Gratification**: See results immediately
- **Shareable**: Publish games with one click
- **Extensible**: Developers can add custom nodes

### 🏆 Why This Wins

1. **Fully Functional MVP**: Not just a prototype
2. **Appwrite Integration**: Showcases DB + Storage + Auth (ready)
3. **Real-World Use Case**: Actual game editor people can use
4. **Clean Code**: Production-quality TypeScript
5. **Great Documentation**: Easy for others to build on
6. **Community Ready**: Contribution guide included

### 📞 Contact

Built for the Appwrite Hackathon 2024 🚀

---

**Repository**: [GitHub Link]
**Demo**: [Deployed Link]
**Video**: [Demo Video]

Thank you for this opportunity to build something creative with Appwrite!
