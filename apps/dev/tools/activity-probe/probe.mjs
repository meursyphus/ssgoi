// Repro loop for the Comwit-like fixture (/comwit-like) under Next cacheComponents.
//
//   node apps/dev/tools/activity-probe/probe.mjs --runs 10 --delay 0,80 --viewport mobile,desktop
//
// Per run: open the list, scroll to Y, click a card, wait for the detail to
// settle, go back, sample the scroller's scrollTop for 60 frames. Hero is
// judged from the forward transition: did the detail hero image get a
// transform/clip-path (a resolved pair) while the transition ran?
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const { chromium } = createRequire(
  path.join(root, "packages/core/package.json"),
)("@playwright/test");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
// localhost, not 127.0.0.1: Next dev rejects assets from an origin it did not bind.
const BASE = args.base ?? "http://localhost:3100";
const RUNS = Number(args.runs ?? 10);
const DELAYS = String(args.delay ?? "0,80").split(",").map(Number);
const VIEWPORTS = String(args.viewport ?? "mobile,desktop").split(",");
const CPU = Number(args.cpu ?? 1);
const SCROLL_Y = Number(args.scroll ?? 1200);
const REVISIT = args.revisit === "true";

const viewportSize = (name) =>
  name === "mobile" ? { width: 390, height: 844 } : { width: 1280, height: 800 };

const scrollerExpr = `(() => {
  const main = document.querySelector('[data-scroller]');
  const docScrolls = main && getComputedStyle(main).overflowY === 'visible';
  return docScrolls ? document.documentElement : main;
})()`;

