"""SSGOI's 60 Hz semi-implicit Euler and bounded inverse fitting.

Parity is checked against the repository's actual TypeScript through core-reference.mjs.
No continuous-time analytical spring or Bezier is used to choose physics values.
"""

from __future__ import annotations

import math
import numpy as np
from scipy.optimize import least_squares

from .reference import preset_curves

DT = 1 / 60
FRAME_MS = 1000 / 60
# Inferring an unobserved rest position is a mild extrapolation prior: placing an
# endpoint one observed-span away costs as much as 0.1% RMSE of travel, so the
# fit only extends off-screen travel when the visible curve demands it.
EXTRAPOLATION_WEIGHT = 0.001
# Fits closer than this (in progress units) are indistinguishable given pixel
# tracking noise; the parsimony rule then prefers fewer parameters and the
# smaller off-screen extrapolation.
EQUIVALENT_RMSE = 0.001


def simulate(model, params, initial_velocity=0.0, rest_delta=0.01, rest_speed=0.01):
    p, v, lp, lv, settled = (
        0.0,
        float(initial_velocity),
        0.0,
        float(initial_velocity),
        0.0,
    )
    positions, velocities = [], []
    if model != "inertia":
        k, c = params["stiffness"], params["damping"]
        ratio = params.get("doubleSpring", 1.0)
    for i in range(600):
        positions.append(p)
        velocities.append(v)
        if model == "inertia":
            direction = 1 if 1 > p else -1
            nv = (
                v
                + (
                    direction * params["acceleration"]
                    - params["resistance"] * v * abs(v)
                )
                * DT
            )
            np_ = p + nv * DT
            p = min(1.0, np_) if direction > 0 else max(1.0, np_)
            v = 0.0 if p == 1.0 else nv
            rest = abs(1 - p) < rest_delta
        else:
            target = 1.0
            if model == "doubleSpring":
                lv += -DT * c * lv + DT * k * (1 - lp)
                lp += DT * lv
                target = lp
            v += -DT * c * v + DT * k * (ratio if model == "doubleSpring" else 1) * (
                target - p
            )
            p += DT * v
            rest = abs(1 - p) < rest_delta and abs(v) < rest_speed
            if model == "doubleSpring":
                rest = rest and abs(1 - lp) < rest_delta and abs(lv) < rest_speed
        if not math.isfinite(p) or abs(p) > 1e8:
            return np.array([0.0, 1e6]), np.array([0.0, 1e6]), False
        settled = settled + DT if rest else 0.0
        if settled >= 0.05:
            positions.append(1.0)
            velocities.append(0.0)
            return np.array(positions), np.array(velocities), True
    return np.array(positions), np.array(velocities), False


def sample(
    model,
    params,
    times_ms,
    t0_ms=0.0,
    initial_velocity=0.0,
    rest_delta=0.01,
    rest_speed=0.01,
):
    p, _, _ = simulate(model, params, initial_velocity, rest_delta, rest_speed)
    return np.interp(
        np.asarray(times_ms) - t0_ms,
        np.arange(len(p)) * FRAME_MS,
        p,
        left=0,
        right=p[-1],
    )


def duration_bounce(k, c):
    zeta = c / (2 * math.sqrt(k))
    return {
        "duration": 2 * math.pi / math.sqrt(k),
        "bounce": 1 - zeta if zeta <= 1 else 1 / zeta - 1,
    }


def spring_params(duration, bounce=0.0):
    return {
        "stiffness": (2 * math.pi / duration) ** 2,
        "damping": (
            4 * math.pi * (1 - bounce) / duration
            if bounce >= 0
            else 4 * math.pi / (duration * (1 + bounce))
        ),
    }



