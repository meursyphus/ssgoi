(() => {
  "use strict";
  const report = JSON.parse(document.getElementById("study-data").textContent);
  const $ = (id) => document.getElementById(id);
  const colors = [
    "#4c7ce5",
    "#d78d65",
    "#4ca394",
    "#9c84cb",
    "#c3a154",
    "#679aae",
    "#bd85a7",
  ];
  const propertyNames = {
    x: "가로 위치",
    y: "세로 위치",
    scale: "크기",
    opacityProxy: "불투명도 추정",
  };
  const qualities = {
    high: "측정 양호",
    medium: "추정 포함",
    review: "검토 필요",
    unmeasured: "측정 불가",
  };
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const num = (v, digits = 0) =>
    Number.isFinite(v)
      ? (Math.abs(v) < 0.5 * 10 ** -digits ? 0 : v).toLocaleString("en-US", {
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        })
      : "—";
  const finite = (v) => typeof v === "number" && Number.isFinite(v);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const nameOf = (e) => e.name.replace(/^\d+\s*[·.\-]\s*/, "");
  const asset = (e, file) => `${encodeURIComponent(e.id)}/${file}`;
  const video = $("video");
  const state = {
    index: 0,
    row: 0,
    view: "timing",
    time: 0,
    rate: 0.5,
    loop: true,
    dragging: false,
    ready: false,
    pending: null,
    generation: 0,
  };
  let frameHandle = null,
    animationHandle = null,
    toastTimer = null;
  let plotGeometry = null;
  const event = () => report.segments[state.index];
  function rows() {
    return event().tracks.flatMap((track, trackIndex) => {
      const props = Object.keys(track.properties);
      return (props.length ? props : [null]).map((property) => ({
        track,
        trackIndex,
        property,
        color: colors[trackIndex % colors.length],
      }));
    });
  }
  const selected = () => rows()[state.row] || null;
  function samples() {
    const times = event().tracks.find((t) => Array.isArray(t.timeMs))
      ?.timeMs || [0, event().durationMs];
    // The legacy clip excludes its final boundary frame. Never seek past its last playable PTS.
    return times.filter(
      (t) =>
        t <= event().durationMs &&
        (!state.ready || t < video.duration * 1000 - 0.1),
    );
  }
  function nearestFrame(ms) {
    const times = samples();
    return times.reduce(
      (best, time) => (Math.abs(time - ms) < Math.abs(best - ms) ? time : best),
      times[0] || 0,
    );
  }
  function at(times, values, time, preserveGaps = false) {
    if (!times?.length || !values?.length) return null;
    if (time < times[0] || time > times[times.length - 1]) {
      if (preserveGaps) return null;
      return time < times[0] ? values[0] : values[values.length - 1];
    }
    let hi = times.findIndex((t) => t >= time);
    if (hi < 0) return values[values.length - 1];
    if (hi === 0 || Math.abs(times[hi] - time) < 0.05)
      return finite(values[hi]) ? values[hi] : null;
    const lo = hi - 1;
    if (!finite(values[lo]) || !finite(values[hi])) return null;
    return (
      values[lo] +
      ((values[hi] - values[lo]) * (time - times[lo])) / (times[hi] - times[lo])
    );
  }
  function predicted(fit, time) {
    if (!fit) return null;
    if (time < fit.t0Ms) return 0;
    return at(fit.simulation.timeMs, fit.simulation.progress, time - fit.t0Ms);
  }
  function badge(quality) {
    return `<span class="quality ${escape(quality)}">${escape(qualities[quality] || quality)}</span>`;
  }
  function makeRail() {
    $("segments").innerHTML = report.segments
      .map(
        (e, i) =>
          `<button class="segment-button${i === state.index ? " active" : ""}" data-segment="${i}" aria-pressed="${i === state.index}" aria-label="${i + 1}번 전환: ${escape(nameOf(e))}"><img class="segment-thumb" src="${asset(e, "thumbnail.jpg")}" alt="" loading="lazy"><span class="segment-copy"><span class="segment-number">TRANSITION ${String(i + 1).padStart(2, "0")}</span><span class="segment-name">${escape(nameOf(e))}</span><span class="segment-time">${num(e.startMs / 1000, 2)}–${num(e.endMs / 1000, 2)} s <span aria-hidden="true">·</span> ${num(e.durationMs)} ms</span></span></button>`,
      )
      .join("");
  }
  function selectSegment(index, updateHash = true) {
    if (!report.segments[index]) return;
    state.generation++;
    video.pause();
    if (frameHandle !== null && video.cancelVideoFrameCallback)
      video.cancelVideoFrameCallback(frameHandle);
    if (animationHandle !== null) cancelAnimationFrame(animationHandle);
    state.index = index;
    state.row = 0;
    state.time = 0;
    state.pending = null;
    state.ready = false;
    const e = event();
    if (updateHash) {
      try {
        history.replaceState(null, "", `#${e.id}`);
      } catch (_) {
        /* File viewers may disallow history. */
      }
    }
    makeRail();
    $("segment-index").textContent =
      `TRANSITION ${String(index + 1).padStart(2, "0")} / ${String(report.segments.length).padStart(2, "0")}`;
    $("segment-title").textContent = nameOf(e);
    const fitted = e.tracks.filter((t) => t.fit).length;
    $("segment-meta").innerHTML =
      `<span class="meta-pill">${e.direction === "forward" ? "진입" : e.direction === "backward" ? "복귀" : "방향 미지정"}</span><span class="meta-pill">${num(e.durationMs)} ms</span><span>${fitted}개 측정${e.tracks.length > fitted ? ` · ${e.tracks.length - fitted}개 미측정` : ""}</span>`;
    $("recording-range").textContent =
      `${num(e.startMs / 1000, 3)}–${num(e.endMs / 1000, 3)} s`;
    $("segment-notes").replaceChildren(
      ...(e.notes || []).map((n) => {
        const p = document.createElement("p");
        p.textContent = n;
        return p;
      }),
    );
    $("frame-strip-link").href = asset(e, "frames.png");
    $("chart-download").href = asset(e, "timeline.svg");
    $("code-download").href = asset(e, "motion.ts");
    $("csv-download").href = asset(e, "curves.csv");
    $("curves-download").href = asset(e, "curves.png");
    $("full-code").textContent = e.code;
    $("video-fallback").href = asset(e, "clip.mp4");
    $("video-error").hidden = true;
    $("video-stage").classList.add("waiting");
    video.poster = asset(e, "poster.jpg");
    video.src = asset(e, "clip.mp4");
    video.playbackRate = state.rate;
    video.loop = state.loop;
    $("scrubber").max = e.durationMs;
    $("time-total").textContent = `/ ${num(e.durationMs)}`;
    setControlsDisabled(true);
    renderChart();
    renderInspector();
    renderRelationships();
    updateTime(0);
    updatePlayback();
    watchVideo(state.generation);
  }
  function setControlsDisabled(disabled) {
    for (const id of [
      "play",
      "stage-play",
      "previous-frame",
      "next-frame",
      "scrubber",
    ])
      $(id).disabled = disabled;
  }
  function watchVideo(generation) {
    if (!video.requestVideoFrameCallback) return;
    frameHandle = video.requestVideoFrameCallback((_, metadata) => {
      if (generation !== state.generation) return;
      if (!state.dragging && state.pending === null && !video.seeking)
        updateTime(metadata.mediaTime * 1000);
      watchVideo(generation);
    });
  }
  function fallbackClock() {
    if (video.requestVideoFrameCallback || video.paused) return;
    if (!video.seeking && state.pending === null)
      updateTime(video.currentTime * 1000);
    animationHandle = requestAnimationFrame(fallbackClock);
  }
  function updatePlayback() {
    const playing = !video.paused && !video.ended;
    $("play").setAttribute(
      "aria-label",
      playing ? "영상 일시정지" : "영상 재생",
    );
    $("play-icon").setAttribute(
      "d",
      playing ? "M7 5h4v14H7zM15 5h4v14h-4z" : "m9 5 11 7-11 7Z",
    );
    $("video-stage").classList.toggle("playing", playing);
    $("stage-play").hidden = playing;
  }
  async function togglePlayback() {
    if (!state.ready) return;
    if (video.paused) {
      if (video.ended || state.time >= samples().at(-1) - 0.1)
        video.currentTime = 0;
      try {
        await video.play();
      } catch (_) {
        toast("재생 버튼을 다시 눌러주세요.");
      }
    } else video.pause();
  }
  function seek(ms) {
    if (!state.ready) return;
    video.pause();
    const target = nearestFrame(clamp(ms, 0, event().durationMs));
    const seekable = Array.from({ length: video.seekable.length }, (_, i) => [
      video.seekable.start(i) * 1000,
      video.seekable.end(i) * 1000,
    ]).some(([start, end]) => target >= start && target <= end);
    if (target > 0 && !seekable) {
      updateTime(video.currentTime * 1000);
      toast(
        "영상 탐색이 아직 준비되지 않았습니다. 로컬 뷰어에서 다시 열어주세요.",
      );
      return;
    }
    state.pending = target;
    updateTime(target);
    video.currentTime = target / 1000;
    // Seeking to the same timestamp need not emit seeked.
    if (!video.seeking) state.pending = null;
  }
  function stepFrame(direction) {
    if (!state.ready) return;
    const times = samples(),
      here = nearestFrame(state.time);
    const i = times.indexOf(here);
    seek(times[clamp(i + direction, 0, times.length - 1)]);
  }
  function updateTime(ms) {
    state.time = clamp(ms, 0, event().durationMs);
    $("time-current").textContent = num(state.time);
    const times = samples();
    const index = Math.max(0, times.indexOf(nearestFrame(state.time)));
    $("frame-readout").textContent =
      `f${event().startFrame + index} · ${num(event().startMs + state.time)} ms`;
    $("scrubber").value = state.time;
    $("scrubber").style.setProperty(
      "--seek",
      `${(state.time / event().durationMs) * 100}%`,
    );
    $("scrubber").setAttribute(
      "aria-valuetext",
      `${num(state.time)} 밀리초, 원본 ${num(event().startMs + state.time)} 밀리초`,
    );
    $("plot").dataset.timeMs = state.time.toFixed(3);
    const cursor = $("time-cursor");
    if (cursor && plotGeometry) {
      const x = plotGeometry.x(state.time);
      cursor.setAttribute("transform", `translate(${x.toFixed(2)} 0)`);
      $("cursor-text").textContent = `${num(state.time)} ms`;
    }
    const s = selected();
    if (s?.property) {
      const p = s.track.properties[s.property];
      const measured = at(s.track.timeMs, p.progress, state.time, true);
      const estimate = predicted(s.track.fit, state.time);
      if ($("current-progress"))
        $("current-progress").textContent = finite(measured)
          ? `${num(measured * 100, 1)}%`
          : "관측 없음";
      if ($("current-physics"))
        $("current-physics").textContent = finite(estimate)
          ? `${num(estimate * 100, 1)}%`
          : "—";
      if ($("value-cursor") && state.view === "curve" && finite(estimate)) {
        $("value-cursor").setAttribute("cx", plotGeometry.x(state.time));
        $("value-cursor").setAttribute("cy", plotGeometry.y(estimate));
      }
    }
  }
  function path(times, values, x, y) {
    let result = "",
      started = false;
    times.forEach((time, i) => {
      if (!finite(values[i])) {
        started = false;
        return;
      }
      result += `${started ? "L" : "M"}${x(time).toFixed(2)},${y(values[i]).toFixed(2)} `;
      started = true;
    });
    return result;
  }
  function niceStep(span) {
    const raw = span / 6,
      magnitude = 10 ** Math.floor(Math.log10(raw));
    return [1, 2, 2.5, 5, 10].find((v) => v * magnitude >= raw) * magnitude;
  }
  function ticks(duration) {
    const step = niceStep(duration),
      values = [];
    for (let t = 0; t <= duration + 0.01; t += step) values.push(t);
    return values;
  }
  function cursorMarkup(top, bottom) {
    return `<g id="time-cursor" pointer-events="none"><line class="cursor-line" x1="0" y1="${top - 8}" x2="0" y2="${bottom}"/><rect x="-28" y="${top - 29}" width="56" height="20" rx="5" fill="#526b91"/><text id="cursor-text" class="cursor-label" x="0" y="${top - 15}" text-anchor="middle">0 ms</text></g>`;
  }
  function renderChart() {
    const e = event(),
      all = rows(),
      svg = $("plot"),
      W = Math.max(300, svg.clientWidth || 1000);
    const compact = W < 550;
    $("view-timing").classList.toggle("active", state.view === "timing");
    $("view-curve").classList.toggle("active", state.view === "curve");
    $("view-timing").setAttribute("aria-pressed", state.view === "timing");
    $("view-curve").setAttribute("aria-pressed", state.view === "curve");
    document.querySelector(".bezier-legend").hidden = state.view !== "curve";
    const s = selected();
    $("chart-title").textContent =
      state.view === "timing" ? "요소별 타이밍" : "측정 곡선과 재현 곡선";
    $("chart-subtitle").textContent =
      state.view === "timing"
        ? "시작과 끝, 겹치는 순간을 같은 시간축에서."
        : `${s?.track.name || "요소 선택"}${s?.property ? " · " + propertyNames[s.property] : ""}`;
    if (!all.length) {
      svg.setAttribute("viewBox", "0 0 1000 160");
      svg.innerHTML =
        '<text x="500" y="85" text-anchor="middle" fill="#9aa5b5" font-size="16">측정된 요소가 없습니다. 분석 계획을 보정해주세요.</text>';
      plotGeometry = null;
      return;
    }
    if (state.view === "timing") {
      const left = compact ? 126 : 232,
        right = W - (compact ? 27 : 65),
        top = 42,
        rowHeight = compact ? 57 : 59,
        bottom = top + all.length * rowHeight,
        H = bottom + 47;
      const x = (t) => left + (t / e.durationMs) * (right - left);
      plotGeometry = { x, left, right, top, bottom, W, H };
      let markup = `<defs><clipPath id="plot-bounds"><rect x="${left}" y="${top - 2}" width="${right - left}" height="${bottom - top + 4}"/></clipPath></defs>`;
      ticks(e.durationMs).forEach((t) => {
        markup += `<line x1="${x(t)}" y1="${top - 4}" x2="${x(t)}" y2="${bottom}" stroke="#edf0f5"/><text class="axis-label" x="${x(t)}" y="${bottom + 24}" text-anchor="middle">${num(t)}</text>`;
      });
      markup += `<text class="axis-label" x="${right + 21}" y="${bottom + 24}">ms</text>`;
      all.forEach((r, i) => {
        const y0 = top + i * rowHeight,
          base = y0 + 42,
          ceiling = y0 + 11,
          p = r.track.properties[r.property],
          active = i === state.row;
        markup += `<g class="row-pick" data-row="${i}" tabindex="0" role="button" aria-label="${escape(r.track.name)} ${escape(propertyNames[r.property] || "측정 불가")} 선택"><rect class="row-wash" x="5" y="${y0}" width="${W - 21}" height="${rowHeight - 4}" rx="7" fill="${active ? "#f5f8fd" : "#fafbfd"}" opacity="${active ? 1 : 0}"/><circle cx="18" cy="${y0 + 24}" r="3" fill="${r.color}"/><text class="row-name" x="31" y="${y0 + 22}">${escape(r.track.name.length > (compact ? 9 : 19) ? r.track.name.slice(0, compact ? 8 : 18) + "…" : r.track.name)}</text><text class="row-property" x="31" y="${y0 + 39}">${escape(propertyNames[r.property] || "측정 불가")}</text>`;
        if (p) {
          const y = (v) => base - clamp(v, -0.14, 1.14) * (base - ceiling);
          const fit = r.track.fit;
          markup += `<g clip-path="url(#plot-bounds)"><line x1="${left}" y1="${base}" x2="${right}" y2="${base}" stroke="#eef2f7"/>`;
          if (fit) {
            const times = fit.simulation.timeMs.map((t) => t + fit.t0Ms),
              ys = fit.simulation.progress;
            const curve = path(times, ys, x, y);
            const measured = times.map((t, k) =>
              t >= p.observedFromMs && t <= p.observedToMs ? ys[k] : null,
            );
            const inBounds = times
              .map((t, k) => ({ t, v: measured[k] }))
              .filter((d) => finite(d.v) && d.t >= 0 && d.t <= e.durationMs);
            if (inBounds.length > 1)
              markup += `<path d="M${x(inBounds[0].t)},${base} ${inBounds.map((d) => `L${x(d.t)},${y(d.v)}`).join(" ")} L${x(inBounds.at(-1).t)},${base}Z" fill="${r.color}" opacity=".12"/>`;
            markup += `<path d="${curve}" fill="none" stroke="${r.color}" stroke-width="1.5" stroke-dasharray="4 3" opacity=".45"/><path d="${path(times, measured, x, y)}" fill="none" stroke="${r.color}" stroke-width="2.3"/>`;
            markup += `<line x1="${x(fit.t0Ms)}" y1="${y0 + 7}" x2="${x(fit.t0Ms)}" y2="${base + 1}" stroke="${r.color}" stroke-width="1.3" opacity=".7"/>`;
          }
          r.track.timeMs.forEach((t, k) => {
            if (finite(p.progress[k]))
              markup += `<circle cx="${x(t)}" cy="${y(p.progress[k])}" r="1.8" fill="${r.color}" opacity=".7"/>`;
          });
          markup += "</g>";
        } else
          markup += `<text class="row-property" x="${left + 12}" y="${y0 + 30}">추적 가능한 측정점이 없습니다.</text>`;
        markup += "</g>";
      });
      markup += cursorMarkup(top, bottom);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.innerHTML = markup;
      $("chart-footnote").textContent =
        "색은 요소, 각 행은 속성입니다. 행을 선택해 설정을 확인하세요.";
    } else {
      const left = compact ? 42 : 66,
        right = W - (compact ? 25 : 50),
        top = 47,
        bottom = compact ? 270 : 312,
        H = bottom + 50;
      const x = (t) => left + (t / e.durationMs) * (right - left);
      if (!s?.property || !s.track.fit) {
        svg.setAttribute("viewBox", "0 0 1000 210");
        svg.innerHTML =
          '<text x="500" y="110" text-anchor="middle" fill="#8d9aaf" font-size="16">이 요소에는 비교할 수 있는 측정 곡선이 없습니다.</text>';
        plotGeometry = null;
        return;
      }
      const tr = s.track,
        p = tr.properties[s.property],
        fit = tr.fit,
        bezier = tr.bezier;
      const values = [
        ...p.progress,
        ...fit.simulation.progress,
        ...(bezier?.predicted || []),
      ].filter(finite);
      const min = Math.min(-0.06, ...values),
        max = Math.max(1.08, ...values),
        y = (v) => bottom - ((v - min) / (max - min)) * (bottom - top);
      plotGeometry = { x, y, left, right, top, bottom, W, H };
      let markup = `<defs><clipPath id="plot-bounds"><rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}"/></clipPath></defs>`;
      [0, 0.25, 0.5, 0.75, 1].forEach((v) => {
        markup += `<line x1="${left}" y1="${y(v)}" x2="${right}" y2="${y(v)}" stroke="${v === 1 ? "#dae3ef" : "#edf1f6"}" ${v === 1 ? 'stroke-dasharray="3 4"' : ""}/><text class="axis-label" x="${left - 14}" y="${y(v) + 4}" text-anchor="end">${v * 100}%</text>`;
      });
      ticks(e.durationMs).forEach((t) => {
        markup += `<line x1="${x(t)}" y1="${top}" x2="${x(t)}" y2="${bottom}" stroke="#edf1f6"/><text class="axis-label" x="${x(t)}" y="${bottom + 25}" text-anchor="middle">${num(t)}</text>`;
      });
      markup += `<text class="axis-label" x="${right + 15}" y="${bottom + 25}">ms</text><g clip-path="url(#plot-bounds)">`;
      const times = fit.simulation.timeMs.map((t) => t + fit.t0Ms);
      const valid = times.map((t, k) =>
        t >= p.observedFromMs && t <= p.observedToMs
          ? fit.simulation.progress[k]
          : null,
      );
      markup += `<path d="${path(times, fit.simulation.progress, x, y)}" fill="none" stroke="${s.color}" stroke-width="2" stroke-dasharray="5 4" opacity=".4"/><path d="${path(times, valid, x, y)}" fill="none" stroke="${s.color}" stroke-width="2.6"/>`;
      if (bezier)
        markup += `<path d="${path(tr.timeMs, bezier.predicted, x, y)}" fill="none" stroke="#c5984a" stroke-width="1.6" stroke-dasharray="7 4"/>`;
      tr.timeMs.forEach((t, i) => {
        if (finite(p.progress[i]))
          markup += `<circle cx="${x(t)}" cy="${y(p.progress[i])}" r="3" fill="white" stroke="${s.color}" stroke-width="1.4"/>`;
      });
      markup +=
        `<circle id="value-cursor" cx="${left}" cy="${y(0)}" r="5" fill="${s.color}" stroke="white" stroke-width="2"/></g>` +
        cursorMarkup(top, bottom);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.innerHTML = markup;
      $("chart-footnote").textContent =
        "베지어는 형태 비교용입니다. 재현 설정은 물리 적분기에서 계산합니다.";
    }
    updateTime(state.time);
  }
  function codeFor(fit) {
    const config = { ...fit.params, restDelta: fit.restDelta };
    if (fit.model !== "inertia") config.restSpeed = fit.restSpeed;
    return `${fit.model === "inertia" ? "new InertiaIntegrator" : "spring"}({\n${Object.entries(
      config,
    )
      .map(([k, v]) => `  ${k}: ${Number(v.toFixed(6))},`)
      .join("\n")}\n})`;
  }
  function highlight(code) {
    return escape(code)
      .replace(
        /\b(spring|InertiaIntegrator)\b/g,
        '<span class="token-call">$1</span>',
      )
      .replace(
        /\b(stiffness|damping|doubleSpring|acceleration|resistance|restDelta|restSpeed)\b/g,
        '<span class="token-name">$1</span>',
      )
      .replace(/(-?\d+(?:\.\d+)?)/g, '<span class="token-number">$1</span>');
  }
  function bezierDiagram(points) {
    const [x1, y1, x2, y2] = points,
      lo = Math.min(0, y1, y2),
      hi = Math.max(1, y1, y2);
    const x = (v) => 15 + v * 108,
      y = (v) => 101 - ((v - lo) / (hi - lo)) * 88;
    return `<svg viewBox="0 0 145 114" role="img" aria-label="베지어 곡선과 두 제어점"><path d="M15 13V101H123" fill="none" stroke="#e6dfcf"/><path d="M15 ${y(0)}L${x(x1)} ${y(y1)}M123 ${y(1)}L${x(x2)} ${y(y2)}" fill="none" stroke="#d4bb88" stroke-dasharray="3 3"/><path d="M15 ${y(0)}C${x(x1)} ${y(y1)},${x(x2)} ${y(y2)},123 ${y(1)}" fill="none" stroke="#b88e41" stroke-width="2"/>${[
      [x1, y1],
      [x2, y2],
    ]
      .map(
        ([a, b]) =>
          `<circle cx="${x(a)}" cy="${y(b)}" r="3" fill="#fffaf0" stroke="#ba985a"/>`,
      )
      .join(
        "",
      )}<circle cx="15" cy="${y(0)}" r="2.5" fill="#b88e41"/><circle cx="123" cy="${y(1)}" r="2.5" fill="#b88e41"/></svg>`;
  }
  function renderInspector() {
    const s = selected(),
      container = $("inspector-content");
    if (!s) {
      $("selected-title").textContent = "측정된 요소 없음";
      container.innerHTML = "";
      $("track-picker").innerHTML = "";
      return;
    }
    const tr = s.track,
      fit = tr.fit,
      p = tr.properties[s.property];
    $("selected-dot").style.background = s.color;
    $("selected-title").textContent =
      tr.name + (s.property ? " · " + propertyNames[s.property] : "");
    $("selected-confidence").innerHTML = badge(tr.confidence);
    $("track-picker").innerHTML = event()
      .tracks.map(
        (track, i) =>
          `<button class="track-chip${i === s.trackIndex ? " active" : ""}" data-track="${i}" aria-pressed="${i === s.trackIndex}"><i style="background:${colors[i % colors.length]}"></i>${escape(track.name)}</button>`,
      )
      .join("");
    if (!fit) {
      container.innerHTML =
        '<p class="empty-measurement">안정적으로 추적할 수 있는 측정점이 부족합니다.<br>이 요소는 수치를 제안하지 않았습니다. 다른 프레임이나 관심 영역으로 다시 측정할 수 있습니다.</p>';
      return;
    }
    const values = Object.entries(fit.params);
    const compactCode = `${fit.model === "inertia" ? "new InertiaIntegrator" : "spring"}({\n${values.map(([k, v]) => `  ${k}: ${Number(v.toFixed(3))},`).join("\n")}\n})`;
    const bounce = finite(fit.bounce)
      ? `duration ${num(fit.duration, 3)} s · bounce ${num(fit.bounce, 3)}`
      : "quadratic resistance · mass 1";
    const delta = p
      ? `${p.delta > 0 ? "+" : ""}${num(p.delta, 1)}${s.property === "scale" ? "×" : s.property === "opacityProxy" ? "" : " px"}`
      : "—";
    const bx = tr.bezier;
    container.innerHTML = `<div class="settings-body"><div class="settings-left"><div class="code-heading"><span class="code-label">${fit.model === "doubleSpring" ? "DOUBLE SPRING" : fit.model.toUpperCase()}</span><button class="copy-button" id="copy-physics" aria-label="선택한 요소의 물리 설정 복사"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="9" rx="1.5"/><path d="M10 4V2H2v9h2"/></svg>설정 복사</button></div><pre class="integrator-code">${highlight(compactCode)}</pre><p class="code-note">${escape(bounce)}<br>가장 가까운 프리셋: <b>${escape(fit.nearestPreset.name)}</b> · 오차 ${num(fit.nearestPreset.rmse * 100, 2)}%</p></div><div class="metrics"><div class="metric"><span class="metric-label" title="구간 시작 기준, 물리 모델의 시작 시각">시작 시각</span><b class="metric-value">${num(fit.t0Ms, 0)}<small>ms</small></b></div><div class="metric"><span class="metric-label" title="구간 시작 기준, 목표 ±2%에 처음 도달">시각적 도착</span><b class="metric-value">${num(fit.t0Ms + fit.arrivalMs, 0)}<small>ms</small></b></div><div class="metric"><span class="metric-label">${escape(propertyNames[s.property] || "속성")} 변화</span><b class="metric-value" style="font-size:16px">${escape(delta)}</b></div><div class="metric"><span class="metric-label" title="정규화한 진행률의 RMSE">곡선 오차</span><b class="metric-value">${num(fit.rmse * 100, 2)}<small>%</small></b></div><div class="current-metric"><span>현재 관측 <b id="current-progress">—</b></span><span>물리 <b id="current-physics">—</b></span></div></div>${state.view === "curve" && bx ? `<div class="bezier-card">${bezierDiagram(bx.controlPoints)}<div><h4>베지어로 보면 이런 모양</h4><code>cubic-bezier(${bx.controlPoints.map((v) => num(v, 3)).join(", ")})</code><p>곡선 오차 ${num(bx.rmse * 100, 2)}% · 형태를 비교하는 참고값입니다.</p></div></div>` : ""}</div><details class="inspector-extra"><summary>정착 시간 · 대안 모델 · 측정 근거</summary><p>물리적 정착은 구간 시작 후 <b>${num(fit.t0Ms + fit.settleMs)} ms</b>입니다. 표시된 코드 값은 읽기 쉽게 반올림했으며, 복사할 때 정밀도와 정착 임계값을 함께 포함합니다.</p>${tr.incomplete ? `<p>${tr.explicitEndpoints ? "보이지 않는 구간은 분석 계획에 지정한 이동량에 의존합니다." : "이 설정은 보이는 구간을 기준으로 맞췄습니다. 가려진 시작과 끝은 확정할 수 없습니다."}</p>` : ""}<p>${escape(tr.geometryEvidence || "이름과 영역은 분석 계획에, 관측값은 CSV에 기록되어 있습니다.")}</p><ul>${fit.alternatives.map((a) => `<li>${escape(a.model)} · 오차 ${num(a.rmse * 100, 2)}%${a.equivalent ? " · 동등한 대안" : ""}</li>`).join("")}</ul><div class="geometry-row">${Object.entries(
      tr.properties,
    )
      .map(
        ([key, v]) =>
          `<span class="geometry-tag">${escape(key)} ${num(v.from, 2)} → ${num(v.to, 2)}</span>`,
      )
      .join("")}</div></details>`;
    $("copy-physics").onclick = () => copyText(codeFor(fit));
    updateTime(state.time);
  }
  function renderRelationships() {
    const e = event(),
      byId = Object.fromEntries(e.tracks.map((t) => [t.id, t]));
    $("relationships").innerHTML = e.overlaps.length
      ? e.overlaps
          .map((r) => {
            const simultaneous =
              r.delayMs < report.video.frameIntervalMs.median;
            const label = simultaneous
              ? "같은 프레임 간격 안에서 시작"
              : `${num(r.delayMs)} ms 뒤에 시작`;
            const threshold = finite(r.startAt)
              ? `startAt ≈ ${num(r.startAt, 3)}`
              : "진행률 기준으로 정확히 예약할 수 없음";
            return `<div class="relationship"><div class="relation-names"><span>${escape(byId[r.first]?.name || r.first)}</span><span class="arrow">→</span><span>${escape(byId[r.second]?.name || r.second)}</span></div><div class="relation-data"><b>${label}</b><span>${threshold}${r.confidence === "review" ? " · 추정 관계" : ""}</span></div></div>`;
          })
          .join("")
      : '<p class="empty-relationship">비교할 수 있는 측정 트랙이 하나뿐입니다.</p>';
  }
  function pickRow(index) {
    state.row = clamp(index, 0, Math.max(0, rows().length - 1));
    renderChart();
    renderInspector();
  }
  function setView(view) {
    state.view = view;
    renderChart();
    renderInspector();
  }
  function toast(message) {
    $("toast").textContent = message;
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("toast").hidden = true), 2400);
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(text);
      else throw new Error("Clipboard unavailable");
      toast("물리 설정을 복사했습니다.");
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      toast(
        copied
          ? "물리 설정을 복사했습니다."
          : "복사를 허용하거나 아래에서 SSGOI 코드 파일을 내려받으세요.",
      );
    }
  }
  function pointFromPointer(e) {
    if (!plotGeometry) return null;
    const bounds = $("plot").getBoundingClientRect();
    return {
      x: ((e.clientX - bounds.left) / bounds.width) * plotGeometry.W,
      y: ((e.clientY - bounds.top) / bounds.height) * plotGeometry.H,
    };
  }
  function seekPointer(e) {
    const p = pointFromPointer(e);
    if (p)
      seek(
        ((p.x - plotGeometry.left) / (plotGeometry.right - plotGeometry.left)) *
          event().durationMs,
      );
  }
  $("plot").addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const p = pointFromPointer(e);
    if (!p) return;
    const row = e.target.closest("[data-row]");
    if (row) pickRow(Number(row.dataset.row));
    if (
      p.x < plotGeometry.left ||
      p.y < plotGeometry.top - 12 ||
      p.y > plotGeometry.bottom + 30
    )
      return;
    if (!state.ready) return;
    state.dragging = true;
    $("plot").classList.add("dragging");
    $("plot").setPointerCapture(e.pointerId);
    seekPointer(e);
    e.preventDefault();
  });
  $("plot").addEventListener("pointermove", (e) => {
    if (state.dragging) seekPointer(e);
  });
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    $("plot").addEventListener(name, () => {
      state.dragging = false;
      $("plot").classList.remove("dragging");
    });
  $("plot").addEventListener("keydown", (e) => {
    const row = e.target.closest("[data-row]");
    if (row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();
      const i = Number(row.dataset.row);
      pickRow(i);
      $("plot").querySelector(`[data-row="${i}"]`)?.focus();
    }
  });
  $("segments").addEventListener("click", (e) => {
    const b = e.target.closest("[data-segment]");
    if (b) selectSegment(Number(b.dataset.segment));
  });
  $("track-picker").addEventListener("click", (e) => {
    const b = e.target.closest("[data-track]");
    if (b)
      pickRow(
        rows().findIndex((r) => r.trackIndex === Number(b.dataset.track)),
      );
  });
  $("view-timing").onclick = () => setView("timing");
  $("view-curve").onclick = () => setView("curve");
  $("play").onclick = togglePlayback;
  $("stage-play").onclick = togglePlayback;
  video.addEventListener("click", togglePlayback);
  $("previous-frame").onclick = () => stepFrame(-1);
  $("next-frame").onclick = () => stepFrame(1);
  $("scrubber").addEventListener("input", (e) => seek(Number(e.target.value)));
  $("scrubber").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      stepFrame(e.key === "ArrowLeft" ? -1 : 1);
    }
  });
  $("speed").onchange = (e) => {
    state.rate = Number(e.target.value);
    video.playbackRate = state.rate;
  };
  $("loop").onclick = () => {
    state.loop = !state.loop;
    video.loop = state.loop;
    $("loop").setAttribute("aria-pressed", state.loop);
    $("loop").classList.toggle("is-on", state.loop);
  };
  video.addEventListener("loadedmetadata", () => {
    state.ready = true;
    video.playbackRate = state.rate;
    setControlsDisabled(false);
    updateTime(0);
  });
  video.addEventListener("loadeddata", () => {
    $("video-stage").classList.remove("waiting");
  });
  video.addEventListener("play", () => {
    updatePlayback();
    fallbackClock();
  });
  video.addEventListener("pause", updatePlayback);
  video.addEventListener("ended", () => {
    updatePlayback();
    updateTime(nearestFrame(event().durationMs));
  });
  video.addEventListener("seeked", () => {
    state.pending = null;
    if (!state.dragging) updateTime(nearestFrame(video.currentTime * 1000));
  });
  video.addEventListener("error", () => {
    $("video-error").hidden = false;
    setControlsDisabled(true);
    state.ready = false;
    updatePlayback();
  });
  document.addEventListener("keydown", (e) => {
    if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.target.closest('input,select,textarea,button,a,summary,[role="button"]')
    )
      return;
    if (e.key === " ") {
      e.preventDefault();
      togglePlayback();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      stepFrame(e.key === "ArrowLeft" ? -1 : 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      seek(0);
    }
  });
  $("chart-download").onclick = (e) => {
    e.preventDefault();
    const svg = $("plot").cloneNode(true);
    svg.removeAttribute("tabindex");
    const style = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );
    style.textContent =
      "text{font-family:-apple-system,Arial,sans-serif}.axis-label{font:11px monospace;fill:#9ba6b5}.row-name{font-size:13px;fill:#506179}.row-property{font-size:10px;fill:#99a5b6}.cursor-label{font:11px monospace;fill:white}.cursor-line{stroke:#547196;stroke-width:1;stroke-dasharray:3 3}";
    svg.prepend(style);
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event().id}-${state.view}-${Math.round(state.time)}ms.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  document.querySelector(".brand").onclick = (e) => {
    e.preventDefault();
    selectSegment(0);
  };
  addEventListener("hashchange", () => {
    const index = report.segments.findIndex(
      (e) => `#${e.id}` === location.hash,
    );
    if (index >= 0 && index !== state.index) selectSegment(index, false);
  });
  $("source-name").textContent = report.source.name;
  $("source-specs").textContent =
    `${report.video.width} × ${report.video.height} · 평균 ${num(report.video.averageFps, 1)} fps · ${num(report.video.durationMs / 1000, 2)}초 녹화`;
  $("verification").textContent =
    report.physicsVerification?.status === "passed"
      ? "SSGOI 물리 검증 완료"
      : "물리 검증 정보 없음";
  $("interpretation").textContent = report.interpretation;
  $("excluded").innerHTML =
    (report.excluded || [])
      .map(
        (e) =>
          `<li>${num(e.startMs / 1000, 2)}–${num(e.endMs / 1000, 2)} s · ${escape(e.reason)}</li>`,
      )
      .join("") || "<li>없음</li>";
  $("warnings").innerHTML = (report.warnings || [])
    .map((t) => `<li>${escape(t)}</li>`)
    .join("");
  $("verification-detail").textContent =
    report.physicsVerification?.status === "passed"
      ? `현재 SSGOI 소스와 ${report.physicsVerification.curvesChecked}개 곡선을 대조했습니다. 최대 수치 차이 ${report.physicsVerification.maxAbsoluteError.toExponential(2)}. 녹화의 프레임 간격은 ${num(report.video.frameIntervalMs.min)}–${num(report.video.frameIntervalMs.max)} ms이며, 프레임 간 움직임은 직접 관측되지 않습니다.`
      : "현재 소스와의 수치 대조 정보가 없습니다.";
  const initial = report.segments.findIndex(
    (e) => `#${e.id}` === location.hash,
  );
  if (report.segments.length) selectSegment(initial >= 0 ? initial : 0, false);
  let lastWidth = $("plot").clientWidth;
  new ResizeObserver(() => {
    const width = $("plot").clientWidth;
    if (Math.abs(width - lastWidth) > 1) {
      lastWidth = width;
      renderChart();
    }
  }).observe(document.querySelector(".chart-card"));
})();
