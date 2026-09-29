## Motivation

SSGOI needs a consistent way to move from an unfinished page transition into the next one, including when the effects and their participating elements are different.

A transition executes the `Animation` returned by its effect. That object may drive one element or compose many animations: outgoing and incoming pages, shared media, backgrounds, masks, or temporary blind panels. Each effect can use different elements, properties, and sequencing.[^1]

Users do not necessarily wait for this work to finish. They may navigate `A -> B -> A`, open C while B is still entering, or change from `drill` to `zoom` to `blind` in quick succession.

**How should we cancel, overlap, compose, and hand off these individual motions so that the result feels like one continuous interaction?**

This is an architecture RFC informed by source-code research. The names and contracts below are proposals, not a finalized public API or a claim that the implementation already provides these guarantees.

## 1. The problem is larger than cancelling one animation

Consider a drill transition from A to B. A is moving away and B is sliding in from the right. Before that finishes, a zoom transition to C begins:

```text
First request: A -> B / drill

    A surface -------- leaving
    B surface -------- entering

                  [next request arrives here]

Next request: B -> C / zoom

    B surface -------- new background motion
    C surface -------- entering
    shared media ----- expanding

Still on screen?

    A surface -------- unfinished old motion
```

Force-finishing the first animation and restarting the second can snap B to a resting pose or discard its velocity. Keeping every old animation running can create competing writers for B and let obsolete choreography execute later.

`blind` makes the lifetime problem especially visible: it creates multiple temporary panels, and the next effect may contain none of them.[^2] A single decision to cancel or continue the composite does not describe what should happen to each participating element.

We need to distinguish:

| Concern | Question |
|---|---|
| Motion continuity | How does the current position, size, rotation, and velocity continue toward the new goal? |
| Identity | Which old and new targets represent the same visual entity? |
| Composition | Which contributions should coexist, and who produces their final output? |
| Lifetime | Which views, temporary elements, and pending stages should survive? |

### Why integrators matter

A major reason for choosing integrator-driven motion is to change a target while preserving the motion already in progress, rather than just to produce spring overshoot.

Restarting a conventional duration/Bezier easing from the current position does not automatically preserve velocity. If the new curve starts with zero velocity, a moving element can appear to stop and restart.

A spring can instead take the current position and velocity as its initial conditions. If an object is moving right and its target moves left, it can continue right briefly, decelerate, and then turn left. Neither instantaneous velocity reversal nor completing the old journey is necessary. Apple's spring presentation discusses this use of initial velocity for gestures and retargeting.[^3]

```text
Typical easing restart

    current position --------> next curve's start position
    current velocity --- ? --> next curve's initial velocity

State-based continuation

    current position --+
    current velocity --+-----> continue toward a new target
    new target --------+
```

This is not a claim that Bezier curves cannot provide velocity continuity. A new curve can be constructed with appropriate boundary conditions. The distinction is between restarting a fixed easing and calculating the next motion from the current state. An integrator must actually receive and preserve that state to provide the intended benefit.

### What an integrator does not solve

An integrator does not decide which previous element corresponds to which new element. It also cannot assume that two effects use the same coordinates.

For example, `progress = 0.4` may control horizontal translation in drill, but position, scale, and clipping in zoom. Copying the progress and its velocity can still produce a different visible pose and velocity.

SSGOI already has the beginnings of a handoff contract in `getPose()` and `matchInto()`. `HostAnimation.attach()` samples the previous child, calls `complete()`, then supplies its poses to the next child. However, the current pose is an element-associated scalar value and velocity, and `MultiAnimation.matchInto()` is a no-op.[^4][^5][^1]

The proposal is to extend that original intent across multiple elements, different effects, and repeated navigation.

## 2. What game engines and UI frameworks actually do

The useful questions are: **what persists, what gets replaced, and what continuity does that particular path provide?** Being interruptible does not necessarily mean preserving visible velocity.

### Game Motion Matching: persistent poses and residuals

Daniel Holden's reference implementation maintains the current clip pose, final output pose, and per-bone position/velocity/rotation offsets separately. When search chooses a better frame, it calls `inertialize_pose_transition()`, changes the frame index, and subsequently evaluates the new clip through `inertialize_pose_update()`.[^6]

```text
Input / desired trajectory
            |
            v
      Pose search ----------------> selected clip + frame
                                            |
                                            v
                                       raw pose
                                            |
Persistent bone offsets -------------------+
                                            |
                                            v
                                   final output pose
```

The spring helpers record the difference between the new destination and the source including its existing residual. Updates decay that residual and combine it with the new pose. Position and rotation have different composition operations.[^7]

**Idea for SSGOI:** selecting the next effect and connecting its output are separate operations. A target's presentation state should outlive a particular effect execution.

