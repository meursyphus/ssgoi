// Feasibility check for the motion analyzer:
//  1. Convert ssgoi's hardcoded springs to Apple duration/bounce + settle time.
//  2. Recover spring params from a noisy 30fps/60fps sampled curve with
//     Nelder–Mead, using the same semi-implicit Euler step ssgoi uses.

const FRAME = 1 / 60;

function springStep({ k, c }, s, target, dt) {
  const h = Math.min(dt, 0.033);
  const omega = Math.sqrt(k);
  const zeta = c / (2 * Math.sqrt(k));
  const v = s.v + -2 * h * zeta * omega * s.v + h * omega * omega * (target - s.p);
  return { p: s.p + h * v, v };
}

function inertiaStep({ a, r }, s, target, dt) {
  const h = Math.min(dt, 0.033);
  const dir = target > s.p ? 1 : -1;
  const acc = dir * a - r * s.v * Math.abs(s.v);
  const v = s.v + acc * h;
  let p = s.p + v * h;
  if ((dir > 0 && p > target) || (dir < 0 && p < target)) p = target;
  return { p, v: p === target ? 0 : v };
}

// Simulate at 60fps exactly like WebAnimation.simulate, return position at each frame.
function simulate(model, params, frames = 240) {
  const out = [];
  let s = { p: 0, v: 0 };
  let leader = { p: 0, v: 0 };
  for (let i = 0; i < frames; i++) {
    out.push(s.p);
    if (model === "spring") s = springStep(params, s, 1, FRAME);
    else if (model === "double") {
      leader = springStep({ k: params.k, c: params.c }, leader, 1, FRAME);
      s = springStep({ k: params.k * params.ratio, c: params.c }, s, leader.p, FRAME);
    } else if (model === "inertia") s = inertiaStep(params, s, 1, FRAME);
  }
  return out;
}

function settleMs(model, params, restDelta = 0.01, restSpeed = 0.01) {
  let s = { p: 0, v: 0 };
  let leader = { p: 0, v: 0 };
  for (let i = 1; i <= 600; i++) {
    if (model === "spring") s = springStep(params, s, 1, FRAME);
    else if (model === "double") {
      leader = springStep({ k: params.k, c: params.c }, leader, 1, FRAME);
      s = springStep({ k: params.k * params.ratio, c: params.c }, s, leader.p, FRAME);
    } else s = inertiaStep(params, s, 1, FRAME);
    const settled =
      model === "inertia"
        ? Math.abs(1 - s.p) < restDelta
        : Math.abs(1 - s.p) < restDelta && Math.abs(s.v) < restSpeed;
    if (settled) return Math.round(i * FRAME * 1000);
  }
  return Infinity;
}

// ---------- 1. Apple duration/bounce for ssgoi's hardcoded springs ----------
function toAppleParams(k, c) {
  const omega = Math.sqrt(k);
  const zeta = c / (2 * omega);
  const D = (2 * Math.PI) / omega; // perceptual duration (s)
  const bounce = zeta <= 1 ? 1 - zeta : 1 / zeta - 1;
  return { zeta, D, bounce };
}

const SPRINGS = [
  ["default (IntegratorProvider)", 300, 30, {}],
  ["axis x snappy (in/out)", 600, 40, { ratio: 1.2 }],
  ["axis x fluid in", 180, 34, { rest: 0.1 }],
  ["axis y non-dir in", 400, 30, { ratio: 1.2, rest: 0.1 }],
  ["axis z", 280, 30, { rest: 0.1 }],
  ["drill parallax", 230, 25, { follower: [600, 50] }],
  ["drill slide (crossfade)", 250, 23, {}],
  ["sheet static", 190, 25, {}],
  ["sheet blur/scale enter", 200, 24, {}],
  ["zoom static", 530, 34, {}],
  ["zoom expand/blur", 380, 30, { follower: [260, 30] }],
  ["hero default", 320, 30, {}],
  ["hero smooth", 300, 30, { ratio: 1 }],
  ["slide", 170, 22, { ratio: 0.8 }],
  ["fade out / in", 180, 20, { ratio: 1 }],
];

console.log("\n== ssgoi springs → Apple duration/bounce, settle time ==");
console.log(
  "name".padEnd(30),
  "k".padStart(5),
  "c".padStart(4),
  "ζ".padStart(6),
  "bounce".padStart(7),
  "D(ms)".padStart(6),
  "settle(ms)".padStart(11),
);
for (const [name, k, c, opt] of SPRINGS) {
  const { zeta, D, bounce } = toAppleParams(k, c);
  const rest = opt.rest ?? 0.01;
  const model = opt.ratio ? "double" : "spring";
  const params = opt.ratio ? { k, c, ratio: opt.ratio } : { k, c };
  const st = settleMs(model, params, rest, rest);
  console.log(
    name.padEnd(30),
    String(k).padStart(5),
    String(c).padStart(4),
    zeta.toFixed(2).padStart(6),
    bounce.toFixed(2).padStart(7),
    Math.round(D * 1000).toString().padStart(6),
    String(st).padStart(11),
    opt.ratio ? `(double ×${opt.ratio})` : opt.follower ? `(follower ${opt.follower})` : "",
  );
}

