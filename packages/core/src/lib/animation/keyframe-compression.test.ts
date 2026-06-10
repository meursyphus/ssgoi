import { describe, expect, it } from "vitest";
import { compressSettledFrames } from "./keyframe-compression";

describe("compressSettledFrames", () => {
  it("keeps everything for two or fewer frames", () => {
    expect(compressSettledFrames([], 0.01)).toEqual([]);
    expect(compressSettledFrames([0.5], 0.01)).toEqual([0]);
    expect(compressSettledFrames([0, 1], 0.01)).toEqual([0, 1]);
  });

  it("keeps fast-moving sections at full resolution", () => {
    const positions = [0, 0.2, 0.4, 0.6, 0.8, 1];
    expect(compressSettledFrames(positions, 0.01)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("collapses a flat settle tail to its endpoints", () => {
    const positions = [0, 0.5, 1, 1.001, 1.002, 1.001, 1.0, 1.0];
    const kept = compressSettledFrames(positions, 0.01);
    expect(kept).toEqual([0, 1, 2, 7]);
  });

  it("collapses a mid-flight plateau but keeps the surrounding motion", () => {
    const positions = [0, 0.5, 0.5, 0.5, 0.5, 1];
    const kept = compressSettledFrames(positions, 0.01);
    expect(kept).toEqual([0, 1, 4, 5]);
  });

  it("always keeps first and last frames", () => {
    const positions = Array.from({ length: 100 }, () => 1);
    const kept = compressSettledFrames(positions, 0.01);
    expect(kept[0]).toBe(0);
    expect(kept[kept.length - 1]).toBe(99);
    expect(kept).toEqual([0, 99]);
  });

  it("bounds the position deviation of dropped frames by the band", () => {
    // Damped oscillation around 1 — the classic spring tail.
    const positions: number[] = [];
    for (let i = 0; i < 200; i++) {
      positions.push(1 + 0.2 * Math.exp(-i / 12) * Math.cos(i / 3));
    }
    const band = 0.005;
    const kept = compressSettledFrames(positions, band);

    expect(kept.length).toBeLessThan(positions.length);
    // Every dropped frame must sit inside the band window spanned by its
    // surrounding kept frames' run.
    for (let k = 0; k < kept.length - 1; k++) {
      const start = kept[k]!;
      const end = kept[k + 1]!;
      if (end - start <= 1) continue; // adjacent kept frames, nothing dropped
      const window = positions.slice(start, end);
      const low = Math.min(...window);
      const high = Math.max(...window);
      expect(high - low).toBeLessThanOrEqual(band);
    }
  });

  it("returns strictly increasing indices", () => {
    const positions = [0, 0.1, 0.1, 0.1, 0.5, 0.5, 0.9, 1, 1, 1];
    const kept = compressSettledFrames(positions, 0.02);
    for (let i = 1; i < kept.length; i++) {
      expect(kept[i]!).toBeGreaterThan(kept[i - 1]!);
    }
  });
});
