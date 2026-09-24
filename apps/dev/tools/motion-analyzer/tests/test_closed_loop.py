"""Closed loop: a recording rendered by the current SSGOI engine is measured back.

`synth` draws a phone app whose transitions move with known physics, encoded
through FFmpeg like a real screen recording. The tolerances below are what the
analyzer achieved on this fixture; they are asserted so a regression in
tracking, endpoint inference, or fitting fails loudly.
"""

from argparse import Namespace
import json
from pathlib import Path
import tempfile
import unittest

from motion_analyzer.pipeline import measure_video
from motion_analyzer.synth import synthesize


def measure(video, out, plan=None):
    measure_video(
        Namespace(
            video=str(video),
            out=str(out),
            width=480,
            threshold=None,
            gap_ms=120,
            min_ms=100,
            plan=str(plan) if plan else None,
            direction="unknown",
            preset=None,
            max_tracks=12,
            fit_mode="all",
            initial_velocity=0.0,
            rest_delta=0.01,
            rest_speed=0.01,
        )
    )
    return json.loads((Path(out) / "report.json").read_text())


def by_role(segment, role):
    tracks = [t for t in segment["tracks"] if t.get("fit") and t.get("role") == role]
    return tracks[0] if tracks else None


def relative_error(fit, truth):
    return max(abs(fit["params"][k] / v - 1) for k, v in truth["params"].items())


class ClosedLoopTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="ssgoi-closed-loop-")
        root = Path(cls.temp.name)
        cls.fixture = synthesize(
            Namespace(out=str(root / "60"), fps=60, codec="h264", drop=0, seed=7)
        )
        cls.truth = json.loads(Path(cls.fixture["truth"]).read_text())
        cls.root = root

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def assertRecovered(self, track, truth, tolerance, note=""):
        self.assertIsNotNone(track, f"{truth['layer']} ({truth['role']}) unmeasured {note}")
        fit = track["fit"]
        self.assertEqual(fit["model"], truth["model"], note)
        self.assertLess(relative_error(fit, truth), tolerance, f"{track['name']} {fit['params']} vs {truth['params']} {note}")

    def test_known_geometry_recovers_page_physics_within_5_percent(self):
        report = measure(
            self.fixture["video"], self.root / "geometry", self.fixture["geometryPlan"]
        )
        self.assertEqual(report["physicsVerification"]["status"], "passed")
        push, pop = self.truth["segments"][:2]
        measured_push, measured_pop = report["segments"][:2]
        for truth_segment, measured in [(push, measured_push), (pop, measured_pop)]:
            for truth in truth_segment["tracks"]:
                self.assertRecovered(by_role(measured, truth["role"]), truth, 0.05)
        overlap = measured_push["overlaps"][0]
        self.assertAlmostEqual(overlap["startAt"], push["startAt"][1], delta=0.05)

    def test_unobserved_rest_positions_are_inferred_and_flagged(self):
        report = measure(self.fixture["video"], self.root / "inference", self.fixture["plan"])
        push, pop = self.truth["segments"][:2]
        measured_push, measured_pop = report["segments"][:2]
        # The list page ends fully covered and the detail page starts off screen:
        # both endpoints are inferred, and the physics still matches within 5%.
        for truth in push["tracks"]:
            track = by_role(measured_push, truth["role"])
            self.assertRecovered(track, truth, 0.05)
            prop = track["properties"]["x"]
            self.assertEqual(prop["endpointSource"], "inferred")
            self.assertTrue(any("inferred" in n for n in track["notes"]))
        self.assertAlmostEqual(measured_push["overlaps"][0]["startAt"], push["startAt"][1], delta=0.05)
        # The returning list is revealed late; its extrapolation is larger, so the
        # result is looser and must not be presented as high confidence.
        incoming = by_role(measured_pop, "in")
        self.assertRecovered(incoming, pop["tracks"][1], 0.12)
        self.assertIn(incoming["confidence"], ["medium", "review"])
        # The exiting page is an accelerating inertia cut short by the screen edge;
        # its visible curve must still be reproduced even though parameters trade off.
        outgoing = by_role(measured_pop, "out")
        self.assertIsNotNone(outgoing)
        self.assertLess(outgoing["fit"]["rmse"], 0.01)
        self.assertEqual(outgoing["fit"]["model"], "inertia")

    def test_automatic_proposals_find_both_pages(self):
        report = measure(self.fixture["video"], self.root / "auto")
        push = self.truth["segments"][0]
        measured = report["segments"][0]
        self.assertEqual({t["role"] for t in measured["tracks"]}, {"in", "out"})
        self.assertEqual(len(measured["tracks"]), 2)
        for truth in push["tracks"]:
            self.assertRecovered(by_role(measured, truth["role"]), truth, 0.05)
        self.assertIn("select(\"in\")", measured["override"])
        self.assertIn("select(\"out\")", measured["override"])

    def test_thirty_fps_recording_with_known_geometry(self):
        fixture = synthesize(
            Namespace(out=str(self.root / "30"), fps=30, codec="h264", drop=0, seed=7)
        )
        report = measure(fixture["video"], self.root / "30-geometry", fixture["geometryPlan"])
        self.assertTrue(any("60 fps" in w for w in report["warnings"]))
        push, pop = self.truth["segments"][:2]
        self.assertRecovered(by_role(report["segments"][0], "in"), push["tracks"][1], 0.08)
        self.assertRecovered(by_role(report["segments"][1], "in"), pop["tracks"][1], 0.08)


if __name__ == "__main__":
    unittest.main()