// ---------- 2. Nelder–Mead fit on noisy, 30fps-sampled curve ----------
function nelderMead(f, x0, { maxIter = 800, step = 0.3 } = {}) {
  const n = x0.length;
  let simplex = [x0.slice()];
  for (let i = 0; i < n; i++) {
    const p = x0.slice();
    p[i] = p[i] === 0 ? step : p[i] * (1 + step);
    simplex.push(p);
  }
  let vals = simplex.map(f);
  for (let it = 0; it < maxIter; it++) {
    const idx = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b]);
    simplex = idx.map((i) => simplex[i]);
    vals = idx.map((i) => vals[i]);
    const best = simplex[0], worst = simplex[n];
    const centroid = Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) centroid[j] += simplex[i][j] / n;
    const refl = centroid.map((c, j) => c + (c - worst[j]));
    const fr = f(refl);
    if (fr < vals[0]) {
      const exp = centroid.map((c, j) => c + 2 * (c - worst[j]));
      const fe = f(exp);
      if (fe < fr) { simplex[n] = exp; vals[n] = fe; } else { simplex[n] = refl; vals[n] = fr; }
    } else if (fr < vals[n - 1]) {
      simplex[n] = refl; vals[n] = fr;
    } else {
      const con = centroid.map((c, j) => c + 0.5 * (worst[j] - c));
      const fc = f(con);
      if (fc < vals[n]) { simplex[n] = con; vals[n] = fc; }
      else for (let i = 1; i <= n; i++) { simplex[i] = simplex[i].map((x, j) => best[j] + 0.5 * (x - best[j])); vals[i] = f(simplex[i]); }
    }
    if (Math.abs(vals[n] - vals[0]) < 1e-10) break;
  }
  return { x: simplex[0], fx: vals[0] };
}

function sampleAt(curve60, fps, t0ms = 0) {
  // resample a 60fps curve onto `fps` with a start offset (linear interp)
  const out = [];
  for (let i = 0; ; i++) {
    const tMs = t0ms + (i * 1000) / fps;
    const f = tMs / (1000 / 60);
    const lo = Math.floor(f), hi = Math.ceil(f);
    if (hi >= curve60.length) break;
    const a = curve60[lo], b = curve60[hi];
    out.push({ t: tMs, p: a + (b - a) * (f - lo) });
  }
  return out;
}

function rmse(model, params, samples, t0) {
  const sim = simulate(model, params, 300);
  let se = 0;
  for (const s of samples) {
    const f = (s.t - t0) / (1000 / 60);
    let p;
    if (f <= 0) p = 0;
    else if (f >= sim.length - 1) p = 1;
    else { const lo = Math.floor(f); p = sim[lo] + (sim[lo + 1] - sim[lo]) * (f - lo); }
    se += (p - s.p) ** 2;
  }
  return Math.sqrt(se / samples.length);
}

function fit(model, samples) {
  // params encoded in log-space so the simplex stays positive
  const x0 = model === "spring" ? [Math.log(200), Math.log(20), 0]
    : model === "double" ? [Math.log(200), Math.log(20), Math.log(1), 0]
    : [Math.log(100), Math.log(1), 0];
  const decode = (x) => model === "spring" ? { k: Math.exp(x[0]), c: Math.exp(x[1]), t0: x[2] }
    : model === "double" ? { k: Math.exp(x[0]), c: Math.exp(x[1]), ratio: Math.exp(x[2]), t0: x[3] }
    : { a: Math.exp(x[0]), r: Math.exp(x[1]), t0: x[2] };
  const loss = (x) => { const p = decode(x); return rmse(model, p, samples, p.t0 * 100); };
  let best = null;
  // a few restarts to dodge local minima
  for (const scale of [0.5, 1, 2]) {
    const start = x0.map((v, i) => (i === x0.length - 1 ? v : v + Math.log(scale)));
    const r = nelderMead(loss, start);
    if (!best || r.fx < best.fx) best = r;
  }
  const p = decode(best.x);
  return { ...p, t0: p.t0 * 100, rmse: best.fx };
}

function noisy(samples, sigma, seed = 1) {
  let s = seed;
  const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 - 0.5; };
  return samples.map((x) => ({ t: x.t, p: x.p + (rnd() + rnd() + rnd()) * sigma * 2 }));
}

console.log("\n== fit recovery (truth → fitted), progress noise σ=0.01, start offset 37ms ==");
const cases = [
  ["spring 400/30", "spring", { k: 400, c: 30 }],
  ["double 400/30 ×1.2 (axis y non-dir in)", "double", { k: 400, c: 30, ratio: 1.2 }],
  ["inertia 150/1.5 (axis out)", "inertia", { a: 150, r: 1.5 }],
];
for (const [name, model, truth] of cases) {
  const curve = simulate(model, truth, 240);
  for (const fps of [30, 60]) {
    const samples = noisy(sampleAt(curve, fps, 37), 0.01);
    const n = samples.filter((s) => s.p < 0.99).length;
    const results = ["spring", "double", "inertia"].map((m) => [m, fit(m, samples)]);
    results.sort((a, b) => a[1].rmse - b[1].rmse);
    const [bm, bp] = results[0];
    const fmt = (m, p) => m === "inertia"
      ? `a=${p.a.toFixed(0)} r=${p.r.toFixed(2)}`
      : `k=${p.k.toFixed(0)} c=${p.c.toFixed(1)}${m === "double" ? ` ratio=${p.ratio.toFixed(2)}` : ""}`;
    console.log(
      `${name.padEnd(40)} @${fps}fps (${String(n).padStart(2)} moving samples) → best=${bm.padEnd(7)} ${fmt(bm, bp).padEnd(32)} t0=${bp.t0.toFixed(0)}ms rmse=${bp.rmse.toFixed(4)}` +
      `   | others: ${results.slice(1).map(([m, p]) => `${m} ${p.rmse.toFixed(4)}`).join(", ")}`,
    );
  }
}
