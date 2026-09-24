"""Portable PNG/SVG + HTML report. No service, CDN, upload, or build step."""

from __future__ import annotations

import html
import json
import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from .video import color_frame

COLORS = ["#3B6FE0", "#E0743C", "#2E9C8B", "#8A6BD1", "#B8901F", "#4F8FAE", "#C26F9C"]
INK, MUTED, HAIRLINE, PAPER = "#141821", "#6B7380", "#E4E7EC", "#FFFFFF"
for font in [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]:
    if Path(font).exists():
        font_manager.fontManager.addfont(font)
        plt.rcParams["font.family"] = font_manager.FontProperties(fname=font).get_name()
        break
plt.rcParams.update(
    {
        "font.size": 9.5,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.spines.left": False,
        "axes.labelcolor": MUTED,
        "axes.edgecolor": HAIRLINE,
        "axes.titlecolor": INK,
        "xtick.color": MUTED,
        "ytick.color": INK,
        "xtick.labelsize": 8.5,
        "ytick.labelsize": 9,
        "grid.color": HAIRLINE,
        "grid.linewidth": 0.6,
        "legend.frameon": False,
        "legend.fontsize": 8,
        "savefig.facecolor": PAPER,
        "axes.facecolor": PAPER,
        "axes.unicode_minus": False,
    }
)


