import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";
import {
  DocsTable,
  Figure,
  NextLinks,
  Note,
  Section,
  inlineCode,
  link,
  measure,
  prose,
} from "@/page/docs/ui";

const LLMS_PATTERN = "https://ssgoi.dev/llms/complex-routing.txt";

const mono = "font-mono text-[0.9em]";

export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className={`${measure} ${prose}`}>
        The{" "}
        <Link href="/docs/install" className={link}>
          quick start
        </Link>{" "}
        uses the path as both the boundary key and the transition id, so every
        navigation replaces the whole page. Keep that version until part of the
        routed UI has to survive a navigation — then split the page into the few
        lifetimes the product actually needs.
      </p>

      <Section title="Keep a bottom nav still while tabs change">
        <p className={`mt-4 ${measure} ${prose}`}>
          Say <code className={inlineCode}>/</code>,{" "}
          <code className={inlineCode}>/collections</code> and{" "}
          <code className={inlineCode}>/create</code> are tab pages sharing one
          bottom nav, and <code className={inlineCode}>/photo/[id]</code> is a
          detail page without it. Tab → tab should move only the content. Tab →
          detail should send the whole shell away, nav included.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          With one boundary keyed by the path at the root, React remounts
          everything on every navigation, so the nav animates on tab → tab too.
        </p>

        <Figure
          src="/docs/diagrams/persistent-bottom-nav.png"
          alt="Two mobile navigation cases: tab-to-tab moves only inner content while the bottom navigation stays fixed; tab-to-detail moves the entire shell including the bottom navigation"
          width={1586}
          height={992}
          priority
          caption="Tab → tab: the inner content changes and BottomNav stays mounted. Tab → detail: the outer shell leaves and takes BottomNav with it."
        />
      </Section>

      <Section title="Change the key to animate, keep the attribute truthful">
        <p className={`mt-4 ${measure} ${prose}`}>
          A boundary carries two values, and only one of them starts anything.
          The <code className={inlineCode}>key</code> decides when the DOM node
          is replaced, and SSGOI reacts to the framework destroying and
          rebuilding the routed node.{" "}
          <code className={inlineCode}>data-ssgoi-transition</code> is the route
          id used to pair the leaving page with the arriving one and to match
          your config rules.{" "}
          <code className={inlineCode}>SsgoiLayoutBoundary</code> sets both for
          you: the id is always the route path, and the key comes from{" "}
          <code className={inlineCode}>config.layouts</code>.
        </p>
        <div className="mt-6">
          <Note>
            Changing only the attribute on a still-mounted node produces no
            transition: the engine registers each element once and never
            re-reads it as a new arrival. Change the key when you want motion;
            keep the attribute equal to the route so rules keep matching.
          </Note>
        </div>
      </Section>

      <Section title="Declare the layout tree in config">
        <p className={`mt-4 ${measure} ${prose}`}>
          <code className={inlineCode}>config.layouts</code> describes which
          routes share a layout. Each scope has{" "}
          <code className={inlineCode}>paths</code>, an optional{" "}
          <code className={inlineCode}>except</code>, and optional child{" "}
          <code className={inlineCode}>layouts</code>. Siblings are tried in
          order and the first match wins; children describe the next depth
          inside that scope. Patterns use the route-rule syntax, and a{" "}
          <code className={inlineCode}>*</code> or{" "}
          <code className={inlineCode}>:id</code> segment makes each captured
          value its own instance, so{" "}
          <code className={inlineCode}>/projects/1</code> and{" "}
          <code className={inlineCode}>/projects/2</code> get separate shells
          while a <code className={inlineCode}>**</code> tail does not (which is
          why the shop section uses <code className={inlineCode}>/shop/**</code>
          , not <code className={inlineCode}>/shop/*</code>). This is the layout
          of the{" "}
          <a
            href="https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs"
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            Next.js template
          </a>
          :
        </p>
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`// Bottom-nav tabs, including every shop category.
const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

const config = {
  layouts: [
    // depth 0: one shell for the tabs; depth 1: the shop section inside it
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
    // depth 0: one shell for every detail page
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },  // tab ↔ tab
    /* drill / zoom for details, slide for categories */
  ],
};`}
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          Then place prop-less boundaries in the layouts that own each lifetime.
          Depth is automatic: a boundary with no boundary above it is depth 0,
          and each boundary inside another is one deeper. A boundary at depth N
          keys by the scope instance that matches at depth N, and by the route
          path when nothing matches there.
        </p>
        <CodeBlock
          className="mt-6"
          language="text"
          code={`app/