Game Motion Matching also searches for a suitable clip/frame. SSGOI's route rule often already selects the next effect, so identity matching and pose handoff should come before any large search system. Another important difference is topology: clips generally share a skeleton, while page transitions create and remove views and temporary elements.

### Godot: a common mixer, plus an explicit transition policy

Godot's `AnimationMixer` resolves tracks to nodes, properties, and bones. Its evaluation initializes base values, accumulates weighted contributions, and applies the resulting continuous transforms/values in a common output stage. A `RESET` animation can provide reference values.[^8]

```text
Clip X ---- weight / track values ---+
                                    |
Clip Y ---- weight / track values ---+--> Mixer --> Node / Bone
                                    |
Base pose --------------------------+
```

Its state-machine implementation also illustrates that an engine need not accept every transition immediately: the inspected normal next-state path waits while `fading_from` is active, with separate handling for explicit next requests.[^9]

**Idea for SSGOI:** output composition and permission to begin the next transition are different policies. We can borrow the common output owner without adopting a wait-for-fade navigation policy.

### Jetpack Compose: value, transition, and content lifetimes

`Animatable` keeps value and velocity in `internalState`. A new `animateTo()` uses the current value and, by default, current velocity; execution cancellation and mutual exclusion are handled separately. Cancelling an execution does not destroy the value holder.[^10]

The inspected `Transition.updateAnimation()` path has an interruption-specific policy: an interrupted non-spring animation can use an interruption spring, while carrying the current value and velocity vector.[^11]

`AnimatedContent` separately maintains `currentlyVisible` content and matches `contentKey` values. Content disposal follows exit state, not merely replacement of the numerical animation.[^12]

```text
target state
    |
    v
Transition
    +-- persistent child value state --> replacement animation
    +-- persistent child value state --> replacement animation
    |
    +-- AnimatedContent
          +-- currently visible contents
          +-- keyed target content
          +-- exit / disposal
```

**Idea for SSGOI:** cancellation, numerical continuation, and view removal need separate contracts. Normal authored motion and interruption recovery may also use different policies.

### Motion: values, layout projection, and presence

For ordinary property animation, `MotionValue` keeps current/previous frame information. Starting a new animation stops the old execution; `animateMotionValue()` supplies `value.getVelocity()` to the replacement.[^13][^14]

Shared layout uses `ProjectionNode` snapshots/deltas and a `NodeStack` for a shared `layoutId`. Promoting a new lead can transfer the previous lead's snapshot and current animation values.[^15][^16]

```text
Property motion              Shared layout              Element lifetime

MotionValue                  ProjectionNode             AnimatePresence
  current / previous           snapshot / delta           rendered children
  active animation             shared NodeStack           exiting keys
       |                             |                         |
       +-----------------------------+-------------------------+
                                     v
                              final rendered element
```

There is a meaningful limit to the velocity claim: the inspected projection `startAnimation()` resets progress and explicitly starts its new progress animation with `velocity: 0`. Ordinary MotionValue velocity handoff therefore does not establish a universal visible-velocity guarantee for layout transitions.[^15]

`AnimatePresence` independently keeps keyed exiting children rendered and tracks their completion, including its `wait` policy.[^17]

**Idea for SSGOI:** retaining a value, matching different DOM instances, and retaining an exiting DOM subtree are three capabilities, not one `getPose()` implementation.

### Flutter: several complementary mechanisms

Flutter is particularly relevant because it handles property updates, overlapping content, different route effects, and shared-element flights through distinct mechanisms.

**Implicit property animation.** The inspected tween update path evaluates the current tween as the new start value and restarts its controller. This supports position/value continuity but is not a general velocity handoff.[^18] A controller can also be driven with a `SpringSimulation` initialized from current value and velocity; choosing and connecting those states remains the author's job.[^19]

**AnimatedSwitcher.** It retains a current entry and a set of outgoing entries, so several previous children can exit while the latest child enters.[^20]

```text
After A -> B -> C in quick succession

AnimatedSwitcher
    +-- A entry / exiting
    +-- B entry / exiting
    +-- C entry / entering
```

An already-outgoing child and a newly supplied child with the same key are not treated as related.[^21] Changing `transitionBuilder` rebuilds current and outgoing transitions; it does not generally infer the old geometry and bridge it into the new builder.[^20]

**Route coordination and delegated transitions.** A route has its own primary animation and a secondary animation corresponding to the route above it.[^22] An incoming route can also supply `delegatedTransition`: how the previous route should move away. Flutter's official example mixes Material zoom, Cupertino slide, and a custom vertical transition this way.[^23]

```text
B route                                     C route
    |                                           |
    +-- own primary animation                   +-- enter animation
    |                                           |
    +-- received outgoing transition <----------+-- delegatedTransition
    |
    v
composed appearance of B
```