async function runOnce(context, { delay, viewport }) {
  let card = 0;
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  await context.addCookies([
    { name: "ssgoi-delay", value: String(delay), url: BASE },
  ]);

  if (args.verbose === "true") {
    page.on("framenavigated", (f) => {
      if (f === page.mainFrame()) console.log("    nav:", f.url());
    });
    page.on("console", (m) => {
      if (m.type() === "error") console.log("    console:", m.text());
    });
  }
  await page.goto(`${BASE}/comwit-like/list`, { waitUntil: "networkidle" });
  // Next dev may reload once after compiling a route; let that settle.
  await page.waitForTimeout(1200);
  await page.evaluate(
    ([expr, y]) => {
      // eslint-disable-next-line no-eval
      const s = eval(expr);
      s.scrollTo({ top: y, behavior: "instant" });
    },
    [scrollerExpr, SCROLL_Y],
  );
  await page.waitForTimeout(250);
  const before = await page.evaluate((expr) => eval(expr).scrollTop, scrollerExpr);
  // Click a card that is fully on screen at this offset, by coordinates, so
  // Playwright's scroll-into-view cannot move the scroller first.
  const target = await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-card]")) {
      const r = el.getBoundingClientRect();
      if (r.top >= 80 && r.bottom <= innerHeight - 80) {
        return { card: Number(el.dataset.card), x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    }
    return null;
  });
  if (!target) throw new Error("no fully visible card at this scroll offset");
  card = target.card;
  if (REVISIT) {
    // Warm the router cache / Activity for this card, then return to the
    // same offset (the return itself is not judged).
    await page.mouse.click(target.x, target.y);
    await page.waitForSelector("[data-body]");
    await page.waitForTimeout(900);
    await page.goBack();
    await page.waitForTimeout(900);
    await page.evaluate(
      ([expr, y]) => eval(expr).scrollTo({ top: y, behavior: "instant" }),
      [scrollerExpr, SCROLL_Y],
    );
    await page.waitForTimeout(250);
  }

  // Forward: click a card and watch the hero target during the transition.
  const heroWatch = page.evaluate(
    ([card]) =>
      new Promise((resolve) => {
        const t0 = performance.now();
        const key = `card-${card}`;
        let enterSeenAt = null;
        let morphed = false;
        let exitLayer = false;
        let detailVisibleAt = null;
        let bodyAt = null;
        const listStyles = [];
        const animated = new Set();
        window.__ssgoiTrace?.push({ t: performance.now(), type: "probe:click" });
        const tick = () => {
          const now = performance.now() - t0;
          const list = document.querySelector('[data-ssgoi-transition="/comwit-like/list"]');
          if (list && listStyles.length < 8 && Math.round(now) % 50 < 17)
            listStyles.push([Math.round(now), list.getAttribute("style")]);
          const detail = document.querySelector(
            `[data-ssgoi-transition="/comwit-like/item/${card}"]`,
          );
          if (detail && detailVisibleAt == null && detail.style.display !== "none")
            detailVisibleAt = now;
          if (bodyAt == null && document.querySelector("[data-body]")) bodyAt = now;
          const enter = document.querySelector(`[data-hero-enter-key="${key}"]`);
          if (enter) {
            if (enterSeenAt == null) enterSeenAt = now;
            // Hero plays through WAAPI, so inline style stays empty; look at
            // running animations and the computed transform/clip instead.
            const cs = getComputedStyle(enter);
            if (
              enter.getAnimations().length > 0 ||
              (cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") ||
              cs.clipPath !== "none"
            )
              morphed = true;
          }
          if (document.querySelector("[data-ssgoi-id]")) exitLayer = true;
          for (const a of document.getAnimations()) {
            const el = a.effect?.target;
            if (!el) continue;
            const tag = `${el.tagName.toLowerCase()}${el.getAttribute("data-hero-enter-key") ? "[enter]" : ""}${el.getAttribute("data-hero-exit-key") ? "[exit]" : ""}${el.getAttribute("data-ssgoi-transition") ? "[page " + el.getAttribute("data-ssgoi-transition") + "]" : ""}${el.hasAttribute("data-ssgoi-clone") ? "[clone]" : ""}`;
            animated.add(tag);
          }
          if (now < 1500) requestAnimationFrame(tick);
          else resolve({ enterSeenAt, morphed, exitLayer, detailVisibleAt, bodyAt, animated: [...animated], listStyles });
        };
        requestAnimationFrame(tick);
      }),
    [card],
  );
  await page.mouse.click(target.x, target.y);
  const hero = await heroWatch;
  await page.waitForSelector("[data-body]");
  await page.waitForTimeout(400);

  // Back: sample scrollTop as the list returns.
  const back = page.evaluate(
    (expr) =>
      new Promise((resolve) => {
        const samples = [];
        const t0 = performance.now();
        const tick = () => {
          const s = eval(expr);
          samples.push([Math.round(performance.now() - t0), s.scrollTop]);
          if (performance.now() - t0 < 1400) requestAnimationFrame(tick);
          else resolve(samples);
        };
        requestAnimationFrame(tick);
      }),
    scrollerExpr,
  );
  if (args.back === "link") {
    // Comwit's app-bar back without in-app history: a push to the parent.
    await page.click("[data-back]");
  } else {
    await page.goBack();
  }
  const samples = await back;
  const after = samples.at(-1)[1];
  const trace = await page.evaluate(() => window.__ssgoiTrace ?? []);
  await page.close();
  return { card, before, after, hero, samples, trace };
}

