from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import unittest
from urllib.request import Request, urlopen
from urllib.error import HTTPError

from motion_analyzer.server import ReportHandler


class PreviewServerTests(unittest.TestCase):
    def test_byte_ranges_allow_video_seeking(self):
        payload = bytes(range(256)) * 4
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory) / "clip.mp4").write_bytes(payload)
            server = ThreadingHTTPServer(
                ("127.0.0.1", 0), partial(ReportHandler, directory=directory)
            )
            worker = threading.Thread(target=server.serve_forever, daemon=True)
            worker.start()
            try:
                url = f"http://127.0.0.1:{server.server_port}/clip.mp4"
                for header, expected, content_range in [
                    ("bytes=15-31", payload[15:32], "bytes 15-31/1024"),
                    ("bytes=1000-", payload[1000:], "bytes 1000-1023/1024"),
                    ("bytes=-12", payload[-12:], "bytes 1012-1023/1024"),
                ]:
                    with urlopen(
                        Request(url, headers={"Range": header}), timeout=2
                    ) as response:
                        self.assertEqual(response.status, 206)
                        self.assertEqual(response.headers["Accept-Ranges"], "bytes")
                        self.assertEqual(
                            response.headers["Content-Range"], content_range
                        )
                        self.assertEqual(response.read(), expected)
                with urlopen(url, timeout=2) as response:
                    self.assertEqual(response.read(), payload)
                with self.assertRaises(HTTPError) as raised:
                    urlopen(Request(url, headers={"Range": "bytes=1024-"}), timeout=2)
                self.assertEqual(raised.exception.code, 416)
                raised.exception.close()
            finally:
                server.shutdown()
                server.server_close()
                worker.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
