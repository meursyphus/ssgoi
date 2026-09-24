#!/usr/bin/env python3
"""Inspect → semantic plan → measurement → visual verification, for coding agents."""
import argparse
import json
import sys
import math
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    presentation = commands.add_parser(
        "render", help="Refresh the viewer from existing measurements"
    )
    presentation.add_argument(
        "report", help="Path to report.json; output is written beside it"
    )
    synth = commands.add_parser(
        "synth",
        help="Render a recording with known SSGOI physics plus truth.json and plan.json",
    )
    synth.add_argument("--out", required=True)
    synth.add_argument("--fps", type=float, default=60)
    synth.add_argument("--codec", choices=["h264", "hevc"], default="h264")
    synth.add_argument(
        "--drop", type=float, default=0, help="Fraction of frames to drop (VFR)"
    )
    synth.add_argument("--seed", type=int, default=7)
    preview = commands.add_parser(
        "serve", help="Open a local preview server with video seeking support"
    )
    preview.add_argument("directory", help="Output folder containing report.html")
    preview.add_argument("--port", type=int, default=0)
    for name in ["inspect", "measure"]:
        cmd = commands.add_parser(name)
        cmd.add_argument("video")
        cmd.add_argument("--out", required=True)
        cmd.add_argument(
            "--width",
            type=int,
            default=480,
            help="Analysis width; never upscale; ROI coordinates remain original pixels",
        )
        cmd.add_argument("--threshold", type=float)
        cmd.add_argument("--gap-ms", type=float, default=120)
        cmd.add_argument("--min-ms", type=float, default=100)
        if name == "inspect":
            cmd.add_argument(
                "--range", type=float, nargs=2, metavar=("START_MS", "END_MS")
            )
            cmd.add_argument("--step-ms", type=float, default=50)
        else:
            cmd.add_argument(
                "--plan", help="Agent-authored semantic ranges / element ROIs JSON"
            )
            cmd.add_argument(
                "--direction",
                choices=["forward", "backward", "unknown"],
                default="unknown",
            )
            cmd.add_argument(
                "--preset",
                help="Preset to consider; code retains element tracks when coupling is uncertain",
            )
            cmd.add_argument("--max-tracks", type=int, default=12)
            cmd.add_argument(
                "--fit-mode", choices=["all", "duration-bounce"], default="all"
            )
            cmd.add_argument(
                "--initial-velocity",
                type=float,
                default=0,
                help="Normalized progress/s; use for a separately segmented release phase",
            )
            cmd.add_argument("--rest-delta", type=float, default=0.01)
            cmd.add_argument("--rest-speed", type=float, default=0.01)
    args = parser.parse_args()
    if args.command in ("inspect", "measure") and (
        args.width < 32
        or args.gap_ms <= 0
        or args.min_ms < 0
        or getattr(args, "step_ms", 1) <= 0
    ):
        parser.error("Width must be >= 32; time steps / gap must be positive")
    if args.command == "synth" and (
        not 1 <= args.fps <= 240 or not 0 <= args.drop < 0.9
    ):
        parser.error("fps must be within 1-240 and drop within [0, 0.9)")
    if args.command == "measure" and (
        args.max_tracks < 1
        or args.rest_delta <= 0
        or args.rest_speed <= 0
        or not all(
            math.isfinite(v)
            for v in [args.initial_velocity, args.rest_delta, args.rest_speed]
        )
    ):
        parser.error(
            "max-tracks and rest thresholds must be positive; physics inputs must be finite"
        )
    try:
        from motion_analyzer.pipeline import inspect_video, measure_video

        if args.command == "serve":
            from motion_analyzer.server import serve

            result = serve(args.directory, args.port)
        elif args.command == "synth":
            from motion_analyzer.synth import synthesize

            result = synthesize(args)
        elif args.command == "render":
            from motion_analyzer.report import rerender

            result = rerender(args.report)
        else:
            result = (inspect_video if args.command == "inspect" else measure_video)(
                args
            )
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (ValueError, FileNotFoundError) as error:
        print(f"motion-analyzer: {error}", file=sys.stderr)
        return 2
    except subprocess.CalledProcessError as error:
        detail = error.stderr or str(error)
        if isinstance(detail, bytes):
            detail = detail.decode(errors="replace")
        print(
            f"motion-analyzer: external tool failed: {detail[:2000]}", file=sys.stderr
        )
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
