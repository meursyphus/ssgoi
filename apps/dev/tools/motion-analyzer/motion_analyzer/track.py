"""Geometric element proposals + bidirectional feature tracking.

Labels describe observable geometry/lifetime, not an inferred DOM or app identity.
Explicit named ROIs supply semantic identities when computer vision is ambiguous.
"""

from __future__ import annotations

import warnings
import cv2
import numpy as np
from scipy.ndimage import median_filter


def nanmedian(a, axis=None):
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        return np.nanmedian(a, axis=axis)


def track_points(frames, anchor, mask=None):
    cv2.setRNGSeed(7)
    seed = cv2.goodFeaturesToTrack(
        frames[anchor], 420, 0.012, 5, mask=mask, blockSize=5
    )
    if seed is None:
        return np.empty((len(frames), 0, 2))
    seed = seed.reshape(-1, 2)
    result = np.full((len(frames), len(seed), 2), np.nan)
    result[anchor] = seed
    for direction in [-1, 1]:
        alive = np.arange(len(seed))
        old = seed.copy()
        for i in range(
            anchor + direction, len(frames) if direction > 0 else -1, direction
        ):
            if not len(alive):
                break
            new, ok, err = cv2.calcOpticalFlowPyrLK(
                frames[i - direction],
                frames[i],
                old.reshape(-1, 1, 2).astype(np.float32),
                None,
                winSize=(25, 25),
                maxLevel=3,
                criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01),
            )
            back, bok, _ = cv2.calcOpticalFlowPyrLK(
                frames[i],
                frames[i - direction],
                new,
                None,
                winSize=(25, 25),
                maxLevel=3,
            )
            new, back = new.reshape(-1, 2), back.reshape(-1, 2)
            h, w = frames[i].shape
            valid = (
                (ok.ravel() > 0)
                & (bok.ravel() > 0)
                & (np.linalg.norm(back - old, axis=1) < 1.5)
            )
            valid &= (
                (err.ravel() < 35)
                & (new[:, 0] > 2)
                & (new[:, 0] < w - 3)
                & (new[:, 1] > 2)
                & (new[:, 1] < h - 3)
            )
            alive, old = alive[valid], new[valid]
            result[i, alive] = old
    return result


def region_proposals(frame):
    h, w = frame.shape
    edges = cv2.Canny(frame, 55, 125)
    edges[: int(0.06 * h)] = 0
    edges[int(0.95 * h) :] = 0
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, np.ones((7, 11), np.uint8))
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for contour in contours:
        x, y, bw, bh = cv2.boundingRect(contour)
        if (
            bw >= 18
            and bh >= 12
            and bw * bh >= 0.002 * w * h
            and bw * bh <= 0.65 * w * h
        ):
            x0, y0 = max(0, x - 3), max(0, y - 3)
            boxes.append([x0, y0, min(w, x + bw + 3) - x0, min(h, y + bh + 3) - y0])
    return sorted(boxes, key=lambda b: b[2] * b[3], reverse=True)[:16]


def similarity_series(bank, anchor, ids):
    n = len(bank)
    ref = bank[anchor, ids]
    center = np.mean(ref, axis=0)
    values = np.full((n, 3), np.nan)
    support = np.zeros(n)
    for i in range(n):
        valid = np.isfinite(bank[i, ids, 0])
        if valid.sum() < 3:
            continue
        src = ref[valid].astype(np.float32)
        dst = bank[i, ids][valid].astype(np.float32)
        matrix, inliers = cv2.estimateAffinePartial2D(
            src,
            dst,
            method=cv2.RANSAC,
            ransacReprojThreshold=1.5,
            maxIters=500,
            confidence=0.99,
        )
        if matrix is None or inliers.sum() < max(3, len(ids) * 0.2):
            continue
        scale = float(np.hypot(matrix[0, 0], matrix[1, 0]))
        if not 0.15 < scale < 6:
            continue
        values[i, :2] = matrix[:, :2] @ center + matrix[:, 2]
        values[i, 2] = scale
        support[i] = inliers.sum() / len(ids)
    return values, support, center


def motion_groups(bank, anchor):
    if bank.shape[1] < 6:
        return []
    displacement = np.linalg.norm(bank - bank[anchor][None, :, :], axis=2)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        moving = np.nanmax(displacement, axis=0) > 1.4
    remaining = np.flatnonzero(moving)
    groups = []
    for _ in range(4):
        if len(remaining) < 6:
            break
        counts = np.sum(
            np.isfinite(displacement[:, remaining])
            & (displacement[:, remaining] > 1.4),
            axis=1,
        )
        frame = int(np.argmax(counts))
        valid = np.isfinite(bank[frame, remaining, 0])
        candidates = remaining[valid]
        if len(candidates) < 6:
            break
        _, inliers = cv2.estimateAffinePartial2D(
            bank[anchor, candidates].astype(np.float32),
            bank[frame, candidates].astype(np.float32),
            method=cv2.RANSAC,
            ransacReprojThreshold=1.5,
            maxIters=1000,
            confidence=0.995,
        )
        if inliers is None or inliers.sum() < 6:
            break
        ids = candidates[inliers.ravel() > 0]
        groups.append(ids)
        remaining = np.setdiff1d(remaining, ids)
    return groups


