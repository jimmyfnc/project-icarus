# Quick Start Guide

Get your visual scripting game editor running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start development server
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

## Your First Game (Without Appwrite)

You can start using the editor immediately without setting up Appwrite! The save/load features won't work, but you can create and test games in the preview.

### Create a Simple Game

1. Click **"New Project"** on the home screen
2. Enter a name (e.g., "My First Game")
3. You'll see a simple movement example loaded

### Test the Example

1. Look at the preview panel at the bottom
2. Click **"Play"** button
3. Press **LEFT** and **RIGHT** arrow keys
4. The blue square (player) should move!

### Modify the Example

1. Click on the **"Move Right"** node in the canvas
2. In the right sidebar (Properties), change **Velocity X** to `300`
3. Click **"Reset"** then **"Play"** again
4. The player now moves faster!

## Create a Flappy Bird Clone

1. Go back to the home screen (click **"← Back"**)
2. Click **"Flappy Bird"** template
3. Click **"Play"** in the preview
4. Press **SPACE** to make the bird jump!

### How It Works

- **On Start**: Spawns the bird and applies gravity
- **On Space Key**: When you press space, it applies an upward impulse (jump)
- **Every 2s**: Spawns pipes that move left

## Create a Platformer

1. Load the **"Platformer"** template
2. Click **"Play"**
3. Use **LEFT/RIGHT** arrows to move
4. Press **UP** to jump

## Understanding Nodes

### Event Nodes (Red)
These trigger when something happens:
- **On Start**: Runs once when game starts
- **On Key**: Runs when a key is pressed
- **Every**: Runs repeatedly (like a timer)

### Movement Nodes (Blue)
Control physics and movement:
- **Apply Gravity**: Makes things fall down
- **Impulse**: Instant push (good for jumping)
- **Move**: Continuous movement (good for walking)

### World Nodes (Green)
Create and manage game objects:
- **Spawn**: Creates a new sprite
- **Destroy**: Removes a sprite
- **Set Camera Follow**: Camera follows a sprite

### Logic Nodes (Orange)
Decisions and variables:
- **If**: Choose different paths based on condition
- **Set Variable**: Store a value (like score)
- **Compare**: Check if values are equal, greater, etc.

## Building Your Own Game

### Example: Add Jumping to Movement Example

1. Start with the movement example (or create new project)
2. From the left sidebar, click **"On Key"** under Events
3. In Properties, set **Key** to `UP`
4. From the sidebar, click **"Impulse"** under Movement
5. In Properties:
   - **Entity ID**: `player`
   - **Velocity X**: `0`
   - **Velocity Y**: `-400` (negative = up)
6. Connect the nodes:
   - Drag from the white circle on right of "On Key (UP)"
   - To the white circle on left of "Impulse"
7. Add gravity so player falls back down:
   - Click **"Apply Gravity"** from sidebar
   - Set **Entity ID**: `player`
   - Set **Gravity**: `800`
   - Connect from "Spawn Player" → "Apply Gravity"
8. Click **"Reset"** then **"Play"**
9. Press **UP** to jump!

## Tips

### Node Connection Rules
- **White circles** = Execution flow (when things happen)
- **Colored circles** = Data (passing values between nodes)
- Connect output (right side) to input (left side)
- Execution flows from left to right

### Entity IDs
- When you spawn something, give it an **Entity ID** (like "player", "enemy1")
- Use the same ID in other nodes to control that entity
- Think of it like a name tag

### Common Issues

**Player won't move:**
- Check Entity ID matches in Spawn and Move nodes
- Make sure nodes are connected with white exec line
- Click Reset and Play again

**Can't connect nodes:**
- You can only connect matching handle types
- Exec (white) connects to exec
- Data handles must match types (number, string, etc.)

**Game runs too fast/slow:**
- Adjust velocity values in Move/Impulse nodes
- Change gravity value in Apply Gravity node
- Tweak interval in Every node

## Next Steps

1. **Set up Appwrite** (optional, for save/load): See [APPWRITE_SETUP.md](APPWRITE_SETUP.md)
2. **Add more nodes**: Create enemies, obstacles, scoring
3. **Experiment**: Try different combinations!
4. **Share**: Deploy and share your game URL

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Look at the template JSON files in `src/templates/` for examples
- Experiment! The preview lets you test instantly

## Common Recipes

### Score Counter
1. Use **Set Variable** (varName: "score", value: 0) at start
2. Use **Add Variable** (varName: "score", value: 1) when points scored
3. Connect from collision or timer event

### Endless Runner
1. Spawn ground platform
2. Use **Every** (2000ms) to spawn obstacles
3. Use **Move** to move obstacles left (dx: -200)
4. Player stays in place or moves right slowly

### Collision Detection
1. Spawn two entities with different IDs
2. Add **On Collide** node
3. Connect to **Reset Game** or **Destroy** node

Happy game making! 🎮
