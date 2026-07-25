import { Link } from "@/lib/link";
import { NpmPill } from "@/components/npm-pill";
import { CodeBlock } from "@/components/code-block";
import {
  Checklist,
  DocsTable,
  Figure,
  Heading3,
  NextLinks,
  Note,
  PageHeading,
  PrimaryLink,
  SecondaryLink,
  Section,
  Step,
  Steps,
  card,
  caption,
  inlineCode,
  link,
  measure,
  prose,
  proseDim,
} from "@/page/docs/ui";
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

/* -------------------------------------------------------------------------- */
/* Overview hero                                                              */
/* -------------------------------------------------------------------------- */

export function DocsHero() {
  return (
    <>
      <PageHeading
        title="Native app-like page transitions"
        lead="SSGOI animates the change between routes without taking over navigation. One config and one route boundary is the whole starting point."
      />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <PrimaryLink href="/docs/install">
          Add your first transition
        </PrimaryLink>
        <SecondaryLink href="/docs/transitions">
          Browse transitions
        </SecondaryLink>
      </div>
    </>
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

/**
 * The three wrapper classes, shared by the quick start and the layout page so
 * the two can never drift apart.
 */
const LAYOUT_CLASSES: { cls: string; why: string }[] = [
  {
    cls: "relative",
    why: "The leaving page is put back into the DOM with position: absolute, so it lands relative to the nearest positioned ancestor. Without this it jumps to the top of the document.",
  },
  {
    cls: "z-0",
    why: "Gives the wrapper its own stacking context, so the layers a transition creates stay inside your shell instead of covering a fixed header. Transitions never use a negative z-index, so the leaving page cannot fall behind your background.",
  },
  {
    cls: "overflow-x-clip",
    why: "Stops a horizontal scrollbar from flashing while slide, drill or strip move a page off-screen. Use clip, not hidden — overflow-x: hidden turns the wrapper into the scroll container, and scroll restore then targets the wrong element.",
  },
];

function LayoutClassTable() {
  return (
    <DocsTable
      head={["Class", "Why it is there"]}
      rows={LAYOUT_CLASSES.map(({ cls, why }) => [
        <code key={cls} className={inlineCode}>
          {cls}
        </code>,
        why,
      ])}
      minWidth="560px"
    />
  );
}

export function InstallBody() {
  return (
    <div className="mt-8">
      <p className={`${measure} ${proseDim}`}>
        One package per framework. This quick start uses React and Next.js; the
        equivalent setup for every other stack is in{" "}
        <Link href="/docs/frameworks" className={link}>
          Frameworks
        </Link>
        .
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {PACKAGES.map((pkg) => (
          <NpmPill key={pkg} pkg={pkg} />
        ))}
      </div>

      <AgentSetup />

      <Section
        title="Set it up"
        lead="Two new files, plus one edit to the layout you already have. Copy each block as it is."
      >
        <Steps>
          <Step n={1} title="Create the provider">
            <p className={`${measure} ${prose}`}>
              One rule is enough to start:{" "}
              <code className={inlineCode}>drill()</code> everywhere except the
              home route. It is the most visible transition, which makes step 4
              unambiguous.
            </p>
            <CodeBlock
              className="mt-4"
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
            <p className={`mt-4 ${measure} ${prose}`}>
              Both new files are client components. SSGOI reads and moves real
              DOM nodes, and <code className={inlineCode}>usePathname</code>{" "}
              only exists on the client. The pages inside the boundary stay
              server components.
            </p>
            <p className={`mt-4 ${measure} ${prose}`}>
              <code className={inlineCode}>transitions</code> also accepts a
              function of device context — the usual way to give phones and
              desktops different motion.
            </p>
            <CodeBlock
              className="mt-4"
              code={`import { drill, fade } from "@ssgoi/react/view-transitions";

const config = {
  transitions: ({ isMobile }) =>
    isMobile
      ? [{ on: "/**", except: "/", transition: drill() }]
      : [{ priority: -100, on: "/**", transition: fade() }],
};`}
            />
            <p className={`mt-4 ${measure} ${prose}`}>
              <code className={inlineCode}>priority</code> defaults to 0, so{" "}
              <code className={inlineCode}>-100</code> parks that rule below
              every other one as a last resort —{" "}
              <Link href="/docs/route-rules" className={link}>
                Route rules
              </Link>{" "}
              has the rest of the resolution order.{" "}
              <code className={inlineCode}>isMobile</code> is true when the
              scroll container is narrower than 768px, re-measured when it
              resizes. SSGOI calls your function once per{" "}
              <code className={inlineCode}>isMobile</code> value and caches the
              result, so keep it pure.
            </p>
            <p className={`mt-4 ${measure} ${prose}`}>
              Define <code className={inlineCode}>config</code> outside the
              component. A new object on every render rebuilds the engine and
              loses its saved scroll positions.
            </p>
          </Step>

          <Step n={2} title="Mark the region that changes">
            <p className={`${measure} ${prose}`}>
              The <code className={inlineCode}>key</code> is what makes the
              framework throw the old page away — SSGOI reacts to the framework
              destroying and rebuilding the routed node.{" "}
              <code className={inlineCode}>data-ssgoi-transition</code> is just
              the label your rules match against.
            </p>
            <CodeBlock
              className="mt-4"
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
}`}
            />
            <p className={`mt-4 ${measure} ${prose}`}>
              If the wrong part of the screen ends up moving, it is this key
              that decides —{" "}
              <Link href="/docs/boundaries" className={link}>
                Route boundaries
              </Link>{" "}
              shows how to move it up or down the tree.
            </p>
          </Step>

          <Step n={3} title="Assemble them in the layout">
            <p className={`${measure} ${prose}`}>
              This is the one edit to a file you already have. The element
              around <code className={inlineCode}>&lt;Ssgoi&gt;</code> needs
              three classes; they hold the leaving page in place while it
              animates out.
            </p>
            <CodeBlock
              className="mt-4"
              code={`// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";
import { SsgoiRouteBoundary } from "./ssgoi-route-boundary";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>
            <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
          </SsgoiProvider>
        </main>
      </body>
    </html>
  );
}`}
            />
            <LayoutClassTable />
            <p className={`mt-4 ${measure} ${prose}`}>
              Without Tailwind, write{" "}
              <code className={inlineCode}>
                position: relative; z-index: 0; min-height: 100dvh; overflow-x:
                clip
              </code>
              . If the leaving page appears in the wrong place or slides under
              your header,{" "}
              <Link href="/docs/layout" className={link}>
                Layout shell
              </Link>{" "}
              explains which of the three is missing.
            </p>
          </Step>

          <Step n={4} title="Run it">
            <p className={`${measure} ${prose}`}>
              Start the app and navigate. Two things tell you the wiring is
              right.
            </p>
            <Checklist
              items={[
                "From / to any other page, the new page slides in from the right.",
                "Back to /, the page slides out to the right.",
              ]}
            />
            <p className={`mt-5 ${measure} ${prose}`}>
              If nothing moves, or the wrong region moves, the cause is almost
              always one of two files: check{" "}
              <Link href="/docs/layout" className={link}>
                Layout shell
              </Link>{" "}
              for the wrapper classes and{" "}
              <Link href="/docs/boundaries" className={link}>
                Route boundaries
              </Link>{" "}
              for where the key sits.
            </p>
          </Step>
        </Steps>

        <p className={`mt-12 ${measure} ${prose}`}>
          That is the whole setup. This boundary remounts the entire routed area
          on every navigation, which is correct until you need something to stay
          put — a bottom nav that survives page changes, for instance. That is{" "}
          <Link href="/docs/nested-boundaries" className={link}>
            Persistent layouts
          </Link>
          .
        </p>
      </Section>

      <ReferenceTemplates />

      <p className={`mt-10 ${measure} ${proseDim}`}>
        Next: pick the motion your product actually needs in{" "}
        <Link href="/docs/transitions" className={link}>
          Transitions
        </Link>
        .
      </p>
    </div>
  );
}

/**
 * Sits above the manual steps rather than under them: handing this URL to an
 * agent replaces the steps outright, so finding it at the bottom of the page
 * would be finding it too late.
 */
function AgentSetup() {
  return (
    <div className={`mt-8 ${card} ${measure}`}>
      <p className={prose}>
        Using an AI coding agent? Point it at one file and it has the whole
        setup — the config, the route boundary, the layout classes and the
        transition specs — as plain text.
      </p>
      <a
        href="https://ssgoi.dev/llms.txt"
        target="_blank"
        rel="noreferrer"
        className={`mt-4 inline-block ${link} font-mono text-[0.9em]`}
      >
        https://ssgoi.dev/llms.txt
      </a>
      <p className={`mt-4 ${caption}`}>
        The rest of this page is that same setup, written for a person.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Install — reference templates                                              */
/* -------------------------------------------------------------------------- */

function ReferenceTemplates() {
  return (
    <Section
      title="Reference templates"
      lead="Each template is a runnable app already wired the recommended way for its router. Clone one and read its provider, boundary and layout files, or copy the pieces you need."
    >
      <RoutersBody />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout shell                                                                */
/* -------------------------------------------------------------------------- */

export function LayoutBody() {
  return (
    <div className="mt-8">
      <p className={`${measure} ${prose}`}>
        The quick start gives you the copy-paste version. This page is for when
        a transition lands in the wrong place.
      </p>

      <CodeBlock
        className="mt-6"
        code={`<main className="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
      />

      <p className={`mt-4 ${measure} ${prose}`}>
        That is the shell for the common case: the document scrolls and the
        wrapper simply fills it. It is the shell the quick start, the framework
        guides and the templates all use.
      </p>

      <LayoutClassTable />

      <div className="mt-10">
        <Heading3>If the wrapper scrolls instead of the document</Heading3>
        <p className={`mt-3 ${measure} ${prose}`}>
          Swap <code className={inlineCode}>min-h-dvh</code> for{" "}
          <code className={inlineCode}>h-dvh overflow-y-auto</code>. Pick this
          only if you deliberately want a fixed-height app frame with its own
          scrolling region — for example a header that never moves.
        </p>
        <CodeBlock
          className="mt-4"
          code={`<main className="relative z-0 h-dvh overflow-y-auto overflow-x-clip">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
        />
        <div className="mt-6">
          <Note>
            SSGOI restores scroll on the nearest ancestor that actually scrolls,
            so with this shell that ancestor is the wrapper itself. Keep{" "}
            <code className={inlineCode}>overflow-y: auto</code> on the same
            element you gave <code className={inlineCode}>relative</code> to —
            if the two live on different elements, scroll restore targets one
            box and the leaving page is positioned against another.
          </Note>
        </div>
      </div>

      <Section
        title="Why the leaving page needs a wrapper at all"
        lead="When you navigate, your framework removes the old page from the DOM. SSGOI catches that exact node — not a copy of it — and puts it back so it can animate out."
      >
        <Figure
          src="/docs/diagrams/route-lifecycle.png"
          alt="Four route frames showing the outgoing page detached above the incoming page while both animate, then cleaned up"
          width={1672}
          height={941}
          caption="The new page keeps its normal place in the flow. The old one is layered on top of it until its animation ends."
        />

        <p className={`mt-8 ${measure} ${prose}`}>
          Because the reinserted page is{" "}
          <code className={inlineCode}>position: absolute</code>, it is placed
          against the nearest positioned ancestor. That ancestor is the element
          you put <code className={inlineCode}>relative</code> on. The{" "}
          <code className={inlineCode}>&lt;Ssgoi&gt;</code> element itself
          cannot do the job: it renders as{" "}
          <code className={inlineCode}>display: contents</code> and so has no
          box of its own.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Reusing the real node is deliberate — typed-in form values, canvas
          contents and playing video all survive the trip.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          The cost is that two pages are in the document at once for the length
          of the animation. That is what the other two classes contain:{" "}
          <code className={inlineCode}>z-0</code> keeps both pages&apos; layers
          inside your shell, and{" "}
          <code className={inlineCode}>overflow-x-clip</code> hides the
          horizontal overflow while one of them travels off-screen.
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/how-it-works",
            title: "How it works",
            body: "The same lifecycle end to end",
          },
          {
            href: "/docs/boundaries",
            title: "Route boundaries",
            body: "Which part of the page animates",
          },
          {
            href: "/docs/troubleshooting",
            title: "Troubleshooting",
            body: "When nothing moves at all",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                                */
/* -------------------------------------------------------------------------- */

export function HowItWorksBody() {
  return (
    <div className="mt-8">
      <p className={`${measure} ${prose}`}>
        SSGOI never reads your router. It watches for elements marked with{" "}
        <code className={inlineCode}>data-ssgoi-transition</code> appearing and
        disappearing from the DOM. A navigation changes a boundary&apos;s key,
        and SSGOI reacts to the framework destroying and rebuilding the routed
        node.
      </p>

      <Figure
        src="/docs/diagrams/route-lifecycle.png"
        alt="A four-stage route lifecycle: the old route unmounts, SSGOI restores it as an outgoing layer, both pages animate, then the outgoing layer is removed"
        width={1672}
        height={941}
        priority
        caption="Unmount, reinsert, animate together, clean up."
      />

      <Checklist
        items={[
          "Navigation changes the boundary key, so the framework unmounts the old page.",
          <>
            SSGOI keeps that same node — never a clone — and puts it back with{" "}
            <code className={inlineCode}>position: absolute</code>, offset so it
            does not visually jump.
          </>,
          "The new page mounts in its normal place.",
          "The chosen transition animates both, either at once or one after the other.",
          "When the animation ends, the old node is removed for good.",
        ]}
      />

      <div className="mt-8">
        <Note>
          Destroying the node is not the only shape this takes. With React{" "}
          <code className={inlineCode}>&lt;Activity&gt;</code> or Next&apos;s{" "}
          <code className={inlineCode}>cacheComponents</code>, the old page is
          hidden with <code className={inlineCode}>display: none</code> instead
          of being removed. SSGOI watches for that too: it reveals the same node
          in place, animates it, then hides it again — and the page keeps its
          state, so scroll position, inputs and media survive.
        </Note>
      </div>

      <p className={`mt-8 ${measure} ${prose}`}>
        Everything runs through the Web Animations API: spring motion is
        simulated up front, turned into keyframes and handed to the browser, so
        there is no per-frame JavaScript once a transition is playing.
      </p>

      <Section
        title="Why the wrapper needs relative and z-0"
        lead="Both classes exist because of that temporarily reinserted page."
      >
        <p className={`${measure} ${prose}`}>
          <code className={inlineCode}>relative</code> is the load-bearing one.
          An absolutely positioned element is placed against its nearest
          positioned ancestor; if your shell has none, the leaving page is
          measured against the document and lands in the wrong spot.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          <code className={inlineCode}>z-0</code> is about containment.
          Transitions stack their layers at{" "}
          <code className={inlineCode}>z-index</code> 0, 1 and 2 — never
          negative, so the leaving page cannot slip behind your background — but
          a few expressive effects go much higher. A stacking context on the
          wrapper keeps all of that inside your shell instead of over a fixed
          header.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          If a transition looks broken, check the{" "}
          <Link href="/docs/layout" className={link}>
            layout shell
          </Link>{" "}
          before anything else.
        </p>
      </Section>

      <Section
        title="Which boundary owns the transition"
        lead="If an outer boundary and one nested inside it both change in the same update, the outer one owns the transition. A child owns it only while its parent stays mounted."
      >
        <p className={`${measure} ${prose}`}>
          The reason is mechanical: the outer node is the one the framework
          removes, and the inner boundary goes with it. SSGOI still cleans the
          inner one up, but there is no separately removed node left to animate,
          so the outer boundary&apos;s transition is the only one that runs.
        </p>
        <CodeBlock
          className="mt-6"
          language="text"
          code={`tab → tab
app-shell stays ── main-content changes ── BottomNav stays

tab → detail
app-shell changes ── nested change is absorbed ── BottomNav leaves

project child → child
project key stays ── no marked child leaves ── content swaps immediately`}
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          One consequence worth knowing: changing only{" "}
          <code className={inlineCode}>data-ssgoi-transition</code> on a node
          that stays mounted animates nothing. The key has to change.{" "}
          <Link href="/docs/nested-boundaries" className={link}>
            Persistent layouts
          </Link>{" "}
          has the full route tree, dynamic keys, and intercepted modals.
        </p>
      </Section>
    </div>
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
  { name: "React Router", icon: ReactRouterMark, templatePath: "react-router" },
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
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {ROUTERS.map(({ name, icon: Icon, templatePath }) => (
          <a
            key={name}
            href={`${TEMPLATES_URL}/${templatePath}`}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-4 ${card} transition-colors hover:border-ink-faint`}
          >
            <Icon className="h-8 w-8 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{name}</span>
              <span className={`mt-1 block font-mono ${caption}`}>
                templates/{templatePath} ↗
              </span>
            </span>
          </a>
        ))}
      </div>
      <p className={`mt-6 ${measure} ${prose}`}>
        The React, SvelteKit, Nuxt and SolidStart templates wrap routed content
        in a boundary component. Qwik and Angular have no equivalent wrapper, so
        each routed page root carries the key and the marker itself.{" "}
        <a
          href={TEMPLATES_URL}
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          All templates ↗
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
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Chrome", icon: ChromeMark },
  { name: "Safari", icon: SafariMark },
  { name: "Firefox", icon: FirefoxMark },
  { name: "Edge", icon: EdgeMark },
];

