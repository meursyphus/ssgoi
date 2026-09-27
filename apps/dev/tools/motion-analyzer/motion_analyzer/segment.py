"""Motion intervals from arrays, independent of video I/O or reporting."""

from __future__ import annotations

import cv2
import numpy as np
from scipy.ndimage import median_filter


def measure_activity(frames):
    n, h, w = frames.shape
    # A blinking clock/home indicator must not turn an entire recording into motion.
    y0, y1 = int(h * 0.055), int(h * 0.955)
    energy, area, shift = np.zeros(n), np.zeros(n), np.zeros((n, 2))
    previous = None
    for i in range(n):
        current = cv2.resize(
            frames[i, y0:y1], (min(w, 240), round((y1 - y0) * min(w, 240) / w))
        )
        if previous is not None:
            diff = cv2.absdiff(current, previous)
            energy[i] = np.mean(np.maximum(diff.astype(float) - 3, 0))
            area[i] = np.mean(diff > 15)
            if energy[i] > 0.25:
                pts = cv2.goodFeaturesToTrack(previous, 100, 0.02, 6)
                if pts is not None:
                    q, ok, _ = cv2.calcOpticalFlowPyrLK(previous, current, pts, None)
                    if q is not None and np.sum(ok) >= 8:
                        delta = (q - pts).reshape(-1, 2)[ok.ravel() > 0]
                        med = np.median(delta, axis=0)
                        if np.mean(np.linalg.norm(delta - med, axis=1) < 2) > 0.65:
                            shift[i] = med * w / min(w, 240)
        previous = current
    return energy, area, shift


def segment(pts, energy, area, shift, threshold=None, gap_ms=120, min_ms=100):
    threshold = float(
        threshold if threshold is not None else max(0.28, np.percentile(energy, 20) * 4)
    )
    active = (energy > threshold) & (area > 0.002)
    idx = np.flatnonzero(active)
    if not len(idx):
        return [], threshold
    groups = np.split(idx, np.flatnonzero(np.diff(pts[idx]) > gap_ms) + 1)
    intervals = []
    for g in groups:
        start, end = max(0, int(g[0]) - 1), min(len(pts) - 1, int(g[-1]) + 1)
        if pts[end] - pts[start] < min_ms or len(g) < 3:
            continue
        # Split sustained, coherent translation reversals, not one noisy optical-flow vector.
        axis = int(np.argmax(np.sum(np.abs(shift[start : end + 1]), axis=0)))
        v = median_filter(shift[:, axis], size=3)
        cuts = []
        for i in range(start + 3, end - 3):
            before, after = np.median(v[i - 3 : i]), np.median(v[i : i + 3])
            if before * after < -1 and min(abs(before), abs(after)) > 1:
                if (
                    pts[i] - pts[cuts[-1] if cuts else start] >= 160
                    and pts[end] - pts[i] >= 160
                ):
                    cuts.append(i)
        boundaries = [start] + cuts + [end]
        for a, b in zip(boundaries, boundaries[1:]):
            peak = float(np.max(area[a : b + 1]))
            kind = "continuous-or-mixed" if pts[b] - pts[a] > 1400 else "motion"
            if sum(area[a : b + 1] > 0.75) <= 2 and peak > 0.75:
                kind = "possible-cut"
            intervals.append(
                {
                    "startFrame": a,
                    "endFrame": b,
                    "startMs": float(pts[a]),
                    "endMs": float(pts[b]),
                    "durationMs": float(pts[b] - pts[a]),
                    "kind": kind,
                    "peakChangedArea": peak,
                    "source": "automatic",
                }
            )
    return intervals, threshold
