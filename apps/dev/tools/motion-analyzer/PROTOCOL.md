# Motion analysis protocol

This is a tool for a coding agent, with a deterministic measurement engine. The agent decides which interaction and element a measurement represents after viewing frames. The engine decodes, tracks, fits, verifies physics, and renders evidence. An unattended `measure` run without a plan produces geometric proposals rather than semantic ground truth.

The tool lives under `apps/dev/tools` and is maintained with the development app. Its Python environment, input recordings and generated reports are local artifacts. Next.js compilation and ESLint exclude this standalone tool; `motion:test` validates it separately. It is not part of the versioned library packages or their release process.

From the repository root:

```sh
bash apps/dev/tools/motion-analyzer/run.sh inspect '/path/to/recording.mov' --out apps/dev/tools/motion-analyzer/output/study/inspection
# The agent views the contact sheets and writes study.plan.json.
bash apps/dev/tools/motion-analyzer/run.sh measure '/path/to/recording.mov' --plan study.plan.json --out apps/dev/tools/motion-analyzer/output/study/report
```

Requirements: Python 3.9–3.14, FFmpeg/ffprobe, Node, and this workspace's pnpm dependencies. `run.sh` creates an isolated `.venv` and installs the Python requirements (binary wheels for every supported interpreter) on first use. `MOTION_ANALYZER_PYTHON=/path/to/python` selects an existing environment. The measurement engine makes no API requests or video uploads. The agent views extracted frames through its normal image tools.

Convenience commands: `pnpm motion:inspect VIDEO --out DIR`, `pnpm motion:analyze VIDEO --plan PLAN --out DIR`, `pnpm motion:render DIR/report.json`, `pnpm motion:view DIR`, `pnpm motion:synth --out DIR`, and `pnpm motion:test`. `motion:render` refreshes the viewer and exported charts without decoding the source or changing the measured JSON. `motion:view` prints a localhost URL and serves only that output folder, with HTTP byte ranges for reliable video seeking; stop it with Ctrl-C. Use its optional `--port` to select a port.

## Try it without a recording

`synth` renders a phone-app recording whose three transitions (push, pop, tab crossfade) move with physics simulated by the repository's own TypeScript engine, encoded with FFmpeg like a real screen recording:

```sh
bash apps/dev/tools/motion-analyzer/run.sh synth --out apps/dev/tools/motion-analyzer/output/demo [--fps 30] [--codec hevc] [--drop 0.1]
bash apps/dev/tools/motion-analyzer/run.sh measure apps/dev/tools/motion-analyzer/output/demo/recording.mp4 --plan apps/dev/tools/motion-analyzer/output/demo/plan.json --out apps/dev/tools/motion-analyzer/output/demo/report
```

