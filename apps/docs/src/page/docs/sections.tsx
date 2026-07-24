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
  QwikMark,
  ReactRouterMark,
  SolidStartMark,
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
  "@ssgoi/qwik",
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
        transition config shape is shared, while the wrapper and route marker
        follow each framework&apos;s routing model.
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
          Next.js; other frameworks place the page marker directly on each
          routed page, and Qwik passes the config as a QRL factory.
        </p>

        <SetupStep
          n="1"
          title="Wrap your app once"
          desc={
            <>
              Add the{" "}
              <code className="font-mono text-neutral-200">&lt;Ssgoi&gt;</code>{" "}
              provider from your root layout, then put the layout shell classes
              on the wrapper above it. Keep the layout and pages as server
              components; only the small provider/boundary files need client
              hooks.
            </>
          }
          code={`// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill, fade } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    {
      priority: -100,
      on: "/**",
      except: ["/", "/about"],
      transition: drill(),
    },
    { from: "/", to: "/about", transition: fade() },
  ],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}

// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Layout shell: positioned ancestor + stacking context for the OUT clone. */}
        <main className="relative z-0 min-h-dvh overflow-x-clip bg-black">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}`}
        />

        <WhyStructure />

        <SetupStep
          n="2"
          title="Wrap React routed content"
          desc={
            <>
              In React adapters, create a pathname-based{" "}
              <code className="font-mono text-neutral-200">
                data-ssgoi-transition
              </code>{" "}
              boundary utility, then place it in the layouts that should
              transition. Its key controls layout lifetime; the transition id
              remains the real pathname.
            </>
          }
          code={`// ssgoi-transition-boundary.tsx
"use client";

import { type ElementType, type Key, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type BoundaryScope = (pathname: string) => Key;
const pathnameScope: BoundaryScope = (pathname) => pathname;

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  scope = pathnameScope,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  scope?: BoundaryScope;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";

  return (
    <Component
      key={scope(pathname)}
      data-ssgoi-transition={pathname}
      className={className}
    >
      {children}
    </Component>
  );
}

// app/posts/layout.tsx
export default function PostsLayout({ children }) {
  return <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>;
}`}
        />

        <NonReactBoundary />
      </div>

      <ReferenceTemplates />

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-500">
        Which transition goes where is just config — browse them in{" "}
        <Link
          href="/docs/transitions"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          Transitions
        </Link>
        . If a transition ever looks off, the cause is almost always the wrapper
        — see{" "}
        <Link
          href="/docs/layout"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          Layout
        </Link>{" "}
        and{" "}
        <Link
          href="/docs/how-it-works"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          How it works
        </Link>
        .
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Install — why the DOM structure                                            */
/* -------------------------------------------------------------------------- */