def strip(video, pts, indices, output, width=178, columns=6, tracks=None):
    indices = list(dict.fromkeys(int(i) for i in indices))
    first = color_frame(video, indices[0], width)
    height = first.height
    cols = min(columns, len(indices))
    canvas = Image.new(
        "RGB",
        (cols * (width + 12) + 12, math.ceil(len(indices) / cols) * (height + 38) + 12),
        PAPER,
    )
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=15)
    for j, index in enumerate(indices):
        frame = first.copy() if j == 0 else color_frame(video, index, width)
        if tracks:
            fd = ImageDraw.Draw(frame)
            for k, tr in enumerate(tracks):
                if tr["anchorGlobalFrame"] != index:
                    continue
                scale = width / tr["analysisWidth"]
                x, y, w, h = [v * scale for v in tr["box"]]
                fd.rectangle(
                    (x, y, x + w, y + h), outline=COLORS[k % len(COLORS)], width=2
                )
                fd.text(
                    (x + 3, y + 2), str(k + 1), fill=COLORS[k % len(COLORS)], font=font
                )
        x = 12 + (j % cols) * (width + 12)
        y = 12 + (j // cols) * (height + 38)
        canvas.paste(frame, (x, y))
        draw.text(
            (x, y + height + 6),
            f"{pts[index]:.0f} ms · f{index}",
            fill=INK,
            font=font,
        )
    canvas.save(output)


def activity_plot(pts, energy, threshold, segments, output):
    fig, ax = plt.subplots(figsize=(13, 2.4))
    ax.plot(pts / 1000, energy, color=INK, lw=0.9)
    ax.axhline(threshold, color=MUTED, ls=(0, (3, 3)), lw=0.8)
    for i, s in enumerate(segments):
        c = COLORS[i % len(COLORS)]
        ax.axvspan(s["startMs"] / 1000, s["endMs"] / 1000, color=c, alpha=0.1, lw=0)
        ax.text(
            (s["startMs"] + s["endMs"]) / 2000,
            ax.get_ylim()[1] * 0.92,
            str(i + 1),
            ha="center",
            color=c,
            fontsize=9,
        )
    ax.set_xlabel("녹화 시간 (s)")
    ax.set_ylabel("프레임 변화")
    ax.set_title("움직임 후보 구간", loc="left", fontsize=11, pad=10)
    ax.grid(axis="y", alpha=0.6)
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def timeline_plot(event, output):
    rows = [(tr, p) for tr in event["tracks"] for p in tr["properties"]]
    fig, ax = plt.subplots(figsize=(13, max(2.8, 1.4 + len(rows) * 0.62)))
    labels = {"x": "가로", "y": "세로", "scale": "크기", "opacityProxy": "불투명도"}
    for row, (tr, p) in enumerate(rows):
        c = COLORS[event["tracks"].index(tr) % len(COLORS)]
        prop = tr["properties"][p]
        fit = tr.get("fit")
        times = np.array(tr["timeMs"])
        values = np.array(prop["progress"], dtype=float)
        valid = np.isfinite(values)
        lo, hi = row + 0.3, row - 0.3
        y = lambda v: lo - (lo - hi) * np.clip(v, -0.15, 1.2)
        ax.hlines(lo, 0, event["durationMs"], color=HAIRLINE, lw=0.8)
        if fit:
            sim = fit["simulation"]
            t = np.array(sim["timeMs"]) + fit["t0Ms"]
            curve = y(np.array(sim["progress"]))
            measured = (t >= prop["observedFromMs"]) & (t <= prop["observedToMs"])
            ax.plot(t, curve, color=c, lw=1, ls=(0, (3, 3)), alpha=0.7)
            ax.plot(t[measured], curve[measured], color=c, lw=2)
            ax.vlines(fit["t0Ms"], lo, hi, color=c, lw=1)
        ax.plot(times[valid], y(values[valid]), ".", ms=3.5, color=c, alpha=0.8)
        ax.text(
            event["durationMs"] + 18,
            row,
            f"관측 {prop['startMs']:.0f}–{prop['endMs']:.0f} ms",
            va="center",
            fontsize=8,
            color=MUTED,
        )
    ax.set_yticks(range(len(rows)), [f"{tr['name']}  {labels.get(p, p)}" for tr, p in rows])
    ax.tick_params(axis="y", length=0)
    ax.invert_yaxis()
    ax.set_xlim(-12, event["durationMs"] + 150)
    ax.set_xlabel("구간 시간 (ms)")
    ax.set_title(event["name"], loc="left", fontsize=12, fontweight="bold", pad=18)
    ax.text(
        0,
        1.02,
        "점 측정값   실선 물리 곡선   점선 관측 밖 추정   세로선 시작 시각",
        transform=ax.transAxes,
        fontsize=8,
        color=MUTED,
    )
    ax.grid(axis="x", alpha=0.7)
    fig.tight_layout()
    fig.savefig(output.with_suffix(".png"), dpi=160)
    fig.savefig(output.with_suffix(".svg"))
    plt.close(fig)


def curve_plot(event, output):
    tracks = [tr for tr in event["tracks"] if tr.get("fit")]
    if not tracks:
        fig, ax = plt.subplots(figsize=(10, 2))
        ax.text(
            0.5,
            0.5,
            "측정 곡선이 없습니다. 분석 계획이나 관심 영역을 보정하세요.",
            ha="center",
            va="center",
            color=MUTED,
        )
        ax.axis("off")
        fig.savefig(output, dpi=120)
        plt.close(fig)
        return
    fig, axes = plt.subplots(
        len(tracks),
        2,
        figsize=(13, max(3, len(tracks) * 2.6)),
        squeeze=False,
        gridspec_kw={"width_ratios": [2.2, 1]},
    )
    for i, tr in enumerate(tracks):
        ax, res = axes[i]
        c = COLORS[event["tracks"].index(tr) % len(COLORS)]
        fit = tr["fit"]
        t = np.array(tr["timeMs"])
        for p, prop in tr["properties"].items():
            obs = np.array(prop["progress"], dtype=float)
            ax.plot(t, obs, ".", ms=4, color=c, alpha=0.55, label=f"측정 {p}")
            res.plot(t, obs - np.array(fit["predicted"]), ".-", ms=2, lw=0.7, color=c, label=p)
        sim = fit["simulation"]
        ax.plot(
            np.array(sim["timeMs"]) + fit["t0Ms"],
            sim["progress"],
            color=c,
            lw=2,
            label=fit["model"],
        )
        if tr.get("bezier"):
            ax.plot(
                t,
                tr["bezier"]["predicted"],
                color="#B8901F",
                ls=(0, (4, 3)),
                lw=1.1,
                label="베지어 참고",
            )
        ax.axhline(1, color=HAIRLINE, lw=0.8)
        ax.set_title(f"{tr['name']}   RMSE {fit['rmse']:.3f}", loc="left", fontsize=10)
        ax.set_ylabel("진행률")
        ax.set_xlim(-12, event["durationMs"] + 30)
        ax.legend(loc="lower right", ncol=2)
        res.axhline(0, color=MUTED, lw=0.7)
        res.set_title("측정 − 물리", loc="left", fontsize=10)
        res.set_ylim(-max(0.08, fit["rmse"] * 3), max(0.08, fit["rmse"] * 3))
        for a in (ax, res):
            a.grid(alpha=0.7)
            a.set_xlabel("ms")
    fig.tight_layout(h_pad=2)
    fig.savefig(output, dpi=145)
    plt.close(fig)


def render(report, out):
    """Render a synchronized, portable viewer from existing measurements."""
    import re

    out = Path(out)
    template_dir = Path(__file__).resolve().parents[1] / "viewer"
    markdown = ["# Motion study", "", report.get("interpretation", ""), ""]
    for event in report["segments"]:
        sid = event["id"]
        if not re.fullmatch(r"[a-zA-Z0-9_-]+", sid):
            raise ValueError("Report segment IDs must be safe relative directory names")
        directory = out / sid
        movie = directory / "clip.mp4"
        if movie.exists():
            times = next((t["timeMs"] for t in event["tracks"] if t.get("timeMs")), [0])
            for filename, frame in [
                ("poster.jpg", 0),
                ("thumbnail.jpg", max(0, len(times) // 2 - 1)),
            ]:
                target = directory / filename
                if (
                    not target.exists()
                    or target.stat().st_mtime < movie.stat().st_mtime
                ):
                    color_frame(movie, frame, 178).save(target, quality=88)
        markdown += [
            f"## {event['name']}",
            "",
            f"{event['startMs']:.0f}–{event['endMs']:.0f} ms · {event['confidence']}",
            "",
            " ".join(event.get("notes", [])),
            "",
            f"![Timing]({sid}/timeline.png)",
            "",
            f"[Video]({sid}/clip.mp4) · [SSGOI code]({sid}/motion.ts) · [Measurements]({sid}/curves.csv)",
            "",
        ]
        for track in event["tracks"]:
            fit = track.get("fit")
            if fit:
                markdown.append(
                    f"- {track['name']}: `{fit['model']} {json.dumps(fit['params'])}`; RMSE {fit['rmse']:.4f}; {track['confidence']}"
                )
            else:
                markdown.append(f"- {track['name']}: unmeasured")
        markdown += ["", "```ts", event["code"], "```", ""]
    data = json.dumps(
        report, ensure_ascii=False, separators=(",", ":"), allow_nan=False
    )
    # JSON is data, including names containing HTML/script delimiters.
    data = (
        data.replace("<", "\\u003c")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )
    replacements = {
        "__STUDY_TITLE__": html.escape("Motion study · " + report["source"]["name"]),
        "__STUDY_DATA__": data,
        "__STUDY_CSS__": (template_dir / "viewer.css").read_text(),
        "__STUDY_JS__": (template_dir / "viewer.js").read_text(),
    }
    # Substitute only template tokens, never tokens contained inside report data.
    document = re.sub(
        r"__STUDY_(?:TITLE|DATA|CSS|JS)__",
        lambda m: replacements[m[0]],
        (template_dir / "index.html").read_text(),
    )
    (out / "report.html").write_text(document)
    (out / "report.md").write_text("\n".join(markdown))


def rerender(report_path):
    """Refresh presentation without decoding the source or refitting measurements."""
    report_path = Path(report_path).resolve()
    report = json.loads(report_path.read_text())
    if report.get("schemaVersion") != 1 or not report.get("segments"):
        raise ValueError("Expected a schemaVersion 1 motion report with segments")
    render(report, report_path.parent)
    for event in report["segments"]:
        directory = report_path.parent / event["id"]
        directory.mkdir(exist_ok=True)
        timeline_plot(event, directory / "timeline")
        curve_plot(event, directory / "curves.png")
    return {
        "report": str(report_path.parent / "report.html"),
        "measurements": "unchanged",
    }
