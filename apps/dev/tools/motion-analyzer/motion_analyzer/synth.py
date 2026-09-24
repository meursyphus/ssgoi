"""Render a phone-app recording whose motion comes from the current SSGOI engine.

The scene has static chrome (status bar with a blinking record dot, tab bar),
a list page, a detail page and a second tab. Three transitions move whole
layers with physics simulated by the repository's TypeScript (through
`core-reference.mjs`) and linearly interpolated between 60 Hz frames, exactly
as WAAPI plays SSGOI keyframes. `truth.json` records every parameter, so a
measurement of the video can be checked against what produced it (closed loop),
and `plan.json` is a ready-made semantic plan for the same recording.
"""

from __future__ import annotations

import json
from pathlib import Path
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from .reference import simulate_with_core

WIDTH, HEIGHT = 390, 844
STATUS, TABBAR = 47, 83
CONTENT = HEIGHT - STATUS - TABBAR
FRAME_MS = 1000 / 60
DURATION_MS = 4700
WORDS = (
    "spring damping motion layer shared overlay page detail library photo "
    "timing physics settle bounce frame gesture scroll release parallax"
).split()

# Every transition below is data: role, layer, SSGOI physics, geometry, and the
# MultiAnimation-style `startAt` threshold on the preceding track.
SEGMENTS = [
    {
        "name": "Push list to detail",
        "direction": "forward",
        "startMs": 700,
        "tracks": [
            {
                "role": "out",
                "layer": "list",
                "model": "spring",
                "params": {"stiffness": 250, "damping": 28},
                "x": [0, -WIDTH / 3],
                "dim": [0, 0.15],
            },
            {
                "role": "in",
                "layer": "detail",
                "model": "spring",
                "params": {"stiffness": 380, "damping": 34},
                "x": [WIDTH, 0],
                "startAt": 0.15,
            },
        ],
    },
    {
        "name": "Pop detail to list",
        "direction": "backward",
        "startMs": 2400,
        "tracks": [
            {
                "role": "out",
                "layer": "detail",
                "model": "inertia",
                "params": {"acceleration": 90, "resistance": 1.5},
                "x": [0, WIDTH],
            },
            {
                "role": "in",
                "layer": "list",
                "model": "spring",
                "params": {"stiffness": 260, "damping": 30},
                "x": [-WIDTH / 3, 0],
                "dim": [0.15, 0],
                "startAt": 0,
            },
        ],
    },
    {
        "name": "Tab swap with crossfade",
        "direction": "forward",
        "startMs": 3500,
        "tracks": [
            {
                "role": "out",
                "layer": "list",
                "model": "spring",
                "params": {"stiffness": 600, "damping": 45},
                "opacity": [1, 0],
            },
            {
                "role": "in",
                "layer": "second",
                "model": "spring",
                "params": {"stiffness": 600, "damping": 45},
                "x": [8, 0],
                "opacity": [0, 1],
                "startAt": 0,
            },
        ],
    },
]
LAYER_ORDER = ["list", "second", "detail"]
INITIAL = {
    "list": {"x": 0.0, "opacity": 1.0, "dim": 0.0},
    "second": {"x": 0.0, "opacity": 0.0, "dim": 0.0},
    "detail": {"x": float(WIDTH), "opacity": 1.0, "dim": 0.0},
}
# Anchor-frame ROIs (oriented recording pixels) for plan.json. Boxes sit on
# textured parts of each layer at its rest position.
ROIS = {
    "list": [14, STATUS + 96, 250, 260],
    "detail": [16, STATUS + 14, 358, 200],
    "second": [16, STATUS + 88, 358, 300],
    # A strip that is textured on the list page but blank on the second tab, so
    # the list's fade is a pure two-endpoint mixture (the `alpha` method).
    "list-fade": [96, STATUS + 216, 270, 18],
}


def font(size):
    return ImageFont.load_default(size=size)


