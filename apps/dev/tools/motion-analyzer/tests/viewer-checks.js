(async () => {
  const checks = [];
  const $ = (id) => document.getElementById(id);
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  const until = async (predicate, label) => {
    const end = performance.now() + 3500;
    while (!predicate()) {
      if (performance.now() > end) throw new Error(`Timed out: ${label}`);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const data = JSON.parse($("study-data").textContent);
  const seek = async (time) => {
    const same = Math.abs($("video").currentTime * 1000 - time) < 1;
    let presented = same ? time : null;
    if (!same && $("video").requestVideoFrameCallback) {
      $("video").requestVideoFrameCallback((_, metadata) => {
        presented = metadata.mediaTime * 1000;
      });
    }
    $("scrubber").value = time;
    $("scrubber").dispatchEvent(new Event("input", { bubbles: true }));
    await until(() => !$("video").seeking, "video seek");
    if ($("video").requestVideoFrameCallback) {
      await until(() => presented !== null, "presented video frame");
      assert(
        Math.abs(presented - time) <= data.video.frameIntervalMs.max + 1,
        "Seek presents the requested source frame",
      );
    }
  };
  const select = async (index) => {
    document.querySelector(`[data-segment="${index}"]`).click();
    await until(
      () => $("video").readyState >= 2 && !$("play").disabled,
      "segment metadata",
    );
  };
  const chosen = Math.min(3, data.segments.length - 1);
  await select(chosen);
  assert(
    $("video").seekable.length > 0 && $("video").seekable.end(0) > 0,
    "Video source supports seeking",
  );
  assert(
    $("segment-title").textContent.length > 0,
    "Segment selection changes the title",
  );
  assert(
    $("video")
      .getAttribute("src")
      .startsWith(data.segments[chosen].id + "/"),
    "Segment selection changes the video",
  );
  const times = data.segments[chosen].tracks.find((t) => t.timeMs)?.timeMs || [
    0,
  ];
  $("next-frame").click();
  await until(
    () => !$("video").seeking && Number($("plot").dataset.timeMs) > 0,
    "next frame",
  );
  assert(
    Math.abs($("video").currentTime * 1000 - times[1]) < 1,
    "Next frame uses source PTS",
  );
  assert(
    Math.abs(Number($("plot").dataset.timeMs) - times[1]) < 1,
    "Graph cursor follows frame stepping",
  );
  $("previous-frame").click();
  await until(
    () => !$("video").seeking && Number($("plot").dataset.timeMs) < 1,
    "previous frame",
  );
  assert(
    Number($("plot").dataset.timeMs) < 1,
    "Previous frame returns to the first PTS",
  );
  $("view-curve").click();
  assert(
    $("view-curve").getAttribute("aria-pressed") === "true",
    "Curve view is selectable",
  );
  assert(
    !!document.querySelector(".bezier-card"),
    "Bezier controls are visible in curve view",
  );
  const middle = times[Math.floor(times.length / 2)];
  await seek(middle);
  assert(
    Math.abs($("video").currentTime * 1000 - Number($("plot").dataset.timeMs)) <
      1,
    "Slider keeps the video and graph at the same time",
  );
  $("speed").value = "0.25";
  $("speed").dispatchEvent(new Event("change", { bubbles: true }));
  assert(
    $("video").playbackRate === 0.25,
    "Playback speed control applies to the video",
  );
  if ($("loop").getAttribute("aria-pressed") === "true") $("loop").click();
  assert(!$("video").loop, "Loop can be disabled");
  await seek(0);
  $("play").click();
  await until(
    () => !$("video").paused && Number($("plot").dataset.timeMs) > 25,
    "playing graph",
  );
  const playbackDifference = Math.abs(
    $("video").currentTime * 1000 - Number($("plot").dataset.timeMs),
  );
  assert(
    playbackDifference <= data.video.frameIntervalMs.max + 5,
    "Playing cursor stays within one source frame of video playback",
  );
  $("play").click();
  await new Promise((resolve) => setTimeout(resolve, 60));
  const paused = Number($("plot").dataset.timeMs);
  await new Promise((resolve) => setTimeout(resolve, 80));
  assert(
    $("video").paused &&
      Math.abs(Number($("plot").dataset.timeMs) - paused) < 1,
    "Pause freezes the cursor",
  );
  await select(Math.min(chosen + 1, data.segments.length - 1));
  assert(
    $("video").paused && Number($("plot").dataset.timeMs) < 1,
    "Changing segments resets and pauses the viewer",
  );
  assert(
    $("video").playbackRate === 0.25 && !$("video").loop,
    "Playback preferences survive a segment change",
  );
  $("view-timing").click();
  const chip = document.querySelector('[data-track="1"]');
  if (chip) {
    chip.click();
    assert(
      chip.dataset.track === "1" &&
        document
          .querySelector('[data-track="1"]')
          .getAttribute("aria-pressed") === "true",
      "Element selection updates the inspector",
    );
  }
  const images = [...document.querySelectorAll("img")];
  for (const image of images) image.loading = "eager";
  await until(() => images.every((image) => image.complete), "thumbnails");
  assert(
    images.every((image) => image.naturalWidth > 0),
    "All thumbnails load from local assets",
  );
  assert(
    document.documentElement.scrollWidth <= innerWidth,
    "Viewer has no page-level horizontal overflow",
  );
  return { passed: checks.length, checks };
})();
