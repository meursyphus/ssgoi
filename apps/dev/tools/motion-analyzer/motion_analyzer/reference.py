"""Bridge to the repository's current SSGOI TypeScript sources.

Everything the analyzer claims about SSGOI physics is checked here against the
real engine (bundled on demand with esbuild), never against a Python copy.
"""

from __future__ import annotations

from functools import lru_cache
import json
from pathlib import Path
import subprocess

SCRIPT = Path(__file__).resolve().parents[1] / "core-reference.mjs"
CORE_LIB = SCRIPT.parents[4] / "packages/core/src/lib"


def run_core(payload):
    result = subprocess.run(
        ["node", str(SCRIPT)],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


def simulate_with_core(configs):
    """SimFrame lists ({time, position, velocity}) from the core's `simulate`."""
    return run_core(list(configs))


@lru_cache(maxsize=1)
def preset_curves():
    """Semantic presets (smooth, snappy, ...) as the core currently defines them."""
    return tuple(
        {
            "name": preset["name"],
            "kind": preset["kind"],
            "duration": preset.get("duration"),
            "bounce": preset.get("bounce"),
            "settleMs": preset["settleMs"],
            "timeMs": [frame["time"] for frame in preset["frames"]],
            "progress": [frame["position"] for frame in preset["frames"]],
        }
        for preset in run_core({"presets": True})
    )
