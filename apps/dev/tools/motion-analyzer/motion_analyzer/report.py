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

COLORS = ["#4c7ce5", "#d78d65", "#4ca394", "#9c84cb", "#c3a154", "#679aae", "#bd85a7"]
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
        "font.size": 10,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.labelcolor": "#74849c",
        "axes.edgecolor": "#e4eaf2",
        "xtick.color": "#657188",
        "ytick.color": "#24314b",
        "savefig.facecolor": "white",
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
        "#f2f5fa",
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
            fill="#24314b",
            font=font,
        )
    canvas.save(output)


def activity_plot(pts, energy, threshold, segments, output):
    fig, ax = plt.subplots(figsize=(13, 2.6))
    ax.plot(pts / 1000, energy, color="#59708e", lw=1)
    ax.axhline(threshold, color="#b16b28", ls="--", lw=1)
    for i, s in enumerate(segments):
        ax.axvspan(
            s["startMs"] / 1000,
            s["endMs"] / 1000,
            color=COLORS[i % len(COLORS)],
            alpha=0.16,
        )
        ax.text(
            (s["startMs"] + s["endMs"]) / 2000,
            ax.get_ylim()[1] * 0.9,
            str(i + 1),
            ha="center",
        )
    ax.set(
        xlabel="Recording time (s)",
        ylabel="Frame change",
        title="Motion candidates · measured on original presentation timestamps",
    )
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def timeline_plot(event, output):
    rows = [(tr, p) for tr in event["tracks"] for p in tr["properties"]]
    fig, ax = plt.subplots(figsize=(13, max(3, 1.25 + len(rows) * 0.55)))
    for row, (tr, p) in enumerate(rows):
        c = COLORS[event["tracks"].index(tr) % len(COLORS)]
        prop = tr["properties"][p]
        fit = tr.get("fit")
        times = np.array(tr["timeMs"])
        valid = np.isfinite(np.array(prop["progress"], dtype=float))
        start, end = prop["startMs"], prop["endMs"]
        lo, hi = row + 0.28, row - 0.28
        values = np.array(prop["progress"], dtype=float)
        ax.plot(
            times[valid],
            lo - (lo - hi) * np.clip(values[valid], -0.15, 1.2),
            ".",
            ms=3,
            color=c,
            alpha=0.65,
        )
        if fit:
            sim = fit["simulation"]
            t = np.array(sim["timeMs"]) + fit["t0Ms"]
            curve = lo - (lo - hi) * np.clip(sim["progress"], -0.15, 1.2)
            measured = (t >= prop["observedFromMs"]) & (t <= prop["observedToMs"])
            ax.plot(t, curve, color=c, lw=1, ls="--", alpha=0.6)
            ax.plot(t[measured], curve[measured], color=c, lw=1.8)
            ax.fill_between(t[measured], lo, curve[measured], color=c, alpha=0.17)
            ax.vlines(fit["t0Ms"], row - 0.33, row + 0.33, color=c, lw=1.2)
        ax.text(
            event["durationMs"] + 20,
            row,
            f"관측 {start:.0f}–{end:.0f} ms",
            va="center",
            fontsize=7,
            color="#657188",
        )
    ax.set_yticks(range(len(rows)), [f"{tr['name']} / {p}" for tr, p in rows])
    ax.invert_yaxis()
    ax.set_xlim(-20, event["durationMs"] + 145)
    ax.set_xlabel(
        "구간 시간 (ms)   ·   점: 측정값   /   실선: 물리 곡선   /   점선: 관측 밖 추정"
    )
    ax.set_title(event["name"], loc="left", fontweight="bold", pad=25, fontsize=16)
    ax.grid(axis="x", alpha=0.14)
    ax.spines["left"].set_visible(False)
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
            "No reliable curve measurements. Refine the semantic plan or ROI.",
            ha="center",
            va="center",
        )
        ax.axis("off")
        fig.savefig(output, dpi=120)
        plt.close(fig)
        return
    fig, axes = plt.subplots(
        len(tracks),
        2,
        figsize=(13, max(3, len(tracks) * 2.5)),
        squeeze=False,
        gridspec_kw={"width_ratios": [2.2, 1]},
    )
    for i, tr in enumerate(tracks):
        ax, res = axes[i]
        c = COLORS[i % len(COLORS)]
        fit = tr["fit"]
        t = np.array(tr["timeMs"])
        for p, prop in tr["properties"].items():
            obs = np.array(prop["progress"], dtype=float)
            ax.plot(t, obs, ".", ms=4, alpha=0.6, label=f"measured {p}")
            res.plot(t, obs - np.array(fit["predicted"]), ".-", ms=2, lw=0.7, label=p)
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
                color="#c19030",
                ls="--",
                lw=1.2,
                label="Bezier reference",
            )
        ax.axhline(1, color="#b2bdce", lw=0.7)
        ax.set(
            title=f"{tr['name']} · RMSE {fit['rmse']:.3f}",
            ylabel="Progress",
            xlim=(-20, event["durationMs"] + 30),
        )
        ax.legend(loc="lower right", fontsize=7, ncol=2)
        res.axhline(0, color="#8895aa", lw=0.7)
        res.set(
            title="Measured − physics",
            ylim=(-max(0.08, fit["rmse"] * 3), max(0.08, fit["rmse"] * 3)),
        )
        for a in (ax, res):
            a.grid(alpha=0.14)
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