├─ layout.tsx                      <Ssgoi> + boundary               depth 0
├─ (top-level)/layout.tsx          boundary + <BottomNav /> outside depth 1
│  ├─ posts/page.tsx               /posts
│  ├─ pinterest/page.tsx           /pinterest
│  ├─ profile/page.tsx             /profile
│  └─ shop/layout.tsx              header + category tabs + boundary depth 2
│     ├─ page.tsx                  /shop (All)
│     └─ electronics/, ...         /shop/electronics, /shop/fashion, ...
└─ (detail)/layout.tsx             boundary                         depth 1
   └─ posts/[id], pinterest/[id], profile/[id]

tab → tab           : depth 0 key stays · depth 1 key changes · nav stays
category → category : depth 0 and 1 keys stay · depth 2 slides · tabs stay
tab → detail        : depth 0 key changes · the whole tab shell leaves, nav included
detail → detail     : depth 0 key stays · depth 1 key changes`}
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          When a parent and a child boundary leave in the same DOM mutation, the
          outer one owns the transition and the child is cleaned up silently.
          Arrivals resolve the same way — inside one mount batch only the
          outermost boundary plays an entrance. The child therefore owns the
          motion only while its parent stays mounted, and that is what lets one
          nesting serve both tab and detail navigation. Without{" "}
          <code className={inlineCode}>layouts</code>, every boundary keys by
          the path, which is the quick-start behavior.
        </p>
      </Section>

      <Section title="Intercepted modals keep the background">
        <p className={`mt-4 ${measure} ${prose}`}>
          During a soft intercepted modal the URL becomes{" "}
          <code className={inlineCode}>/p/42</code> while the{" "}
          <code className={inlineCode}>children</code> slot still renders the
          background. The Next.js <code className={inlineCode}>framework</code>{" "}
          returns a <code className={inlineCode}>renderedPath</code> built from
          the selected layout segments, so boundaries follow what is actually
          rendered and the background stays mounted. Render the{" "}
          <code className={inlineCode}>{"{modal}"}</code> slot outside the
          boundaries; nothing modal-specific is configured.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Your app still owns intercepting route files, parallel slot fallbacks,
          and any redirects or rewrites in middleware.ts (Next 13–15) or
          proxy.ts (Next 16+). Review those rules for soft navigation and direct
          entry, and test open, close/back, and reload with that configuration
          enabled. This is separate from SSGOI’s animation middleware.
        </p>
      </Section>

      <Section title="A production tree">
        <p className={`mt-4 ${measure} ${prose}`}>
          Comwit runs this on a Next.js App Router tree with tabs, full-page
          details, a persistent project workspace and intercepted modals. Route
          groups and parallel slots decide which layouts stay mounted; one
          provider observes them all.
        </p>
        <CodeBlock
          className="mt-6"
          language="text"
          code={`app/
