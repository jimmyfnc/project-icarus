# 📱 Touch Controls Documentation

## Overview

The Project Icarus game engine now includes comprehensive touch/mobile control support, allowing all games to be played on tablets and smartphones. The touch control system works alongside existing keyboard controls without conflict, providing a seamless experience across all devices.

## Table of Contents

1. [Touch System Architecture](#touch-system-architecture)
2. [Touch Event Nodes](#touch-event-nodes)
3. [Touch Zones](#touch-zones)
4. [Implementation Guide](#implementation-guide)
5. [Template Examples](#template-examples)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)

---

## Touch System Architecture

### Components

The touch control system consists of three main components:

1. **Touch Input Manager** (`src/runtime/GameScene.ts`)
   - Tracks pointer events (down, move, up)
   - Maintains touch state across frames
   - Detects 9 predefined screen zones
   - Calculates swipe gestures

2. **Touch Event Nodes** (`src/runtime/nodes/events.ts`)
   - OnTouch: Universal tap detection
   - OnTouchArea: Zone-based virtual buttons
   - OnSwipe: Swipe gesture detection

3. **Properties Panel UI** (`src/components/PropertiesPanel.vue`)
   - Configuration interface for touch nodes
   - Zone selection, mode selection, direction selection

### How It Works

1. Phaser's pointer events are captured in `GameScene`
2. Touch state is tracked frame-by-frame (similar to keyboard input)
3. Touch event nodes query the touch state during graph execution
4. Actions trigger based on touch input, just like keyboard input

---

## Touch Event Nodes

### 1. OnTouch

**Description**: Detects tap anywhere on the screen.

**Use Cases**: 
- Flappy Bird jump
- Simple tap-to-action games
- Universal "any touch" detection

**Properties**:
- `mode`: 
  - `press` - Fires once when tapped (default)
  - `hold` - Fires continuously while touching

**Outputs**:
- `exec` - Execution output
- `x` - Touch X coordinate
- `y` - Touch Y coordinate

**Example**:
```
OnTouch (mode: press) → Jump
```

---

### 2. OnTouchArea

**Description**: Detects touch in specific screen zones (virtual buttons/D-pad).

**Use Cases**:
- Platformer movement (left/right zones)
- Shooter controls (left/right for move, top for shoot)
- Any game needing virtual buttons

**Properties**:
- `zone`:
  - `left` - Left third of screen
  - `right` - Right third of screen
  - `top` - Top third of screen
  - `bottom` - Bottom third of screen
  - `center` - Center of screen
  - `topleft`, `topright`, `bottomleft`, `bottomright` - Corner zones
- `mode`:
  - `press` - Fires once when zone is tapped
  - `hold` - Fires continuously while zone is touched

**Outputs**:
- `exec` - Execution output
- `x` - Touch X coordinate
- `y` - Touch Y coordinate

**Example**:
```
OnTouchArea (zone: left, mode: hold) → Move Left
OnTouchArea (zone: right, mode: hold) → Move Right
OnTouchArea (zone: top, mode: press) → Jump
```

---

### 3. OnSwipe

**Description**: Detects swipe gestures in specific directions.

**Use Cases**:
- Quick movements
- Special actions (swipe up to boost)
- Gesture-based controls

**Properties**:
- `direction`:
  - `any` - Any swipe direction (default)
  - `up` - Swipe up
  - `down` - Swipe down
  - `left` - Swipe left
  - `right` - Swipe right

**Minimum Swipe Distance**: 50 pixels

**Outputs**:
- `exec` - Execution output
- `direction` - Detected swipe direction (string)

**Example**:
```
OnSwipe (direction: up) → Boost
OnSwipe (direction: any) → Dash in detected direction
```

---

## Touch Zones

The screen is divided into a **3×3 grid** of touch zones:

```
┌─────────┬─────────┬─────────┐
│ TOP-    │   TOP   │ TOP-    │
│ LEFT    │         │ RIGHT   │
│         │         │         │
├─────────┼─────────┼─────────┤
│  LEFT   │ CENTER  │  RIGHT  │
│         │         │         │
│         │         │         │
├─────────┼─────────┼─────────┤
│BOTTOM-  │ BOTTOM  │BOTTOM-  │
│LEFT     │         │RIGHT    │
│         │         │         │
└─────────┴─────────┴─────────┘
```

### Zone Specifications

- **Game Resolution**: 800×600 pixels
- **Zone Size**: Each zone is approximately 267×200 pixels
- **Zone Names**: `left`, `right`, `top`, `bottom`, `center`, `topleft`, `topright`, `bottomleft`, `bottomright`

### Recommended Zones for Common Actions

| Action | Recommended Zone | Mode |
|--------|------------------|------|
| Move Left | `left` | `hold` |
| Move Right | `right` | `hold` |
| Jump | `top` or `center` | `press` |
| Shoot | `top` | `press` |
| Attack | `center` | `press` |
| Special Move | `bottom` | `press` |

---

## Implementation Guide

### Adding Touch Controls to a Game

#### Step 1: Identify Input Actions

List all keyboard inputs in your game:
- Movement (LEFT/RIGHT arrows)
- Jump/Fly (UP arrow or SPACE)
- Shoot/Attack (SPACE)

#### Step 2: Add Touch Nodes

For each keyboard input, add an equivalent touch node:

**Example: Platformer Game**

1. **Left Movement**:
   - Add `OnTouchArea` node
   - Set zone to `left`
   - Set mode to `hold`
   - Connect to same `Move Left` action as LEFT arrow key

2. **Right Movement**:
   - Add `OnTouchArea` node
   - Set zone to `right`
   - Set mode to `hold`
   - Connect to same `Move Right` action as RIGHT arrow key

3. **Jump**:
   - Add `OnTouchArea` node
   - Set zone to `top`
   - Set mode to `press`
   - Connect to same `Jump` action as UP arrow key

#### Step 3: Test Both Input Methods

- Test keyboard controls (should work as before)
- Test touch controls (should work identically)
- Verify both can work simultaneously

---

## Template Examples

### Flappy Bird

**Controls**:
- **Keyboard**: SPACE to jump
- **Touch**: Tap anywhere to jump

**Implementation**:
```json
{
  "id": "on_space",
  "type": "OnKey",
  "properties": { "key": "SPACE" }
}
{
  "id": "on_touch_jump",
  "type": "OnTouch",
  "properties": { "mode": "press" }
}
```

Both nodes connect to the same `Jump` action.

---

### Space Shooter

**Controls**:
- **Keyboard**: LEFT/RIGHT arrows to move, SPACE to shoot
- **Touch**: Left/Right zones to move, Top zone to shoot

**Implementation**:
```json
// Move Left
{ "id": "on_left", "type": "OnKey", "properties": { "key": "LEFT" } }
{ "id": "on_touch_left", "type": "OnTouchArea", "properties": { "zone": "left", "mode": "hold" } }

// Move Right
{ "id": "on_right", "type": "OnKey", "properties": { "key": "RIGHT" } }
{ "id": "on_touch_right", "type": "OnTouchArea", "properties": { "zone": "right", "mode": "hold" } }

// Shoot
{ "id": "on_space", "type": "OnKey", "properties": { "key": "SPACE" } }
{ "id": "on_touch_shoot", "type": "OnTouchArea", "properties": { "zone": "top", "mode": "press" } }
```

---

### Platformer

**Controls**:
- **Keyboard**: LEFT/RIGHT arrows to move, UP arrow to jump
- **Touch**: Left/Right zones to move, Top zone to jump

**Implementation**: Same as Space Shooter, but with jump instead of shoot.

---

### Breakout

**Controls**:
- **Keyboard**: LEFT/RIGHT arrows to move paddle
- **Touch**: Left/Right zones to move paddle

**Implementation**:
```json
{ "id": "on_left", "type": "OnKey", "properties": { "key": "LEFT" } }
{ "id": "on_touch_left", "type": "OnTouchArea", "properties": { "zone": "left", "mode": "hold" } }

{ "id": "on_right", "type": "OnKey", "properties": { "key": "RIGHT" } }
{ "id": "on_touch_right", "type": "OnTouchArea", "properties": { "zone": "right", "mode": "hold" } }
```

---

### Tank Wars

**Controls**:
- **Keyboard**: SPACE for Player 1 shoot, ENTER for Player 2 shoot
- **Touch**: Left zone for Player 1 shoot, Right zone for Player 2 shoot

**Implementation**:
```json
{ "id": "on_space_shoot", "type": "OnKey", "properties": { "key": "SPACE" } }
{ "id": "on_touch_shoot_1", "type": "OnTouchArea", "properties": { "zone": "left", "mode": "press" } }

{ "id": "on_enter_shoot", "type": "OnKey", "properties": { "key": "ENTER" } }
{ "id": "on_touch_shoot_2", "type": "OnTouchArea", "properties": { "zone": "right", "mode": "press" } }
```

---

## API Reference

### GameScene Methods

#### `isTouching(): boolean`
Returns `true` if the screen is currently being touched.

#### `isTouchJustPressed(): boolean`
Returns `true` if touch started this frame (not held from previous frame).

#### `getTouchPosition(): { x: number, y: number }`
Returns the current touch position coordinates.

#### `isTouchingZone(zone: string): boolean`
Returns `true` if the specified zone is currently being touched.

**Parameters**:
- `zone`: One of `left`, `right`, `top`, `bottom`, `center`, `topleft`, `topright`, `bottomleft`, `bottomright`

#### `isTouchZoneJustPressed(zone: string): boolean`
Returns `true` if the specified zone was touched this frame.

#### `getSwipeDirection(): string | null`
Returns the detected swipe direction (`up`, `down`, `left`, `right`) or `null` if no swipe detected.

#### `isSwipeDetected(): boolean`
Returns `true` if a swipe was detected this frame.

---

## Best Practices

### 1. Always Provide Both Input Methods

✅ **Good**: Add both OnKey and OnTouch/OnTouchArea nodes
```
OnKey (LEFT) → Move Left
OnTouchArea (left) → Move Left
```

❌ **Bad**: Only touch controls (desktop users can't play)

### 2. Use Appropriate Modes

- **Press Mode**: For single actions (jump, shoot)
- **Hold Mode**: For continuous actions (movement)

### 3. Choose Logical Zones

- **Left/Right zones**: Movement
- **Top zone**: Jump, shoot up
- **Center zone**: Primary action, tap anywhere
- **Bottom zone**: Secondary actions

### 4. Test on Actual Devices

- Browser mobile emulation is helpful but not perfect
- Test on real phones/tablets for best results
- Check touch zone sizes feel right

### 5. Consider Touch Zone Size

- Zones are roughly 267×200px
- This is large enough for comfortable touch on most devices
- For smaller actions, use center zone or create custom detection

### 6. Avoid Touch Zone Conflicts

❌ **Bad**: Both left and center zones trigger movement
✅ **Good**: Left zone for left movement, center for different action

### 7. Provide Visual Feedback (Optional)

Consider adding visual indicators for touch zones:
- Semi-transparent buttons
- Highlight on touch
- Debug mode overlay (for development)

---

## Troubleshooting

### Touch Not Detected

**Problem**: Touch inputs don't work at all.

**Solutions**:
- Verify game is in Play mode (not paused)
- Check browser console for errors
- Ensure Phaser input is enabled
- Test in browser mobile emulation first

### Wrong Zone Detected

**Problem**: Touching left zone triggers right action.

**Solutions**:
- Verify zone names in node properties
- Check edge connections to correct action nodes
- Test zone boundaries with debug logging

### Touch Too Sensitive

**Problem**: Single tap triggers multiple times.

**Solutions**:
- Use `press` mode instead of `hold` for single actions
- Verify `isTouchJustPressed()` is used, not `isTouching()`
- Check for duplicate OnTouch nodes

### Swipe Not Detected

**Problem**: Swipes don't trigger.

**Solutions**:
- Ensure swipe distance > 50 pixels
- Try swiping faster and longer
- Check `direction` property matches intended swipe
- Verify swipe node is connected to action

---

## Future Enhancements

Potential improvements for the touch control system:

- **Custom Touch Zones**: Define arbitrary rectangles
- **Multi-Touch Support**: Detect multiple simultaneous touches
- **Pinch/Rotate Gestures**: For zoom and rotation
- **Touch Pressure**: Detect force of touch
- **Visual Zone Overlay**: Optional debug mode showing zones
- **Haptic Feedback**: Vibration on touch (mobile browsers)
- **Configurable Zone Sizes**: User-adjustable touch areas

---

## Summary

The touch control system provides a complete, flexible solution for adding mobile support to your games:

✅ **3 Touch Event Nodes** (OnTouch, OnTouchArea, OnSwipe)
✅ **9 Predefined Zones** covering all common game control patterns
✅ **Frame-Perfect Detection** matching keyboard input precision
✅ **Backward Compatible** with all existing keyboard controls
✅ **Easy to Configure** through visual node properties
✅ **All Templates Updated** - 5 working examples to learn from

**Next Steps**:
1. Test touch controls on mobile devices
2. Add touch controls to your custom games
3. Customize zones and modes to fit your game design
4. Gather user feedback on mobile experience

Happy game development! 🎮📱