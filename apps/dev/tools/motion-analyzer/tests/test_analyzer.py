"""Behavioral tests using current SSGOI-generated curves and rendered pixels."""

import json
from pathlib import Path
import subprocess
import tempfile
import unittest

import cv2
import numpy as np

from motion_analyzer.physics import simulate, sample, fit_physics, fit_bezier
from motion_analyzer.pipeline import verify_core, relationships, code_for, clean
from motion_analyzer.segment import measure_activity, segment
from motion_analyzer.track import extract_tracks, alpha_series, edge_series
from motion_analyzer.video import decode

ROOT = Path(__file__).resolve().parents[1]


def actual_curves(configs):
    result = subprocess.run(
        ["node", str(ROOT / "core-reference.mjs")],
        input=json.dumps(configs),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


class PhysicsTests(unittest.TestCase):
    def test_generated_recipe_typechecks_against_current_core(self):
        times = np.arange(0, 700, 1000 / 60)
        fit = fit_physics(
            times, sample("spring", dict(stiffness=300, damping=30), times), 0
        )
        track = dict(
            id="photo",
            name="Photo",
            confidence="high",
            fit=fit,
            properties={"x": {"from": 296.0, "to": 0.0}},
        )
        event = dict(tracks=[track], overlaps=[])
        with tempfile.TemporaryDirectory() as temp:
            file = Path(temp) / "motion.ts"
            file.write_text(code_for(event))
            checked = subprocess.run(
                ["node", str(ROOT / "tests/check-code.mjs"), str(file)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(checked.returncode, 0, checked.stderr)

    def test_current_core_parity_all_models_thresholds_and_initial_velocity(self):
        configs = []
        for model, params in [
            ("spring", dict(stiffness=370, damping=29)),
            ("doubleSpring", dict(stiffness=530, damping=34, doubleSpring=0.8)),
            ("inertia", dict(acceleration=125, resistance=1.8)),
        ]:
            for rest in [0.01, 0.1]:
                for velocity in [0.0, 2.4]:
                    p, v, _ = simulate(model, params, velocity, rest, rest)
                    configs.append(
                        dict(
                            model=model,
                            params=params,
                            initialVelocity=velocity,
                            restDelta=rest,
                            restSpeed=rest,
                            simulation=dict(
                                progress=p,
                                velocity=v,
                                timeMs=np.arange(len(p)) * 1000 / 60,
                            ),
                        )
                    )
        self.assertLess(verify_core(configs)["maxAbsoluteError"], 1e-10)

    def test_inverse_fit_from_real_core(self):
        cases = [
            dict(model="spring", params=dict(stiffness=370, damping=29)),
            dict(model="inertia", params=dict(acceleration=125, resistance=1.8)),
        ]
        for config, curve in zip(cases, actual_curves(cases)):
            for fps in [30, 60]:
                times = np.arange(0, 850, 1000 / fps)
                values = np.interp(
                    times - 21,
                    [p["time"] for p in curve],
                    [p["position"] for p in curve],
                    left=0,
                    right=1,
                )
                fit = fit_physics(times, values, 21, 1000 / fps)
                self.assertEqual(fit["model"], config["model"])
                for key, value in config["params"].items():
                    self.assertLess(abs(fit["params"][key] / value - 1), 0.05)
                self.assertLess(fit["rmse"], 0.002)

    def test_bezier_is_separate_and_allows_overshoot(self):
        t = np.arange(0, 700, 1000 / 60)
        p = sample("spring", dict(stiffness=250, damping=16), t)
        curve = fit_bezier(t, p, 0, 600)
        self.assertEqual(curve["purpose"], "visual-reference-only")
        self.assertGreater(max(curve["predicted"]), 1)

    def test_overlap_progress_and_unrepresentable_gap(self):
        t = np.arange(0, 800, 1000 / 60)
        params = dict(stiffness=300, damping=30)
        a = fit_physics(t, sample("spring", params, t), 0)
        b = fit_physics(t, sample("spring", params, t, 80), 80)
        tracks = [
            dict(id="out", name="out", fit=a, confidence="high"),
            dict(id="in", name="in", fit=b, confidence="high"),
        ]
        relation = relationships(tracks)[0]
        self.assertAlmostEqual(relation["delayMs"], 80, delta=1)
        self.assertAlmostEqual(
            relation["startAt"], sample("spring", params, [80])[0], delta=0.05
        )
        b["t0Ms"] = a["settleMs"] + 200
        self.assertIsNone(relationships(tracks)[0]["startAt"])


class VisionTests(unittest.TestCase):
    def test_container_edge_is_distinct_from_internal_content(self):
        params = dict(stiffness=370, damping=29)
        times = np.arange(0, 700, 1000 / 60)
        truth = sample("spring", params, times)
        frames = np.full((len(times), 120, 300), 35, np.uint8)
        for i, p in enumerate(truth):
            boundary = int(round(250 * (1 - p)))
            frames[i, :, max(0, boundary) :] = 250
            # A moving texture elsewhere must not change the nav-strip boundary.
            frames[i, 80:110, (i * 7) % 250 : (i * 7) % 250 + 25] = 0
        values = edge_series(frames, [0, 20, 300, 30])
        np.testing.assert_allclose(values, 250 * (1 - truth), atol=2)
        fit = fit_physics(times, (values - values[0]) / (values[-1] - values[0]), 0)
        self.assertEqual(fit["model"], "spring")
        self.assertLess(abs(fit["params"]["stiffness"] / 370 - 1), 0.05)

    def test_named_untrackable_element_is_reported(self):
        frames = np.full((20, 120, 100), 240, np.uint8)
        times = np.arange(20) * 1000 / 60
        tracks = extract_tracks(
            frames,
            times,
            [dict(name="flat", box=[20, 20, 40, 40], anchor="end")],
            manual_only=True,
        )
        self.assertEqual(tracks[0]["name"], "flat")
        self.assertEqual(tracks[0]["properties"], {})
        self.assertIn("fitError", tracks[0])

    @staticmethod
    def moving_frames(curve, distance=8):
        rng = np.random.default_rng(3)
        texture = rng.integers(20, 210, (70, 70), dtype=np.uint8)
        base = np.full((260, 240), 248, np.uint8)
        base[100:170, 55:125] = texture
        return np.array(
            [
                cv2.warpAffine(
                    base,
                    np.float32([[1, 0, distance * p], [0, 1, 0]]),
                    (240, 260),
                    flags=cv2.INTER_CUBIC,
                    borderValue=248,
                )
                for p in curve
            ]
        )

    def test_eight_pixel_motion_recovers_physics_from_pixels(self):
        config = dict(model="spring", params=dict(stiffness=370, damping=29))
        actual = actual_curves([config])[0]
        times = np.arange(0, 800, 1000 / 60)
        progress = np.interp(
            times, [p["time"] for p in actual], [p["position"] for p in actual]
        )
        frames = self.moving_frames(progress)
        rois = [
            dict(
                name="card",
                role="shared",
                anchor="start",
                box=[55, 100, 70, 70],
                properties=["x"],
            )
        ]
        tracks = extract_tracks(frames, times, rois, manual_only=True)
        self.assertEqual(len(tracks), 1)
        prop = tracks[0]["properties"]["x"]
        self.assertAlmostEqual(prop["delta"], 8, delta=0.3)
        fit = fit_physics(times, prop["progress"], 0)
        self.assertLess(fit["rmse"], 0.02)
        self.assertEqual(fit["model"], "spring")
        for key, value in config["params"].items():
            self.assertLess(abs(fit["params"][key] / value - 1), 0.05)

    def test_three_separate_motion_intervals_and_static_clock_ignored(self):
        t = np.arange(240) * 1000 / 60
        p = np.zeros(240)
        for start in [25, 100, 175]:
            p += sample(
                "spring", dict(stiffness=370, damping=29), t - start * 1000 / 60
            )
        frames = self.moving_frames(p, 20)
        for i in range(len(frames)):
            frames[i, :10, :15] = 0 if i % 2 else 255
        e, a, v = measure_activity(frames)
        intervals, _ = segment(t, e, a, v)
        self.assertEqual(len(intervals), 3)
        for interval, start in zip(intervals, [25, 100, 175]):
            self.assertAlmostEqual(interval["startMs"], start * 1000 / 60, delta=35)

    def test_static_alpha_proxy_and_moving_occlusion_rejected(self):
        rng = np.random.default_rng(4)
        fg = rng.integers(20, 220, (90, 90)).astype(float)
        bg = np.full((90, 90), 240.0)
        progress = np.linspace(0, 1, 20)
        frames = np.array([(bg + (fg - bg) * p).astype(np.uint8) for p in progress])
        result = alpha_series(frames, [0, 0, 90, 90], len(frames) - 1)
        self.assertIsNotNone(result)
        np.testing.assert_allclose(result[0], progress, atol=0.01)

    def test_vfr_decoder_keeps_real_pts(self):
        with tempfile.TemporaryDirectory() as temp:
            video = Path(temp) / "vfr.mov"
            subprocess.run(
                [
                    "ffmpeg",
                    "-v",
                    "error",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    "testsrc2=size=120x160:rate=60:duration=1",
                    "-vf",
                    "setpts=if(lt(N\\,30)\\,N\\,30+(N-30)*2)/(60*TB)",
                    "-fps_mode",
                    "vfr",
                    "-c:v",
                    "libx264",
                    str(video),
                ],
                check=True,
            )
            meta, pts, frames = decode(video, 120, temp)
            self.assertTrue(meta["variableFrameRate"])
            self.assertEqual(len(frames), 60)
            self.assertGreater(np.max(np.diff(pts)), 1.9 * np.min(np.diff(pts)))
            self.assertAlmostEqual(pts[40], 833.333, delta=1)


if __name__ == "__main__":
    unittest.main()
