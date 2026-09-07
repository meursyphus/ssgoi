#!/usr/bin/env bash
set -euo pipefail
motion_tool_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
motion_python="${MOTION_ANALYZER_PYTHON:-$motion_tool_dir/.venv/bin/python}"
if [[ ! -x "$motion_python" ]]; then
  if [[ -n "${MOTION_ANALYZER_PYTHON:-}" ]]; then
    echo "MOTION_ANALYZER_PYTHON is not executable: $motion_python" >&2
    exit 2
  fi
  python3 -m venv "$motion_tool_dir/.venv"
fi
if [[ -z "${MOTION_ANALYZER_PYTHON:-}" ]] && ! cmp -s "$motion_tool_dir/requirements.txt" "$motion_tool_dir/.venv/requirements.lock"; then
  "$motion_python" -m pip install -r "$motion_tool_dir/requirements.txt"
  cp "$motion_tool_dir/requirements.txt" "$motion_tool_dir/.venv/requirements.lock"
fi
if [[ "${1:-}" == "test" ]]; then
  shift
  export PYTHONPATH="$motion_tool_dir${PYTHONPATH:+:$PYTHONPATH}"
  exec "$motion_python" -m unittest discover -s "$motion_tool_dir/tests" -v "$@"
fi
exec "$motion_python" "$motion_tool_dir/analyze.py" "$@"
