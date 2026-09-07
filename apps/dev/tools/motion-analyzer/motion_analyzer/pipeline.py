from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path
import tempfile
import subprocess

import numpy as np

from . import __version__
from .physics import fit_physics, fit_bezier, sample
from .report import strip, activity_plot, timeline_plot, curve_plot, render
from .segment import measure_activity, segment
from .track import extract_tracks, nanmedian
from .video import decode, clip


def clean(value):
    if isinstance(value, np.ndarray):
        return clean(value.tolist())
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [clean(v) for v in value]
    if isinstance(value, (np.integer, np.floating, np.bool_)):
        value = value.item()
    if isinstance(value, float) and not np.isfinite(value):
        return None
    return value


def write_json(path, value):
    path.write_text(
        json.dumps(clean(value), ensure_ascii=False, indent=2, allow_nan=False) + "\n"
    )


def validate_plan(plan):
    if not isinstance(plan, dict) or plan.get("schemaVersion") != 1:
        raise ValueError("Analysis plan schemaVersion must be 1")
    if not isinstance(plan.get("segments"), list):
        raise ValueError("Analysis plan segments must be a list")
    for segment in plan["segments"]:
        if not isinstance(segment, dict) or not isinstance(segment.get("name"), str):
            raise ValueError("Each segment needs a name")
        for key in ["startMs", "endMs"]:
            if not isinstance(segment.get(key), (int, float)) or not np.isfinite(
                segment[key]
            ):
                raise ValueError(f"Segment {key} must be a finite number")
        if segment.get("direction", "unknown") not in [
            "forward",
            "backward",
            "unknown",
        ]:
            raise ValueError("Direction must be forward, backward or unknown")
        elements = segment.get("elements", [])
        if not isinstance(elements, list):
            raise ValueError("elements must be a list")
        names = set()
        for element in elements:
            if (
                not isinstance(element, dict)
                or not isinstance(element.get("name"), str)
                or not element["name"]
            ):
                raise ValueError("Each element needs a nonempty name")
            if element["name"] in names:
                raise ValueError("Element names must be unique within a segment")
            names.add(element["name"])
            box = element.get("box")
            if (
                not isinstance(box, list)
                or len(box) != 4
                or not all(isinstance(v, (int, float)) and np.isfinite(v) for v in box)
            ):
                raise ValueError(
                    "Element box must be [x, y, width, height] with finite numbers"
                )
            if element.get("anchor", "end") not in ["start", "end"]:
                raise ValueError("Element anchor must be start or end")
            if element.get("role", "unknown") not in [
                "in",
                "out",
                "shared",
                "overlay",
                "mixture",
                "unknown",
            ]:
                raise ValueError("Unknown element role")
            if element.get("method", "features") not in ["features", "alpha", "edge"]:
                raise ValueError("Element method must be features, alpha or edge")
            if element.get("method") == "edge":
                axis = element.get("edgeAxis", "x")
                side = element.get("edgeSide", "right")
                if axis not in ["x", "y"] or side not in (
                    ["left", "right"] if axis == "x" else ["top", "bottom"]
                ):
                    raise ValueError(
                        "Edge axis/side must be x with left/right or y with top/bottom"
                    )
                threshold = element.get("edgeThreshold", 220)
                if not isinstance(threshold, (int, float)) or not 0 < threshold < 255:
                    raise ValueError("edgeThreshold must be between 0 and 255")
            if not isinstance(element.get("properties", []), list) or any(
                p not in ["x", "y", "scale"] for p in element.get("properties", [])
            ):
                raise ValueError("Element properties may contain x, y, scale")
            for key in ["endpoints", "offsetFromEnd", "offsetToStart"]:
                values = element.get(key, {})
                if not isinstance(values, dict):
                    raise ValueError(f"{key} must be an object")
                for prop, value in values.items():
                    if prop not in ["x", "y", "scale"]:
                        raise ValueError("Unknown endpoint property")
                    vals = value if key == "endpoints" else [value]
                    if (
                        not isinstance(vals, list)
                        or len(vals) != (2 if key == "endpoints" else 1)
                        or not all(
                            isinstance(v, (int, float)) and np.isfinite(v) for v in vals
                        )
                    ):
                        raise ValueError(
                            f"{key} requires finite numeric endpoints/offsets"
                        )
                    if key == "endpoints" and value[0] == value[1]:
                        raise ValueError("Endpoints must differ")
                    if (
                        sum(
                            prop in element.get(k, {})
                            for k in ["endpoints", "offsetFromEnd", "offsetToStart"]
                        )
                        > 1
                    ):
                        raise ValueError(
                            "Use only one endpoint normalization method per property"
                        )