The inspected flexible-transition path suppresses B's old secondary transition and wraps its original transition result with the delegated builder. This can preserve B's existing entrance expression while composing the new outgoing expression. Changing secondary animation sources can also use train hopping, switching when their values cross or when the new animation stops; that is not a general derivative-matching guarantee.[^22][^24]

This is a strong precedent for avoiding an adapter for every pair of effects: the incoming effect supplies its companion outgoing behavior once.

**Hero flights.** `HeroController` maintains a tag-indexed `_flights` map. A subsequent navigation with the same tag calls `divert()` on the existing flight. It distinguishes push/pop cases and, for general redirection, starts a new rect path at the currently evaluated rect. The flight also owns its overlay and placeholder lifecycle. This is concrete position handoff, not evidence of arbitrary cross-effect velocity preservation.[^25]

**Gesture completion.** In the inspected Cupertino back-gesture path, release velocity helps choose completion versus rollback, followed by `animateTo/animateBack` with a duration and curve. Using velocity to decide direction is different from carrying that exact velocity into a spring.[^26]

**Assessment:** Flutter already provides substantial support for concurrent content lifetimes, redirected shared elements, and cooperation between different page effects. These mechanisms are useful precedents, but they do not constitute one automatic matcher for every child's world-space pose and velocity.

### SwiftUI and UIKit: close to the desired experience within supported transitions

SwiftUI's public explanation separates model/presentation values from an animation's `animate`, `shouldMerge`, and `velocity` contracts. Springs merge prior state; other animations can have their outputs composed.[^27]

For the same animatable properties with continuing identity, spring retargeting is directly relevant to our goal. Apple's built-in zoom navigation/presentation also supports grabbing or reversing the interaction while it is still underway. Source IDs and namespaces identify the corresponding source view.[^3][^28][^29]

The UIKit lifecycle described in the same presentation is instructive: starting a pop during a push immediately completes the push's appearance lifecycle, then starts the pop. Logical lifecycle completion and continuous visual motion are separate concerns; this should not be interpreted as a required frame snapped to the old endpoint.[^28]

```text
User action:       begin zoom in ---- grab / reverse ---- zoom out

Visual motion:     current presentation continues

UIKit lifecycle:   appearing -> appeared -> disappearing
                               logical handoff
```

**Assessment:** important parts of the desired experience already exist at a high level of quality. The open question for SSGOI is extending a reusable contract across our own effects and temporary targets, rather than claiming other frameworks cannot provide fluid transitions. SwiftUI internals were not inspected; these statements concern public contracts and demonstrations.

### React Native: separate value animation from navigation

React Native core `Animated`, Reanimated, React Navigation's JS stack, and native stack operate at different levels.

**Reanimated values.** Assigning a new animation to a shared value cancels the previous execution and passes the current value and previous animation to the new `onStart()`.[^30]

However, the inspected **Reanimated 4.6.0 release** initializes a spring from previous velocity and then zeros velocity pointing away from the new target. This was verified in the release tag as well as the inspected development snapshot.[^31]

```text
Before interruption:      x = 120, velocity = +400
New target:               x = 0

Strict velocity carry:    +400 -> slows down -> 0 -> negative
Reanimated 4.6.0 path:        0 -> negative
```

This chooses immediate movement toward the new target over preserving inertia in that case. It is a statement about this numeric `withSpring` initialization path, not every native navigation gesture.

Core `Animated` also has previous-spring state transfer in `SpringAnimation.start()`.[^32] Neither primitive automatically supplies identity and lifetime management for all pages, shared elements, and temporary effects. Preserving a progress value's velocity also does not preserve visible velocity if its mapping changes from translation to scale or another path.

**React Navigation JS stack.** `Card` drives a gesture value with spring/timing specifications and release velocity. `CardStack` maintains route-associated state and current/next/previous progress, allowing B to coordinate with C's entrance. The inspected Card also holds some closing state stable to avoid jumps when open/close changes during motion.[^33][^34]

```text
JS stack
    +-- B / current progress
    |     / next progress from C
    +-- C / current progress
    +-- card interpolation + route lifetime
```

**Native stack.** The documented native stack uses `UINavigationController` on iOS and `Fragment` on Android. Its React implementation forwards animation/gesture options through `ScreenStackItem`. Native push/pop behavior comes with the customization boundaries of those components.[^35][^36] It does not imply automatic handoff of every custom child animation.

**Shared elements.** Reanimated's inspected 4.x documentation describes matching `sharedTransitionTag` values on old/new top screens, animating a separate transition view, then restoring the originals. It also describes progress-based cancellation for iOS back gestures.[^37]

At the research date, this is documented as experimental behind a feature flag, with native-stack-centered support and limitations on fully custom animation functions and some modal/progress-based behavior. The inspected C++ path separately handles snapshots, progress, and completion/cancellation cleanup.[^37][^38][^39]

