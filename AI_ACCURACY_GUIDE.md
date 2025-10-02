# AI Accuracy System Guide

## Overview

The `AIAimAt` node now includes a configurable **accuracy input** that controls how precisely the AI aims at targets.

---

## How Accuracy Works

### **Accuracy Scale (0.0 - 1.0)**

| Accuracy | Error Range | Description | Use Case |
|----------|-------------|-------------|----------|
| **1.0** | ±0° | Perfect aim | Expert/Boss AI, Tutorial demonstrations |
| **0.9** | ±2° | Nearly perfect | Hard difficulty, skilled AI |
| **0.7** | ±6° | Good aim | Medium-Hard difficulty |
| **0.5** | ±10° | Medium aim | Default/Balanced gameplay |
| **0.3** | ±14° | Poor aim | Easy difficulty, beginner-friendly |
| **0.1** | ±18° | Very poor | Very easy, comedy/drunk AI |
| **0.0** | ±20° | Terrible aim | Impossible difficulty (reverse), random chaos |

### **Formula**
```javascript
maxError = 20 * (1 - accuracy)
randomOffset = (Math.random() - 0.5) * 2 * maxError
finalAngle = calculatedAngle + randomOffset
```

**Example:**
- accuracy = 0.5 → maxError = 10 → randomOffset = -10° to +10°
- accuracy = 1.0 → maxError = 0 → randomOffset = 0° (perfect)
- accuracy = 0.0 → maxError = 20 → randomOffset = -20° to +20°

---

## Usage Examples

### **Example 1: Basic AI with Fixed Accuracy**

Simple AI tank that aims with 70% accuracy:

```
Node Graph:
1. OnKey (ENTER)
   ↓
2. AIAimAt
   - fromEntity: tank2
   - toEntity: tank1
   - accuracy: 0.7  ← 70% accurate (±6° error)
   ↓ outputs: angle, power
3. ShootProjectile
   - fromEntity: tank2
   - angle: [from AIAimAt]
   - power: [from AIAimAt]
```

---

### **Example 2: Dynamic Difficulty with Variables**

AI accuracy changes based on game progression:

```
Node Graph:
1. OnStart
   ↓
2. SetVariable (aiAccuracy, 0.3)  ← Start easy (30%)

... Later when player scores...

3. OnCollide (player hits target)
   ↓
4. GetVariable (aiAccuracy) → currentAccuracy
   ↓
5. Add (currentAccuracy + 0.1) → newAccuracy  ← Increase by 10%
   ↓
6. SetVariable (aiAccuracy, newAccuracy)

... When AI shoots...

7. GetVariable (aiAccuracy) → accuracy
   ↓
8. AIAimAt
   - fromEntity: tank2
   - toEntity: tank1
   - accuracy: [from GetVariable]  ← Dynamic!
   ↓
9. ShootProjectile
```

**Result:** AI gets better as player progresses (adaptive difficulty)

---

### **Example 3: Distance-Based Accuracy** (Advanced)

AI is more accurate at close range, worse at long range:

```
Node Graph:
1. GetEntityPosition (tank1) → x1, y1
   ↓
2. GetEntityPosition (tank2) → x2, y2
   ↓
3. CalculateAngle (x1, y1, x2, y2) → angle, distance
   ↓
4. Divide (distance / 500) → distanceFactor  ← Normalize (0-1 range)
   ↓
5. Subtract (1 - distanceFactor) → accuracy  ← Far = low accuracy
   ↓
6. AIAimAt
   - fromEntity: tank2
   - toEntity: tank1
   - accuracy: [from step 5]  ← Distance-based!
```

**Result:**
- Close range (100px): accuracy ≈ 0.8 (good)
- Medium range (250px): accuracy ≈ 0.5 (medium)
- Long range (500px): accuracy ≈ 0.0 (terrible)

---

### **Example 4: Randomized AI Skill**

Each AI opponent has different skill levels:

```
Node Graph:
1. OnStart
   ↓
2. RandomRange (min: 3, max: 9) → randomSkill
   ↓
3. Divide (randomSkill / 10) → accuracy  ← 0.3 to 0.9
   ↓
4. SetVariable (tank2Accuracy, accuracy)

... When tank2 shoots...

5. GetVariable (tank2Accuracy) → aiAccuracy
   ↓
6. AIAimAt (accuracy: aiAccuracy)
```

**Result:** Each game, AI has random skill (30%-90%)