def fingerprint(path):
    sha = hashlib.sha256()
    with open(path, "rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            sha.update(chunk)
    return sha.hexdigest()


def verify_core(fits):
    script = Path(__file__).resolve().parents[1] / "core-reference.mjs"
    payload = [
        {
            k: f[k]
            for k in ("model", "params", "initialVelocity", "restDelta", "restSpeed")
        }
        for f in fits
    ]
    result = subprocess.run(
        ["node", str(script)],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    actual = json.loads(result.stdout)
    max_error = 0.0
    for fit, reference in zip(fits, actual):
        expected = fit["simulation"]
        if len(reference) != len(expected["progress"]):
            raise ValueError(
                "Physics parity failure: SSGOI settling frame differs from the analyzer"
            )
        for key, ref_key in [
            ("progress", "position"),
            ("velocity", "velocity"),
            ("timeMs", "time"),
        ]:
            error = float(
                np.max(
                    np.abs(
                        np.array(expected[key])
                        - np.array([f[ref_key] for f in reference])
                    )
                )
            )
            max_error = max(max_error, error)
    if len(actual) != len(fits) or max_error > 1e-8:
        raise ValueError(
            f"Physics parity failure against current SSGOI source: {max_error}"
        )
    core = script.parents[4] / "packages/core/src/lib"
    paths = [
        core / "animation/web-animation.ts",
        core / "animation/integrator/spring-integrator.ts",
        core / "animation/integrator/double-spring-integrator.ts",
        core / "animation/integrator/inertia-integrator.ts",
    ]
    return {
        "status": "passed",
        "engine": "current TypeScript sources bundled with esbuild",
        "curvesChecked": len(fits),
        "maxAbsoluteError": max_error,
        "sourceHashes": {str(p.relative_to(core)): fingerprint(p) for p in paths},
    }


def inspect_video(args):
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="ssgoi-motion-") as temp:
        meta, pts, frames = decode(args.video, args.width, temp)
        energy, area, shift = measure_activity(frames)
        candidates, threshold = segment(
            pts, energy, area, shift, args.threshold, args.gap_ms, args.min_ms
        )
        if args.range:
            a, b = args.range
            if not 0 <= a < b <= pts[-1]:
                raise ValueError(
                    "Inspection range must be within the recording, in milliseconds"
                )
            indices = np.unique(
                [np.argmin(abs(pts - t)) for t in np.arange(a, b + 0.01, args.step_ms)]
            )
        else:
            indices = np.unique(
                [np.argmin(abs(pts - t)) for t in np.arange(0, pts[-1] + 1, 500)]
            )
        # Page contact sheets so long recordings remain legible and cheap for Codex to inspect.
        sheets = []
        for page, offset in enumerate(range(0, len(indices), 24)):
            name = f"contact-{page+1:02d}.png"
            strip(args.video, pts, indices[offset : offset + 24], out / name)
            sheets.append(name)
        activity_plot(pts, energy, threshold, candidates, out / "activity.png")
        for i, s in enumerate(candidates):
            ids = np.unique(
                np.linspace(s["startFrame"], s["endFrame"], 7).round().astype(int)
            )
            strip(
                args.video,
                pts,
                ids,
                out / f"candidate-{i+1:02d}.png",
                width=148,
                columns=7,
            )
        source = {
            "name": Path(args.video).name,
            "path": str(Path(args.video).resolve()),
            "sha256": fingerprint(args.video),
        }
        plan = {
            "schemaVersion": 1,
            "source": source,
            "interpretation": "",
            "segments": [
                {
                    "name": f"Motion {i+1}",
                    "startMs": s["startMs"],
                    "endMs": s["endMs"],
                    "direction": "unknown",
                    "notes": [],
                    "elements": [],
                }
                for i, s in enumerate(candidates)
            ],
            "excluded": [],
        }
        write_json(
            out / "inspection.json",
            {
                "video": meta,
                "source": source,
                "candidates": candidates,
                "contactSheets": sheets,
                "timeMs": pts,
                "activity": energy,
                "threshold": threshold,
                "next": "Inspect contact/candidate PNGs; save semantic ranges and named ROIs in a new plan JSON; run measure --plan.",
            },
        )
        # Never overwrite the agent's corrected plan during another inspection pass.
        if not (out / "plan.template.json").exists():
            write_json(out / "plan.template.json", plan)
    return {
        "inspection": str(out / "inspection.json"),
        "contactSheets": [str(out / p) for p in sheets],
        "candidateCount": len(candidates),
        "planTemplate": str(out / "plan.template.json"),
    }


def fit_tracks(tracks, times, args):
    result = []
    for source in tracks:
        keys = list(source["properties"])
        if not keys:
            result.append(
                dict(
                    source,
                    id=f"track-{len(result)+1}",
                    timeMs=times.tolist(),
                    confidence="unmeasured",
                )
            )
            continue
        matrix = np.column_stack([source["properties"][p]["progress"] for p in keys])
        mean = nanmedian(matrix, axis=1)
        disagreement = float(np.sqrt(np.nanmean((matrix - mean[:, None]) ** 2)))
        # If properties have their own timing, a single page-level progress is not a valid model.
        groups = [[p] for p in keys] if disagreement > 0.055 else [keys]
        for group in groups:
            tr = {
                **source,
                "properties": {p: source["properties"][p] for p in group},
                "notes": list(source["notes"]),
            }
            tr["timeMs"] = times.tolist()
            if len(groups) > 1:
                tr["name"] += " · " + group[0]
                tr["notes"].append(
                    "Properties have different progress curves; use separate physical tracks."
                )
            matrix = np.column_stack([tr["properties"][p]["progress"] for p in group])
            onset = min(p["startMs"] for p in tr["properties"].values())
            # Explicit geometry can expose a clipped early portion; retain the annotated onset.
            if tr.get("explicitEndpoints"):
                onset = source.get("onsetMs", 0.0)
            try:
                f = fit_physics(
                    times,
                    matrix,
                    onset,
                    float(np.median(np.diff(times))),
                    args.fit_mode,
                    args.initial_velocity,
                    args.rest_delta,
                    args.rest_speed,
                )
                tr["fit"] = f
                tr["bezier"] = fit_bezier(
                    times,
                    nanmedian(matrix, axis=1),
                    min(p["startMs"] for p in tr["properties"].values()),
                    max(p["endMs"] for p in tr["properties"].values()),
                )
                score = tr["trackingScore"]
                incomplete = tr["incomplete"] and not tr.get("explicitEndpoints")
                tr["confidence"] = (
                    "high"
                    if f["rmse"] < 0.035 and score > 0.7 and not incomplete
                    else (
                        "medium"
                        if f["rmse"] < 0.08 and score > 0.4 and not incomplete
                        else "review"
                    )
                )
                if f["rmse"] > 0.08:
                    tr["notes"].append(
                        "Large residual: recheck ROI, segmentation, a gesture-driven phase, or unsupported deformation."
                    )
                if tr.get("explicitEndpoints") and tr["incomplete"]:
                    tr["confidence"] = (
                        "medium" if f["rmse"] < 0.06 and score > 0.4 else "review"
                    )
            except ValueError as error:
                tr.update(fitError=str(error), confidence="review")
            tr["id"] = f"track-{len(result)+1}"
            result.append(tr)
    return result


def relationships(tracks):
    fitted = [tr for tr in tracks if tr.get("fit")]
    relationships = []
    for i, a in enumerate(fitted):
        for b in fitted[i + 1 :]:
            first, second = sorted([a, b], key=lambda t: t["fit"]["t0Ms"])
            f = first["fit"]
            delay = second["fit"]["t0Ms"] - f["t0Ms"]
            progress = float(
                sample(
                    f["model"],
                    f["params"],
                    [delay],
                    0,
                    f["initialVelocity"],
                    f["restDelta"],
                    f["restSpeed"],
                )[0]
            )
            threshold = float(np.clip(progress, 0, 1))
            common_end = min(
                f["t0Ms"] + f["settleMs"],
                second["fit"]["t0Ms"] + second["fit"]["settleMs"],
            )
            overlap = max(0, common_end - second["fit"]["t0Ms"])
            # SSGOI uses first crossing, while threshold 1 waits for settling.
            sim = f["simulation"]
            hit = next(
                (t for t, p in zip(sim["timeMs"], sim["progress"]) if p >= threshold),
                f["settleMs"],
            )
            if threshold == 1:
                hit = f["settleMs"]
            scheduling_error = hit - delay
            valid = abs(scheduling_error) <= 1000 / 60 + 0.01
            relationships.append(
                {
                    "first": first["id"],
                    "second": second["id"],
                    "delayMs": delay,
                    "startAt": threshold if valid else None,
                    "candidateStartAt": threshold,
                    "scheduleErrorMs": scheduling_error,
                    "overlapMs": overlap,
                    "confidence": (
                        "review"
                        if "review" in [first["confidence"], second["confidence"]]
                        else "medium"
                    ),
                    "description": f"{second['name']} starts {delay:.0f} ms after {first['name']}; "
                    + (
                        f"startAt ≈ {threshold:.3f}"
                        if valid
                        else "a progress threshold cannot represent this exact delay"
                    )
                    + f"; physical overlap {overlap:.0f} ms.",
                }
            )
    return relationships


def code_for(event, preset=None):
    lines = [
        'import { spring, InertiaIntegrator, WebAnimation, MultiAnimation } from "@ssgoi/core";',
        "",
        "// Values reproduce the measured curves; element identity and endpoints are in analysis-plan.json.",
        "// REVIEW tracks are provisional. Translation coordinates are recording pixels, not CSS pixels.",
        "// Convert them using your app's CSS-pixel / recording-pixel ratio.",
        "export const measuredTracks = [",
    ]
    fitted = [tr for tr in event["tracks"] if tr.get("fit")]
    if not fitted:
        return "// No reliable physical measurements for this segment. Refine its ROI or measurement method.\nexport const measuredTracks = [] as const;\n"
    base = min((tr["fit"]["t0Ms"] for tr in fitted), default=0)
    for tr in fitted:
        f = tr["fit"]
        config = dict(f["params"], restDelta=f["restDelta"])
        if f["model"] != "inertia":
            config["restSpeed"] = f["restSpeed"]
        expression = (
            ("new InertiaIntegrator" if f["model"] == "inertia" else "spring")
            + "("
            + json.dumps(config)
            + ")"
        )
        lines.extend(
            [
                f"  // {tr['name'].replace(chr(10),' ')} · {tr['confidence']} · RMSE {f['rmse']:.4f}",
                "  {",
                f"    id: {json.dumps(tr['id'])}, name: {json.dumps(tr['name'],ensure_ascii=False)},",
                f"    delayMs: {f['t0Ms']-base:.5f}, initialVelocity: {f['initialVelocity']},",
                f"    integrator: {expression},",
                "    from: "
                + json.dumps({p: v["from"] for p, v in tr["properties"].items()})
                + ",",
                "    to: "
                + json.dumps({p: v["to"] for p, v in tr["properties"].items()})
                + ",",
                "  },",
            ]
        )
    lines += [
        "] as const;",
        "",
        "// Bind each measurement to its element's own geometry/style.",
        "// This factory returns physical animations and their measured delays.",
        "export function createMeasuredTracks(",
        "  bind: (id: string) => { element: HTMLElement; style: (progress: number) => Record<string, string> },",
        ") {",
        "  return measuredTracks.map(track => {",
        "    const binding = bind(track.id);",
        "    const animation = new WebAnimation({ ...binding, integrator: track.integrator });",
        "    animation.matchInto([{ element: binding.element, value: 0, velocity: track.initialVelocity }]);",
        "    return { ...track, animation };",
        "  });",
        "}",
        "",
    ]
    order = sorted(fitted, key=lambda t: t["fit"]["t0Ms"])
    schedule = [0.0]
    for a, b in zip(order, order[1:]):
        match = next(
            (
                r
                for r in event["overlaps"]
                if r["first"] == a["id"] and r["second"] == b["id"]
            ),
            None,
        )
        if not match or match["startAt"] is None:
            schedule = None
            break
        schedule.append(match["startAt"])
    if schedule is not None and order:
        lines += [
            "// Progress scheduling follows the preceding child, in the order below.",
            "// Resolution is one 60 Hz simulation frame; see scheduleErrorMs in report.json.",
            "export function composeMeasuredTracks(bound: ReturnType<typeof createMeasuredTracks>) {",
            "  const order = " + json.dumps([t["id"] for t in order]) + ";",
            "  return new MultiAnimation(order.map(id => bound.find(t => t.id === id)!.animation), {",
            "    startAt: " + json.dumps(schedule) + ",",
            "  });",
            "}",
        ]
    else:
        lines += [
            "// A gap after settling or a non-monotonic crossing prevents exact progress scheduling.",
            "// Use delayMs with your orchestration clock; do not silently replace this with startAt = 1.",
        ]
    if preset:
        lines += [
            "",
            f"// Requested preset: {preset}. Check its labels, child order, and coupled flag before overriding.",
            "// Do not apply separate integrators to a preset whose tracks are geometrically coupled.",
        ]
    imports = ["WebAnimation"]
    if any(t["fit"]["model"] != "inertia" for t in fitted):
        imports.append("spring")
    if any(t["fit"]["model"] == "inertia" for t in fitted):
        imports.append("InertiaIntegrator")
    if schedule is not None and order:
        imports.append("MultiAnimation")
    lines[0] = "import { " + ", ".join(imports) + ' } from "@ssgoi/core";'
    return "\n".join(lines) + "\n"


def measure_video(args):
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    source = {
        "name": Path(args.video).name,
        "path": str(Path(args.video).resolve()),
        "sha256": fingerprint(args.video),
    }
    plan = json.loads(Path(args.plan).read_text()) if args.plan else None
    if plan is not None:
        validate_plan(plan)
    if plan and plan.get("source", {}).get("sha256") not in (None, source["sha256"]):
        raise ValueError(
            "Analysis plan belongs to a different source video (SHA-256 mismatch)"
        )
    with tempfile.TemporaryDirectory(prefix="ssgoi-motion-") as temp:
        meta, pts, frames = decode(args.video, args.width, temp)
        energy, area, shift = measure_activity(frames)
        candidates, threshold = segment(
            pts, energy, area, shift, args.threshold, args.gap_ms, args.min_ms
        )
        if plan:
            segments = plan["segments"]
        else:
            segments = [
                dict(
                    s,
                    name=f"Motion {i+1}",
                    direction=args.direction,
                    notes=[],
                    elements=[],
                )
                for i, s in enumerate(candidates)
            ]
            plan = {
                "schemaVersion": 1,
                "source": source,
                "segments": segments,
                "excluded": [],
                "interpretation": "Automatic geometric proposals. Codex review of identity and ranges is pending.",
            }
        if not segments:
            raise ValueError(
                "No motion intervals found. Inspect the recording or provide explicit plan segments."
            )
        report = {
            "schemaVersion": 1,
            "analyzerVersion": __version__,
            "source": source,
            "video": meta,
            "interpretation": plan.get("interpretation", ""),
            "segments": [],
            "excluded": plan.get("excluded", []),
            "warnings": [
                "Semantic interpretation is saved in analysis-plan.json. Pixel measurements do not identify an app's original source code.",
                "Bezier is a visual comparison. Reproduction uses physical integrators at 60 Hz.",
                "A low curve error does not uniquely identify the original physics. Alternative models are included.",
            ],
        }
        if meta["averageFps"] < 55 or meta["frameIntervalMs"]["max"] > 25:
            report["warnings"].append(
                "This recording has sparse or irregular frames. Prefer a 60 fps original for parameter identification; timing uncertainty is at least one local frame interval."
            )
        write_json(out / "analysis-plan.json", plan)
        for index, s in enumerate(segments):
            if not 0 <= s["startMs"] < s["endMs"] <= pts[-1] + 0.01:
                raise ValueError(
                    f"Segment {s.get('name',index)!r} is outside the source PTS"
                )
            a = int(np.argmin(abs(pts - s["startMs"])))
            b = int(np.argmin(abs(pts - s["endMs"])))
            if b - a < 5:
                raise ValueError(
                    f"Segment {s.get('name',index)!r} needs at least six source frames"
                )
            sid = f"transition-{index+1:02d}"
            directory = out / sid
            directory.mkdir(exist_ok=True)
            print(
                f"[{index+1}/{len(segments)}] {s.get('name',sid)}: {pts[a]:.0f}–{pts[b]:.0f} ms",
                flush=True,
            )
            times = pts[a : b + 1] - pts[a]
            tracked = extract_tracks(
                frames[a : b + 1],
                times,
                s.get("elements"),
                args.max_tracks,
                meta["pixelScale"],
                manual_only=bool(s.get("elements")),
            )
            for tr in tracked:
                tr.update(
                    anchorGlobalFrame=a + tr["anchorFrame"],
                    analysisWidth=meta["analysisWidth"],
                )
            fitted = fit_tracks(tracked, times, args)
            event = {
                "id": sid,
                "name": s.get("name", sid),
                "startFrame": a,
                "endFrame": b,
                "startMs": float(pts[a]),
                "endMs": float(pts[b]),
                "durationMs": float(times[-1]),
                "direction": s.get("direction", args.direction),
                "notes": s.get("notes", []),
                "tracks": fitted,
                "confidence": (
                    "review"
                    if not fitted
                    or any(t["confidence"] in ("review", "unmeasured") for t in fitted)
                    else "medium"
                ),
                "semanticSource": "codex-plan" if args.plan else "geometric-heuristic",
            }
            event["overlaps"] = relationships(fitted)
            event["code"] = code_for(event, args.preset)
            (directory / "motion.ts").write_text(event["code"])
            with (directory / "curves.csv").open("w", newline="") as file:
                writer = csv.writer(file)
                writer.writerow(
                    [
                        "track",
                        "property",
                        "recording_ms",
                        "segment_ms",
                        "value",
                        "progress",
                        "physical",
                        "bezier",
                    ]
                )
                for tr in fitted:
                    for p, prop in tr["properties"].items():
                        for j, t in enumerate(times):
                            writer.writerow(
                                [
                                    tr["name"],
                                    p,
                                    float(t + pts[a]),
                                    float(t),
                                    clean(prop["values"][j]),
                                    clean(prop["progress"][j]),
                                    tr.get("fit", {}).get(
                                        "predicted", [None] * len(times)
                                    )[j],
                                    (tr.get("bezier") or {}).get(
                                        "predicted", [None] * len(times)
                                    )[j],
                                ]
                            )
            ids = np.unique(np.linspace(a, b, 6).round().astype(int))
            strip(args.video, pts, ids, directory / "frames.png", tracks=tracked)
            clip(args.video, pts[a], pts[b], directory / "clip.mp4")
            timeline_plot(event, directory / "timeline")
            curve_plot(event, directory / "curves.png")
            report["segments"].append(event)
        activity_plot(pts, energy, threshold, report["segments"], out / "activity.png")
        fits = [
            t["fit"] for s in report["segments"] for t in s["tracks"] if t.get("fit")
        ]
        report["physicsVerification"] = verify_core(fits)
        report["summary"] = {
            "segmentCount": len(report["segments"]),
            "trackCount": len(fits),
            "nearestPresetDistribution": {
                name: sum(f["nearestPreset"]["name"] == name for f in fits)
                for name in sorted(set(f["nearestPreset"]["name"] for f in fits))
            },
            "byDirection": {
                d: {
                    "durationMean": (
                        np.mean(
                            [
                                t["fit"]["duration"]
                                for s in report["segments"]
                                if s["direction"] == d
                                for t in s["tracks"]
                                if t.get("fit", {}).get("duration")
                            ]
                        )
                        if any(
                            t.get("fit", {}).get("duration")
                            for s in report["segments"]
                            if s["direction"] == d
                            for t in s["tracks"]
                        )
                        else None
                    )
                }
                for d in sorted(set(s["direction"] for s in report["segments"]))
            },
        }
        write_json(out / "report.json", report)
        render(clean(report), out)
    return {
        "report": str(out / "report.html"),
        "json": str(out / "report.json"),
        "segments": len(report["segments"]),
        "tracks": len(fits),
    }