def texture(rng, width, height):
    base = rng.integers(150, 235, 3)
    image = Image.new("RGB", (width, height), tuple(int(v) for v in base))
    draw = ImageDraw.Draw(image)
    for _ in range(rng.integers(6, 11)):
        color = tuple(int(v) for v in rng.integers(30, 220, 3))
        x, y = rng.integers(0, width), rng.integers(0, height)
        w, h = rng.integers(width // 6, width // 2), rng.integers(height // 6, height // 2)
        if rng.random() < 0.5:
            draw.ellipse((x, y, x + w, y + h), fill=color)
        else:
            draw.rectangle((x, y, x + w, y + h), fill=color)
    noise = rng.normal(0, 6, (height, width, 3))
    array = np.clip(np.asarray(image).astype(float) + noise, 0, 255)
    return Image.fromarray(array.astype(np.uint8))


def words(rng, count):
    return " ".join(rng.choice(WORDS) for _ in range(count)).capitalize()


def page(rng, kind):
    image = Image.new("RGB", (WIDTH, CONTENT), "white")
    draw = ImageDraw.Draw(image)
    if kind == "list":
        draw.text((20, 14), "Library", fill="#111", font=font(30))
        draw.rounded_rectangle((16, 58, WIDTH - 16, 92), 10, fill="#eef0f4")
        draw.text((32, 66), "Search", fill="#8a8f98", font=font(15))
        for row in range(7):
            y = 104 + row * 82
            image.paste(texture(rng, 62, 62), (20, y))
            draw.text((96, y + 6), words(rng, 3), fill="#161616", font=font(17))
            draw.text((96, y + 32), words(rng, 5), fill="#7a7f88", font=font(13))
            draw.line((96, y + 72, WIDTH - 20, y + 72), fill="#e6e8ec")
    elif kind == "detail":
        image.paste(texture(rng, WIDTH, 228), (0, 0))
        draw.text((20, 242), words(rng, 2), fill="#111", font=font(28))
        for i in range(3):
            draw.rounded_rectangle((20 + i * 96, 286, 104 + i * 96, 312), 13, fill="#e8ebf0")
            draw.text((34 + i * 96, 292), words(rng, 1), fill="#454a55", font=font(13))
        for line in range(10):
            draw.text((20, 330 + line * 26), words(rng, 7), fill="#2c2f36", font=font(15))
    else:
        draw.text((20, 14), "Explore", fill="#111", font=font(30))
        for i in range(6):
            x, y = 16 + (i % 2) * 183, 70 + (i // 2) * 168
            image.paste(texture(rng, 174, 118), (x, y))
            draw.text((x, y + 124), words(rng, 2), fill="#161616", font=font(15))
    return image.convert("RGBA")


def chrome(canvas, t_ms):
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, WIDTH, STATUS), fill="white")
    draw.text((28, 14), "9:41", fill="#111", font=font(17))
    draw.rounded_rectangle((WIDTH - 46, 17, WIDTH - 20, 30), 4, outline="#111", width=2)
    draw.rectangle((WIDTH - 43, 20, WIDTH - 26, 27), fill="#111")
    for i in range(4):
        draw.rectangle((WIDTH - 90 + i * 6, 27 - i * 3, WIDTH - 87 + i * 6, 30), fill="#111")
    # A screen-recording indicator that blinks like iOS: chrome that changes
    # without moving must not be mistaken for a transition.
    if int(t_ms // 500) % 2 == 0:
        draw.ellipse((WIDTH / 2 - 6, 17, WIDTH / 2 + 6, 29), fill="#e0443c")
    top = HEIGHT - TABBAR
    draw.rectangle((0, top, WIDTH, HEIGHT), fill="#f7f8fa")
    draw.line((0, top, WIDTH, top), fill="#dcdfe4")
    for i, label in enumerate(["Home", "Search", "Library", "Profile"]):
        cx = WIDTH / 8 + i * WIDTH / 4
        draw.ellipse((cx - 12, top + 14, cx + 12, top + 38), outline="#3b4250", width=2)
        draw.text((cx - 20, top + 46), label, fill="#3b4250", font=font(12))
    draw.rounded_rectangle((WIDTH / 2 - 66, HEIGHT - 12, WIDTH / 2 + 66, HEIGHT - 7), 3, fill="#111")


def resolve_tracks():
    """Absolute timing for every track, from the engine's own frames."""
    configs = [
        {"model": tr["model"], "params": tr["params"]}
        for segment in SEGMENTS
        for tr in segment["tracks"]
    ]
    curves = iter(simulate_with_core(configs))
    resolved = []
    for segment in SEGMENTS:
        tracks = []
        for tr in segment["tracks"]:
            frames = next(curves)
            times = np.array([f["time"] for f in frames])
            progress = np.array([f["position"] for f in frames])
            delay = 0.0
            if tracks and tr.get("startAt", 0) > 0:
                previous = tracks[-1]
                # MultiAnimation starts the child on the first frame at which the
                # predecessor's progress has reached the threshold.
                hit = int(np.argmax(previous["progress"] >= tr["startAt"]))
                delay = previous["delayMs"] + float(previous["timeMs"][hit])
            tracks.append(
                {
                    **tr,
                    "delayMs": delay,
                    "t0Ms": segment["startMs"] + delay,
                    "settleMs": float(times[-1]),
                    "timeMs": times,
                    "progress": progress,
                }
            )
        resolved.append(
            {
                **segment,
                "tracks": tracks,
                "endMs": max(t["t0Ms"] + t["settleMs"] for t in tracks),
            }
        )
    return resolved


def layer_states(resolved, t_ms):
    state = {name: dict(values) for name, values in INITIAL.items()}
    for segment in resolved:
        for tr in segment["tracks"]:
            if t_ms < tr["t0Ms"]:
                continue
            p = float(np.interp(t_ms - tr["t0Ms"], tr["timeMs"], tr["progress"]))
            for prop in ("x", "opacity", "dim"):
                if prop in tr:
                    a, b = tr[prop]
                    state[tr["layer"]][prop] = a + (b - a) * p
    return state


def render_frame(pages, resolved, t_ms):
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), "white")
    state = layer_states(resolved, t_ms)
    for name in LAYER_ORDER:
        s = state[name]
        if s["opacity"] <= 0 or abs(s["x"]) >= WIDTH:
            continue
        layer = pages[name].transform(
            (WIDTH, CONTENT),
            Image.AFFINE,
            (1, 0, -s["x"], 0, 1, 0),
            resample=Image.BILINEAR,
            fillcolor=(0, 0, 0, 0),
        )
        if s["opacity"] < 1:
            alpha = layer.getchannel("A").point(lambda v: int(v * s["opacity"]))
            layer.putalpha(alpha)
        canvas.alpha_composite(layer, (0, STATUS))
        if s["dim"] > 0:
            shade = Image.new("RGBA", (WIDTH, CONTENT), (0, 0, 0, int(255 * s["dim"])))
            canvas.alpha_composite(shade, (0, STATUS))
    chrome(canvas, t_ms)
    return canvas.convert("RGB")