**Assessment:** the ecosystem supplies many necessary components. It does not follow that one of these packages automatically reconciles all targets and their motion through arbitrary `drill -> zoom -> blind` sequences. Some default policies, such as the inspected reverse-target spring behavior, also differ from the inertia we want to preserve.

## 3. What is already solved, and what remains our problem?

These systems suggest a recurring structure:

**Persistent presentation state + replaceable motion + separately managed presence.**

Their connection policies differ: current-value restart, spring state transfer, residual correction, composition, and waiting are all used.

| Scope | Existing support | Remaining question for SSGOI |
|---|---|---|
| Change a target on the same property | Value holders and spring/controller primitives | Which velocity and solver-state guarantees do we choose? |
| Interrupt a supported route/zoom/gesture transition | Native navigation, Flutter route coordination, Apple zoom | How does this relate to custom child motion? |
| Move the same shared element across views | Flutter Hero, Motion shared layout, Reanimated shared elements | How are pose, velocity, representation, and lifetime handed off? |
| Keep older content while newer content enters | AnimatedSwitcher, AnimatedContent, AnimatePresence | How are existing entities reused rather than merely overlapped? |
| Replace arbitrary multi-element effects | Composition/building blocks are available | Can all participating effects share one identity, motion, and lifetime contract? |

Some of the desired UX is already mature. This RFC is not a claim of universal superiority over native or existing framework transitions. Within the inspected public contracts, we did not identify one drop-in contract covering every target in an arbitrary mixed-effect sequence. That does not mean such behavior cannot be built on those frameworks.

There are also two different kinds of limits:

- **Algorithmic policy:** resetting velocity, preserving it, composing paths, or decaying a residual can be an implementation choice.
- **Semantic information:** a solver cannot decide whether photo 42 and photo 99 are the same entity, or whether ten horizontal blind panels correspond to twenty vertical panels. Effects must supply meaningful identities and lifecycle behavior.

Motion data alone also cannot display a view that has already been destroyed or a destination that does not exist yet. A good integrator, a good matcher, and a good view-lifetime contract are all necessary.

## 4. Proposed architecture: Host, Scene, and Plan

The proposal is to keep current presentation state alive while replacing the description of future choreography. These are responsibilities, not a requirement to immediately introduce three large classes.

```text
Router / application
    |
    | latest navigation intent
    v
TransitionHost                         long-lived owner
    |
    +-- MotionScene                    current presentation state
    |     +-- page A
    |     +-- page B
    |     +-- shared media
    |     +-- temporary effects
    |
    +-- MotionPlan                     replaceable choreography
    |
    +-- Reconcile + Continuity         common handoff policy
    |
    +-- Renderer / view lifetime       display and resource ownership
```

### Host: one owner for a transition scope

The Host receives the latest navigation intent, applies the selected effect plan, and coordinates ownership. It need not own router history or decide URLs.

The existing `HostAnimation` is a useful starting point. Its role would expand from replacing a single child slot to updating the motion of the currently participating targets.[^4]

**The Host owns the Scene; they should not become competing authorities.** A scene registry and reconciliation policy inside the current host would be a reasonable first implementation.

### Scene: current targets, including those still leaving

The Scene need not mirror the entire application DOM. It can be a registry limited to transition participants: page surfaces, shared media, and temporary effects.

```text
MotionScene
|
+-- page:B
|     +-- rendering handle
|     +-- current geometry + velocity
|     +-- base layout
|     +-- motion ownership
|
+-- media:photo42
|     +-- semantic identity
|     +-- current presentation / flight
|
+-- effect:blind-group
      +-- parent / coordinate space
      +-- pieces and current motion
      +-- release behavior
```

Semantic identity and rendering-instance identity are different. A shared entity can move between DOM instances; the same URL can represent different route entries. Keys should be scoped and role-aware, not blindly matched as global element IDs.

The Scene must also include targets outside the latest `from/to` pair. If A is still leaving when `B -> C` begins, the next handoff needs the current A/B/C scene, not only the previous composite's two endpoints.

### Plan: the new effect's desired motion

A plan describes participating targets, desired poses or paths, local dependencies, and release behavior. It does not need to reduce all choreography to a single final value.

```text
Effect factory
    |
    | from / to / layout / navigation intent
    v
MotionPlan
    +-- participating surfaces and temporary targets
    +-- desired paths / targets
    +-- local choreography dependencies
    +-- release behavior
```

An effect should be authorable without knowing the previous effect's name. Its own motion and companion outgoing behavior are defined once. The Host connects them to the current presentation.

### Renderer and presence

The renderer composes contributions into one final output per target/property. Two effects should not independently overwrite the same CSS `transform`.

