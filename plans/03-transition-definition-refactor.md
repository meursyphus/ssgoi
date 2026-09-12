# Transition definition refactor

This supersedes the public API proposals in `01-motion-scheme.md`.

## Accepted contract

- `defineTransition({ forward: { prepare, animation }, backward: { prepare, animation } })`
  is the supported authoring entry point. Each direction independently infers its
  prepared data and concrete animation return type. Both satisfy `Animation`.
- Presets retain `{ type, variant, options }` and a second `{ override }` argument.
  Overrides are direction-specific callbacks receiving `{ animation, context }`.
  The callback's animation type is inferred from that direction's factory.
- `MultiAnimation` supports named children, with a default string name parameter
  and inferred literal names. Explicitly registered names replace DOM guessing.
  `select(name)` returns an animation; `set({ integrator, startAt })` edits it.
  Root `set({ integrator })` explicitly edits the entire group. No hidden coupled
  propagation from an unrelated or absent label.
- A start condition references another animation and uses a first-crossing
  progress number or the distinct `"settled"` condition. Preserve existing preset
  timing by keeping their existing numeric scheduling behavior.
- Springs take stiffness/damping. Custom `Integrator` instances remain supported.
- The core is the sole authority for forward/backward, using route rules and
  history. Transitions must consume `context.direction` unchanged. There is no
  effect-direction resolver, second direction value, or context rewriting.
- `prepare`, `animation`, and the matching override use the same core-selected
  direction and original context for each run.
- Explicit pair and on/except rules determine relationship direction even for
  fresh pushes; equally matching same-scope rules fall back to history direction.
- Preserve zoom/hero enter/exit key attributes exactly. These identify expanded
  and collapsed endpoints; they never decide or rewrite navigation direction.
  Zoom matches exit -> enter for core forward and enter -> exit for core backward.
- Existing transitions must retain their visuals, preparation timing, cleanup,
  geometry, supported aliases, and default physics. Do not move layout measurement
  before the dispatcher's outgoing-node insertion.
- Document built-in overrides, custom definitions, custom integrators, typed
  names, scheduling, and navigation direction. Update examples and templates.
- No package release, version bump, or site deployment is requested. The user
  authorized committing and pushing this work to the existing draft PR #400.

## Implementation and validation

1. Definition types/runtime, stable per-run core-selected lifecycle, typed overrides and exports.
2. Named animation composition and explicit editing/scheduling.
3. Migrate built-in presets using shared helpers for unchanged preparation,
   geometry and cleanup; preserve specific output types through public factories.
4. Zoom/hero matching and route/history direction regression coverage.
5. Raw spring helpers, analyzer compatibility and public API documentation.
6. Type checks, core/adapter tests, all package builds, docs/dev checks, browser
   checks of forward/back navigation and interrupted/reused DOM transitions.

Pre-refactor local commit: `9caceec`.
Backup branch: `codex/pr400-before-transition-refactor-20260912`.
Existing untracked `research/` and analyzer output belong to the user.

## Implementation status

Implementation is complete. The user requested a commit and push to the existing
draft PR #400, preserving its draft status.
All 13 presets use defineTransition. Named provider contributions, shared
lifecycle utilities, direction-bound configuration, typed overrides, spring
parameters, compatibility aliases, and documentation/examples were updated.
The core direction matcher and dispatcher were not changed. Enter/exit markers
remain unchanged.

## Validation evidence

- All eight package builds passed after implementation migration.
- Core TypeScript and ESLint passed; the main suite passed 201 tests before the
  final route/zoom regression additions (which passed 29 targeted tests).
- React route-boundary suite: 18 passed. Docs and dev TypeScript checks passed.
- Motion analyzer: 15 tests passed using the isolated Python 3.9 environment.
- Four executable documentation examples passed TypeScript checking.
- Browser parity against `codex/pr400-before-transition-refactor-20260912`:
  54/54 cases passed across 13 presets and their principal type/variant options,
  in both directions. Preparation styles, generated keyframes, and final styles
  matched exactly. Browser execution used accelerated playback; live scheduling
  semantics are independently covered by frame-clock regression tests.
- Reproduce fixture preparation with `pnpm test:transition-parity:prepare REF`.
  Open the generated index.html and run the comparison. The fixture has no
  framework or remote-media dependency and builds both revisions from source.
- Recheck documentation samples with `pnpm test:transition-examples`.

## Final scope steering

The user requested limited final verification and a handoff, plus a
Pinterest demo related-pin flow. Added related pins to the docs Pinterest detail
screen, an equal-pattern detail/detail zoom rule, and a real router.back button.
Browser verification stopped after the requested forward/back flow.

The final core run passed 205 tests, including empty-group progress preservation.
The added Pinterest files passed the docs TypeScript check.

Pinterest browser check: gallery -> pin-1 -> related pin-2 -> Back -> pin-1.
The related section contains eight cards and uses the original exit markers;
the main media retains its enter marker. The Back control calls router.back().
New docs pages rendered at desktop and 390px mobile widths without page overflow.