def frame_times(fps, drop, rng):
    """Constant-rate presentation times, with a seeded subset dropped for VFR."""
    times = np.arange(0, DURATION_MS, 1000 / fps)
    keep = np.ones(len(times), bool)
    if drop > 0:
        keep = rng.random(len(times)) >= drop
        keep[0] = True
    return times, keep


def encode(frames, fps, keep, codec, output):
    """Pipe raw frames at a constant rate; `select` drops frames but keeps PTS."""
    dropped = np.flatnonzero(~keep)
    filters = []
    if len(dropped):
        filters += ["-vf", "select=not(" + "+".join(f"eq(n\\,{i})" for i in dropped) + ")"]
    encoder = (
        ["-c:v", "libx265", "-tag:v", "hvc1", "-x265-params", "log-level=none", "-crf", "24"]
        if codec == "hevc"
        else ["-c:v", "libx264", "-preset", "veryfast", "-crf", "22"]
    )
    process = subprocess.Popen(
        [
            "ffmpeg", "-v", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}",
            "-framerate", f"{fps:g}", "-i", "-",
            *filters, "-fps_mode", "passthrough", "-video_track_timescale", "60000",
            *encoder, "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(output),
        ],
        stdin=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    for frame in frames:
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    error = process.stderr.read()
    if process.wait() != 0:
        raise subprocess.CalledProcessError(process.returncode, "ffmpeg", stderr=error)