Presence determines which actual views must remain alive: the active destination, exiting surfaces, and resources still referenced by shared flights or temporary effects. A superseded run must not remove or reset a target already adopted by a new owner.

SSGOI already has a presence model in `runtime/presence.ts` and outgoing-view lifetime management in the web transition context. The Scene should connect to those responsibilities rather than unnecessarily reimplement them.[^40]

## 5. A common matching and handoff procedure

This proposal's matcher relates **current scene targets** to **targets required by the next plan**. Identity selects candidates; pose compatibility selects the connection method; presence determines whether something is handed off or retired.

### Four reconciliation outcomes

A missing animation track does not necessarily mean a missing element. Blind may animate only panels while B itself must remain present. Base layout/presentation therefore needs to exist independently of an effect's active tracks.

| Result | Common operation |
|---|---|
| The target and channel are still needed | Continue from current state into the new target/path |
| The target remains, but its old transition channel is unused | Return that owned channel toward its base presentation |
| The target itself is no longer needed | Run its release behavior, then dispose it |
| A new target is needed | Enter from its declared initial presentation or a matched source |

This uses identity, presence, and channel ownership rather than branches such as `previous === blind && next === zoom`.

### A small set of connection methods

```text
Current target state
        |
        +-- same motion system --------> continue / retarget full state
        |
        +-- common presentation pose --> bridge into new motion
        |                                 using residual correction
        |
        +-- compatible contributions --> compose under one output owner
        |
        +-- no useful correspondence --> enter / release / visual fallback
```

- **Continue/retarget:** preserve the complete state of a compatible solver, including internal state beyond position/velocity where required.
- **Bridge:** sample the final presentation and its velocity, then correct the difference from the new authored path. Inertialization is one candidate.
- **Compose:** deliberately retain compatible active contributions under a single output owner, as Flutter's delegated-transition approach illustrates.
- **Enter/release/fallback:** use an explicit lifecycle policy when there is no meaningful correspondence.

Conceptually, residual handoff uses:

```text
initial residual          = current presentation - new path at handoff
initial residual velocity = current velocity - new path velocity

displayed result          = new path + decaying residual
```

This operates in a supported pose representation, not by adding arbitrary CSS strings. Repeated interruptions must sample the final output including any existing correction.

### Superseding a plan is not the same as destroying its targets

```text
Old plan superseded
    |
    +-- not-yet-started steps ------> invalidated
    |
    +-- active, reused targets ----> transferred or adopted by new plan
    |
    +-- active, unused targets ----> release motion
    |
    +-- unreferenced resources ----> disposed
```

If composition is chosen, the new plan explicitly adopts the active contribution it needs. It does not keep the whole obsolete sequence alive by accident.

We should distinguish **reaching a goal**, **transferring ownership**, and **disposing resources** instead of making `complete()` stand for all three. Preparing and committing a handoff must preserve the current presentation until its replacement is ready, and stale asynchronous work must not reclaim the scene.

### Repeated navigation uses the same procedure

```text
Input       A -> B          B -> C          C -> D
Plan        [ AB ]         [ BC ]         [ CD ]

Scene       A leaving      A releasing    ...
            B entering     B leaving      B releasing
                           C entering     C leaving
                                          D entering

Each update samples the current Scene, including ongoing corrections.
It does not replay the whole history of AB + BC + CD.
```

Views can be released when they are no longer visually required or referenced. The host can impose a common resource budget; preserving motion should not imply accumulating an unbounded history of surfaces or residual layers.

## 6. Blind as a test of the abstraction

Blind combines temporary targets with covering/revealing phases.[^2] It should participate through its local contract:

```text
Blind plan
    +-- participating page surfaces
    +-- occlusion group
    |     +-- identity and piece layout
    |     +-- parent / coordinate space
    |     +-- covering / revealing motion
    |     +-- release state: no visible occlusion
    +-- choreography dependencies
```

The effect should not inspect whether the next effect is zoom or drill. If the next plan uses a compatible occlusion group, it can be matched. Otherwise, the existing group moves toward its declared non-occluding release state. A common fade can serve as a fallback where no specialized release is declared.

This produces several useful scenarios from the same operations:

| Scenario | Result under the proposed rules |
|---|---|
| Drill is interrupted by blind | B remains present; its old translation settles toward its base presentation; the new occlusion group enters |
| Blind is interrupted by zoom | B receives the new zoom motion; old panels release; C enters |
| Ten horizontal panels change to twenty vertical panels | Treat incompatible groups as release/enter rather than assuming matching indices identify the same geometry |
| Blind is reversed before its next phase starts | Retarget/adopt the relevant active targets and invalidate obsolete pending stages |

A requirement such as “cover before revealing the destination” remains a local dependency in the active plan. View readiness and valid shared-element anchors should likewise have common representations. They do not require a separate rule for every effect pair.