function WhyStructure() {
  return (
    <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
        Why this shape
      </p>
      <h3 className="mt-3 text-base font-semibold tracking-tight text-neutral-100">
        The wrapper classes aren&apos;t decoration
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        When you navigate, the framework unmounts the leaving page. SSGOI clones
        it back into the DOM with{" "}
        <code className="font-mono text-neutral-200">position: absolute</code>{" "}
        so its exit animation can play <em>over</em> the incoming page. An
        absolutely-positioned clone needs the right ancestor, or it jumps and
        flickers — that&apos;s what these three classes on the layout shell are
        for:
      </p>

      <ul className="mt-5 divide-y divide-white/[0.05] border-y border-white/[0.05]">
        {LAYOUT_CLASSES.map(({ cls, why }) => (
          <li
            key={cls}
            className="flex flex-col gap-1.5 py-3 md:flex-row md:items-baseline md:gap-5"
          >
            <code className="shrink-0 font-mono text-sm font-semibold text-orange-400">
              {cls}
            </code>
            <span className="text-sm leading-relaxed text-neutral-400">
              {why}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-500">
        These belong on the outer layout shell that wraps{" "}
        <code className="font-mono text-neutral-300">&lt;Ssgoi&gt;</code>, not
        on the route marker. Full walkthrough in{" "}
        <Link
          href="/docs/layout"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          Layout
        </Link>{" "}
        and{" "}
        <Link
          href="/docs/how-it-works"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          How it works
        </Link>
        .
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Install — non-React route boundary                                         */
/* -------------------------------------------------------------------------- */

function NonReactBoundary() {
  return (
    <div className="mt-12 border-t border-white/[0.06] pt-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
        Svelte · Vue · Solid · Angular · Qwik
      </p>
      <h3 className="mt-3 text-base font-semibold tracking-tight text-neutral-100">
        Mark each routed page directly
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Outside React, skip the boundary utility and put{" "}
        <code className="font-mono text-neutral-200">
          data-ssgoi-transition
        </code>{" "}
        on each routed page or route layout. The value is a logical page id and
        must match the route patterns in your config&apos;s{" "}
        <code className="font-mono text-neutral-200">on</code>,{" "}
        <code className="font-mono text-neutral-200">from</code>/
        <code className="font-mono text-neutral-200">to</code>, or{" "}
        <code className="font-mono text-neutral-200">ordered</code> rule.
      </p>

      <CodeBlock
        className="mt-5"
        language="xml"
        code={`<!-- SvelteKit · src/routes/gallery/+page.svelte -->
<main data-ssgoi-transition="/gallery">
  <!-- page content -->
</main>

<!-- Nuxt / Vue · pages/gallery.vue -->
<template>
  <main data-ssgoi-transition="/gallery">
    <!-- page content -->
  </main>
</template>

<!-- Angular · gallery.component.html -->
<section data-ssgoi-transition="/gallery">
  <!-- page content -->
</section>

// Qwik City · src/routes/gallery/index.tsx
export default component$(() => {
  return (
    <main data-ssgoi-transition="/gallery">
      {/* page content */}
    </main>
  );
});`}
      />

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-500">
        Parent route layouts may own an outer boundary for persistent tabs,
        headers, or navigation. Keep child page boundaries for inner route
        changes. If both leave together, SSGOI selects the outer changed
        boundary.
      </p>

      <div className="mt-8 border-t border-white/[0.06] pt-8">
        <h4 className="text-sm font-semibold tracking-tight text-neutral-100">
          Qwik City layout setup
        </h4>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          Qwik serializes component state for resumability, while SSGOI configs
          contain transition functions. Pass the config as{" "}
          <code className="font-mono text-neutral-200">config$</code> and call{" "}
          <code className="font-mono text-neutral-200">useSsgoi</code> directly
          in the Qwik City layout that owns the route{" "}
          <code className="font-mono text-neutral-200">&lt;Slot /&gt;</code>.
        </p>
        <CodeBlock
          className="mt-5"
          language="tsx"
          code={`import { $, Slot, component$, useSignal } from "@builder.io/qwik";
import { useSsgoi } from "@ssgoi/qwik";
import { drill } from "@ssgoi/qwik/view-transitions";

const config$ = $(() => ({
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
  ],
}));

export default component$(() => {
  const ssgoiRoot = useSignal<HTMLElement>();

  useSsgoi(ssgoiRoot, { config$ });

  return (
    <main
      ref={ssgoiRoot}
      class="relative z-0 h-dvh overflow-y-auto overflow-x-clip"
    >
      <Slot />
    </main>
  );
});`}
        />
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
          Avoid wrapping a Qwik City route{" "}
          <code className="font-mono text-neutral-300">&lt;Slot /&gt;</code>{" "}
          inside the exported{" "}
          <code className="font-mono text-neutral-300">&lt;Ssgoi&gt;</code>{" "}
          component. Forwarding the route slot through another component can
          keep routed content out of the live DOM during navigation.
        </p>
      </div>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        Agent-readable setup for each framework lives in its own file:{" "}
        {(["svelte", "vue", "solid", "angular", "qwik"] as const).map(
          (fw, i) => (
            <span key={fw}>
              {i > 0 && " · "}
              <a
                href={`https://ssgoi.dev/llms/${fw}.txt`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
              >
                /llms/{fw}.txt
              </a>
            </span>
          ),
        )}
        . The main{" "}
        <a
          href={LLMS_TXT}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
        >
          /llms.txt
        </a>{" "}
        stays React-first and indexes the rest.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Install — reference templates                                              */
/* -------------------------------------------------------------------------- */

function ReferenceTemplates() {
  return (
    <div className="mt-12 border-t border-white/[0.06] pt-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80">
        Copy from a working app
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-100">
        Reference templates
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Each template is a runnable app wired up the recommended way for its
        router — provider, layout shell, and route boundaries already in place.
        Clone one and read the diff, or copy the pieces you need.
      </p>
      <RoutersBody />
      <p className="mt-6 text-sm text-neutral-500">
        Source lives in the monorepo at{" "}
        <a
          href="https://github.com/meursyphus/ssgoi/tree/HEAD/templates"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          meursyphus/ssgoi/templates ↗
        </a>
        .
      </p>
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
        Effects and route matching are separate: a factory describes how pages
        move, while its surrounding rule describes where it applies. Open an
        effect for variants and live demos — or grab the{" "}
        <span className="font-mono text-neutral-300">.txt</span> for the full
        API.
      </p>

      <CodeBlock
        className="mt-6"
        code={`const TOP_LEVEL = ["/", "/search", "/profile"] as const;

const config: SsgoiConfig = {
  transitions: ({ isMobile }) =>
    isMobile
      ? [
          {
            from: "/gallery",
            to: "/photo/:id",
            transition: zoom({ type: "expand" }),
          },
          {
            ordered: TOP_LEVEL,
            transition: slide(),
          },
          {
            priority: -100,
            on: "/**",
            except: TOP_LEVEL,
            transition: drill(),
          },
        ]
      : [
          { ordered: TOP_LEVEL, transition: film() },
          { priority: -100, on: "/**", transition: fade() },
        ],
};`}
      />

      <ul className="mt-6 grid gap-3 text-sm text-neutral-400 sm:grid-cols-3">
        <li className="rounded-xl border border-white/[0.06] p-4">
          <code className="font-mono text-orange-300">on</code> defines a route
          family. Entering is forward, leaving is backward;{" "}
          <code className="font-mono text-neutral-300">except</code> marks its
          boundary.
        </li>
        <li className="rounded-xl border border-white/[0.06] p-4">
          <code className="font-mono text-orange-300">from / to</code> defines
          an exact relationship. It is bidirectional by default and accepts
          pattern arrays.
        </li>
        <li className="rounded-xl border border-white/[0.06] p-4">
          <code className="font-mono text-orange-300">ordered</code> requires
          both routes in one ordered scope; index order resolves direction.
        </li>
      </ul>

      <p className="mt-4 max-w-2xl text-xs leading-relaxed text-neutral-500">
        Matching supports <code className="font-mono">:id</code> and{" "}
        <code className="font-mono">*</code> for one segment, plus suffix{" "}
        <code className="font-mono">**</code> for zero or more. Winners are
        chosen by priority, then path specificity, then declaration order.
        Selectors work with every effect; the examples show their most common
        pairings.
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
  templatePath: string;
}> = [
  { name: "Next.js", icon: NextMark, templatePath: "nextjs" },
  {
    name: "React Router",
    icon: ReactRouterMark,
    templatePath: "react-router",
  },
  {
    name: "TanStack Router",
    icon: TanStackRouterMark,
    templatePath: "tanstack-router",
  },
  { name: "SolidStart", icon: SolidStartMark, templatePath: "solidstart" },
  { name: "SvelteKit", icon: SvelteKitMark, templatePath: "sveltekit" },
  { name: "Nuxt", icon: NuxtMark, templatePath: "nuxt" },
  { name: "Qwik City", icon: QwikMark, templatePath: "qwik" },
];

const TEMPLATES_URL = "https://github.com/meursyphus/ssgoi/tree/HEAD/templates";

export function RoutersBody() {
  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {ROUTERS.map(({ name, icon: Icon, templatePath }) => (
          <a
            key={name}
            href={`${TEMPLATES_URL}/${templatePath}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
          >
            <Icon className="h-8 w-8 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold tracking-tight text-neutral-100">
                {name}
              </span>
              <span className="mt-1 block font-mono text-xs text-neutral-500">
                templates/{templatePath} ↗
              </span>
            </span>
          </a>
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-400">
        These examples show the recommended framework-specific setup. React
        templates use the pathname boundary utility; SolidStart, SvelteKit,
        Nuxt, and Qwik mark routed pages directly. Angular follows the same
        direct marker rule in its package docs. Full templates index:{" "}
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