---

### **Example 5: Difficulty Settings Menu**

Player selects difficulty:

```
Node Graph (Easy Mode):
1. OnKey (E)  ← Player presses E for Easy
   ↓
2. SetVariable (difficulty, 0.2)  ← AI gets 20% accuracy

Node Graph (Normal Mode):
1. OnKey (N)  ← Player presses N for Normal
   ↓
2. SetVariable (difficulty, 0.5)  ← AI gets 50% accuracy

Node Graph (Hard Mode):
1. OnKey (H)  ← Player presses H for Hard
   ↓
2. SetVariable (difficulty, 0.9)  ← AI gets 90% accuracy

... When AI shoots...
3. GetVariable (difficulty) → accuracy
   ↓
4. AIAimAt (accuracy: [from GetVariable])
```

---

## Advanced Techniques

### **1. Accuracy Decay Over Time**

AI gets tired and less accurate over time:

```
Every (1000ms)
  ↓
GetVariable (currentAccuracy) → acc
  ↓
Multiply (acc * 0.95) → newAccuracy  ← Reduce by 5% each second
  ↓
SetVariable (currentAccuracy, newAccuracy)
```

### **2. Conditional Accuracy**

AI accuracy changes based on health:

```
GetVariable (aiHealth) → health
  ↓
CompareNumbers (health vs 50)
  ↓ (if health < 50)
SetVariable (accuracy, 0.3)  ← Desperate/panicked = worse aim
  ↓ (if health > 50)
SetVariable (accuracy, 0.7)  ← Confident = better aim
```

### **3. Wind Compensation**

AI adjusts accuracy based on wind:

```
GetVariable (windStrength) → wind
  ↓
Divide (wind / 100) → windPenalty
  ↓
GetVariable (baseAccuracy) → baseAcc
  ↓
Subtract (baseAcc - windPenalty) → finalAccuracy
  ↓
AIAimAt (accuracy: finalAccuracy)
```

---

## Tips & Best Practices

### **For Game Designers:**

1. **Start with 0.5 (medium)** - Good default for balanced gameplay
2. **Use 0.7-0.9 for challenging AI** - Forces player to take cover
3. **Use 0.2-0.4 for beginner-friendly** - Gives players breathing room
4. **Combine with RandomRange** - Add extra unpredictability

### **For Player Experience:**

- **Too Accurate (>0.8)**: Feels unfair, frustrating
- **Too Inaccurate (<0.3)**: Feels too easy, boring
- **Sweet Spot (0.4-0.7)**: Challenging but fair

### **Dynamic Difficulty Tips:**

- Increase accuracy by 0.05-0.1 per player success
- Decrease accuracy by 0.05-0.1 per player failure
- Cap at min=0.2, max=0.9 to avoid extremes

---

## Preset Configurations

### **Easy AI Tank**
```json
{
  "fromEntity": "aiTank",
  "toEntity": "player",
  "accuracy": 0.3
}
```

### **Medium AI Tank**
```json
{
  "fromEntity": "aiTank",
  "toEntity": "player",
  "accuracy": 0.5
}
```

### **Hard AI Tank (Boss)**
```json
{
  "fromEntity": "bossTank",
  "toEntity": "player",
  "accuracy": 0.85
}
```

### **Sniper AI (Perfect Aim)**
```json
{
  "fromEntity": "sniperTank",
  "toEntity": "player",
  "accuracy": 1.0
}
```

---

## Troubleshooting

**Q: AI still misses with accuracy = 1.0?**
A: Check if wind/gravity nodes are affecting projectile trajectory

**Q: AI too accurate even with low accuracy?**
A: Verify the accuracy value is between 0.0-1.0 (not 0-100)

**Q: Accuracy doesn't change?**
A: Make sure you're using GetVariable to read dynamic values, not hardcoded properties

**Q: How to make AI completely random?**
A: Set accuracy = 0.0, or use RandomRange (-45, 45) for angle directly

---

## Summary

The accuracy system provides **fine-grained control** over AI difficulty:

- **Simple to use**: Single slider from 0.0 (terrible) to 1.0 (perfect)
- **Flexible**: Works with variables, conditions, and dynamic systems
- **Realistic**: Error scales smoothly across the accuracy range
- **Balanced**: Default 0.5 provides fair challenge

Perfect for creating adaptive difficulty, skill-based opponents, and engaging gameplay!