def fit_physics(
    times,
    observations,
    onset_ms=0.0,
    frame_ms=FRAME_MS,
    mode="all",
    initial_velocity=0.0,
    rest_delta=0.01,
    rest_speed=0.01,
    free_start=False,
    free_end=False,
):
    """Fit all independent properties jointly; NaN marks invisible/unmeasured points.

    `observations` are normalized over their observed endpoints (0 → 1). When a
    property's rest position was not observed — an incoming page starts off
    screen, an outgoing page ends fully covered — `free_start` / `free_end` let
    the fit place that endpoint itself, in the same units. The returned
    `endpointScale` holds the fitted start/end per column so callers can
    re-normalize; RMSE and residuals are reported over the fitted full travel.
    """
    times = np.asarray(times, dtype=float)
    values = np.asarray(observations, dtype=float)
    if values.ndim == 1:
        values = values[:, None]
    mask = np.isfinite(values)
    if np.sum(mask) < 6:
        raise ValueError("At least six measured samples are required")
    columns = values.shape[1]
    # An unobserved start means motion began before the first visible sample,
    # possibly at the segment start; widen the onset window accordingly.
    lo_t = -frame_ms if free_start else onset_ms - frame_ms
    hi_t = onset_ms + 3 * frame_ms
    t0_starts = sorted({onset_ms, 0.0} if free_start else {onset_ms})
    end_lower = [-6.0] * columns * free_start + [0.4] * columns * free_end
    end_upper = [0.6] * columns * free_start + [7.0] * columns * free_end
    end_start = [-0.05] * columns * free_start + [1.05] * columns * free_end

    def endpoints(x):
        start = np.zeros(columns)
        end = np.ones(columns)
        tail = list(x)
        if free_end:
            end = np.array(tail[-columns:])
            tail = tail[:-columns]
        if free_start:
            start = np.array(tail[-columns:])
        return start, end

    candidates = []
    for model in (
        ["spring"]
        if mode == "duration-bounce"
        else ["spring", "inertia", "doubleSpring"]
    ):
        if mode == "duration-bounce":
            lower, upper = [0.14, -0.45], [2.0, 0.65]
            starts = [[d, b] for d, b in [(0.3, 0), (0.5, 0.2), (0.8, 0)]]
        elif model == "inertia":
            lower, upper = [math.log(0.5), math.log(0.001)], [
                math.log(3000),
                math.log(12),
            ]
            starts = [
                [math.log(a), math.log(r)] for a, r in [(25, 1.5), (150, 1.5), (500, 0.2)]
            ]
        else:
            lower, upper = [math.log(10), math.log(1)], [math.log(2400), math.log(100)]
            starts = [
                [math.log(k), math.log(c)] for k, c in [(150, 20), (400, 30), (800, 40)]
            ]
            if model == "doubleSpring":
                lower += [0.5]
                upper += [2.0]
                starts = [p + [r] for p, r in zip(starts, [0.7, 1.2, 1.8])]
        physics_count = len(lower)
        lower += [lo_t] + end_lower
        upper += [hi_t] + end_upper
        starts = [p + [t0] + end_start for p in starts for t0 in t0_starts]

        def unpack(x):
            if mode == "duration-bounce":
                params = spring_params(x[0], x[1])
            elif model == "inertia":
                params = {"acceleration": math.exp(x[0]), "resistance": math.exp(x[1])}
            else:
                params = {"stiffness": math.exp(x[0]), "damping": math.exp(x[1])}
                if model == "doubleSpring":
                    params["doubleSpring"] = x[2]
            return params, x[physics_count]

        def residual(x):
            params, t0 = unpack(x)
            start, end = endpoints(x)
            predicted = sample(
                model, params, times, t0, initial_velocity, rest_delta, rest_speed
            )
            modelled = start[None, :] + (end - start)[None, :] * predicted[:, None]
            data = np.clip((modelled - values)[mask], -1e5, 1e5)
            prior = EXTRAPOLATION_WEIGHT * math.sqrt(len(data))
            return np.concatenate([data, prior * start, prior * (end - 1)])

        best = min(
            (
                least_squares(
                    residual,
                    x,
                    bounds=(lower, upper),
                    max_nfev=180,
                    ftol=1e-8,
                    xtol=1e-8,
                    gtol=1e-8,
                )
                for x in starts
            ),
            key=lambda r: np.mean(r.fun**2),
        )
        params, t0 = unpack(best.x)
        start, end = endpoints(best.x)
        sim, vel, settled = simulate(
            model, params, initial_velocity, rest_delta, rest_speed
        )
        if not settled:
            continue
        predicted = sample(
            model, params, times, t0, initial_velocity, rest_delta, rest_speed
        )
        # Observations and residuals in full-travel progress units.
        travel = (values - start[None, :]) / (end - start)[None, :]
        residuals = travel - predicted[:, None]
        hit = np.flatnonzero(np.abs(sim - 1) <= 0.02)
        candidate = {
            "model": model,
            "params": {k: float(v) for k, v in params.items()},
            "t0Ms": float(t0),
            "initialVelocity": initial_velocity,
            "restDelta": rest_delta,
            "restSpeed": rest_speed,
            "rmse": float(np.sqrt(np.mean(residuals[mask] ** 2))),
            "settleMs": (len(sim) - 1) * FRAME_MS,
            "arrivalMs": float(hit[0] * FRAME_MS) if len(hit) else None,
            "endpointScale": {"start": start.tolist(), "end": end.tolist()},
            "extrapolation": float(max(np.abs(start).max(), np.abs(end - 1).max())),
            "predicted": predicted.tolist(),
            "travel": travel,
            "simulation": {
                "timeMs": (np.arange(len(sim)) * FRAME_MS).tolist(),
                "progress": sim.tolist(),
                "velocity": vel.tolist(),
            },
        }
        if model != "inertia":
            candidate.update(duration_bounce(params["stiffness"], params["damping"]))
        candidates.append(candidate)
    if not candidates:
        raise ValueError("No stable integrator fits this track")
    candidates.sort(key=lambda c: c["rmse"])
    # Prefer fewer parameters, then the smaller inferred off-screen travel, among
    # fits within 10% (or the noise floor) of the best RMSE.
    equivalent = [
        c
        for c in candidates
        if c["rmse"] <= candidates[0]["rmse"] * 1.1 + EQUIVALENT_RMSE
    ]
    selected = min(
        equivalent,
        key=lambda c: (c["model"] == "doubleSpring", c["extrapolation"], c["rmse"]),
    )
    selected = dict(selected)
    travel = selected.pop("travel")
    selected["alternatives"] = [
        {k: v for k, v in c.items() if k not in ("simulation", "predicted", "travel")}
        | {"equivalent": c in equivalent}
        for c in candidates
        if c["model"] != selected["model"]
    ]
    selected["residuals"] = [
        [float(v) if np.isfinite(v) else None for v in row]
        for row in travel - np.array(selected["predicted"])[:, None]
    ]
    # Semantic presets come from packages/core/src/lib/motion/presets.ts via the
    # core bridge, so a recalibrated preset never leaves this comparison stale.
    ranking = []
    for preset in preset_curves():
        pred = np.interp(
            times - selected["t0Ms"],
            preset["timeMs"],
            preset["progress"],
            left=0,
            right=preset["progress"][-1],
        )
        ranking.append(
            {
                "name": preset["name"],
                "kind": preset["kind"],
                "rmse": float(np.sqrt(np.mean(((pred[:, None] - travel)[mask]) ** 2))),
            }
        )
    selected["nearestPreset"] = min(ranking, key=lambda c: c["rmse"])
    selected["presetRanking"] = sorted(ranking, key=lambda c: c["rmse"])
    return selected