Actual panel splitting/morphing can be explored later. It is not necessary to make interruption handling useful and predictable.

## 7. Ownership boundaries and limits

| Owner | Responsibility |
|---|---|
| Router/application | Destination, navigation direction, content readiness |
| Effect/Plan | Normal paths, participating targets, local order, temporary-target release |
| Host/reconciler | Latest intent, matching, handoff/restore/enter/release decisions, ownership |
| Scene/motion state | Live targets and their current final presentation |
| Pose/solver layer | Coordinate-compatible continuation, solver state, residuals |
| Renderer/presence adapter | Final output, actual view retention and disposal |

The runtime should apply declared contracts rather than infer the meaning of arbitrary views. Initially, common geometry can be limited to page surfaces, shared media, and occlusion/overlay targets.

For supported persistent geometry, position and velocity continuity are explicit goals. For new or removed entities, meaningful identity and lifecycle behavior are the relevant contract. Unsupported custom representations need an explicit fallback.

A same-ID match is necessary in many cases but not sufficient: pose schema, coordinate space, role, and property ownership must be compatible. The scalar currently returned by `getPose()` does not establish those properties across unrelated style functions.[^5]

## 8. Adoption path

The existing `animation(args) -> Animation` model can remain. Returned animations could expose target/motion/lifetime information so the host can reconcile them. `MultiAnimation` can continue to describe normal choreography.[^1]

Built-in effects can opt into the contract incrementally; opaque custom animations can retain their existing behavior with an explicit fallback. This does not require immediately converting every effect into a data-only graph or replacing WAAPI playback with a per-frame JavaScript renderer.

Three prototypes would test different foundations:

| Prototype | Architectural question |
|---|---|
| Repeated slide `A <-> B` | Does the same target retain motion state while execution and direction change? |
| Drill interrupted by zoom to C | Can different effects connect through a common presentation contract? |
| Blind interrupted by another effect | Are temporary targets, pending stages, and page lifetimes handled independently? |

### Proposed acceptance criteria for the first iteration

- [ ] Matched persistent targets continue without a position discontinuity; supported solver/pose paths retain the intended velocity.
- [ ] Effect changes do not require a growing table of named effect-pair handlers.
- [ ] Base-pose restoration is distinct from removing an element.
- [ ] Superseded pending stages cannot start later, and old cleanup cannot mutate transferred targets.
- [ ] Repeated navigation does not duplicate the same logical surface or accumulate unbounded retiring resources.
- [ ] Debug output explains target matches, adopted contributions, releases, and fallbacks.

## 9. Design questions

1. What is the smallest target/pose/lifetime contract that can extend the current `Animation` API without a full rewrite?
2. Which representations should initially support strict position/velocity handoff: page transforms, shared-media geometry, and rectangular occlusion?
3. How should a plan declare that an active contribution may be composed with its replacement rather than replaced through residual correction?
4. What should the default release behavior be, and which local invariants must an effect declare for masks and sequencing?
5. How should the host coordinate these guarantees with existing web and native view-presence adapters?

The intended direction is to make **a target that keeps moving through successive transitions** a first-class runtime concept. Effects describe their own choreography once; the host handles ongoing changes of intent consistently.

## Research scope and references

Research was checked on **2026-09-12**, covering 28 source/example files from eight public repositories. Links below pin code snapshots where available. Flutter was inspected on a stable-branch snapshot; several other code paths were inspected on development branches. Reanimated's reverse-target velocity policy was additionally checked in release **4.6.0**. Do not generalize one snapshot to every release, platform, or driver.

SwiftUI/Apple zoom observations are based on public contracts and demonstrations, not private engine source. Reanimated shared-element limitations refer to the inspected 4.x documentation. This is source-level research and an architectural proposal, not a benchmark obtained by building and exercising every framework.

The SSGOI source references use public commit `f85c3d568ed4c861461aa518fce446df28e7908e` as the research baseline.

