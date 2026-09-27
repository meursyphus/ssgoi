"""Report presentation must preserve measured data and treat labels as text."""

import json
from html.parser import HTMLParser
from pathlib import Path
import tempfile
import unittest

from motion_analyzer.report import rerender


class EmbeddedData(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.data = ""
        self.script_count = 0
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script":
            self.script_count += 1
            self.active = attrs.get("id") == "study-data"
        if tag == "img":
            self.images.append(attrs)

    def handle_endtag(self, tag):
        if tag == "script":
            self.active = False

    def handle_data(self, data):
        if self.active:
            self.data += data


class ReportTests(unittest.TestCase):
    def test_rerender_preserves_measurements_and_escapes_untrusted_labels(self):
        label = '</script><img src=x onerror="alert(1)"> __STUDY_JS__'
        report = {
            "schemaVersion": 1,
            "source": {"name": label},
            "interpretation": label,
            "segments": [
                {
                    "id": "transition-01",
                    "name": label,
                    "startMs": 0,
                    "endMs": 300,
                    "durationMs": 300,
                    "confidence": "review",
                    "tracks": [],
                    "code": label,
                }
            ],
        }
        original = json.dumps(report, indent=3)
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "report.json"
            source.write_text(original)
            rerender(source)
            self.assertEqual(source.read_text(), original)
            parsed = EmbeddedData()
            parsed.feed((Path(directory) / "report.html").read_text())
            self.assertEqual(json.loads(parsed.data), report)
            self.assertEqual(parsed.script_count, 2)
            self.assertEqual(parsed.images, [])
            self.assertTrue((Path(directory) / "report.md").exists())

    def test_invalid_report_version_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "report.json"
            source.write_text('{"schemaVersion":2,"segments":[]}')
            with self.assertRaises(ValueError):
                rerender(source)


if __name__ == "__main__":
    unittest.main()