def normalize_property(raw, times, min_change):
    valid = np.flatnonzero(np.isfinite(raw))
    if len(valid) < 6 or times[valid[-1]] - times[valid[0]] < 90:
        return None
    # Keep overshoot, and use a small stable tail when it is observable.
    first = float(raw[valid[0]])
    last = float(np.median(raw[valid[-2:]]))
    delta = last - first
    if abs(delta) < min_change:
        return None
    progress = (raw - first) / delta
    smooth = median_filter(np.interp(times, times[valid], progress[valid]), size=3)
    changes = np.flatnonzero(np.abs(smooth - smooth[0]) > 0.025)
    if not len(changes):
        return None
    onset = max(valid[0], int(changes[0]) - 1)
    # Final band must hold for all remaining observed samples; retain spring bounce.
    outside = valid[np.abs(progress[valid] - 1) > 0.025]
    end = min(valid[-1], int(outside[-1]) + 1) if len(outside) else valid[-1]
    return {
        "from": first,
        "to": last,
        "delta": delta,
        "values": raw,
        "progress": progress,
        "startMs": float(times[onset]),
        "endMs": float(times[end]),
        "observedFromMs": float(times[valid[0]]),
        "observedToMs": float(times[valid[-1]]),
    }


def alpha_series(frames, box, anchor):
    """Endpoint mixture under a static, different background; not absolute CSS opacity."""
    x, y, w, h = box
    start = frames[0, y : y + h, x : x + w].astype(float)
    end = frames[-1, y : y + h, x : x + w].astype(float)
    basis = end - start
    # Text/edges carry the signal; large flat white regions should not dominate.
    mask = np.abs(basis) > 12
    if mask.sum() < 40:
        return None
    denom = np.sum(basis[mask] ** 2)
    p, errors = [], []
    for frame in frames:
        patch = frame[y : y + h, x : x + w].astype(float)
        a = np.sum((patch - start)[mask] * basis[mask]) / denom
        p.append(a)
        errors.append(
            float(
                np.sqrt(np.mean((patch[mask] - (start + a * basis)[mask]) ** 2)) / 255
            )
        )
    # A moving/cross-occluding image does not satisfy the fixed mixture model.
    if np.quantile(errors, 0.8) > 0.055:
        return None
    return np.array(p if anchor else 1 - np.array(p)), float(np.mean(errors))


def edge_series(frames, box, axis="x", side="right", threshold=220):
    """Boundary of a bright panel adjoining one side of a Codex-selected strip.

    This deliberately measures the container, not texture moving inside it.
    The caller supplies the semantic contrast/side assumption from viewed frames.
    """
    x, y, w, h = box
    result = []
    for frame in frames:
        patch = frame[y : y + h, x : x + w]
        profile = np.median(patch, axis=0 if axis == "x" else 1).astype(float)
        bright = median_filter((profile > threshold).astype(np.uint8), size=5) > 0
        if side in ("right", "bottom"):
            dark = np.flatnonzero(~bright)
            boundary = float(dark[-1] + 1) if len(dark) else 0.0
        else:
            dark = np.flatnonzero(~bright)
            boundary = float(dark[0]) if len(dark) else float(len(profile))
        # Subpixel intensity crossing, only where a real edge is inside the strip.
        at = int(boundary)
        if 0 < at < len(profile) and abs(profile[at] - profile[at - 1]) > 5:
            boundary = (
                at
                - 1
                + float(
                    np.clip(
                        (threshold - profile[at - 1]) / (profile[at] - profile[at - 1]),
                        0,
                        1,
                    )
                )
            )
        result.append(boundary + (x if axis == "x" else y))
    return np.array(result)