[^1]: SSGOI. [TransitionConfig](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/types/index.ts#L123), [MultiAnimation](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/animation/multi-animation.ts#L31). TransitionConfig and MultiAnimation. Snapshot `f85c3d568ed4`.

[^2]: SSGOI. [transition.ts](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/transitions/blind/transition.ts#L24). Blind panel creation and two-phase composite. Snapshot `f85c3d568ed4`.

[^3]: Apple. [Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/). Animate with springs, WWDC23: gesture and retarget velocity continuity.

[^4]: SSGOI. [host-animation.ts](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/animation/host-animation.ts#L26). HostAnimation.attach and current child handoff. Snapshot `f85c3d568ed4`.

[^5]: SSGOI. [Pose types](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/runtime/motion-state.ts#L1), [Animation contract](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/runtime/animation.ts#L3). Pose representation and Animation handoff contracts. Snapshot `f85c3d568ed4`.

[^6]: Daniel Holden. [controller.cpp](https://github.com/orangeduck/Motion-Matching/blob/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/controller.cpp#L1279). Motion-Matching controller; persistent poses, offsets, search, and handoff. Snapshot `57b7250e0d34` (2025-02-06).

[^7]: Daniel Holden. [spring.h](https://github.com/orangeduck/Motion-Matching/blob/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/spring.h#L162). Spring inertialization helpers for position and rotation. Snapshot `57b7250e0d34` (2025-02-06).

[^8]: Godot Engine. [scene/animation/animation_mixer.cpp](https://github.com/godotengine/godot/blob/c24bf5d933c53d9477d5e82c51403856a9e7da62/scene/animation/animation_mixer.cpp#L1026). AnimationMixer target bindings and init/process/apply stages. Snapshot `c24bf5d933c5` (2026-09-11).

[^9]: Godot Engine. [scene/animation/animation_node_state_machine.cpp](https://github.com/godotengine/godot/blob/c24bf5d933c53d9477d5e82c51403856a9e7da62/scene/animation/animation_node_state_machine.cpp#L851). State-machine crossfade and next-transition gating. Snapshot `c24bf5d933c5` (2026-09-11).

[^10]: AndroidX / Google. [compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Animatable.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Animatable.kt#L227). Animatable current state, animateTo, and execution cancellation. Snapshot `e8cac06846dd` (2026-09-12).

[^11]: AndroidX / Google. [compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Transition.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Transition.kt#L1629). Transition.updateAnimation and interruption-specific spring selection. Snapshot `e8cac06846dd` (2026-09-12).

[^12]: AndroidX / Google. [compose/animation/animation/src/commonMain/kotlin/androidx/compose/animation/AnimatedContent.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation/src/commonMain/kotlin/androidx/compose/animation/AnimatedContent.kt#L1079). AnimatedContent keyed content retention and disposal. Snapshot `e8cac06846dd` (2026-09-12).

[^13]: Motion. [packages/motion-dom/src/value/index.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/value/index.ts#L447). MotionValue velocity, start, and stop. Snapshot `372846e89d05` (2026-09-11).

[^14]: Motion. [packages/motion-dom/src/animation/interfaces/motion-value.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/animation/interfaces/motion-value.ts#L23). Passing current MotionValue velocity to a replacement animation. Snapshot `372846e89d05` (2026-09-11).

[^15]: Motion. [packages/motion-dom/src/projection/node/create-projection-node.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/projection/node/create-projection-node.ts#L1589). Projection snapshots/deltas; startAnimation explicitly initializes progress velocity to zero. Snapshot `372846e89d05` (2026-09-11).

[^16]: Motion. [packages/motion-dom/src/projection/shared/stack.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/projection/shared/stack.ts#L45). NodeStack lead promotion and snapshot transfer. Snapshot `372846e89d05` (2026-09-11).

[^17]: Motion. [packages/framer-motion/src/components/AnimatePresence/index.tsx](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/framer-motion/src/components/AnimatePresence/index.tsx#L62). AnimatePresence keyed children and exit completion. Snapshot `372846e89d05` (2026-09-11).

[^18]: Flutter. [packages/flutter/lib/src/widgets/implicit_animations.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/implicit_animations.dart#L387). Implicit animation tween updates from the currently evaluated value. Snapshot `9584c6713b32` (2026-09-10).

[^19]: Flutter. [packages/flutter/lib/src/animation/animation_controller.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/animation/animation_controller.dart#L642). AnimationController interpolation, velocity, and simulation APIs. Snapshot `9584c6713b32` (2026-09-10).

[^20]: Flutter. [packages/flutter/lib/src/widgets/animated_switcher.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/animated_switcher.dart#L254). AnimatedSwitcher current/outgoing entries and transition-builder replacement. Snapshot `9584c6713b32` (2026-09-10).

[^21]: Flutter. [AnimatedSwitcher API](https://api.flutter.dev/flutter/widgets/AnimatedSwitcher-class.html). AnimatedSwitcher API: overlapping outgoing children and key semantics.

[^22]: Flutter. [packages/flutter/lib/src/widgets/routes.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/routes.dart#L422). Secondary-animation handoff and delegated/flexible route transitions. Snapshot `9584c6713b32` (2026-09-10).

[^23]: Flutter. [Flexible route transitions example](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/examples/api/lib/widgets/routes/flexible_route_transitions.0.dart#L99), [delegatedTransition API](https://api.flutter.dev/flutter/widgets/ModalRoute/delegatedTransition.html). Official example mixing zoom, Cupertino slide, and custom vertical route transitions. Snapshot `9584c6713b32`.

[^24]: Flutter. [TrainHoppingAnimation API](https://api.flutter.dev/flutter/animation/TrainHoppingAnimation-class.html). TrainHoppingAnimation API and value-crossing handoff.

[^25]: Flutter. [packages/flutter/lib/src/widgets/heroes.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/heroes.dart#L741). Hero flight diversion, tag lookup, and overlay lifetime. Snapshot `9584c6713b32` (2026-09-10).

[^26]: Flutter. [packages/flutter/lib/src/cupertino/route.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/cupertino/route.dart#L851). Cupertino back-gesture dragEnd and completion/rollback animation. Snapshot `9584c6713b32` (2026-09-10).

[^27]: Apple. [Explore SwiftUI animation](https://developer.apple.com/videos/play/wwdc2023/10156/). Explore SwiftUI animation, WWDC23: public animatable/merge/velocity contracts.

[^28]: Apple. [Enhance your UI animations and transitions](https://developer.apple.com/videos/play/wwdc2024/10145/). Enhance your UI animations and transitions, WWDC24: interactive zoom and UIKit lifecycle.

[^29]: Apple. [NavigationTransition.zoom API](https://developer.apple.com/documentation/SwiftUI/NavigationTransition/zoom%28sourceID%3Ain%3A%29). NavigationTransition.zoom source ID and namespace contract.

[^30]: Software Mansion. [packages/react-native-reanimated/src/valueSetter.ts](https://github.com/software-mansion/react-native-reanimated/blob/5336bb7f4c41ae19d03b17c991b5675aa483d4bf/packages/react-native-reanimated/src/valueSetter.ts#L9). Reanimated valueSetter cancellation and previousAnimation delivery. Snapshot `5336bb7f4c41` (2026-09-11).

[^31]: Software Mansion. [Spring implementation at release commit](https://github.com/software-mansion/react-native-reanimated/blob/8651062064b518dac61bed9740110a645d65e757/packages/react-native-reanimated/src/animation/spring/spring.ts#L159), [4.6.0 release](https://github.com/software-mansion/react-native-reanimated/releases/tag/4.6.0). Reanimated 4.6.0 spring initialization; reverse-target velocity clipping at line 189 onward. Release published 2026-08-21. Snapshot `8651062064b5`.

[^32]: React Native. [packages/react-native/Libraries/Animated/animations/SpringAnimation.js](https://github.com/facebook/react-native/blob/e0224fd40b673ad2143c8c395c20d23a115e0801/packages/react-native/Libraries/Animated/animations/SpringAnimation.js#L202). SpringAnimation.start and previous-spring state transfer. Snapshot `e0224fd40b67` (2026-09-11).

[^33]: React Navigation. [packages/stack/src/views/Stack/Card.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/stack/src/views/Stack/Card.tsx#L190). JS stack Card animation, gesture velocity, and closing-state handling. Snapshot `6db6331ceda7` (2026-09-12).

[^34]: React Navigation. [packages/stack/src/views/Stack/CardStack.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/stack/src/views/Stack/CardStack.tsx#L517). CardStack route state and current/next/previous progress. Snapshot `6db6331ceda7` (2026-09-12).

[^35]: React Navigation. [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/). Native Stack Navigator architecture and customization boundaries.

[^36]: React Navigation. [packages/native-stack/src/views/NativeStackView.native.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/native-stack/src/views/NativeStackView.native.tsx#L397). NativeStackView forwarding animation and gesture options to ScreenStackItem. Snapshot `6db6331ceda7` (2026-09-12).

[^37]: Software Mansion. [Shared Element Transitions](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/). Reanimated 4.x Shared Element Transitions: matching, transition views, gestures, and limitations.

[^38]: React Navigation. [Animating elements between screens](https://reactnavigation.org/docs/shared-element-transitions/). Shared-element integration and documented navigator/customization limitations.

[^39]: Software Mansion. [packages/react-native-reanimated/Common/cpp/reanimated/LayoutAnimations/SharedTransitions.cpp](https://github.com/software-mansion/react-native-reanimated/blob/5336bb7f4c41ae19d03b17c991b5675aa483d4bf/packages/react-native-reanimated/Common/cpp/reanimated/LayoutAnimations/SharedTransitions.cpp#L114). Experimental native shared-transition snapshots, progress, and END/CANCELLED cleanup. Snapshot `5336bb7f4c41` (2026-09-11).

[^40]: SSGOI. [Presence implementation](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/runtime/presence.ts#L34), [Web transition context](https://github.com/meursyphus/ssgoi/blob/f85c3d568ed4c861461aa518fce446df28e7908e/packages/core/src/lib/ssgoi-transition/create-ssgoi-transition-context.ts#L261). Presence and web transition view-lifetime management. Snapshot `f85c3d568ed4`.
