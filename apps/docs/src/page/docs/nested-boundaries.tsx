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
        uses the pathname as both the React key and the transition id, so every
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
          With <code className={inlineCode}>key={"{pathname}"}</code> at the
          root, React remounts everything on every navigation, so the nav
          animates on tab → tab too.
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
          The React <code className={inlineCode}>key</code> decides whether the
          DOM node is destroyed and recreated, and SSGOI reacts to the framework
          destroying and rebuilding the routed node.{" "}
          <code className={inlineCode}>data-ssgoi-transition</code> is the route
          id used to pair the leaving page with the arriving one and to match
          your config rules.
        </p>
        <div className="mt-6">
          <Note>
            Changing only the attribute on a still-mounted node produces no
            transition: the engine registers each element once and never
            re-reads it as a new arrival. The id itself is read fresh at the
            moment the page leaves, so a mid-life change still labels the way
            out — it just does not start anything. Change the key when you want
            motion; keep the attribute equal to the logical route so rules keep
            matching.
          </Note>
        </div>
      </Section>

      <Section title="One provider, two nested boundaries">
        <CodeBlock
          className="mt-6"
          language="text"
          code={`<Ssgoi config={config}>                         one provider
└─ app-shell boundary                              outer lifetime
   ├─ top-level layout
   │  ├─ main-content boundary                     inner lifetime
   │  │  └─ active tab page
   │  ├─ BottomNav                                 outside inner, inside outer
   │  └─ @modal                                    parallel sibling
   └─ detail or project layout

tab → tab       : app-shell key stays · main-content key changes · nav stays
tab → detail    : app-shell key changes · the whole top-level shell leaves
detail → tab    : app-shell key changes · the shell re-enters with the nav`}
        />
        <p className={`mt-6 ${measure} ${prose}`}>
          When a parent and a child boundary leave in the same DOM mutation, the
          outer one owns the transition and the child is cleaned up silently.
          There is nothing else it could do: the node the framework detached is
          the outer one, and the child went with it, so no separate node is left
          to animate. Arrivals resolve the same way — inside one mount batch
          only the outermost boundary plays an entrance.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          The child therefore owns the motion only while its parent stays
          mounted, and that is what lets one nesting serve both tab and detail
          navigation.
        </p>
      </Section>

      <Section title="Resolve the route the slot owns">
        <p className={`mt-4 ${measure} ${prose}`}>
          <code className={inlineCode}>usePathname()</code> is usually enough.
          During a soft intercepted modal it is not: the URL becomes{" "}
          <code className={inlineCode}>/p/42</code> while the background{" "}
          <code className={inlineCode}>children</code> slot still renders{" "}
          <code className={inlineCode}>/projects</code>. Derive the background
          boundary&apos;s id and key from{" "}
          <code className={inlineCode}>useSelectedLayoutSegments()</code>, as
          supplied to the adapter’s resolve callback. For nested layouts, pass
          the owning layout’s base path to selectedSegmentsToPath.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          The adapter reads the hooks and supplies Suspense. Use a stable
          routeKey when a layout owns the shell, or define one resolve policy
          that returns its logical id and lifetime key. Function props belong in
          a client component. The complete pattern is linked below.
        </p>
        <CodeBlock
          className="mt-6"
          language="tsx"
          code={`import {
  SsgoiRouteBoundary,
  selectedSegmentsToPath,
} from "@ssgoi/react/nextjs";

<SsgoiRouteBoundary
  resolve={({ selectedSegments }) => ({
    id: selectedSegmentsToPath(selectedSegments),
    key: selectedSegments.includes("(top-level)")
      ? "app-shell"
      : selectedSegmentsToPath(selectedSegments),
  })}
>
  {children}
</SsgoiRouteBoundary>`}
        />
      </Section>

      <Section title="Interception and middleware / proxy">
        <p className={`mt-4 ${measure} ${prose}`}>
          The boundary controls DOM lifetime. Your app still owns intercepting
          route files, parallel slot fallbacks, and any redirects or rewrites in
          middleware.ts (Next 13–15) or proxy.ts (Next 16+). Review those rules
          for soft navigation and direct entry, preserve Next’s request headers,
          and test open, close/back, and reload with that configuration enabled.
          Ordinary navigation needs no extra middleware. This is separate from
          SSGOI’s animation middleware. See the agent guide for the short
          checklist.
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
   ├─ layout.tsx                         # one provider + outer app-shell
   ├─ (top-level)/
   │  ├─ layout.tsx                      # inner main-content + BottomNav + @modal
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
        <p className={`mt-6 ${measure} ${prose}`}>
          Large tree, small ownership: one provider, one outer boundary, one
          inner boundary for top-level content.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Everything under <code className={inlineCode}>/projects/acme</code>{" "}
          shares the outer key{" "}
          <code className={inlineCode}>/projects/acme</code>, so the project
          header and its loaded state survive while the id keeps following the
          full route. The immediate project child is left unmarked on purpose —
          overview → docs is a child swap, not a page transition.
        </p>

        <Figure
          src="/docs/diagrams/comwit-persistent-routing.svg"
          alt="Comwit route ownership: one SSGOI provider contains an outer app-shell boundary, an inner main-content boundary for top-level tabs, persistent bottom navigation, project shells keyed by project base path, and intercepted modals as parallel siblings"
          width={1440}
          height={900}
          unoptimized
          caption="The four navigation cases differ only in which boundary key changes."
        />

        <p className={`mt-8 ${measure} ${prose}`}>
          Read each row as one lifetime decision. The id stays truthful; the key
          is shared only for the UI that should persist.
        </p>
        <DocsTable
          minWidth="880px"
          head={[
            "Case",
            "Browser URL",
            "children slot",
            "Shell id / key",
            "Result",
          ]}
          rows={[
            [
              "Top-level tab",
              <span key="u" className={mono}>
                /projects
              </span>,
              <span key="s" className={mono}>
                (top-level), projects
              </span>,
              <span key="k" className={mono}>
                /projects / ssgoi-app-main
              </span>,
              "Outer shell persists; the inner tab key owns the motion.",
            ],
            [
              "Generic detail",
              <span key="u" className={mono}>
                /p/42
              </span>,
              <span key="s" className={mono}>
                (detail), p, 42
              </span>,
              <span key="k" className={mono}>
                /p/42 / /p/42
              </span>,
              "Outer key changes; the tab shell and nav leave together.",
            ],
            [
              "Same-project child",
              <span key="u" className={mono}>
                /projects/acme/docs
              </span>,
              <span key="s" className={mono}>
                (detail), projects, acme, docs
              </span>,
              <span key="k" className={mono}>
                /projects/acme/docs / /projects/acme
              </span>,
              "Project shell persists; its child swaps immediately.",
            ],
            [
              "Soft intercepted modal",
              <span key="u" className={mono}>
                /p/42
              </span>,
              <span key="s" className={mono}>
                (top-level), projects
              </span>,
              <span key="k" className={mono}>
                /projects / ssgoi-app-main
              </span>,
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
            It is inside the inner boundary, or the outer boundary is keyed to
            the raw pathname.
          </li>
          <li>
            <strong className="font-medium text-ink">
              BottomNav stays on a detail page.
            </strong>{" "}
            It sits outside the outer boundary. Move it inside the one that
            changes when you leave the tab group.
          </li>
          <li>
            <strong className="font-medium text-ink">
              Opening a modal animates the background.
            </strong>{" "}
            The background was keyed from{" "}
            <code className={inlineCode}>usePathname()</code>. Key it from the{" "}
            <code className={inlineCode}>children</code> slot instead.
          </li>
          <li>
            <strong className="font-medium text-ink">
              Route rules stop matching once keys are shared.
            </strong>{" "}
            The shared key leaked into the id. Keep{" "}
            <code className={inlineCode}>ssgoi-app-main</code> as a React key
            only; the attribute stays the real route.
          </li>
          <li>
            <strong className="font-medium text-ink">
              Project tabs replay the full page.
            </strong>{" "}
            A changing boundary wraps the project child, or the shell key uses
            the full pathname instead of the project base path.
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
            Reuse a key only while that exact shell should stay mounted; return
            a different key the moment navigation leaves it.
          </li>
          <li>
            Keep the id equal to the route the boundary owns, even when several
            routes share one key.
          </li>
          <li>
            Resolve name → key in one place rather than repeating pathname tests
            across layouts.
          </li>
        </ul>

        <p className={`mt-8 ${measure} ${prose}`}>
          A copy-ready resolver, layouts and checklist live in{" "}
          <a
            href={LLMS_PATTERN}
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            /llms/complex-routing.txt
          </a>
          . For a smaller working example, see the{" "}
          <Link href="/demo/google-photos" className={link}>
            Google Photos demo
          </Link>{" "}
          or the{" "}
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
