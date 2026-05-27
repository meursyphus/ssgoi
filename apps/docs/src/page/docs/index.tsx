import { Link } from "@/lib/link";
import { NpmPill } from "@/components/npm-pill";
import { SiteLogo } from "@/components/site-logo";
export default function DocsPage() {
  return (
    <main data-ssgoi-transition="/docs" className="relative min-h-dvh bg-black">
      <FloatingHeader />
      <Hero />
      <Install />
      <Transitions />
      <Layout />
      <HowItWorks />
    </main>
  );
}
function FloatingHeader() {
  return (
    <header className="pointer-events-none sticky top-3 z-50 mt-3 flex justify-center px-3 md:top-4 md:mt-4">
      <nav className="pointer-events-auto inline-flex h-11 items-center gap-5 rounded-full border border-white/10 bg-[#0e0b08]/70 pl-3 pr-4 backdrop-blur md:h-12 md:gap-6 md:pl-4 md:pr-5">
        <SiteLogo />
        <div className="flex items-center gap-5 text-sm text-neutral-300 md:gap-6">
          <Link href="/docs" className="text-neutral-100">
            Docs
          </Link>
          <Link href="/showcase" className="hover:text-neutral-100">
            Examples
          </Link>
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-100"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 md:pt-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
        Docs · llms-first
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
        Drop the txt.{" "}
        <span className="text-neutral-400">Your AI sets it up.</span>
      </h1>
      <p className="mt-6 max-w-xl leading-relaxed text-neutral-400">
        Setup and per-transition docs live in plain-text files. Hand the link to
        Claude Code, Cursor, or any AI agent — it has everything it needs.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="https://ssgoi.dev/llms.txt"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
        >
          /llms.txt
          <span
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
const PACKAGES = [
  "@ssgoi/react",
  "@ssgoi/svelte",
  "@ssgoi/vue",
  "@ssgoi/solid",
  "@ssgoi/angular",
];
function Install() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Install.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {PACKAGES.map((pkg) => (
            <NpmPill key={pkg} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
type TransitionEntry = {
  name: string;
  blurb: string;
};
const TRANSITIONS: TransitionEntry[] = [
  {
    name: "drill",
    blurb: "iOS-style hierarchical navigation.",
  },
  {
    name: "fade",
    blurb: "Calm cross-fade. Safe default.",
  },
  {
    name: "slide",
    blurb: "Horizontal push.",
  },
  {
    name: "scroll",
    blurb: "Vertical page scroll.",
  },
  {
    name: "sheet",
    blurb: "Bottom sheet, slides up.",
  },
  {
    name: "hero",
    blurb: "Shared element. data-hero-enter-key / data-hero-exit-key.",
  },
  {
    name: "zoom",
    blurb: "Card expands to detail. data-zoom-*-key.",
  },
  {
    name: "strip",
    blurb: "3D Y-axis flip.",
  },
  {
    name: "blind",
    blurb: "Window-blinds wipe.",
  },
  {
    name: "film",
    blurb: "Cinematic shrink + tile.",
  },
  {
    name: "rotate",
    blurb: "Card flip.",
  },
  {
    name: "jaemin",
    blurb: "Playful rotated zoom.",
  },
];
const LAYOUT_CLASSES: {
  cls: string;
  why: string;
}[] = [
  {
    cls: "relative",
    why: "The outgoing page is cloned with position: absolute — it needs a positioned ancestor or it jumps.",
  },
  {
    cls: "z-0",
    why: "Creates a stacking context so the OUT page doesn't fall behind backgrounds.",
  },
  {
    cls: "overflow-x-clip",
    why: "Prevents horizontal scrollbar flashes during slide / drill / strip.",
  },
];
function Layout() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
          For setup &amp; debugging
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Layout.{" "}
          <span className="text-neutral-400">
            Three classes on the wrapper.
          </span>
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-neutral-400">
          The element that wraps{" "}
          <code className="font-mono text-neutral-200">&lt;Ssgoi&gt;</code>{" "}
          needs these classes. The AI agent reads this from{" "}
          <a
            href="https://ssgoi.dev/llms.txt"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-neutral-200 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
          >
            /llms.txt
          </a>{" "}
          — this section is for you, when something looks off.
        </p>

        <pre className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 font-mono text-[13px] leading-relaxed text-neutral-200">
          {`<main className="overflow-y-auto relative z-0 overflow-x-clip h-dvh">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
        </pre>

        <ul className="mt-6 divide-y divide-white/[0.05] border-y border-white/[0.05]">
          {LAYOUT_CLASSES.map(({ cls, why }) => (
            <li
              key={cls}
              className="flex flex-col gap-2 py-4 md:flex-row md:items-baseline md:gap-6"
            >
              <code className="shrink-0 font-mono text-base font-semibold text-orange-400">
                {cls}
              </code>
              <span className="text-sm leading-relaxed text-neutral-400">
                {why}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
function HowItWorks() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 md:pb-24">
        <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          How it works.{" "}
          <span className="text-neutral-400">Clone &amp; absolute.</span>
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-neutral-400">
          When a route changes, the old page would normally unmount and vanish.
          SSGOI clones it back into the DOM with{" "}
          <code className="font-mono text-neutral-200">position: absolute</code>{" "}
          so the OUT animation can play while the new page mounts in place.
        </p>

        <ol className="mt-8 space-y-3 text-sm text-neutral-300">
          <FlowStep
            n="1"
            body="User navigates — framework unmounts the old page."
          />
          <FlowStep
            n="2"
            body="SSGOI clones the leaving page and re-inserts it with position: absolute (OUT)."
          />
          <FlowStep
            n="3"
            body="The new page mounts at its natural place (IN)."
          />
          <FlowStep n="4" body="OUT and IN animate at the same time." />
          <FlowStep
            n="5"
            body="The cloned OUT page is removed when its animation ends."
          />
        </ol>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
          That clone is why the wrapper needs{" "}
          <code className="font-mono text-neutral-300">relative z-0</code> —
          without a positioned, stacking-context ancestor, the
          absolute-positioned OUT page either jumps to the wrong spot or falls
          behind the background. If a transition looks broken, check the wrapper
          first.
        </p>
      </div>
    </section>
  );
}
function FlowStep({ n, body }: { n: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 font-mono text-xs text-orange-400"
        aria-hidden
      >
        {n}
      </span>
      <span className="leading-relaxed">{body}</span>
    </li>
  );
}
function Transitions() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Transitions.
        </h2>
        <p className="mt-3 text-sm text-neutral-500">
          Each links to a self-contained{" "}
          <span className="font-mono text-neutral-300">.txt</span>.
        </p>
        <ul className="mt-8 divide-y divide-white/[0.05] border-y border-white/[0.05]">
          {TRANSITIONS.map((t) => (
            <li key={t.name}>
              <a
                href={`https://ssgoi.dev/llms/${t.name}.txt`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex min-w-0 items-baseline gap-4">
                  <span className="font-mono text-base font-semibold text-neutral-100">
                    {t.name}
                  </span>
                  <span className="truncate text-sm text-neutral-400">
                    {t.blurb}
                  </span>
                </div>
                <span
                  className="font-mono text-xs text-neutral-500 transition-colors group-hover:text-orange-400"
                  aria-hidden
                >
                  /llms/{t.name}.txt ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