// One page, many list→detail→back cycles at varying offsets: what a user
// session looks like, with SSGOI's state carried across navigations.
async function runCycles(context, { delay, viewport, cycles }) {
  const page = await context.newPage();
  await context.addCookies([
    { name: "ssgoi-delay", value: String(delay), url: BASE },
  ]);
  await page.goto(`${BASE}/comwit-like/list`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const rows = [];
  for (let c = 0; c < cycles; c++) {
    const y = 400 + ((c * 700) % 2400);
    await page.evaluate(
      ([expr, y]) => eval(expr).scrollTo({ top: y, behavior: "instant" }),
      [scrollerExpr, y],
    );
    await page.waitForTimeout(300);
    const before = await page.evaluate((expr) => eval(expr).scrollTop, scrollerExpr);
    const target = await page.evaluate(() => {
      for (const el of document.querySelectorAll("[data-card]")) {
        const r = el.getBoundingClientRect();
        if (r.top >= 80 && r.bottom <= innerHeight - 80)
          return { card: Number(el.dataset.card), x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });
    await page.mouse.click(target.x, target.y);
    await page.waitForSelector("[data-body]");
    await page.waitForTimeout(900);
    // Scroll the detail too, so the return has a real delta to undo.
    await page.evaluate((expr) => eval(expr).scrollTo({ top: 500, behavior: "instant" }), scrollerExpr);
    await page.waitForTimeout(200);
    if (args.back === "link") await page.click("[data-back]");
    else await page.goBack();
    await page.waitForTimeout(1200);
    const after = await page.evaluate((expr) => eval(expr).scrollTop, scrollerExpr);
    rows.push({ cycle: c, card: target.card, before, after, ok: Math.abs(after - before) <= 1 });
  }
  await page.close();
  return rows;
}

const browser = await chromium.launch();
const results = [];
if (args.cycles) {
  for (const viewport of VIEWPORTS) {
    for (const delay of DELAYS) {
      const context = await browser.newContext({ viewport: viewportSize(viewport) });
      const rows = await runCycles(context, { delay, viewport, cycles: Number(args.cycles) });
      await context.close();
      const fails = rows.filter((r) => !r.ok);
      console.log(
        `${viewport} delay=${delay}ms back=${args.back ?? "history"} cycles=${rows.length}: scroll fail ${fails.length}/${rows.length}` +
          (fails.length ? " " + JSON.stringify(fails) : ""),
      );
    }
  }
  await browser.close();
  process.exit(0);
}
for (const viewport of VIEWPORTS) {
  for (const delay of DELAYS) {
    let scrollFail = 0;
    let heroFail = 0;
    const rows = [];
    for (let i = 0; i < RUNS; i++) {
      const context = await browser.newContext({ viewport: viewportSize(viewport) });
      const r = await runOnce(context, { delay, viewport });
      const card = r.card;
      await context.close();
      const scrollOk = Math.abs(r.after - r.before) <= 1;
      // Hero rule only exists on desktop; on mobile only scroll is judged.
      const heroOk = viewport !== "desktop" || r.hero.morphed || r.hero.exitLayer;
      if (!scrollOk) scrollFail++;
      if (!heroOk) heroFail++;
      rows.push({ card, before: r.before, after: r.after, hero: r.hero });
      if (args.verbose === "true" || !scrollOk || !heroOk) {
        console.log(
          `  [${viewport} delay=${delay} run=${i} card=${card}] scroll ${r.before}→${r.after} ${scrollOk ? "ok" : "FAIL"} | hero ${JSON.stringify(r.hero)} ${heroOk ? "ok" : "FAIL"}`,
        );
        if (args.verbose === "true") {
          console.log("    samples:", JSON.stringify(r.samples.filter((_, i) => i % 6 === 0)));
          const clickAt = r.trace.find((e) => e.type === "probe:click")?.t ?? 0;
          const seen = new Set();
          const compact = r.trace
            .filter((e) => e.t >= clickAt - 1)
            .map((e) => `${Math.round(e.t - clickAt)} ${e.type} ${e.path ?? ""} ${e.detail ?? ""}`.trim())
            .filter((line) => (seen.has(line) ? false : (seen.add(line), true)));
          console.log("    trace:\n      " + compact.join("\n      "));
        }
      }
    }
    const line = `${viewport} delay=${delay}ms cpu=${CPU}x revisit=${REVISIT}: scroll fail ${scrollFail}/${RUNS}` +
      (viewport === "desktop" ? `, hero fail ${heroFail}/${RUNS}` : "");
    console.log(line);
    results.push({ viewport, delay, scrollFail, heroFail, rows });
  }
}
await browser.close();
if (args.json) {
  const fs = await import("node:fs");
  fs.writeFileSync(args.json, JSON.stringify(results, null, 2));
}
