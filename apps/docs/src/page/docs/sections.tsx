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
  title,
  lead,
}: {
  title: string;
  lead?: React.ReactNode;
}) {
  return (
    <header className="border-b border-white/[0.06] pb-8">
      <h1 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl">
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
      <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
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
          Quick start
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
        One package per framework. This quick start uses React / Next.js — the
        same three steps for every other stack live in the{" "}
        <Link
          href="/docs/frameworks/sveltekit"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
        >
          Frameworks
        </Link>{" "}
        section.
      </p>

      <div className="mt-12 border-t border-white/[0.06] pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
          Three small files, in order
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          Provider first, then the layout shell around it, then the route
          boundary inside it. Each step is copy-paste ready; nothing here
          requires understanding the internals.
        </p>

        <SetupStep
          n="1"
          title="Create the provider — one config, one <Ssgoi>"
          desc={
            <>
              One rule is enough to start:{" "}
              <code className="font-mono text-neutral-200">drill()</code> on
              everything except the home route. It&apos;s the most visible
              transition, which makes the verify step unambiguous.
            </>
          }
          code={`// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [{ on: "/**", except: "/", transition: drill() }],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}`}
        />

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-400">
          <code className="font-mono text-neutral-200">transitions</code> also
          accepts a function of device context — the standard way to branch
          mobile and desktop:
        </p>
        <CodeBlock
          className="mt-4"
          code={`const config = {
  transitions: ({ isMobile }) =>
    isMobile
      ? [{ on: "/**", except: "/", transition: drill() }]
      : [{ priority: -100, on: "/**", transition: fade() }],
};`}
        />
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
          Scroll reset and restoration follow the matched transition rule; see{" "}
          <Link
            href="/docs/core-options"
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
          >
            Scroll &amp; middleware
          </Link>{" "}
          for the automatic UX policy and exact override.
        </p>

        <SetupStep
          n="2"
          title="Wrap it in the layout shell"
          desc={
            <>
              The element around{" "}
              <code className="font-mono text-neutral-200">&lt;Ssgoi&gt;</code>{" "}
              needs three classes. They position the leaving page while it
              animates out — skip them and transitions jump or flicker.
            </>
          }
          code={`// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}`}
        />

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
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
          The mechanism behind these classes is in{" "}
          <Link
            href="/docs/how-it-works"
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
          >
            How it works
          </Link>{" "}
          — useful when debugging, not needed for setup.
        </p>

        <SetupStep
          n="3"
          title="Add the route boundary (simple version)"
          desc={
            <>
              A changed <code className="font-mono text-neutral-200">key</code>{" "}
              makes React unmount the old page and mount the new one;{" "}
              <code className="font-mono text-neutral-200">
                data-ssgoi-transition
              </code>{" "}
              is the id config rules match against. For most apps the pathname
              serves as both.
            </>
          }
          code={`// app/ssgoi-route-boundary.tsx
"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiRouteBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}

// app/layout.tsx — wrap the provider's children
<SsgoiProvider>
  <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
</SsgoiProvider>`}
        />

        <div className="mt-10 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6">
          <h3 className="text-base font-semibold tracking-tight text-neutral-100">
            Verify
          </h3>
          <ol className="mt-4 space-y-3 text-sm text-neutral-300">
            <FlowStep
              n="1"
              body="Navigate from / to any other page: the new page slides in from the right."
            />
            <FlowStep
              n="2"
              body="Navigate back to /: the page slides back out to the right."
            />
            <FlowStep
              n="3"
              body="No animation, or the wrong region moves? Check the Layout shell page, then How it works."
            />
          </ol>
        </div>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-400">
          That&apos;s the whole setup. This simple boundary remounts the whole
          routed area on every navigation — correct until the app needs a
          persistent region, like a bottom nav that must stay while pages
          change. When that day comes, read{" "}
          <Link
            href="/docs/nested-boundaries"
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
          >
            Route boundaries
          </Link>
          .
        </p>
      </div>

      <ReferenceTemplates />

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-500">
        Next: pick real transitions for your UX in{" "}
        <Link
          href="/docs/transitions"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
        >
          Transitions
        </Link>
        .
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
      <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
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

const UX_DECISION_ROWS: Array<{
  ux: string;
  name: string;
  rule: string;
}> = [
  {
    ux: "Default / unrelated pages",
    name: "fade",
    rule: `priority: -100, on: "/**"`,
  },
  { ux: "List → detail, drilling deeper", name: "drill", rule: "on + except" },
  { ux: "Tabs or steps with left-right order", name: "slide", rule: "ordered" },
  { ux: "Sibling pages, Material shared-axis", name: "axis", rule: "ordered" },
  {
    ux: "Compose / filters / modal-like route",
    name: "sheet",
    rule: "from / to",
  },
  { ux: "Card or image expands to detail", name: "zoom", rule: "from / to" },
  { ux: "Shared element across two pages", name: "hero", rule: "from / to" },
  {
    ux: "Vertical sequence, editorial paging",
    name: "scroll",
    rule: "ordered",
  },
];

export function TransitionsBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
        Start from the UX you&apos;re building. One row is one decision: the
        effect and the rule form to write it with.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3 font-medium">UX intent</th>
              <th className="px-4 py-3 font-medium">Transition</th>
              <th className="px-4 py-3 font-medium">Rule form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {UX_DECISION_ROWS.map((row) => (
              <tr key={row.name} className="group">
                <td className="px-4 py-3 text-neutral-300">{row.ux}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/docs/transitions/${row.name}`}
                    className="font-mono font-semibold text-orange-400 underline decoration-orange-400/30 underline-offset-4 hover:decoration-orange-400"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                  {row.rule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-2xl text-xs leading-relaxed text-neutral-500">
        Purely stylistic effects work with any rule form:{" "}
        {["film", "strip", "rotate", "blind", "jaemin"].map((name, i) => (
          <span key={name}>
            {i > 0 && " · "}
            <Link
              href={`/docs/transitions/${name}`}
              className="font-mono text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
            >
              {name}
            </Link>
          </span>
        ))}
        .
      </p>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-400">
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
            to: "/photo/*",
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
        Inside a path, <code className="font-mono">*</code> matches exactly one
        segment; suffix <code className="font-mono">**</code> matches zero or
        more. A bare <code className="font-mono">*</code> remains a
        compatibility alias for <code className="font-mono">{"/**"}</code>.
        Named single-segment forms remain supported and rank above a
        single-segment <code className="font-mono">*</code> when rules overlap,
        but their names are not captured or exposed. Winners are chosen by
        priority, then path specificity, then declaration order.
      </p>
      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-neutral-500">
        Scroll follows the rule automatically:{" "}
        <code className="font-mono">on</code> and{" "}
        <code className="font-mono">from / to</code> restore the forward source
        and reset the destination; <code className="font-mono">ordered</code>{" "}
        restores both. Use{" "}
        <code className="font-mono">{"preserveScroll: { from, to }"}</code> only
        for an exact override.
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
    why: "The detached outgoing page is reinserted with position: absolute — it needs the correct containing block.",
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
        code={`<main className="relative z-0 h-dvh overflow-y-auto overflow-x-clip">
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
        A boundary key change makes the framework unmount the old routed region
        and mount a new one. SSGOI preserves the detached outgoing DOM node and
        temporarily reinserts it with{" "}
        <code className="font-mono text-neutral-200">position: absolute</code>{" "}
        so the OUT animation can play while the new page mounts in place.
      </p>

      <CodeBlock
        className="mt-8"
        language="text"
        code={`navigate /home → /about

router unmounts /home ──▶ SSGOI re-inserts the detached node
                          with position: absolute        (OUT)
router mounts /about ───▶ new page in normal layout flow (IN)

        OUT ∥ IN animate simultaneously
        └─ animation ends → OUT node removed from DOM`}
      />

      <ol className="mt-8 space-y-3 text-sm text-neutral-300">
        <FlowStep
          n="1"
          body="Navigation changes the boundary key, so the framework unmounts the old routed region."
        />
        <FlowStep
          n="2"
          body="SSGOI preserves the detached leaving node and reinserts it with position: absolute (OUT)."
        />
        <FlowStep n="3" body="The new page mounts at its natural place (IN)." />
        <FlowStep n="4" body="OUT and IN animate at the same time." />
        <FlowStep
          n="5"
          body="The reinserted OUT page is removed when its animation ends."
        />
      </ol>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        That reinserted OUT page is why the wrapper needs{" "}
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
