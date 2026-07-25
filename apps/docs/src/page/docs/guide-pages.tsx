import Image from "next/image";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import { FRAMEWORK_DOCS } from "@/page/docs/frameworks-data";

const linkClass =
  "text-neutral-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60";

const cardClass = "rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5";

function GuideSection({
  title,
  lead,
  children,
  className = "",
}: {
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={"mt-12 border-t border-white/[0.06] pt-10 " + className}
    >
      <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
        {title}
      </h2>
      {lead && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          {lead}
        </p>
      )}
      {children}
    </section>
  );
}

function Decision({
  label = "Decision",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.055] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
        {label}
      </p>
      <div className="mt-3 max-w-2xl text-pretty leading-relaxed text-neutral-200">
        {children}
      </div>
    </div>
  );
}

function NextLinks({
  title = "Read next",
  links,
}: {
  title?: string;
  links: Array<{ href: string; title: string; body: string }>;
}) {
  return (
    <section className="mt-12 border-t border-white/[0.06] pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block h-full rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="flex items-center justify-between gap-3 font-semibold text-neutral-100 transition-colors group-hover:text-orange-400">
                {item.title}
                <span aria-hidden>→</span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-neutral-400">
                {item.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WhySsgoiBody() {
  const reasons = [
    {
      title: "Easy to adopt",
      body: "Add SSGOI by changing only 2–3 files. You do not need to rewrite pages or replace navigation.",
    },
    {
      title: "Router agnostic",
      body: "Keep your existing router and let it own URLs, data loading, history, SSR, and navigation.",
    },
    {
      title: "Cross-browser",
      body: "Use the same transitions across Chrome, Safari, Firefox, and Edge through the broadly available Web Animations API.",
    },
    {
      title: "Optimized motion",
      body: "Spring physics are precomputed into Web Animations API keyframes, then handed to browser-native playback.",
    },
    {
      title: "Beyond the View Transition API",
      body: "Build reusable transitions that need live DOM, runtime layers, and precise geometry.",
    },
    {
      title: "Mobile UX, not decoration",
      body: "Drill, Sheet, Slide, and Zoom express hierarchy, temporary tasks, ordered tabs, and card-to-detail navigation.",
    },
  ];

  return (
    <div className="mt-8">
      <Decision>
        Use SSGOI when route changes should explain a mobile-style spatial
        relationship, but the application must keep its existing router and page
        structure.
      </Decision>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {reasons.map((reason) => (
          <li key={reason.title} className={cardClass}>
            <h2 className="font-semibold tracking-tight text-neutral-100">
              {reason.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {reason.body}
            </p>
          </li>
        ))}
      </ul>

      <GuideSection
        title="A small surface area"
        lead="The common React and Next.js setup is deliberately boring: one provider, one boundary component, and one layout edit."
      >
        <CodeBlock
          className="mt-5"
          language="text"
          code={`app/
  ssgoi-provider.tsx         # config + <Ssgoi>
  ssgoi-route-boundary.tsx   # pathname → key + transition id
  layout.tsx                 # wrap routed content`}
        />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Start with the pathname as both boundary key and route id. Only apps
          with persistent UI, such as a bottom nav, need to split those
          responsibilities later.
        </p>
        <p className="mt-4">
          <Link href="/docs/install" className={linkClass}>
            Copy the quick start →
          </Link>
        </p>
      </GuideSection>

      <GuideSection
        title="The defaults carry more of the UX"
        lead="Route rules describe whether a navigation drills deeper, targets a precise destination, or moves through an ordered set."
      >
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className={cardClass}>
            <p className="font-mono text-sm text-orange-300">on + except</p>
            <p className="mt-2 text-sm text-neutral-400">
              A route family such as list → detail.
            </p>
          </div>
          <div className={cardClass}>
            <p className="font-mono text-sm text-orange-300">from / to</p>
            <p className="mt-2 text-sm text-neutral-400">
              One precise relationship such as gallery → photo.
            </p>
          </div>
          <div className={cardClass}>
            <p className="font-mono text-sm text-orange-300">ordered</p>
            <p className="mt-2 text-sm text-neutral-400">
              Tabs or steps whose index resolves direction.
            </p>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          The matched relationship also chooses a sensible scroll reset or
          restoration policy. Mobile and desktop can receive different rule sets
          through{" "}
          <code className="font-mono text-neutral-200">
            {"transitions({ isMobile })"}
          </code>
          .
        </p>
      </GuideSection>

      <GuideSection
        title="Complexity stays opt-in"
        lead="A simple boundary is enough until part of the routed UI must survive a navigation."
      >
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          When a bottom nav should stay across tab changes but leave on a detail
          route, add an inner content boundary and keep the nav outside it.
          SSGOI still uses one provider and one config.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
          <Link href="/docs/boundaries" className={linkClass}>
            Boundary basics
          </Link>
          <Link href="/docs/nested-boundaries" className={linkClass}>
            Persistent layout pattern
          </Link>
          <Link href="/docs/scroll-restoration" className={linkClass}>
            Scroll defaults
          </Link>
        </div>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/transitions",
            title: "Choose a mobile interaction",
            body: "Start with Drill, Sheet, Slide, or Zoom, then explore every preset.",
          },
          {
            href: "/docs/frameworks",
            title: "Use your framework",
            body: "The config is shared; only the routed DOM boundary changes.",
          },
          {
            href: "/docs/compatibility",
            title: "Compatibility",
            body: "Browser and router support for the Web Animations API engine.",
          },
          {
            href: "/docs/view-transition-api",
            title: "View Transition API",
            body: "Where the native API ends and SSGOI's preset engine begins.",
          },
        ]}
      />
    </div>
  );
}

export function ViewTransitionApiBody() {
  const rows = [
    {
      concern: "Rendered material",
      native: "Old/new snapshots in a generated pseudo-element tree.",
      ssgoi:
        "The leaving and incoming page DOM, plus temporary scene layers owned by a preset.",
    },
    {
      concern: "Animation control",
      native:
        "CSS animations or Web Animations targeting generated pseudo-elements.",
      ssgoi:
        "Web Animations on live elements, coordinated by preset code and spring timelines.",
    },
    {
      concern: "Route meaning",
      native:
        "The browser starts a view transition; application code still decides what navigation means.",
      ssgoi:
        "on/except, from/to, and ordered rules select a preset and resolve direction.",
    },
    {
      concern: "Interruption",
      native:
        "The active transition has a skip lifecycle; application code owns queueing or continuity into a replacement.",
      ssgoi:
        "The engine pairs route events, cancels incomplete pairs, carries compatible live-element animation state forward, and owns cleanup.",
    },
    {
      concern: "Layout ownership",
      native:
        "Independent from framework mount and persistent-layout lifetime.",
      ssgoi:
        "Explicit boundaries say which routed region may leave, enter, or remain mounted.",
    },
    {
      concern: "Reusable effects",
      native:
        "Applications can measure geometry and prepare named groups or helpers around the API.",
      ssgoi:
        "Presets own repeated measurement, scene setup, pairing, cancellation, and cleanup.",
    },
  ];

  return (
    <div className="mt-8">
      <Decision label="Short answer">
        The View Transition API is now available across current browsers. SSGOI
        does not avoid it because it is Chrome-only; it chooses a different
        control model for reusable, router-aware presets.
      </Decision>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-400">
        Same-document{" "}
        <code className="font-mono text-neutral-200">
          document.startViewTransition()
        </code>{" "}
        reached the web platform&apos;s Baseline 2025 status. It is a good fit
        when an application owns the DOM update and can describe its old/new
        snapshot groups.{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          Check the current platform support ↗
        </a>
      </p>

      <GuideSection
        title="What SSGOI packages into a preset"
        lead="SSGOI owns the geometry, temporary visual layers, live outgoing DOM, and navigation policy needed to make these scenes reusable."
      >
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            {
              name: "Zoom",
              body: "The whole detail page unfolds from its image.",
              src: "/blog/view-transition-api-limitations/zoom-blur.gif",
              width: 360,
              height: 696,
            },
            {
              name: "Film",
              body: "Runtime scene, live video, and multiple springs.",
              src: "/blog/view-transition-api-limitations/film.gif",
              width: 640,
              height: 360,
            },
            {
              name: "Sheet",
              body: "A live backdrop sits between the two pages.",
              src: "/blog/view-transition-api-limitations/sheet-blur-full.gif",
              width: 360,
              height: 696,
            },
          ].map((example) => (
            <figure
              key={example.name}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#120e0b]"
            >
              <div className="flex h-[340px] items-center justify-center p-4">
                <Image
                  src={example.src}
                  alt={`${example.name} transition: ${example.body}`}
                  width={example.width}
                  height={example.height}
                  unoptimized
                  className="max-h-full w-auto max-w-full rounded-xl object-contain"
                />
              </div>
              <figcaption className="border-t border-white/[0.06] bg-black/20 p-5">
                <span className="font-semibold text-neutral-100">
                  {example.name}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-neutral-400">
                  {example.body}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        title="Snapshot tree and live scene"
        lead="Both approaches can use the Web Animations API. The important difference is what the animation engine owns."
      >
        <CodeBlock
          className="mt-5"
          language="text"
          code={`View Transition API
::view-transition
└─ group
   └─ image-pair
      ├─ old snapshot
      └─ new snapshot

SSGOI
route boundary unmounts OUT ─┐
route boundary mounts IN ────┼─ preset measures + animates live DOM
temporary backdrop / pieces ─┘`}
        />

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full min-w-[680px] text-left text-sm">
            <caption className="sr-only">
              View Transition API and SSGOI control-model comparison
            </caption>
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-4 py-3 font-medium">
                  Concern
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  View Transition API
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  SSGOI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row) => (
                <tr key={row.concern}>
                  <th
                    scope="row"
                    className="px-4 py-4 align-top font-medium text-neutral-200"
                  >
                    {row.concern}
                  </th>
                  <td className="px-4 py-4 align-top leading-relaxed text-neutral-400">
                    {row.native}
                  </td>
                  <td className="px-4 py-4 align-top leading-relaxed text-neutral-300">
                    {row.ssgoi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection
        title="What this does not mean"
        lead="The native API is not limited to a cross-fade, and its pseudo-elements can be animated from JavaScript."
      >
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-400">
          <li>
            An application can build shared elements, custom easing, and
            elaborate snapshot choreography with View Transitions.
          </li>
          <li>
            Geometry, metadata transfer, intermediate scene pieces, routing
            policy, interruption behavior, and cleanup may still remain in
            application or library code.
          </li>
          <li>
            SSGOI packages that work into presets such as Zoom blur, Sheet blur,
            and Film while keeping the public config small.
          </li>
        </ul>
      </GuideSection>

      <GuideSection
        title="Choose by ownership"
        lead="Use the native API when your application wants to own snapshot names and transition-specific orchestration. Use SSGOI when the same interaction should be reusable across routers and frameworks."
      >
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          The detailed engineering boundary—including geometry, live video,
          temporary DOM, blur layers, and interruption policy—is documented in{" "}
          <a
            href="https://ssgoi.dev/blog/view-transition-api-limitations"
            className={linkClass}
          >
            Why I didn&apos;t use the View Transition API
          </a>
          .
        </p>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/why-ssgoi",
            title: "Why SSGOI",
            body: "The product-level decision: easy adoption, mobile UX, and router independence.",
          },
          {
            href: "/docs/how-it-works",
            title: "How SSGOI works",
            body: "Follow the OUT node from framework unmount through cleanup.",
          },
        ]}
      />
    </div>
  );
}

export function BoundariesBody() {
  return (
    <div className="mt-8">
      <Decision label="Default">
        For a simple app, use the pathname as both the framework key and the
        SSGOI transition id. Keep the boundary in its own small component.
      </Decision>

      <CodeBlock
        className="mt-6"
        code={`"use client";

import { usePathname } from "next/navigation";

export function SsgoiRouteBoundary({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}`}
      />

      <GuideSection
        title="One element, two decisions"
        lead="The two values are usually identical at first, but they answer different questions."
      >
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Difference between a boundary key and transition id
            </caption>
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-4 py-3 font-medium">
                  Value
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Question it answers
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Consumer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              <tr>
                <th
                  scope="row"
                  className="px-4 py-4 font-mono font-semibold text-orange-300"
                >
                  key
                </th>
                <td className="px-4 py-4 text-neutral-300">
                  When should this routed region unmount and mount again?
                </td>
                <td className="px-4 py-4 text-neutral-400">
                  React or the framework boundary
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-4 py-4 font-mono font-semibold text-orange-300"
                >
                  data-ssgoi-transition
                </th>
                <td className="px-4 py-4 text-neutral-300">
                  Which logical route should transition rules match?
                </td>
                <td className="px-4 py-4 text-neutral-400">SSGOI config</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection
        title="When they stop being the same"
        lead="A persistent layout gives several routes one shared framework lifetime while their logical route ids keep changing."
      >
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          A bottom-nav app is the representative case. Tab → tab should remount
          only the page content, while tab → detail should remount the whole
          shell and take the nav with it. That requires an outer shell boundary
          and an inner content boundary.
        </p>
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 text-sm leading-relaxed text-neutral-300">
          Keep one{" "}
          <code className="font-mono text-orange-300">&lt;Ssgoi&gt;</code>{" "}
          provider. Add boundaries to express ownership; do not nest providers.
        </div>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/nested-boundaries",
            title: "Persistent bottom nav",
            body: "See the outer shell, inner content boundary, route groups, and intercepting modal pattern.",
          },
          {
            href: "/docs/how-it-works",
            title: "Boundary lifecycle",
            body: "Read this only when you need to debug unmount, reinsertion, or cleanup.",
          },
        ]}
      />
    </div>
  );
}