const RUNTIME_REQUIREMENTS: Array<{ api: string; why: string }> = [
  {
    api: "Element.animate()",
    why: "Plays every transition. Spring motion is simulated up front and handed over as keyframes.",
  },
  {
    api: "Animation.ready, writable currentTime",
    why: "The startup handoff that keeps mount and layout jank off the animation timeline.",
  },
  {
    api: "MutationObserver",
    why: "Noticing that a marked route element was added to or removed from the page.",
  },
  {
    api: "queueMicrotask()",
    why: "Flushing an unmount outside the observer callback that reported it.",
  },
  {
    api: "Element.scrollTo({ top, left })",
    why: "Restoring and resetting scroll on the container that actually scrolls.",
  },
  {
    api: "ResizeObserver (optional)",
    why: "Keeps isMobile current when the scroll container resizes. Without it the first measurement stands.",
  },
];

export function CompatibilityBody() {
  return (
    <div className="mt-6">
      <Heading3>Your router keeps navigation</Heading3>
      <p className={`mt-3 ${measure} ${prose}`}>
        SSGOI watches the route boundary your framework already mounts and
        unmounts. There is no replacement router and no navigation wrapper, and
        it never writes to history — it only listens for{" "}
        <code className={inlineCode}>popstate</code> to tell forward from
        backward.
      </p>

      <div className="mt-8">
        <Heading3>Motion the browser plays natively</Heading3>
        <p className={`mt-3 ${measure} ${prose}`}>
          Spring motion is simulated up front and handed to the browser as Web
          Animations API keyframes. The same config runs unchanged anywhere the
          APIs below exist.
        </p>
      </div>

      <div className="mt-10">
        <Heading3>Runtime targets</Heading3>
        <p className={`mt-3 ${measure} ${prose}`}>
          Current Chrome, Safari, Firefox and Edge, on desktop and mobile.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
          {BROWSERS.map(({ name, icon: Icon }) => (
            <span key={name} className="flex items-center gap-2.5">
              <Icon className="h-7 w-7" />
              <span className={caption}>{name}</span>
            </span>
          ))}
        </div>
        <p className={`mt-6 ${measure} ${prose}`}>
          This repo does not ship a browserslist or a support policy, so rather
          than quote version numbers that nothing generates, here is what the
          engine actually calls. If a browser has all of it, SSGOI runs; the
          practical floor is the 2020 Web Animations API update.
        </p>
        <DocsTable
          head={["What SSGOI calls", "What it is for"]}
          rows={RUNTIME_REQUIREMENTS.map(({ api, why }) => [
            <code key={api} className={inlineCode}>
              {api}
            </code>,
            why,
          ])}
          minWidth="560px"
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          The blur variants of Sheet and Zoom also use{" "}
          <code className={inlineCode}>backdrop-filter</code>, on by default
          from Firefox 103. Without it only the blur is lost: Sheet keeps its
          movement, scale and dimming, and Zoom keeps its movement and scale.
        </p>
      </div>
    </div>
  );
}