It writes `truth.json` (every parameter used), `plan.json` (a semantic plan that leaves off-screen rest positions to inference) and `plan.geometry.json` (the same plan with the layout's known travel supplied). `tests/test_closed_loop.py` measures this fixture and asserts the recovered physics, so the tool's accuracy claims are checked, not described.

## Runtime integration

Exported recipes use the current `@ssgoi/core` API. Each segment's `motion.ts` starts with a preset `override`:

```ts
export const override = {
  forward: ({ animation }) => {
    animation.select("in").set({ integrator: IntegratorProvider.from({ spring: { stiffness: 373, damping: 33.4, ... } }) });
    animation.select("out").set({ integrator: IntegratorProvider.from({ spring: { stiffness: 251, damping: 28, ... } }) });
    animation.select("in").set({ startAt: { after: animation.select("out"), at: 0.172 } });
  },
} satisfies Override<MultiAnimation<"out" | "in">>;
```

Every shipped page preset registers its pages under `out` and `in`, so `axis({ type: "x" }, { override })` plays the measured physics with the preset's own geometry. Roles without a registered child (`shared`, `overlay`) are listed as comments; the rest of the file exports every measured element with its integrator, delay and source endpoints for a custom transition (`createMeasuredTracks`, `composeMeasuredTracks`). The viewer copies the override for the selected transition and the integrator for the selected element. Named semantic presets in the report (`smooth`, `snappy`, ...) are read from `packages/core/src/lib/motion/presets.ts` through the core bridge, so a recalibrated preset never leaves the comparison stale.

## Inspect and annotate

`inspect` writes `inspection.json` (PTS, activity, suggested intervals), paginated `contact-*.png`, `candidate-*.png`, and a non-overwritten `plan.template.json`. For dense inspection:

```sh
bash apps/dev/tools/motion-analyzer/run.sh inspect recording.mov --out output/detail --range 1750 2250 --step-ms 50
```

Times are milliseconds from the first video presentation timestamp. Actual source frames are used, with no constant-FPS resampling. Nearest-PTS selection is recorded as `startFrame`, `endFrame`, `startMs`, and `endMs` in the final report. Rotation metadata is applied. ROI coordinates refer to the original **oriented** frame, even when `--width` downsamples analysis. Default width is 480, never upscaled; use a larger width for tiny elements in high-resolution input.

The agent should separate loading updates, gestures, free release motion, navigation, and unrelated system controls based on frame evidence. Automatic segmentation uses activity/changed area and coherent translation reversal; it is not a navigation classifier. Continuous or back-to-back interactions may require explicit boundaries.

## Plan JSON

```json
{
  "schemaVersion": 1,
  "source": { "sha256": "copy from inspection.json" },
  "interpretation": "Visual interpretation and scope of this study",
  "segments": [
    {
      "name": "Photo viewer push",
      "startMs": 5175,
      "endMs": 5800,
      "direction": "forward",
      "notes": ["The back page and front photo have distinct displacement."],
      "elements": [
        {
          "name": "Incoming photo",
          "role": "in",
          "anchor": "end",
          "box": [110, 255, 130, 300],
          "properties": ["x"],
          "offsetFromEnd": { "x": 296 },
          "onsetMs": 0,
          "evidence": "The front panel enters from one recording width to the right."
        }
      ]
    }
  ],
  "excluded": [
    { "startMs": 7500, "endMs": 8550, "reason": "System controls used to stop recording" }
  ]
}
```

- `source.sha256` is optional but recommended; a mismatch fails. Copy it from inspection. Unknown schema versions fail.
- `segments` contains the ranges the agent actually chose to analyze. Ranges may overlap for separate studies of the same event. `excluded` records semantic reasons; it is provenance, not an additional subtraction operation.
- `direction`: `forward`, `backward`, or `unknown`. Never assume the entire recording has one direction.
- `elements: []` uses automatic surface/region proposals. A nonempty list requests only named elements, with no fallback that silently changes identity. Untrackable named elements are reported as `unmeasured`.
- `box`: `[x, y, width, height]`, original oriented pixels, on the segment's exact `anchor` frame (`start` or `end`). Choose a stable textured portion of one element, not a rectangle spanning independent layers. Positions are centroids of tracked features, **not DOM bounding-box coordinates**; displacement is meaningful.
- `role`: `in`, `out`, `shared`, `overlay`, `mixture`, or `unknown`. This is the agent's interpretation, saved as `semanticSource: agent-plan`.
- `properties`: optional subset of `x`, `y`, `scale`. Omit to measure all three. Scale is relative to the anchor; divide by its final value when binding to CSS geometry.
- `method: "alpha"` requests a static endpoint mixture, returned as `opacityProxy`. It requires a stable background and cannot distinguish opacity from pixel blending/occlusion in general; layered crossfades mix nonlinearly, so its confidence is capped at `medium`. Moving opacity is intentionally unmeasured.
- `method: "edge"` measures a **container boundary** instead of texture: select a static strip in `box`, set `edgeAxis: "x"` and `edgeSide: "right"` for a bright panel adjoining the right side (or y/top/bottom for vertical motion). `edgeThreshold` defaults to 220 on gray 0–255. The agent must confirm that contrast and geometry in the source frames. The median brightness profile suppresses small text/icons. This is useful when a photo moves inside its sliding container; tracking the photo itself would answer a different question. The supplied sample uses `[0,35,296,35]` for its viewer's light navigation strip.
- Progress is normalized over observed endpoints. Invisible samples remain null, not invented zeros/ones.
- `endpoints: { "x": [from, to] }` supplies known endpoints. `offsetFromEnd: { "x": 296 }` or `offsetToStart: { "x": -98 }` supplies a known total displacement relative to an observed endpoint. They are alternatives for a given property. State the geometric evidence and uncertainty. These values change the physical inference; a guessed screen-width ratio is not a measurement.
- `onsetMs`: onset estimate relative to segment start, used with explicit endpoints. The fit may shift it by −1 to +3 local median frame intervals. Do not constrain it to an unrelated tap/previous loading phase.

## Unobserved rest positions

A page that enters from off screen is invisible at its start; a page that ends covered by the incoming page never shows its rest position. Normalizing only the visible range as 0 → 1 would turn a correct spring into a stiffer, wrong one that still fits perfectly. When a property's first or last rest position was not observed (the element is not trackable at the segment start, or is still moving or lost when the segment ends), the fit places that endpoint itself, jointly with the physics and the onset, and the report marks the property `endpointSource: "inferred"` with a note giving the inferred and first/last seen values. A weak prior (one observed span of extrapolation costs 0.1% RMSE) keeps equivalent fits from inventing travel, and among models within the noise floor the one needing the least extrapolation wins.

On the synthetic fixture this recovers a push's outgoing (fully covered end) and incoming (off-screen start) springs within 2% at 60 fps, and the measured `startAt` within 0.03. A page revealed only late in its travel (the list returning under a popping detail page, visible for its last 45%) comes back within about 10% and is reported as `medium`/`review`, never `high`. Supplying `offsetFromEnd` / `offsetToStart` from the layout is still the more accurate path (every page within 5% at 60 fps, within 6% at 30 fps) and is what the agent should do when the geometry is known.

## Measurements and fits

Bidirectional pyramidal Lucas–Kanade uses forward/backward consistency. Robust similarity transforms estimate x/y/scale from as few as three visible points, so a partly visible layer still yields its translation; automatic proposals combine motion consensus and connected image regions, and regions that move with an enclosing surface are merged into it. Fixed chrome is filtered by movement. This is geometric vision, not an OCR/DOM semantic model. Different property curves are split when a joint progress model disagrees. No curve is manufactured for an untrackable named element. A track still moving when the segment ends is flagged.

Candidates use SSGOI's 60 Hz semi-implicit Euler, 50 ms continuous settling, and configurable `--rest-delta`/`--rest-speed` (defaults .01). Spring stiffness/damping, quadratic inertia acceleration/resistance, and doubleSpring follower ratio [.5, 2] are fitted with bounded multistart least squares. A simpler model wins within 10% RMSE (or within a 0.1% noise floor), then the smaller extrapolation. Alternatives and semantic preset comparisons are retained. `--fit-mode duration-bounce` restricts fitting to spring duration [.14, 2] s and bounce [−.45, .65].

`--initial-velocity` is normalized progress per second. Isolate a gesture's release phase before using it. It is supplied, not automatically estimated. Unknown finger input cannot be identified from a free spring model.

Every completed report verifies all selected simulations, including velocity and settling frame, against the **current TypeScript sources** using `core-reference.mjs`. Parity failures abort publication of the final JSON/HTML. `physicsVerification` records max error and source hashes (integrators, timeline, motion helpers and presets). The optimizer's Python implementation is not trusted as a substitute for this check.

`duration` is perceptual duration, not observed travel or settle time. `arrivalMs` is first arrival within 2%; `settleMs` includes velocity and the 50 ms rest window. Cubic Bezier is an independent visual comparison with overshoot-capable y controls; it never determines the physical settings.

## Outputs and interpretation

- `report.html`: portable viewer with a transition rail, video beside the timeline, playback speed/loop controls, frame stepping, and a shared playhead. Click/drag the chart or scrubber to seek; use ←/→ for source PTS frame steps and Space for play/pause. Select a row or element to read its physics, inferred endpoints, alternatives and notes. Switch from timing to the curve/Bezier comparison, copy the integrator or the transition's preset override, or download the current SVG. Measurements outside visual support remain dashed. In the Claude desktop app, `preview_start` with the `motion-viewer` launch configuration serves the demo report.
- The viewer uses `requestVideoFrameCallback` where available, with a playback-clock fallback. Seeking snaps to actual source PTS inside the encoded clip. The final exclusive clip boundary is not a playable frame. This does not synthesize extra video frames or change the fit samples.
- CSS, JavaScript and report data are embedded in HTML; clips and poster/thumbnail images are relative local files. Open `report.html` directly in a browser, or use `motion:view` for an in-app browser. A different HTTP server must support byte-range requests for media seeking. No remote service is required. The renderer preserves `report.json` byte-for-byte.
- `report.md`, `report.json`, and the exact `analysis-plan.json`.
- Per segment: `clip.mp4`, `frames.png`, `timeline.png`, `timeline.svg`, `curves.png`, `curves.csv`, `motion.ts`.
- Dashed chart parts are extrapolated outside measured support. Dots are the observations. High/medium/review are heuristic quality labels, not statistical confidence intervals; a fit with inferred endpoints is at most `medium`.
- `motion.ts` exports the preset override, then every element's integrator, source geometry endpoints, relative delay, and factories for actual WebAnimations. Bind each track to its element and a style function. Convert recording pixels to CSS pixels yourself. If properties split, use nested wrappers or combine their independent values rather than letting two transform animations overwrite the same element.
- `composeMeasuredTracks` is included only when predecessor progress thresholds represent the measured ordering within one 60 Hz frame. Numeric thresholds, including 1, use first crossing rather than settling. Delays beyond settling and non-monotonic first-crossing conflicts return `startAt: null`. A delay not representable by these existing numeric thresholds remains explicit in `delayMs` for the caller's orchestration. Do not replace missing schedule values with arbitrary thresholds. A sample with sparse early visibility may have timing bias even when its curve RMSE is small.
- `--preset NAME` records a requested preset hint. Selecting a matching preset and its geometry remains the agent's job; use a custom animation when per-element fits differ from the preset's existing choreography.

The included [recording plan](examples/recording.plan.json) demonstrates agent decisions for a private iPhone recording that is not checked in. Its parallax offsets are explicit assumptions, and several expanding/occluded elements require review. No claim is made that this single compressed 32 fps average recording recovers the original app's unique parameters.

## Verification

```sh
bash apps/dev/tools/motion-analyzer/run.sh test
```

Tests check current-core parity for all models, nonzero velocity and both rest thresholds; inverse parameter recovery; an 8-pixel rendered motion with <5% spring parameter error; three automatic segments; overlap; alpha mixture; Bezier overshoot; VFR timestamp decoding; the generated override and recipe typechecking against the current core; and the closed loop on the synthetic recording (known geometry within 5% at 60 fps and 8% at 30 fps, inferred endpoints within 5% for the push, automatic proposals finding exactly the two pages). External labeled iOS/Material/Kakao datasets have not been provided, so the older plan's acceptance claims about those are not asserted.

Viewer integration checks can run in a browser after opening a generated report, for example with `agent-browser`:

```sh
agent-browser --session motion-qa --allow-file-access open file:///absolute/path/to/report.html
agent-browser --session motion-qa eval --stdin < apps/dev/tools/motion-analyzer/tests/viewer-checks.js
agent-browser --session motion-qa close
```

These exercise real video seeking/playback, cursor synchronization, source-frame stepping, segment and element selection, speed, loop, and local assets. `motion:test` also checks data preservation and safe embedding of labels containing HTML delimiters.