def fit_bezier(times, progress, start_ms, end_ms):
    """A separate descriptive CSS curve, never the physical reproduction model."""
    times, progress = np.asarray(times), np.asarray(progress)
    valid = np.isfinite(progress) & (times >= start_ms) & (times <= end_ms)
    if valid.sum() < 5 or end_ms - start_ms < 50:
        return None
    u = np.linspace(0, 1, 401)

    def predict(c, t):
        x1, y1, x2, y2 = c
        x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u**3
        y = 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u**3
        return np.interp(np.clip((t - start_ms) / (end_ms - start_ms), 0, 1), x, y)

    best = min(
        (
            least_squares(
                lambda c: predict(c, times[valid]) - progress[valid],
                c,
                bounds=([0, -1, 0, -1], [1, 2, 1, 2]),
                max_nfev=120,
            )
            for c in [[0.2, 0, 0.2, 1], [0.4, 0, 0.6, 1], [0, 0.5, 0.5, 1]]
        ),
        key=lambda r: np.mean(r.fun**2),
    )
    return {
        "controlPoints": best.x.tolist(),
        "startMs": float(start_ms),
        "endMs": float(end_ms),
        "rmse": float(np.sqrt(np.mean(best.fun**2))),
        "predicted": predict(best.x, times).tolist(),
        "purpose": "visual-reference-only",
    }
