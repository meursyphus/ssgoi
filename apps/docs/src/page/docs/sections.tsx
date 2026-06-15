import { Link } from "@/lib/link";
import { NpmPill } from "@/components/npm-pill";
import { CodeBlock } from "@/components/code-block";
import {
  TRANSITION_DOCS,
  USE_META,
  type TransitionDoc,
} from "@/page/docs/transitions-data";
import {
  NextMark,
  NuxtMark,
  ReactRouterMark,
  SvelteKitMark,
  TanStackRouterMark,
} from "@/components/router-logos";
import {
  ChromeMark,
  EdgeMark,
  FirefoxMark,
  SafariMark,
} from "@/components/browser-logos";

const LLMS_TXT = "https://ssgoi.dev/llms.txt";

/* -------------------------------------------------------------------------- */
/* Shared heading                                                             */
/* -------------------------------------------------------------------------- */

export function DocsPageHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
}) {
  return (
    <header className="border-b border-white/[0.06] pb-8">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl">
        {title}
      </h1>
      {lead && (
        <p className="mt-5 max-w-xl leading-relaxed text-neutral-400">{lead}</p>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview hero                                                              */
/* -------------------------------------------------------------------------- */

export function DocsHero() {
  return (
    <header className="border-b border-white/[0.06] pb-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
        Docs · llms-first
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
        Drop the txt.{" "}
        <span className="text-neutral-400">Your AI sets it up.</span>
      </h1>
      <p className="mt-6 max-w-xl leading-relaxed text-neutral-400">
        Setup and per-transition docs live in plain-text files. Hand the link to
        Claude Code, Cursor, or any AI agent — it has everything it needs. These
        pages are the human-readable companion: skim them when you want to
        understand or debug.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={LLMS_TXT}
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
        <Link
          href="/docs/install"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
        >
          Install
        </Link>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Install                                                                    */
/* -------------------------------------------------------------------------- */

const PACKAGES = [
  "@ssgoi/react",
  "@ssgoi/svelte",
  "@ssgoi/vue",
  "@ssgoi/solid",
  "@ssgoi/angular",
];

export function InstallBody() {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        {PACKAGES.map((pkg) => (
          <NpmPill key={pkg} pkg={pkg} />
        ))}
      </div>
      <p className="mt-6 text-sm leading-relaxed text-neutral-500">
        One package per framework. Pick the one that matches your stack — the
        API is the same across all of them.
      </p>

      <div className="mt-12 border-t border-white/[0.06] pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
          Set up
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-100">
          Wrap once, mark your pages
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          Two steps and the router feels native. The example below is React /
          Next.js — the shape is identical in every framework.
        </p>

        <SetupStep
          n="1"
          title="Wrap your app once"
          desc={
            <>
              Add the{" "}
              <code className="font-mono text-neutral-200">&lt;Ssgoi&gt;</code>{" "}
              provider in your root layout — the only client component you need.
              Your pages stay server components.
            </>
          }
          code={`// app/layout.tsx
"use client";

import { Ssgoi } from "@ssgoi/react";
import { drill, fade } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    drill({ enter: "/post/*", exit: "*" }),
    fade({ paths: ["/", "/about"] }),
  ],
};

export default function RootLayout({ children }) {
  return (
    <Ssgoi config={config}>
      <div className="relative z-0 min-h-dvh overflow-x-clip">
        {children}
      </div>
    </Ssgoi>
  );
}`}
        />

        <SetupStep
          n="2"
          title="Mark your pages"
          desc={
            <>
              Give each page root a{" "}
              <code className="font-mono text-neutral-200">
                data-ssgoi-transition
              </code>{" "}
              key — that&apos;s the path your config matches against.
            </>
          }
          code={`// app/page.tsx
export default function HomePage() {
  return <main data-ssgoi-transition="/">…</main>;
}

// app/post/[id]/page.tsx
export default function PostPage({ params }) {
  return <main data-ssgoi-transition={\`/post/\${params.id}\`}>…</main>;
}`}
        />

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
          That&apos;s the whole integration. Which transition goes where is just
          config — browse them in{" "}
          <Link
            href="/docs/transitions"
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            Transitions
          </Link>
          , and check the{" "}
          <Link
            href="/docs/layout"
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            wrapper classes
          </Link>{" "}
          if a transition ever looks off.
        </p>
      </div>
    </div>
  );
}

function SetupStep({
  n,
  title,
  desc,
  code,
}: {
  n: string;
  title: string;
  desc: React.ReactNode;
  code: string;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 font-mono text-xs text-orange-400"
          aria-hidden
        >
          {n}
        </span>
        <h3 className="text-base font-semibold tracking-tight text-neutral-100">
          {title}
        </h3>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        {desc}
      </p>
      <CodeBlock code={code} className="mt-4" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Transitions                                                                */
/* -------------------------------------------------------------------------- */

export function TransitionsBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
        Every built-in transition, tagged with when it fits. Open one for its
        variants, usage, and live demos — or grab the{" "}
        <span className="font-mono text-neutral-300">.txt</span> for the full
        API.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {TRANSITION_DOCS.map((t) => (
          <TransitionCard key={t.name} entry={t} />
        ))}
      </ul>
    </div>
  );
}

function TransitionCard({ entry }: { entry: TransitionDoc }) {
  const meta = USE_META[entry.use];

  return (
    <li>
      <Link
        href={`/docs/transitions/${entry.name}`}
        className="group flex h-full flex-col gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-semibold text-neutral-100 transition-colors group-hover:text-orange-400">
            {entry.name}
          </span>
          <span
            className={
              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
              meta.cls
            }
          >
            {meta.label}
          </span>
          <span
            className="ml-auto text-neutral-600 transition-colors group-hover:text-orange-400"
            aria-hidden
          >
            →
          </span>
        </div>
        <p className="text-sm leading-snug text-neutral-300">{entry.blurb}</p>
        <p className="text-xs leading-snug text-neutral-500">{meta.when}</p>
      </Link>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

const LAYOUT_CLASSES: { cls: string; why: string }[] = [
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

export function LayoutBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        The element that wraps{" "}
        <code className="font-mono text-neutral-200">&lt;Ssgoi&gt;</code> needs
        these classes. Your AI agent reads this from{" "}
        <a
          href={LLMS_TXT}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-200 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
        >
          /llms.txt
        </a>{" "}
        — this page is for you, when something looks off.
      </p>

      <CodeBlock
        className="mt-8"
        code={`<main className="overflow-y-auto relative z-0 overflow-x-clip h-dvh">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
      />

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
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                                */
/* -------------------------------------------------------------------------- */

export function HowItWorksBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
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
        <FlowStep n="3" body="The new page mounts at its natural place (IN)." />
        <FlowStep n="4" body="OUT and IN animate at the same time." />
        <FlowStep
          n="5"
          body="The cloned OUT page is removed when its animation ends."
        />
      </ol>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        That clone is why the wrapper needs{" "}
        <code className="font-mono text-neutral-300">relative z-0</code> —
        without a positioned, stacking-context ancestor, the absolute-positioned
        OUT page either jumps to the wrong spot or falls behind the background.
        If a transition looks broken, check the{" "}
        <Link
          href="/docs/layout"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          wrapper
        </Link>{" "}
        first.
      </p>
    </div>
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

/* -------------------------------------------------------------------------- */
/* Routers                                                                     */
/* -------------------------------------------------------------------------- */

const ROUTERS: Array<{
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Next.js", icon: NextMark },
  { name: "React Router", icon: ReactRouterMark },
  { name: "TanStack Router", icon: TanStackRouterMark },
  { name: "SvelteKit", icon: SvelteKitMark },
  { name: "Nuxt", icon: NuxtMark },
];

const TEMPLATES_URL = "https://github.com/meursyphus/ssgoi/tree/main/templates";

export function RoutersBody() {
  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {ROUTERS.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
          >
            <Icon className="h-8 w-8 shrink-0" />
            <span className="text-base font-semibold tracking-tight text-neutral-100">
              {name}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-400">
        Starter examples for each router are on GitHub —{" "}
        <a
          href={TEMPLATES_URL}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          /templates ↗
        </a>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Compatibility                                                               */
/* -------------------------------------------------------------------------- */

const BROWSERS: Array<{
  name: string;
  v: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Chrome", v: "84+", icon: ChromeMark },
  { name: "Safari", v: "13.1+", icon: SafariMark },
  { name: "Firefox", v: "75+", icon: FirefoxMark },
  { name: "Edge", v: "84+", icon: EdgeMark },
];

export function CompatibilityBody() {
  return (
    <div className="mt-8">
      <div className="grid gap-3 md:grid-cols-2">
        <ReasonCard
          title="Chrome-only"
          desc="Firefox and Safari users get a hard cut — no transition at all."
          ours="Every modern browser."
        />
        <ReasonCard
          title="CSS-locked"
          desc="Snapshots and declarative CSS. No physics, no interrupts, no multi-element choreography."
          ours="Web Animations API. Spring physics, interrupt-safe, paired hero transitions."
        />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BROWSERS.map(({ name, v, icon: Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 text-center transition-colors hover:border-white/15 hover:bg-white/[0.03]"
          >
            <Icon className="h-12 w-12" />
            <div>
              <div className="text-base font-semibold text-neutral-100">
                {name}
              </div>
              <div className="mt-1 font-mono text-sm text-orange-500">{v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasonCard({
  title,
  desc,
  ours,
}: {
  title: string;
  desc: string;
  ours: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7">
      <h3 className="text-xl font-semibold tracking-tight text-neutral-100">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-neutral-400">{desc}</p>
      <div className="mt-6 flex items-start gap-3 border-t border-white/[0.05] pt-5">
        <span className="mt-1 text-orange-500" aria-hidden>
          →
        </span>
        <p className="leading-relaxed text-neutral-100">{ours}</p>
      </div>
    </div>
  );
}
