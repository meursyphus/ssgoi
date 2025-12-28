/**
 * Transform Interpolator
 *
 * Heuristic parser for finding matching keyframe based on computed transform.
 * Used to sync WAAPI animation startTime with what main thread already rendered.
 *
 * Background (Safari/WebKit compositor timing issue):
 * When WAAPI animate() is called, animation initially runs on main thread
 * with a temporary startTime. Later, when compositor is ready for GPU acceleration,
 * it confirms the "real" startTime. If these differ, animation visually jumps backward.
 *
 * This module helps fix that by:
 * 1. Parsing the current computed transform (what's actually on screen)
 * 2. Finding which keyframe matches that position
 * 3. Returning the frame time so css-runner can adjust startTime accordingly
 *
 * Currently supports translate-based transforms only (most common case).
 * Other transform functions (scale, rotate, skew) will fall back gracefully.
 *
 * @see css-runner.ts for the full timing synchronization logic
 * @see Mozilla Bug 927349, Chromium Blink Animation README
 */

interface TranslateValues {
  x: number;
  y: number;
}

/**
 * Extract translate values from transform string
 * Handles: translateX, translateY, translate, translate3d, matrix, matrix3d
 *
 * Note: getComputedStyle always returns matrix() or matrix3d() format,
 * but keyframes may use translate functions directly.
 */
export function parseTranslateValues(
  transform: string,
): TranslateValues | null {
  if (!transform || transform === "none") {
    return null;
  }

  // matrix(a, b, c, d, tx, ty) - computedStyle returns this format for 2D
  const matrixMatch = transform.match(
    /matrix\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)\s*\)/,
  );
  if (matrixMatch) {
    return {
      x: parseFloat(matrixMatch[5]!),
      y: parseFloat(matrixMatch[6]!),
    };
  }

  // matrix3d(16 values) - tx is 13th value (index 12), ty is 14th (index 13)
  const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
  if (matrix3dMatch) {
    const values = matrix3dMatch[1]!
      .split(",")
      .map((v) => parseFloat(v.trim()));
    if (values.length >= 14) {
      return {
        x: values[12]!,
        y: values[13]!,
      };
    }
  }

  // translate3d(x, y, z)
  const translate3dMatch = transform.match(
    /translate3d\(\s*([^,]+),\s*([^,]+),\s*[^)]+\)/,
  );
  if (translate3dMatch) {
    return {
      x: parseFloat(translate3dMatch[1]!),
      y: parseFloat(translate3dMatch[2]!),
    };
  }

  // translate(x, y) or translate(x)
  const translateMatch = transform.match(
    /translate\(\s*([^,)]+)(?:,\s*([^)]+))?\s*\)/,
  );
  if (translateMatch) {
    return {
      x: parseFloat(translateMatch[1]!),
      y: translateMatch[2] ? parseFloat(translateMatch[2]) : 0,
    };
  }

  // translateX(x)
  const translateXMatch = transform.match(/translateX\(\s*([^)]+)\s*\)/);
  if (translateXMatch) {
    return {
      x: parseFloat(translateXMatch[1]!),
      y: 0,
    };
  }

  // translateY(y)
  const translateYMatch = transform.match(/translateY\(\s*([^)]+)\s*\)/);
  if (translateYMatch) {
    return {
      x: 0,
      y: parseFloat(translateYMatch[1]!),
    };
  }

  return null;
}

/**
 * Calculate distance between two translate values
 */
function calculateDistance(a: TranslateValues, b: TranslateValues): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Result of interpolation attempt
 */
export interface InterpolationResult {
  success: boolean;
  frameTime: number;
  confidence: "high" | "low";
}

/**
 * Find the elapsed time that best matches the current computed transform
 *
 * @param keyframes - The keyframes array passed to WAAPI
 * @param frameTimes - Array of time values corresponding to each keyframe (ms)
 * @param computedTransform - Current transform from getComputedStyle
 * @returns InterpolationResult with matched frame time, or success=false if no match
 */
export function interpolateElapsedTime(
  keyframes: Keyframe[],
  frameTimes: number[],
  computedTransform: string,
): InterpolationResult {
  const currentValues = parseTranslateValues(computedTransform);

  // Can't parse computed transform - fall back
  if (!currentValues) {
    return { success: false, frameTime: 0, confidence: "low" };
  }

  // Check if first keyframe has transform
  const firstKeyframe = keyframes[0];
  if (!firstKeyframe || typeof firstKeyframe.transform !== "string") {
    return { success: false, frameTime: 0, confidence: "low" };
  }

  const firstValues = parseTranslateValues(firstKeyframe.transform);
  if (!firstValues) {
    return { success: false, frameTime: 0, confidence: "low" };
  }

  // Find best matching keyframe
  let bestIndex = 0;
  let bestDistance = Infinity;

  for (let i = 0; i < keyframes.length; i++) {
    const keyframe = keyframes[i];
    if (!keyframe || typeof keyframe.transform !== "string") {
      continue;
    }

    const keyframeValues = parseTranslateValues(keyframe.transform);
    if (!keyframeValues) {
      continue;
    }

    const distance = calculateDistance(currentValues, keyframeValues);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }

    // Perfect match, no need to continue
    if (distance === 0) {
      break;
    }
  }

  const frameTime = frameTimes[bestIndex];
  if (frameTime === undefined) {
    return { success: false, frameTime: 0, confidence: "low" };
  }

  // Determine confidence based on match quality
  // High confidence: within 0.5px (sub-pixel accuracy)
  // Low confidence: within 5px (might be due to rounding or different property)
  const confidence = bestDistance <= 0.5 ? "high" : "low";

  // If distance is too large (> 10px), probably wrong property or no match
  if (bestDistance > 10) {
    return { success: false, frameTime: 0, confidence: "low" };
  }

  return {
    success: true,
    frameTime,
    confidence,
  };
}
