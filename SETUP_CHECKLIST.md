# Setup Checklist

Quick reference for getting your Visual Scripting Game Editor running.

## ✅ Pre-Deployment Checklist

### 1. Dependencies Installed
```bash
npm install
```

**Expected packages**:
- ✓ Vue 3
- ✓ Vite
- ✓ TypeScript
- ✓ TailwindCSS
- ✓ Pinia
- ✓ Vue Router
- ✓ Vue Flow
- ✓ Phaser
- ✓ Appwrite SDK

### 2. Environment Variables (Optional for local testing)

**Option A: Local Testing Only (No Save/Load)**
- Skip this step
- Editor works without Appwrite
- Projects won't persist between sessions

**Option B: Full Appwrite Integration**
```bash
cp .env.example .env
```

Edit `.env` with your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PROJECTS_COLLECTION_ID=your_collection_id
VITE_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id
```

See [APPWRITE_SETUP.md](APPWRITE_SETUP.md) for detailed instructions.

### 3. Development Server

```bash
npm run dev
```

**Verify**:
- ✓ Server starts on http://localhost:5173
- ✓ No errors in terminal
- ✓ No errors in browser console
- ✓ Home page loads

### 4. Test Basic Functionality

**Without Appwrite**:
1. Click "New Project"
2. Enter a name
3. See movement example loaded
4. Click "Play" in preview
5. Press LEFT/RIGHT arrows
6. Player moves

**With Appwrite** (after setup):
1. Click "Save" in editor
2. Check Appwrite console for new document
3. Reload page
4. Project should persist

### 5. Test Templates

**Flappy Bird**:
1. Go to home page
2. Click "Flappy Bird" card
3. See graph loaded with bird nodes
4. Click "Play"
5. Press SPACE to jump
6. Bird should bounce up

**Platformer**:
1. Go to home page
2. Click "Platformer" card
3. See graph loaded with player + platforms
4. Click "Play"
5. Use arrow keys (LEFT/RIGHT/UP)
6. Player should move and jump

### 6. Build for Production

```bash
npm run build
```

**Verify**:
- ✓ Build completes without errors
- ✓ `dist/` folder created
- ✓ Contains `index.html` and `assets/`

### 7. Preview Production Build

```bash
npm run preview
```

**Verify**:
- ✓ Production build runs
- ✓ All features work as in dev mode

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**:
```bash
npm run build
```
Check console for specific errors. Most common:
- Missing type definitions
- Incorrect imports
- Path alias issues

### Issue: Appwrite connection errors

**Check**:
1. Is `.env` file present?
2. Are all IDs correct?
3. Is Appwrite project accessible?
4. Are CORS settings correct in Appwrite?

**Fix**:
- Go to Appwrite Console > Project Settings > Platforms
- Add Web Platform with your URL: `http://localhost:5173`

### Issue: Nodes not appearing in palette

**Check**:
1. Are nodes imported in `src/runtime/nodes/index.ts`?
2. Is `import '@/runtime/nodes'` in `src/main.ts`?
3. Clear browser cache and reload

### Issue: Game preview not working

**Check**:
1. Browser console for errors
2. Is graph valid (nodes connected properly)?
3. Are entity IDs matching between nodes?
4. Click "Reset" then "Play" again

### Issue: Tailwind styles not applying

**Solution**:
```bash
npm run dev
```
Ensure `src/style.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📋 File Checklist

Make sure these files exist:

### Configuration
- ✓ `package.json`
- ✓ `tsconfig.json`
- ✓ `vite.config.ts`
- ✓ `tailwind.config.js`
- ✓ `postcss.config.js`

### Source Files
- ✓ `src/main.ts`
- ✓ `src/App.vue`
- ✓ `src/style.css`

### Types
- ✓ `src/types/graph.ts`
- ✓ `src/types/runtime.ts`
- ✓ `src/types/appwrite.ts`

### Runtime
- ✓ `src/runtime/NodeRegistry.ts`
- ✓ `src/runtime/GraphExecutor.ts`
- ✓ `src/runtime/GameScene.ts`
- ✓ `src/runtime/PhaserGame.ts`
- ✓ `src/runtime/nodes/` (6 files)

### Components
- ✓ `src/components/` (5 Vue files)

### Views
- ✓ `src/views/` (3 Vue files)

### Stores
- ✓ `src/stores/` (2 files)

### Appwrite
- ✓ `src/appwrite/` (2 files)

### Templates
- ✓ `src/templates/` (2 JSON files)

## 🚀 Deployment Checklist

### Vercel
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables
5. Deploy

### Netlify
1. Connect GitHub repo or drag `dist` folder
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

### Appwrite Static Sites
1. Run `npm run build`
2. Upload `dist` folder to Appwrite Storage
3. Configure as static site
4. Done

### Post-Deployment
- ✓ Update Appwrite Platform settings with production URL
- ✓ Test all features on live site
- ✓ Share `/play/:slug` URLs work
- ✓ No console errors

## ✨ Feature Checklist

### Core Features
- ✓ Node palette with all node types
- ✓ Drag and drop nodes
- ✓ Connect nodes with edges
- ✓ Edit node properties
- ✓ Delete nodes
- ✓ Zoom/pan canvas
- ✓ Real-time preview
- ✓ Play/Stop/Reset controls

### Node Types Working
- ✓ OnStart
- ✓ OnKey (all keys)
- ✓ Every (timer)
- ✓ Spawn
- ✓ Destroy
- ✓ ApplyGravity
- ✓ Impulse
- ✓ Move
- ✓ SetCameraFollow
- ✓ If
- ✓ SetVar
- ✓ AddVar
- ✓ Compare
- ✓ OnCollide
- ✓ ResetGame

### Templates Working
- ✓ Flappy Bird loads
- ✓ Flappy Bird plays
- ✓ Platformer loads
- ✓ Platformer plays

### Appwrite Integration
- ✓ Can save projects
- ✓ Can load projects
- ✓ Can list projects
- ✓ Can delete projects
- ✓ Public play mode works
- ✓ Storage bucket ready

## 📝 Documentation Checklist

- ✓ README.md (main docs)
- ✓ QUICKSTART.md (getting started)
- ✓ APPWRITE_SETUP.md (backend config)
- ✓ CONTRIBUTING.md (dev guide)
- ✓ PROJECT_STRUCTURE.md (architecture)
- ✓ HACKATHON_SUBMISSION.md (submission info)
- ✓ SETUP_CHECKLIST.md (this file)

## 🎯 Next Steps

After setup:
1. Read QUICKSTART.md
2. Try creating a simple game
3. Test both templates
4. Customize nodes
5. Build and deploy!

## 💡 Tips

- **Save Often**: Use "Save" button frequently (if Appwrite configured)
- **Test Incrementally**: Test after adding each node
- **Use Templates**: Start from templates to learn
- **Check Console**: Browser console shows useful errors
- **Read Docs**: All questions answered in docs folder

## ✅ Ready to Submit

Before submitting to hackathon:
- ✓ All features working
- ✓ Tests completed
- ✓ Documentation complete
- ✓ Deployed live
- ✓ Demo video recorded
- ✓ GitHub repo public

Good luck! 🚀