def extract_tracks(
    frames, times, rois=None, max_tracks=14, pixel_scale=1.0, manual_only=False
):
    """Return measurements only. Fitting and rendering are downstream consumers."""
    cv2.setNumThreads(1)
    cv2.setRNGSeed(7)
    n, h, w = frames.shape
    all_tracks = []
    rois = rois or []
    for anchor in [0, n - 1]:
        mask = np.zeros((h, w), np.uint8)
        mask[int(0.055 * h) : int(0.955 * h)] = 255
        bank = track_points(frames, anchor, mask)
        if not bank.shape[1] and not rois:
            continue
        candidates = []
        for group in [] if manual_only else motion_groups(bank, anchor):
            ref = bank[anchor, group]
            xy0 = np.maximum(0, np.floor(ref.min(axis=0) - 5)).astype(int)
            xy1 = np.minimum([w, h], np.ceil(ref.max(axis=0) + 5)).astype(int)
            candidates.append((group, [*xy0, *(xy1 - xy0)], "surface", None))
        for box in [] if manual_only else region_proposals(frames[anchor]):
            x, y, bw, bh = box
            ref = bank[anchor]
            ids = np.flatnonzero(
                (ref[:, 0] >= x)
                & (ref[:, 0] <= x + bw)
                & (ref[:, 1] >= y)
                & (ref[:, 1] <= y + bh)
            )
            if len(ids) >= 4:
                candidates.append((ids, box, "element", None))
        for roi in rois:
            if (roi.get("anchor", "end") == "start") != (anchor == 0):
                continue
            box = [round(v / pixel_scale) for v in roi["box"]]
            x, y, bw, bh = box
            if x < 0 or y < 0 or bw <= 0 or bh <= 0 or x + bw > w or y + bh > h:
                raise ValueError(f"ROI {roi['name']!r} is outside the decoded frame")
            ref = bank[anchor]
            ids = np.flatnonzero(
                (ref[:, 0] >= x)
                & (ref[:, 0] <= x + bw)
                & (ref[:, 1] >= y)
                & (ref[:, 1] <= y + bh)
            )
            candidates.insert(0, (ids, box, "manual", roi))
        for ids, box, kind, roi in candidates:
            if roi and roi.get("method") == "edge":
                axis = roi.get("edgeAxis", "x")
                raw = (
                    edge_series(
                        frames,
                        box,
                        axis,
                        roi.get("edgeSide", "right"),
                        roi.get("edgeThreshold", 220),
                    )
                    * pixel_scale
                )
                prop = normalize_property(raw, times, 1.5 * pixel_scale)
                if prop is not None:
                    all_tracks.append(
                        {
                            "name": roi["name"],
                            "role": roi.get("role", "unknown"),
                            "kind": "manual",
                            "anchorFrame": anchor,
                            "box": box,
                            "pointCount": 0,
                            "trackingScore": 0.9,
                            "incomplete": False,
                            "properties": {axis: prop},
                            "notes": [
                                "Panel boundary measured in the selected contrast strip. The bright panel must adjoin the specified side."
                            ],
                            "support": [1.0] * n,
                            "featureIds": [],
                            "anchorPoints": [],
                            "semanticSource": "codex-plan",
                            "geometryEvidence": roi.get("evidence", ""),
                            "explicitEndpoints": False,
                            "measurementMethod": "brightness-boundary",
                        }
                    )
                continue
            active_bank = bank
            if roi:
                roi_mask = np.zeros((h, w), np.uint8)
                x, y, bw, bh = box
                roi_mask[y : y + bh, x : x + bw] = 255
                active_bank = track_points(frames, anchor, roi_mask)
                ids = np.arange(active_bank.shape[1])
            if roi and roi.get("method") == "alpha":
                alpha = alpha_series(frames, box, anchor)
                if alpha is None:
                    continue
                prop = normalize_property(alpha[0], times, 0.15)
                if prop is None:
                    continue
                all_tracks.append(
                    {
                        "name": roi["name"],
                        "role": roi.get("role", "mixture"),
                        "kind": "manual",
                        "anchorFrame": anchor,
                        "box": box,
                        "pointCount": 0,
                        "trackingScore": max(0, 1 - alpha[1] * 10),
                        "incomplete": False,
                        "properties": {"opacityProxy": prop},
                        "notes": [
                            "Endpoint mixture under a static background; not uniquely identifiable CSS opacity."
                        ],
                        "support": [1.0] * n,
                        "featureIds": [],
                        "anchorPoints": [],
                        "semanticSource": "codex-plan",
                        "geometryEvidence": roi.get("evidence", ""),
                        "explicitEndpoints": False,
                    }
                )
                continue
            if len(ids) < 3:
                continue
            values, support, center = similarity_series(active_bank, anchor, ids)
            properties = {}
            for j, prop in enumerate(["x", "y", "scale"]):
                if roi and prop not in roi.get("properties", ["x", "y", "scale"]):
                    continue
                norm = normalize_property(
                    values[:, j] * (pixel_scale if j < 2 else 1),
                    times,
                    1.5 * pixel_scale if j < 2 else 0.025,
                )
                if norm is not None:
                    endpoints = roi.get("endpoints", {}).get(prop) if roi else None
                    if roi and prop in roi.get("offsetFromEnd", {}):
                        endpoints = [
                            norm["to"] + roi["offsetFromEnd"][prop],
                            norm["to"],
                        ]
                    if roi and prop in roi.get("offsetToStart", {}):
                        endpoints = [
                            norm["from"],
                            norm["from"] + roi["offsetToStart"][prop],
                        ]
                    if endpoints:
                        first, last = endpoints
                        if first == last:
                            raise ValueError("Normalization endpoints must differ")
                        norm.update(
                            {
                                "from": first,
                                "to": last,
                                "delta": last - first,
                                "progress": (norm["values"] - first) / (last - first),
                            }
                        )
                    properties[prop] = norm
            survives = support[-1 if anchor == 0 else 0] >= 0.45
            role = "shared" if survives else ("out" if anchor == 0 else "in")
            if roi:
                role = roi.get("role", role)
            notes = []
            if not properties:
                alpha = alpha_series(frames, box, anchor) if roi is None else None
                if alpha is not None:
                    norm = normalize_property(alpha[0], times, 0.15)
                    if norm:
                        properties["opacityProxy"] = norm
                        notes.append(
                            "Opacity is an endpoint-mixture estimate, not uniquely identifiable CSS alpha."
                        )
                        role = roi.get("role", role) if roi else "mixture"
                if not properties:
                    continue
            else:
                # Affine-tracked displacement is required for moving alpha; avoid a false alpha curve.
                notes.append(
                    "Opacity during motion is unobserved; occlusion and alpha cannot be separated reliably."
                )
            valid = np.flatnonzero(np.any(np.isfinite(values), axis=1))
            incomplete = not len(valid) or valid[0] > 1 or valid[-1] < n - 2
            if incomplete:
                notes.append(
                    "Partly occluded track: progress is normalized over the visible range; full-motion physics is provisional."
                )
            explicit = bool(
                roi
                and any(
                    roi.get(k) for k in ["endpoints", "offsetFromEnd", "offsetToStart"]
                )
            )
            if explicit:
                notes.append(
                    "Normalization uses explicit geometric endpoints supplied in the Codex plan."
                )
            if kind == "surface" and box[2] * box[3] < w * h * 0.08:
                kind = "element"
            label = (
                roi["name"]
                if roi
                else f"{'Surface' if kind=='surface' else 'Region'} · {role} · {'top' if center[1]<h/3 else 'bottom' if center[1]>2*h/3 else 'middle'}"
            )
            score = float(np.mean(support)) * min(1, len(ids) / 20)
            track = {
                "name": label,
                "role": role,
                "kind": kind,
                "anchorFrame": anchor,
                "box": [int(v) for v in box],
                "pointCount": len(ids),
                "trackingScore": score,
                "incomplete": incomplete,
                "properties": properties,
                "notes": notes,
                "support": support.tolist(),
                "featureIds": ids.tolist(),
                "anchorPoints": active_bank[anchor, ids].tolist(),
                "semanticSource": "codex-plan" if roi else "geometric-heuristic",
                "geometryEvidence": roi.get("evidence", "") if roi else "",
                "explicitEndpoints": explicit,
                "onsetMs": roi.get("onsetMs", 0.0) if roi else 0.0,
            }
            all_tracks.append(track)
    # Keep spatially distinct elements even when their curves are the same.
    chosen = []
    for track in sorted(
        all_tracks,
        key=lambda t: (
            t["kind"] != "manual",
            t["incomplete"],
            t["kind"] != "surface",
            -t["trackingScore"],
        ),
    ):
        duplicate = False
        for prev in chosen:
            shared = set(track["properties"]) & set(prev["properties"])
            if not shared:
                continue
            a, b = track["box"], prev["box"]
            overlap = max(0, min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])) * max(
                0, min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
            )
            iou = overlap / max(1, a[2] * a[3] + b[2] * b[3] - overlap)
            errors = []
            for p in shared:
                diff = (
                    track["properties"][p]["progress"]
                    - prev["properties"][p]["progress"]
                )
                if np.isfinite(diff).sum() >= 6:
                    errors.append(np.sqrt(np.nanmean(diff**2)))
            if track["kind"] != "manual" and iou > 0.5 and errors and max(errors) < 0.1:
                duplicate = True
                break
        if not duplicate:
            chosen.append(track)
        if len(chosen) >= max_tracks:
            break
    for roi in rois:
        if roi["name"] not in [t["name"] for t in chosen]:
            chosen.append(
                {
                    "name": roi["name"],
                    "role": roi.get("role", "unknown"),
                    "kind": "manual",
                    "anchorFrame": 0 if roi.get("anchor", "end") == "start" else n - 1,
                    "box": [round(v / pixel_scale) for v in roi["box"]],
                    "properties": {},
                    "notes": [
                        "No coherent measurement: insufficient texture, occlusion, deformation, or too few visible frames. Refine this ROI or use another anchor."
                    ],
                    "fitError": "This requested element could not be measured reliably.",
                    "semanticSource": "codex-plan",
                    "trackingScore": 0.0,
                    "incomplete": True,
                    "pointCount": 0,
                }
            )
    return chosen
