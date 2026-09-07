"""Replaceable FFmpeg decoder. PTS and decoded frames must agree exactly."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np


def run(args):
    return subprocess.run(args, check=True, capture_output=True).stdout


def probe(path):
    data = json.loads(
        run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_streams",
                "-show_frames",
                "-show_entries",
                "stream=width,height,codec_name,duration:stream_side_data=rotation:"
                "frame=best_effort_timestamp_time,pkt_duration_time",
                "-of",
                "json",
                str(path),
            ]
        )
    )
    if not data.get("streams"):
        raise ValueError("No video stream found")
    s = data["streams"][0]
    pts = np.array(
        [float(f["best_effort_timestamp_time"]) * 1000 for f in data["frames"]],
        dtype=float,
    )
    if len(pts) < 3 or not np.all(np.diff(pts) > 0):
        raise ValueError("Video needs at least 3 frames with strictly increasing PTS")
    origin = float(pts[0])
    pts -= origin
    rotation = next(
        (int(d["rotation"]) for d in s.get("side_data_list", []) if "rotation" in d), 0
    )
    w, h = s["width"], s["height"]
    if abs(rotation) % 180 == 90:
        w, h = h, w
    dt = np.diff(pts)
    return {
        "width": w,
        "height": h,
        "codec": s["codec_name"],
        "rotation": rotation,
        "ptsOriginMs": origin,
        "durationMs": float(pts[-1]),
        "frameCount": len(pts),
        "medianFps": float(1000 / np.median(dt)),
        "averageFps": float(1000 * (len(pts) - 1) / pts[-1]),
        "variableFrameRate": bool(np.ptp(dt) > 2),
        "frameIntervalMs": {
            "min": float(dt.min()),
            "median": float(np.median(dt)),
            "max": float(dt.max()),
        },
    }, pts


def decode(path, width, directory):
    meta, pts = probe(path)
    w = min(width, meta["width"])
    h = round(meta["height"] * w / meta["width"])
    raw = Path(directory) / "frames.gray"
    run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(path),
            "-map",
            "0:v:0",
            "-vf",
            f"scale={w}:{h}",
            "-fps_mode",
            "passthrough",
            "-pix_fmt",
            "gray",
            "-f",
            "rawvideo",
            str(raw),
        ]
    )
    if raw.stat().st_size != len(pts) * w * h:
        raise ValueError(
            "Decoded frame count differs from ffprobe PTS; refusing fabricated timestamps"
        )
    meta.update(analysisWidth=w, analysisHeight=h, pixelScale=meta["width"] / w)
    return meta, pts, np.memmap(raw, dtype=np.uint8, mode="r", shape=(len(pts), h, w))


def clip(path, start_ms, end_ms, output):
    run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(path),
            "-ss",
            f"{start_ms/1000:.6f}",
            "-t",
            f"{(end_ms-start_ms)/1000:.6f}",
            "-map",
            "0:v:0",
            "-an",
            "-vf",
            "scale=trunc(iw/2)*2:trunc(ih/2)*2",
            "-c:v",
            "libx264",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-fps_mode",
            "vfr",
            "-movflags",
            "+faststart",
            str(output),
        ]
    )


def color_frame(path, frame_index, width):
    from PIL import Image
    from io import BytesIO

    data = run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(path),
            "-vf",
            f"select=eq(n\\,{frame_index}),scale={width}:-1",
            "-frames:v",
            "1",
            "-f",
            "image2pipe",
            "-vcodec",
            "png",
            "-",
        ]
    )
    return Image.open(BytesIO(data)).convert("RGB")