└─ (app)/
   ├─ layout.tsx                         # one provider + depth-0 boundary
   ├─ (top-level)/
   │  ├─ layout.tsx                      # depth-1 boundary + BottomNav + @modal
   │  ├─ projects/page.tsx               # /projects
   │  ├─ showcase/page.tsx               # /showcase
   │  ├─ comwit-log/page.tsx             # /comwit-log
   │  ├─ profile/page.tsx                # /profile
   │  └─ @modal/
   │     ├─ default.tsx                  # no modal
   │     └─ (.)p/[id]/page.tsx           # soft /p/42 over the current tab
   └─ (detail)/
      ├─ p/[id]/page.tsx                 # direct /p/42, full page
      └─ projects/[id]/
         ├─ layout.tsx                   # persistent project header + tabs
         ├─ page.tsx                     # /projects/acme
         ├─ members/page.tsx
         ├─ board/
         │  ├─ layout.tsx
         │  └─ @taskSidebar/...          # parallel task panel
         └─ docs/
            ├─ layout.tsx
            ├─ [docId]/page.tsx
            └─ @docSidebar/...          # parallel document panel`}
        />
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`layouts: [
  { paths: ["/projects", "/showcase", "/comwit-log", "/profile"] },
  { paths: "/projects/:id/**" },   // one instance per project
]`}
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          Large tree, small ownership: one provider, one depth-0 boundary, one
          depth-1 boundary for top-level content. Everything under{" "}
          <code className={inlineCode}>/projects/acme</code> shares one depth-0
          instance, so the project header and its loaded state survive while the
          id keeps following the full route. The immediate project child has no
          boundary on purpose — overview → docs is a child swap, not a page
          transition.
        </p>

        <Figure
          src="/docs/diagrams/comwit-persistent-routing.svg"
          alt="Comwit route ownership: one SSGOI provider contains an outer app-shell boundary, an inner main-content boundary for top-level tabs, persistent bottom navigation, project shells keyed by project base path, and intercepted modals as parallel siblings"
          width={1440}
          height={900}
          unoptimized
          caption="The four navigation cases differ only in which boundary key changes."
        />

        <DocsTable
          minWidth="760px"
          head={[
            "Case",
            "Browser URL",
            "Rendered path",
            "Depth-0 key",
            "Result",
          ]}
          rows={[
            [
              "Top-level tab",
              <span key="u" className={mono}>
                /projects
              </span>,
              <span key="r" className={mono}>
                /projects
              </span>,
              "top-level scope",
              "Shell persists; the depth-1 boundary owns the motion.",
            ],
            [
              "Generic detail",
              <span key="u" className={mono}>
                /p/42
              </span>,
              <span key="r" className={mono}>
                /p/42
              </span>,
              <span key="k" className={mono}>
                /p/42
              </span>,
              "Key changes; the tab shell and nav leave together.",
            ],
            [
              "Same-project child",
              <span key="u" className={mono}>
                /projects/acme/docs
              </span>,
              <span key="r" className={mono}>
                /projects/acme/docs
              </span>,
              "project scope, acme",
              "Project shell persists; its child swaps immediately.",
            ],
            [
              "Soft intercepted modal",
              <span key="u" className={mono}>
                /p/42
              </span>,
              <span key="r" className={mono}>
                /projects
              </span>,
              "top-level scope",
              "Background stays mounted; the modal renders above it.",
            ],
          ]}
        />
      </Section>

      <Section
        title="When it goes wrong"
        lead="Every symptom below is the wrong lifetime, not a wrong transition."
      >
        <ul className={`mt-6 ${measure} flex flex-col gap-4 ${prose}`}>
          <li>
            <strong className="font-medium text-ink">
              BottomNav moves on tab → tab.
            </strong>{" "}
            It is inside the depth-1 boundary, or the tabs are missing from the
            top-level scope in <code className={inlineCode}>layouts</code>.
          </li>
          <li>
            <strong className="font-medium text-ink">
              BottomNav stays on a detail page.
            </strong>{" "}
            It sits outside the depth-0 boundary. Move it inside the one that
            changes when you leave the tab group.
          </li>
          <li>
            <strong className="font-medium text-ink">
              Opening a modal animates the background.
            </strong>{" "}
            The framework returns only the URL pathname. Return{" "}
            <code className={inlineCode}>renderedPath</code> from the selected
            segments, and render the modal slot outside the boundaries.
          </li>
          <li>
            <strong className="font-medium text-ink">
              Project tabs replay the full page.
            </strong>{" "}
            A boundary wraps the project child, or the project scope uses{" "}
            <code className={inlineCode}>/projects/**</code> where it needs{" "}
            <code className={inlineCode}>/projects/:id/**</code>.
          </li>
          <li>
            <strong className="font-medium text-ink">
              The wrong scope wins.
            </strong>{" "}
            Siblings are first-match: put narrower scopes before broad ones, or
            exclude them with <code className={inlineCode}>except</code>.
          </li>
        </ul>
      </Section>

      <Section title="Rules that generalize">
        <ul className={`mt-6 ${measure} flex flex-col gap-3 ${prose}`}>
          <li>
            One provider per navigation surface. Nested lifetimes need nested
            boundaries, not nested providers.
          </li>
          <li>
            Mirror your layout files in{" "}
            <code className={inlineCode}>layouts</code>: one scope per layout
            that should stay mounted, nested the same way.
          </li>
          <li>
            The id is always the route path, so route rules keep matching while
            keys are shared.
          </li>
        </ul>

        <p className={`mt-8 ${measure} ${prose}`}>
          Copy-ready layouts and a checklist live in{" "}
          <a
            href={LLMS_PATTERN}
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            /llms/complex-routing.txt
          </a>
          . For a working example, see the{" "}
          <a
            href="https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs"
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            Next.js template
          </a>
          .
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/boundaries",
            title: "Route boundaries",
            body: "What the key and the id each decide on one boundary.",
          },
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Match the ids these boundaries carry.",
          },
          {
            href: "/docs/troubleshooting",
            title: "Troubleshooting",
            body: "Nothing moves, or the wrong region moves.",
          },
        ]}
      />
    </div>
  );
}
