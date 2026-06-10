/**
 * Decimation for baked WAAPI keyframes.
 *
 * A simulated spring spends most of its frames in a near-still settle tail
 * (and, for underdamped springs, in sub-visual oscillation around the
 * target). Baking every simulation frame inflates each animation with
 * hundreds of visually identical keyframes.
 *
 * `compressSettledFrames` collapses every maximal run of consecutive frames
 * whose positions stay inside a `band`-wide window down to the run's two
 * endpoint frames. Style values are a continuous function of position, so
 * the visual error of dropping interior frames is bounded by the style
 * variation across `band` — no linearity assumption about the style
 * function is needed (unlike error-based line simplification, which is only
 * safe when styles are linear in position).
 *
 * Fast-moving sections break the band every frame and are kept at full
 * resolution. The first and last frames are always kept, so the animation's
 * start state and forwards-fill end state are exact.
 */
export function compressSettledFrames(
  positions: readonly number[],
  band: number,
): number[] {
  const count = positions.length;
  if (count <= 2) return positions.map((_, i) => i);

  const keep: number[] = [0];
  let runLow = positions[0]!;
  let runHigh = positions[0]!;
  let runEnd = 0; // last index inside the current flat run

  for (let i = 1; i < count; i++) {
    const p = positions[i]!;
    const low = Math.min(runLow, p);
    const high = Math.max(runHigh, p);
    if (high - low <= band) {
      runLow = low;
      runHigh = high;
      runEnd = i;
      continue;
    }
    // `i` would stretch the window past the band: close the current run at
    // its end (its start is already kept), then start a fresh run at `i`.
    if (runEnd !== keep[keep.length - 1]) keep.push(runEnd);
    keep.push(i);
    runLow = p;
    runHigh = p;
    runEnd = i;
  }
  if (keep[keep.length - 1] !== count - 1) keep.push(count - 1);
  return keep;
}