def plan_for(resolved, source_name, geometry=False):
    """A semantic plan for the recording.

    With `geometry`, known layout displacements are supplied as
    `offsetFromEnd` / `offsetToStart`, the recommended way to measure pages
    that start off screen or end covered. Without it, the analyzer must infer
    those rest positions from the physics fit.
    """
    segments = []
    for segment in resolved:
        elements = []
        for tr in segment["tracks"]:
            anchor = "end" if tr["role"] == "in" else "start"
            fade_only = "opacity" in tr and "x" not in tr
            element = {
                "name": f"{tr['layer']} ({tr['role']})",
                "role": tr["role"],
                "anchor": anchor,
                "box": ROIS["list-fade" if fade_only else tr["layer"]],
                "evidence": f"Synthetic {tr['layer']} layer; box covers textured content at its {anchor} position.",
            }
            if fade_only:
                element["method"] = "alpha"
            else:
                element["properties"] = ["x"]
                if geometry and abs(tr["x"][1] - tr["x"][0]) >= 100:
                    start, end = tr["x"]
                    key = "offsetFromEnd" if anchor == "end" else "offsetToStart"
                    element[key] = {"x": start - end if anchor == "end" else end - start}
                    element["onsetMs"] = tr["delayMs"]
                    element["evidence"] += " Displacement is the layout's known travel."
            elements.append(element)
        segments.append(
            {
                "name": segment["name"],
                "startMs": segment["startMs"],
                "endMs": segment["endMs"],
                "direction": segment["direction"],
                "notes": ["Generated by `synth`; compare with truth.json."],
                "elements": elements,
            }
        )
    return {
        "schemaVersion": 1,
        "source": {"name": source_name},
        "interpretation": "Synthetic SSGOI recording with known physics (see truth.json)."
        + (" Displacements are supplied from the layout." if geometry else ""),
        "segments": segments,
        "excluded": [],
    }


def synthesize(args):
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(args.seed)
    pages = {name: page(rng, name) for name in LAYER_ORDER}
    resolved = resolve_tracks()
    times, keep = frame_times(args.fps, args.drop, rng)
    name = "recording.mov" if args.codec == "hevc" else "recording.mp4"
    encode(
        (render_frame(pages, resolved, float(t)) for t in times),
        args.fps,
        keep,
        args.codec,
        out / name,
    )
    times = times[keep]
    truth = {
        "schemaVersion": 1,
        "video": {
            "name": name,
            "width": WIDTH,
            "height": HEIGHT,
            "fps": args.fps,
            "droppedFrameFraction": args.drop,
            "frameCount": len(times),
            "durationMs": DURATION_MS,
            "seed": args.seed,
        },
        "restDelta": 0.01,
        "restSpeed": 0.01,
        "segments": [
            {
                "name": s["name"],
                "direction": s["direction"],
                "startMs": s["startMs"],
                "endMs": s["endMs"],
                "startAt": [tr.get("startAt", 0) for tr in s["tracks"]],
                "tracks": [
                    {
                        "role": tr["role"],
                        "layer": tr["layer"],
                        "model": tr["model"],
                        "params": tr["params"],
                        "delayMs": tr["delayMs"],
                        "t0Ms": tr["t0Ms"],
                        "settleMs": tr["settleMs"],
                        "properties": {
                            prop: tr[prop] for prop in ("x", "opacity", "dim") if prop in tr
                        },
                    }
                    for tr in s["tracks"]
                ],
            }
            for s in resolved
        ],
    }
    (out / "truth.json").write_text(json.dumps(truth, indent=2) + "\n")
    (out / "plan.json").write_text(json.dumps(plan_for(resolved, name), indent=2) + "\n")
    (out / "plan.geometry.json").write_text(
        json.dumps(plan_for(resolved, name, geometry=True), indent=2) + "\n"
    )
    return {
        "video": str(out / name),
        "truth": str(out / "truth.json"),
        "plan": str(out / "plan.json"),
        "geometryPlan": str(out / "plan.geometry.json"),
        "frames": len(times),
        "segments": [
            {"name": s["name"], "startMs": s["startMs"], "endMs": round(s["endMs"], 1)}
            for s in resolved
        ],
    }
