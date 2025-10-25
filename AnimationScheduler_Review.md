# AnimationScheduler Code Review Guide

> **Visual documentation for understanding AnimationScheduler implementation**
>
> This document provides visual explanations of the AnimationScheduler class architecture, execution flows, and edge case handling.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Structures](#data-structures)
3. [Schedule Strategies](#schedule-strategies)
4. [Lifecycle & State Management](#lifecycle--state-management)
5. [Edge Cases & Error Handling](#edge-cases--error-handling)
6. [Method Call Flows](#method-call-flows)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AnimationScheduler                        │
├─────────────────────────────────────────────────────────────┤
│  Responsibility: Coordinate multiple spring animations       │
│  Strategy: overlap | wait | chain                           │
│  Direction: forward | backward                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ manages
                              ▼
        ┌──────────────────────────────────────────┐
        │         Map<string, AnimatorEntry>        │
        │                                           │
        │  spring_0 → { animator, item, startTime } │
        │  spring_1 → { animator, item, startTime } │
        │  spring_2 → { animator, item, startTime } │
        └──────────────────────────────────────────┘
                              │
                              │ each contains
                              ▼
                    ┌──────────────────┐
                    │    Animator      │
                    │  (Popmotion)     │
                    └──────────────────┘
```

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `AnimationScheduler` | Coordinates multiple springs | `animation-scheduler.ts:23` |
| `AnimatorEntry` | Tracks individual spring state | `animation-scheduler.ts:7` |
| `Animator` | Single spring physics engine | `animator.ts` |
| `SpringItem` | User config for each spring | `types.ts:53` |

---

## Data Structures

### AnimatorEntry

```typescript
type AnimatorEntry<TAnimationValue> = {
  id: string               // Unique ID: "spring_0", "spring_1", etc.
  item: SpringItem         // User configuration
  animator: Animator       // Physics engine instance
  startTime: number | null // null = pending, number = started
}
```

**State Tracking:**
```
startTime = null    → Pending (not started)
startTime = 123456  → Started (timestamp)
```

### Private State

```typescript
class AnimationScheduler {
  private animators: Map<string, AnimatorEntry>  // All spring instances
  private springOrder: string[]                   // Execution order
  private completedCount: number                  // How many finished
  private completedAnimators: Set<string>         // Prevent duplicates
  private direction: "forward" | "backward"       // Current direction
  private idCounter: number                       // ID generator
  private timeoutIds: number[]                    // Pending setTimeout IDs
}
```

**Why Set for completedAnimators?**
- Prevents duplicate `onComplete` callbacks
- O(1) lookup time
- Cleared on `forward()`/`backward()` restart

---

## Schedule Strategies

### 1. Overlap Strategy

**All springs start immediately (parallel execution)**

```
Timeline (forward):
t=0ms ──────────────────────────────────────>

Spring A: ████████████████ (300ms)
          ↑ start          ↑ complete

Spring B: ██████████████████████ (400ms)
          ↑ start                ↑ complete

Spring C: ██████████ (200ms)
          ↑ start    ↑ complete
```

**Code Flow:**
```typescript
forward() {
  this.stop()  // Clear existing
  // ...
  case "overlap":
    this.springOrder.forEach(id => this.startAnimator(id))
    // All start at t=0
}
```

**Completion Order:** Based on individual spring duration
- t=200ms: C completes
- t=300ms: A completes
- t=400ms: B completes → `onEnd()` called

---

### 2. Wait Strategy

**Each spring waits for previous to complete (sequential)**

```
Timeline (forward):
t=0ms ──────────────────────────────────────>

Spring A: ████████████████
          ↑ start          ↑ complete
                           │ triggers B

Spring B:                  ██████████████████████
                           ↑ start                ↑ complete
                                                  │ triggers C

Spring C:                                         ██████████
                                                  ↑ start    ↑ complete
```

**Code Flow:**
```typescript
forward() {
  case "wait":
    this.startAnimator(springOrder[0])  // Only start first
}

onAnimatorComplete(id) {
  if (schedule === "wait" && direction === "forward") {
    const nextId = springOrder[currentIndex + 1]
    if (nextId) this.startAnimator(nextId)  // Chain next
  }
}
```

**Backward (reverse order):**
```
Timeline (backward):
t=0ms ──────────────────────────────────────>

Spring C: ██████████
          ↑ start    ↑ complete
                     │ triggers B

Spring B:            ██████████████████████
                     ↑ start                ↑ complete
                                            │ triggers A

Spring A:                                   ████████████████
                                            ↑ start          ↑ complete
```

---

### 3. Chain Strategy

**Springs start with offset delays**

```
Timeline (forward with offsets):
Spring A (offset: 0ms):
t=0ms    ████████████████
         ↑ start

Spring B (offset: 100ms):
t=0ms    ───┬─────────────
         delay  ████████████████
            t=100ms ↑ start

Spring C (offset: 200ms):
t=0ms    ──────────┬─────
              delay  ██████████
                 t=200ms ↑ start
```

**Code Flow:**
```typescript
forward() {
  case "chain":
    this.springOrder.forEach(id => {
      const offset = entry.item.offset ?? 0
      if (offset === 0) {
        this.startAnimator(id)  // Immediate
      } else {
        const timeoutId = setTimeout(() => this.startAnimator(id), offset)
        this.timeoutIds.push(timeoutId)  // Track for cleanup
      }
    })
}
```

**Backward (mirrored offsets):**
```
maxOffset = 200ms

Spring A (offset: 0 → mirrored: 200):
t=0ms    ──────────┬─────
              delay  ████████████████
                 t=200ms ↑ start

Spring B (offset: 100 → mirrored: 100):
t=0ms    ───┬─────────────
         delay  ████████████████
            t=100ms ↑ start

Spring C (offset: 200 → mirrored: 0):
t=0ms    ██████████
         ↑ start
```

---

## Lifecycle & State Management

### Public Methods

```
┌─────────────────────────────────────────────────────┐
│                  Public API                          │
├─────────────────────────────────────────────────────┤
│  forward()   → Start all animations (0 → 1)          │
│  backward()  → Start all animations in reverse       │
│  stop()      → Stop all animations + clear timeouts  │
│  reverse()   → Reverse current animations            │
│  getState()  → Get current progress state            │
└─────────────────────────────────────────────────────┘
```

### State Transitions

```
Initial State
     │
     │ forward()
     ▼
┌──────────┐
│ FORWARD  │───── onComplete ────┐
│ RUNNING  │                     │
└──────────┘                     │
     │                           ▼
     │ backward()        All Complete
     ▼                           │
┌──────────┐                     │
│ BACKWARD │───── onComplete ────┤
│ RUNNING  │                     │
└──────────┘                     │
     │                           │
     │ stop()                    │
     ▼                           ▼
┌──────────┐              ┌───────────┐
│ STOPPED  │              │   ENDED   │
│          │              │ (onEnd)   │
└──────────┘              └───────────┘
     │
     │ reverse()
     ▼
┌──────────┐
│ REVERSED │
│ RUNNING  │
└──────────┘
```

### forward() / backward() Flow

```typescript
forward() {
  1. stop()                        // Clean slate
  2. direction = "forward"         // Set direction
  3. completedCount = 0            // Reset counter
  4. completedAnimators.clear()    // Reset tracking
  5. config.onStart?.()            // Global start callback
  6. Start animations based on schedule strategy
}
```

**Why call stop() first?**
- Clears pending `setTimeout` calls (prevents delayed starts)
- Resets `startTime` to `null` (allows restart)
- Stops any running animators (prevents state corruption)

---

## Edge Cases & Error Handling

### 1. Memory Leak Prevention (setTimeout)

**Problem:**
```typescript
// ❌ Without cleanup
setTimeout(() => this.startAnimator(id), 100)
this.stop()  // Animator stopped, but setTimeout still runs!
```

**Solution:**
```typescript
// ✅ With cleanup
const timeoutId = window.setTimeout(() => this.startAnimator(id), 100)
this.timeoutIds.push(timeoutId)

stop() {
  this.timeoutIds.forEach(id => clearTimeout(id))  // Clear all pending
  this.timeoutIds = []
}
```

**Location:** `animation-scheduler.ts:163`, `animation-scheduler.ts:207`, `animation-scheduler.ts:231`

---

### 2. Duplicate Completion Prevention

**Problem:**
```typescript
// Scenario: Animator completes twice (edge case)
onAnimatorComplete("spring_0")  // completedCount = 1
onAnimatorComplete("spring_0")  // completedCount = 2 ❌ Wrong!
```

**Solution:**
```typescript
private completedAnimators = new Set<string>()

onAnimatorComplete(id) {
  if (this.completedAnimators.has(id)) {
    return  // Already completed, ignore
  }
  this.completedAnimators.add(id)
  this.completedCount++
  // ...
}
```

**Location:** `animation-scheduler.ts:73-77`

---

### 3. Duplicate Start Prevention

**Problem:**
```typescript
// Scenario: Animation already started
startAnimator("spring_0")  // startTime = 1000
startAnimator("spring_0")  // Starts again ❌ Duplicate!
```

**Solution:**
```typescript
private startAnimator(id: string): void {
  const entry = this.animators.get(id)
  if (!entry) { /* warn */ return }

  if (entry.startTime !== null) {
    console.warn(`animator ${id} already started`)
    return  // Prevent duplicate
  }

  entry.startTime = Date.now()
  entry.animator.forward()
}
```

**Location:** `animation-scheduler.ts:122-127`

---

### 4. Empty Animators (Chain Mode)

**Problem:**
```typescript
// ❌ Empty array causes -Infinity
const maxOffset = Math.max(...[])  // -Infinity
```

**Solution:**
```typescript
// ✅ Guard against empty
const maxOffset = this.animators.size === 0
  ? 0
  : Math.max(...Array.from(this.animators.values()).map(e => e.item.offset ?? 0))
```

**Location:** `animation-scheduler.ts:206-213`

---

### 5. Direction Consistency (reverse)

**Problem:**
```typescript
// ❌ reverse() doesn't update direction
reverse() {
  this.animators.forEach(entry => entry.animator.reverse())
  // direction still "forward" → getState() returns wrong value
}
```

**Solution:**
```typescript
// ✅ Toggle direction
reverse() {
  this.direction = this.direction === "forward" ? "backward" : "forward"
  // ...
}
```

**Location:** `animation-scheduler.ts:243`

---

## Method Call Flows

### forward() → overlap mode

```
User calls forward()
    │
    ├─ stop()
    │   ├─ Clear all timeoutIds
    │   └─ Set all startTime = null
    │
    ├─ Set direction = "forward"
    ├─ Reset completedCount = 0
    ├─ Clear completedAnimators
    ├─ Call config.onStart()
    │
    └─ For each spring in springOrder:
        ├─ startAnimator(id)
        │   ├─ Check entry exists
        │   ├─ Check not already started
        │   ├─ Set startTime = now
        │   └─ Call animator.forward()
        │       └─ Popmotion animate() starts
        │
        └─ (All start immediately)

... time passes ...

Spring completes
    │
    └─ onAnimatorComplete(id)
        ├─ Check not already completed (Set)
        ├─ completedCount++
        ├─ Call item.onComplete()
        ├─ Call config.onProgress(completed, total)
        │
        └─ If completedCount === total:
            └─ Call config.onEnd()
```

### backward() → wait mode

```
User calls backward()
    │
    ├─ stop()
    ├─ Set direction = "backward"
    ├─ Reset completedCount = 0
    ├─ Clear completedAnimators
    ├─ Call config.onStart()
    │
    └─ case "wait":
        └─ startBackwardAnimator(lastId)  // Only last spring
            ├─ Check entry exists
            ├─ Check not already started
            ├─ Set startTime = now
            └─ Call animator.backward()

... last spring completes ...

onAnimatorComplete(lastId)
    ├─ completedCount++
    ├─ Call item.onComplete()
    ├─ Call config.onProgress()
    │
    └─ If schedule === "wait" && direction === "backward":
        └─ Start previous spring
            └─ startBackwardAnimator(prevId)

... previous spring completes ...

onAnimatorComplete(prevId)
    └─ Chain continues until first spring completes
```

### reverse() flow

```
User calls reverse()
    │
    ├─ Toggle direction ("forward" ↔ "backward")
    │
    └─ For each animator entry:
        │
        ├─ If startTime === null:
        │   └─ Skip (never started)
        │
        └─ If startTime !== null:
            │
            ├─ Get current state (position, velocity)
            │
            ├─ If position === to (completed):
            │   └─ Create new animator from final state
            │       └─ Start backward from 1.0
            │
            └─ Else (running):
                └─ Call animator.reverse()
                    └─ Preserves velocity, reverses direction
```

### stop() cleanup

```
User calls stop()
    │
    ├─ Clear all pending timeouts:
    │   └─ this.timeoutIds.forEach(id => clearTimeout(id))
    │       └─ Prevents delayed starts
    │
    └─ For each animator entry:
        ├─ Call entry.animator.stop()
        │   └─ Stops Popmotion animation
        │
        └─ Set entry.startTime = null
            └─ Allows future restart
```

---

## State Variables Summary

| Variable | Type | Purpose | Reset When |
|----------|------|---------|------------|
| `animators` | `Map<string, AnimatorEntry>` | All spring instances | Constructor only |
| `springOrder` | `string[]` | Execution order | Constructor only |
| `completedCount` | `number` | Completed animations count | `forward()`, `backward()` |
| `completedAnimators` | `Set<string>` | Prevent duplicate completion | `forward()`, `backward()` |
| `direction` | `"forward" \| "backward"` | Current direction | `forward()`, `backward()`, `reverse()` |
| `idCounter` | `number` | ID generator | Never |
| `timeoutIds` | `number[]` | Pending setTimeout IDs | `stop()` |

---

## Error Scenarios & Warnings

### Warning Messages

| Location | Trigger | Message |
|----------|---------|---------|
| `onAnimatorComplete:66` | Animator not found | `animator with id "${id}" not found on completion` |
| `startAnimator:115` | Animator not found | `animator with id "${id}" not found on start` |
| `startAnimator:123` | Already started | `animator with id "${id}" already started` |
| `startBackwardAnimator:136` | Animator not found | `animator with id "${id}" not found on backward start` |
| `startBackwardAnimator:143` | Already started | `animator with id "${id}" already started` |
| `reverse:237` | Unsupported offsetMode | `Only "immediate" offsetMode is currently supported` |

### Guard Conditions

```typescript
// Entry existence
if (!entry) { warn(); return; }

// Duplicate start
if (entry.startTime !== null) { warn(); return; }

// Duplicate completion
if (this.completedAnimators.has(id)) { return; }

// Empty animators (chain)
if (this.animators.size === 0) { maxOffset = 0 }
```

---

## Performance Considerations

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| `forward()` | O(n) | Iterates all springs |
| `backward()` | O(n) | Iterates all springs |
| `stop()` | O(n + m) | n=animators, m=timeouts |
| `reverse()` | O(n) | Iterates all springs |
| `onAnimatorComplete()` | O(n) | Set lookup O(1), array indexOf O(n) |
| `getState()` | O(1) | Returns stored values |

### Memory Usage

```
Base:
  - Map<string, Entry> → O(n) where n = spring count
  - string[] (springOrder) → O(n)
  - Set<string> (completed) → O(n) worst case
  - number[] (timeouts) → O(n) in chain mode

Per Spring:
  - AnimatorEntry → 4 properties
  - Animator instance → Popmotion overhead
  - Callbacks → Closures
```

---

## Code Location Reference

```
animation-scheduler.ts
├── Lines 7-12:   AnimatorEntry type
├── Lines 23-31:  Class declaration + state
├── Lines 33-35:  Constructor
├── Lines 37-38:  generateId()
├── Lines 40-60:  initializeAnimators()
├── Lines 64-109: onAnimatorComplete()
├── Lines 112-131: startAnimator()
├── Lines 133-152: startBackwardAnimator()
├── Lines 154-178: forward()
├── Lines 180-225: backward()
├── Lines 227-238: stop()
├── Lines 240-271: reverse()
└── Lines 273-282: getState()
```

---

## Testing Checklist

When reviewing or testing AnimationScheduler:

- [ ] All three schedule modes work (overlap, wait, chain)
- [ ] Forward and backward directions work
- [ ] `stop()` clears all pending timeouts
- [ ] `reverse()` updates direction correctly
- [ ] Duplicate completion is prevented
- [ ] Duplicate start is prevented
- [ ] Empty animators don't crash (chain mode)
- [ ] `onEnd` fires only when all complete
- [ ] `onProgress` fires with correct counts
- [ ] Memory cleanup on `stop()`
- [ ] State consistency across method calls

---

**Generated:** 2025-10-08
**Class:** `AnimationScheduler<TAnimationValue>`
**File:** `packages/core/src/lib/animation-scheduler.ts`