const ROUTE_RULE_ROWS = [
  {
    rule: "on + except",
    choose: "A route family or drill-down scope.",
    example: "/posts ↔ /posts/42",
  },
  {
    rule: "from / to",
    choose: "A precise relationship between two screen families.",
    example: "/gallery ↔ /photo/42",
  },
  {
    rule: "ordered",
    choose: "Tabs or steps whose position determines direction.",
    example: "feed → search → profile",
  },
];

export function RouteRulesBody() {
  return (
    <div className="mt-8">
      <Decision>
        Choose the route relationship first. The transition factory describes
        motion; the surrounding rule decides where it applies and what forward
        and backward mean.
      </Decision>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Choosing an SSGOI route rule</caption>
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
              <th scope="col" className="px-4 py-3 font-medium">
                Rule
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Choose it for
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {ROUTE_RULE_ROWS.map((row) => (
              <tr key={row.rule}>
                <th scope="row" className="px-4 py-4 font-mono text-orange-300">
                  {row.rule}
                </th>
                <td className="px-4 py-4 text-neutral-300">{row.choose}</td>
                <td className="px-4 py-4 font-mono text-xs text-neutral-400">
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GuideSection
        title="The three representative forms"
        lead="The written relationship establishes the forward direction. A from/to pair is bidirectional by default; set bidirectional: false when only the written direction should match."
      >
        <CodeBlock
          className="mt-5"
          code={`const config = {
  transitions: [
    // Enter the family: forward. Leave it: backward.
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },

    // The written pair is forward.
    {
      from: "/gallery",
      to: "/photo/*",
      transition: zoom(),
    },

    // Increasing index is forward.
    {
      ordered: ["/tabs/feed", "/tabs/search", "/tabs/profile"],
      transition: slide(),
    },
  ],
};`}
        />
      </GuideSection>

      <GuideSection
        title="Path patterns"
        lead="Use exact paths until the relationship genuinely contains a family."
      >
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">SSGOI route path patterns</caption>
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-4 py-3 font-medium">
                  Pattern
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Matches
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              <tr>
                <th scope="row" className="px-4 py-3 font-mono text-orange-300">
                  /posts
                </th>
                <td className="px-4 py-3 text-neutral-400">
                  Exactly <code className="font-mono">/posts</code>
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-mono text-orange-300">
                  /posts/*
                </th>
                <td className="px-4 py-3 text-neutral-400">
                  Exactly one additional segment
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-mono text-orange-300">
                  /posts/**
                </th>
                <td className="px-4 py-3 text-neutral-400">
                  The base path and any number of descendant segments
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection
        title="Overlapping rules"
        lead="Higher priority wins first, then path specificity, then declaration order."
      >
        <CodeBlock
          className="mt-5"
          language="ts"
          code={`transitions: [
  { priority: -100, on: "/**", transition: fade() },
  { on: "/posts/**", except: "/posts", transition: drill() },
]`}
        />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Keep broad fallback rules at a lower priority. Scroll behavior is
          resolved from whichever rule actually wins.
        </p>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/transitions",
            title: "Transition catalog",
            body: "Choose a preset and its variants after the route relationship is clear.",
          },
          {
            href: "/docs/scroll-restoration",
            title: "Automatic scroll",
            body: "See how the matched rule supplies restore and reset defaults.",
          },
          {
            href: "/docs/middleware",
            title: "Normalize route ids",
            body: "Use middleware for locale prefixes, rewrites, and tenant slugs.",
          },
        ]}
      />
    </div>
  );
}

export function ScrollRestorationBody() {
  const rows = [
    { rule: "on (scope entry / leave)", from: "restore", to: "reset" },
    { rule: "from / to", from: "restore", to: "reset" },
    { rule: "ordered", from: "restore", to: "restore" },
  ];

  return (
    <div className="mt-8">
      <Decision label="Default">
        Keep the automatic policy. SSGOI records the leaving page, resets a new
        detail or task screen, and restores the source when the user returns.
      </Decision>

      <figure className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <Image
          src="/docs/diagrams/scroll-restore.png"
          alt="Forward navigation records the list scroll position and resets the detail page; back navigation restores the list position."
          width={1672}
          height={941}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
        <figcaption className="border-t border-white/[0.06] px-5 py-3 text-xs leading-relaxed text-neutral-500">
          Scroll is attached to the matched route relationship, not to the
          visual transition preset.
        </figcaption>
      </figure>

      <GuideSection
        title="Automatic policy"
        lead="From and to refer to the rule's semantic forward relationship. A backward navigation reverses their physical OUT and IN roles."
      >
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Default scroll restoration behavior by route rule
            </caption>
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-4 py-3 font-medium">
                  Rule
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Forward from
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Forward to
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row) => (
                <tr key={row.rule}>
                  <th
                    scope="row"
                    className="px-4 py-4 font-mono text-orange-300"
                  >
                    {row.rule}
                  </th>
                  <td className="px-4 py-4 text-neutral-300">{row.from}</td>
                  <td className="px-4 py-4 text-neutral-300">{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          The outgoing page always animates at its current scroll position.
          Reset or restoration runs only when a page becomes IN.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
          When both routes are already inside the same{" "}
          <code className="font-mono text-neutral-300">on</code> scope, both are
          semantic <code className="font-mono text-neutral-300">to</code> and
          reset by default. For stack UX, use{" "}
          <code className="font-mono text-neutral-300">except</code> to keep the
          source route outside the scope.
        </p>
      </GuideSection>

      <GuideSection
        title="Override one relationship"
        lead="Use preserveScroll only when the automatic UX is wrong for that rule."
      >
        <CodeBlock
          className="mt-5"
          language="ts"
          code={`{
  from: "/gallery",
  to: "/photo/*",
  preserveScroll: { from: true, to: true },
  transition: zoom(),
}`}
        />
      </GuideSection>

      <GuideSection
        title="Mobile and desktop"
        lead="There is no separate mobile scroll switch. Select different rule sets, and each winning rule carries its own default or override."
      >
        <CodeBlock
          className="mt-5"
          language="ts"
          code={`transitions: ({ isMobile }) =>
  isMobile
    ? [
        {
          on: "/posts/**",
          except: "/posts",
          transition: drill(),
        },
      ]
    : [
        {
          from: "/posts",
          to: "/posts/*",
          preserveScroll: { from: true, to: false },
          transition: fade(),
        },
      ]`}
        />
      </GuideSection>

      <div className="mt-10 rounded-2xl border border-white/[0.06] p-5 text-sm leading-relaxed text-neutral-400">
        <code className="font-mono text-neutral-200">scroll()</code> is a visual
        page-transition effect. Scroll restoration is navigation state; the two
        features are independent.
      </div>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route relationships",
            body: "Understand the semantic from and to sides used by the policy.",
          },
          {
            href: "/docs/middleware",
            title: "Middleware",
            body: "See how normalized route ids also become scroll-map identities.",
          },
        ]}
      />
    </div>
  );
}

export function MiddlewareBody() {
  return (
    <div className="mt-8">
      <Decision>
        Add middleware only when the URL contains structure that transition
        rules should ignore, such as a locale, tenant prefix, or rewrite.
      </Decision>

      <GuideSection
        title="Normalize before matching"
        lead="Middleware receives the raw from and to ids once and returns the logical ids used by every rule."
        className="mt-8"
      >
        <CodeBlock
          className="mt-5"
          language="text"
          code={`raw URL        /en/posts/42  →  /en/posts
                       │ middleware removes locale
logical route     /posts/42     →  /posts
                       │
                       └─ one shared rule set`}
        />
        <CodeBlock
          className="mt-5"
          language="ts"
          code={`const config = {
  middleware: (from, to) => ({
    from: from.replace(/^\\/(en|ko)(?=\\/|$)/, ""),
    to: to.replace(/^\\/(en|ko)(?=\\/|$)/, ""),
  }),
  transitions: [
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
  ],
};`}
        />
      </GuideSection>

      <GuideSection
        title="One identity all the way through"
        lead="The resolved id is used by matching and scroll bookkeeping."
      >
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">
          In the example,{" "}
          <code className="font-mono text-neutral-200">/en/posts</code> and{" "}
          <code className="font-mono text-neutral-200">/ko/posts</code> both
          become <code className="font-mono text-orange-300">/posts</code>. They
          therefore match the same rules and share the same restored scroll
          identity. If those locales must retain independent state, do not
          normalize them to the same id.
        </p>
      </GuideSection>

      <GuideSection
        title="Do not use it for"
        lead="Middleware should remove incidental URL structure, not hide a complicated transition model."
      >
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-400">
          <li>
            Device branching—use{" "}
            <code className="font-mono text-neutral-200">
              {"transitions({ isMobile })"}
            </code>
            .
          </li>
          <li>
            Persistent layout lifetime—use route boundaries and scoped keys.
          </li>
          <li>Effect variants—pass props to the transition factory.</li>
        </ul>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Match the normalized ids with on, from/to, or ordered.",
          },
          {
            href: "/docs/scroll-restoration",
            title: "Scroll identity",
            body: "Understand the state that follows the middleware-resolved id.",
          },
        ]}
      />
    </div>
  );
}

export function TroubleshootingBody() {
  const checks = [
    {
      title: "No animation",
      items: [
        "Confirm both routes render under the same single <Ssgoi>.",
        "Confirm outgoing and incoming route roots have data-ssgoi-transition.",
        "Confirm the boundary key changes when the owned routed region changes.",
        "Confirm one route rule matches the navigation pair.",
      ],
    },
    {
      title: "The wrong region animates",
      items: [
        "Find the nearest boundary whose key changed.",
        "Keep persistent UI outside the inner boundary that remounts.",
        "Reuse an outer key only while routes share that exact shell.",
        "Do not create a nested <Ssgoi> provider.",
      ],
    },
    {
      title: "The page jumps or flickers",
      items: [
        "Give the element around <Ssgoi> a positioned containing block and local stacking context.",
        "Clip horizontal overflow for transitions that travel beyond the viewport.",
        "Give routed pages a full-height background when the design requires one.",
      ],
    },
    {
      title: "Scroll is unexpected",
      items: [
        "Identify the route rule that won; scroll belongs to that relationship.",
        "Check middleware if the visible URL and logical route id differ.",
        "Remove preserveScroll temporarily and verify the automatic default first.",
      ],
    },
  ];

  return (
    <div className="mt-8">
      <Decision label="Start here">
        Diagnose from the outside in: provider, markers, boundary key, winning
        rule, then layout. Read engine internals only if this checklist is not
        enough.
      </Decision>

      <ol className="mt-6 space-y-4">
        {checks.map((check, index) => (
          <li key={check.title} className={cardClass}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/35 bg-orange-500/10 font-mono text-xs text-orange-400"
                aria-hidden
              >
                {index + 1}
              </span>
              <h2 className="font-semibold tracking-tight text-neutral-100">
                {check.title}
              </h2>
            </div>
            <ul className="mt-4 space-y-2 pl-9 text-sm leading-relaxed text-neutral-400">
              {check.items.map((item) => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <GuideSection
        title="Layout sanity check"
        lead="This is the minimum shell expected by the leaving page while SSGOI temporarily reinserts it."
      >
        <CodeBlock
          className="mt-5"
          code={`<main className="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
        />
      </GuideSection>

      <NextLinks
        title="Escalate only to the relevant topic"
        links={[
          {
            href: "/docs/frameworks",
            title: "Framework wiring",
            body: "Verify the routed DOM lifecycle and boundary pattern for your stack.",
          },
          {
            href: "/docs/boundaries",
            title: "Boundary ownership",
            body: "Separate the key that remounts from the id that matches rules.",
          },
          {
            href: "/docs/layout",
            title: "Layout shell",
            body: "Debug containing blocks, stacking, and horizontal clipping.",
          },
          {
            href: "/docs/how-it-works",
            title: "Engine lifecycle",
            body: "Follow unmount, OUT reinsertion, IN mount, animation, and cleanup.",
          },
        ]}
      />

      <p className="mt-8 text-sm text-neutral-500">
        Agent-oriented checklist:{" "}
        <a
          href="https://ssgoi.dev/llms/troubleshooting.txt"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          /llms/troubleshooting.txt ↗
        </a>
      </p>
    </div>
  );
}

const hasNextJsGuide = FRAMEWORK_DOCS.some((doc) => doc.slug === "nextjs");
const FRAMEWORK_INDEX = hasNextJsGuide
  ? FRAMEWORK_DOCS
  : [
      {
        slug: "nextjs",
        name: "React / Next.js",
        pkg: "@ssgoi/react",
        lead: "The minimal pathname boundary: provider, route-boundary component, and root layout.",
        llmsUrl: "https://ssgoi.dev/llms/frameworks/nextjs.txt",
        templateUrl:
          "https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs",
        sections: [],
      },
      ...FRAMEWORK_DOCS,
    ];

export function FrameworksIndexBody() {
  return (
    <div className="mt-8">
      <Decision>
        Choose the guide for the framework that owns your routed DOM. Transition
        factories and route rules stay the same; only the boundary lifecycle
        changes.
      </Decision>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {FRAMEWORK_INDEX.map((doc) => {
          const href =
            doc.slug === "nextjs" && !hasNextJsGuide
              ? "/docs/install"
              : `/docs/frameworks/${doc.slug}`;

          return (
            <li key={doc.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold tracking-tight text-neutral-100">
                      <Link
                        href={href}
                        className="transition-colors hover:text-orange-400"
                      >
                        {doc.name}
                      </Link>
                    </h2>
                    <p className="mt-1 font-mono text-xs text-orange-300">
                      {doc.pkg}
                    </p>
                  </div>
                  <Link
                    href={href}
                    aria-label={`Open ${doc.name} guide`}
                    className="text-neutral-500 transition-colors hover:text-orange-400"
                  >
                    →
                  </Link>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">
                  {doc.lead}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                  <Link href={href} className={linkClass}>
                    Human guide
                  </Link>
                  {doc.llmsUrl && (
                    <a
                      href={doc.llmsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={linkClass}
                    >
                      Agent guide ↗
                    </a>
                  )}
                  {doc.templateUrl && (
                    <a
                      href={doc.templateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={linkClass}
                    >
                      Template ↗
                    </a>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <GuideSection
        title="What remains shared"
        lead="After the framework boundary is wired, every stack uses the same mental model."
      >
        <ul className="mt-5 grid gap-3 text-sm text-neutral-400 sm:grid-cols-3">
          <li className={cardClass}>
            Route rules choose the navigation relationship.
          </li>
          <li className={cardClass}>
            Transition factories choose motion and variants.
          </li>
          <li className={cardClass}>
            Boundaries choose the routed region that owns the motion.
          </li>
        </ul>
      </GuideSection>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Use on/except, from/to, or ordered after the provider is wired.",
          },
          {
            href: "/docs/boundaries",
            title: "Boundary basics",
            body: "Understand the key and route id before adding persistent layouts.",
          },
        ]}
      />
    </div>
  );
}
