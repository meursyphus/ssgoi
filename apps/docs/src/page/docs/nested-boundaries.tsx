import Image from "next/image";
import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

const LLMS_PATTERN = "https://ssgoi.dev/llms/complex-routing.txt";

export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        The quick start uses the pathname as both a React key and a transition
        id. Keep that version until part of the routed UI must survive a
        navigation. Then split the page into the few lifetimes the product
        actually needs.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-neutral-100">
        Start with one persistent bottom nav
      </h2>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-neutral-400">
        <li>
          <code className="font-mono text-neutral-300">/</code>,{" "}
          <code className="font-mono text-neutral-300">/collections</code>,{" "}
          <code className="font-mono text-neutral-300">/create</code> — tab
          pages. All share one bottom nav.
        </li>
        <li>
          <code className="font-mono text-neutral-300">/photo/[id]</code> —
          detail page. No nav.
        </li>
      </ul>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        The desired motion is specific: tab → tab transitions the content while
        the nav stays perfectly still. Tab → detail sends the whole shell away,
        nav included. Detail → tab brings it back.
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        With{" "}
        <code className="font-mono text-neutral-300">key={"{pathname}"}</code>{" "}
        at the root, React remounts everything on every navigation. The nav
        therefore animates even on tab → tab.
      </p>

      <figure className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0e0b08]">
        <Image
          src="/docs/diagrams/persistent-bottom-nav.png"
          alt="Two mobile navigation cases: tab-to-tab moves only inner content while the bottom navigation stays fixed; tab-to-detail moves the entire shell including the bottom navigation"
          width={1586}
          height={992}
          priority
          className="h-auto w-full"
          sizes="(min-width: 1024px) 768px, 100vw"
        />
        <figcaption className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] text-xs leading-relaxed text-neutral-400 sm:grid-cols-2">
          <span className="bg-[#0e0b08] px-4 py-3">
            <strong className="font-medium text-neutral-200">Tab → tab:</strong>{" "}
            inner content changes; BottomNav remains mounted.
          </span>
          <span className="bg-[#0e0b08] px-4 py-3">
            <strong className="font-medium text-neutral-200">
              Tab → detail:
            </strong>{" "}
            the outer shell leaves with BottomNav.
          </span>
        </figcaption>
      </figure>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        A boundary makes two independent decisions
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        The simple example happens to use the pathname twice. A persistent
        layout cannot:
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <code className="font-mono text-sm text-orange-400">key</code>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Controls the React lifetime. Change it when this region should
            unmount and a new routed region should enter. SSGOI observes that
            real DOM lifecycle.
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
          <code className="font-mono text-sm text-orange-400">
            data-ssgoi-transition
          </code>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Identifies the logical route. Keep it equal to the route that config
            rules should match, even when several routes share one React key.
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Production case: one app, four route lifetimes
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Comwit uses the same idea in a real Next.js App Router tree. It has
        top-level tabs, full-page details, a persistent project workspace, and
        soft intercepted modals. Route groups and parallel slots decide which
        layouts stay mounted; one SSGOI provider observes those lifetimes.
      </p>
      <CodeBlock
        className="mt-5"
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
            └─ @docSidebar/...           # parallel document panel`}
      />
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-400">
        The tree is large, but the transition ownership is small:{" "}
        <strong className="font-medium text-neutral-200">one provider</strong>,{" "}
        one outer boundary, and one inner boundary for top-level content. The
        parallel slots remain owned by the layouts that render them.
      </p>

      <figure className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0e0b08]">
        <Image
          src="/docs/diagrams/comwit-persistent-routing.svg"
          alt="Comwit route ownership: one SSGOI provider contains an outer app-shell boundary, an inner main-content boundary for top-level tabs, persistent bottom navigation, project shells keyed by project base path, and intercepted modals as parallel siblings"
          width={1440}
          height={900}
          unoptimized
          className="h-auto w-full"
          sizes="(min-width: 1024px) 768px, 100vw"
        />
        <figcaption className="border-t border-white/[0.06] bg-black/20 px-5 py-4 text-xs leading-relaxed text-neutral-400">
          The four navigation cases differ only in which boundary key changes.
          Route ids continue to match the real route throughout.
        </figcaption>
      </figure>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        One provider, two nested boundaries
      </h2>
      <CodeBlock
        className="mt-5"
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
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-400">
        If parent and child boundaries leave in the same DOM mutation, SSGOI
        uses the outer changed boundary. A child owns the transition only while
        its parent remains mounted. That rule is what makes the same nesting
        work for both tab and detail navigation.
      </p>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Resolve the route owned by the slot
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        <code className="font-mono text-neutral-300">usePathname()</code> tells
        you the browser URL. Usually that is enough. During a soft intercepted
        modal, however, the URL becomes{" "}
        <code className="font-mono text-neutral-300">/p/42</code> while the
        background <code className="font-mono text-neutral-300">children</code>{" "}
        slot is still rendering{" "}
        <code className="font-mono text-neutral-300">/projects</code>.
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        The background boundary must therefore derive its id and key from{" "}
        <code className="font-mono text-orange-400">
          useSelectedLayoutSegments(&quot;children&quot;)
        </code>
        . The pathname remains a fallback for a normal route where the slot
        gives no segments.
      </p>
      <CodeBlock
        className="mt-5"
        language="tsx"
        code={`const pathname = usePathname() ?? "";
const segments = useSelectedLayoutSegments("children");
const { id, key } = resolveBoundary(name, { pathname, segments });

return (
  <div key={key} data-ssgoi-transition={id}>
    {children}
  </div>
);`}
      />

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        The route matrix
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Read each row as a separate lifetime decision. The route id stays
        truthful; the key is shared only for the UI that should persist.
      </p>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="min-w-[880px] w-full border-collapse text-left text-xs leading-relaxed text-neutral-400">
          <thead className="bg-white/[0.035] text-neutral-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Case
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Browser URL
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                children slot
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                app-shell id / key
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            <tr>
              <th
                scope="row"
                className="px-4 py-3 font-medium text-neutral-200"
              >
                Top-level tab
              </th>
              <td className="px-4 py-3 font-mono">/projects</td>
              <td className="px-4 py-3 font-mono">(top-level), projects</td>
              <td className="px-4 py-3 font-mono">
                /projects / ssgoi-app-main
              </td>
              <td className="px-4 py-3">
                Outer shell persists; the inner tab key owns tab motion.
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-4 py-3 font-medium text-neutral-200"
              >
                Generic detail
              </th>
              <td className="px-4 py-3 font-mono">/p/42</td>
              <td className="px-4 py-3 font-mono">(detail), p, 42</td>
              <td className="px-4 py-3 font-mono">/p/42 / /p/42</td>
              <td className="px-4 py-3">
                Outer key changes; the tab shell and nav leave together.
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-4 py-3 font-medium text-neutral-200"
              >
                Same-project child
              </th>
              <td className="px-4 py-3 font-mono">/projects/acme/docs</td>
              <td className="px-4 py-3 font-mono">
                (detail), projects, acme, docs
              </td>
              <td className="px-4 py-3 font-mono">
                /projects/acme/docs / /projects/acme
              </td>
              <td className="px-4 py-3">
                Project shell persists; its child swaps immediately.
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-4 py-3 font-medium text-neutral-200"
              >
                Soft intercepted modal
              </th>
              <td className="px-4 py-3 font-mono">/p/42</td>
              <td className="px-4 py-3 font-mono">(top-level), projects</td>
              <td className="px-4 py-3 font-mono">
                /projects / ssgoi-app-main
              </td>
              <td className="px-4 py-3">
                Background stays mounted; the parallel modal renders above it.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Why project children change immediately
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Every route below{" "}
        <code className="font-mono text-neutral-300">/projects/acme</code>{" "}
        shares the outer key{" "}
        <code className="font-mono text-neutral-300">/projects/acme</code>. The
        project header, tabs, state, and loaded context remain mounted. Its
        transition id still follows the full active route, such as{" "}
        <code className="font-mono text-neutral-300">/projects/acme/docs</code>.
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        There is intentionally no marked boundary around the immediate project
        child. Switching from overview to docs is a normal Next.js child swap,
        not a page transition. This keeps a dense workspace calm and avoids
        replaying the entire shell. If the product later needs animated project
        tabs, add one inner boundary around only the child content; do not add a
        second provider.
      </p>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Failure modes reveal the wrong lifetime
      </h2>
      <ul className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-400">
        <li>
          <strong className="font-medium text-neutral-200">
            BottomNav moves on tab → tab.
          </strong>{" "}
          It is inside the changing inner boundary, or the outer boundary uses
          the raw pathname as its key. Move the nav outside{" "}
          <code className="font-mono text-neutral-300">main-content</code> and
          share the top-level outer key.
        </li>
        <li>
          <strong className="font-medium text-neutral-200">
            BottomNav remains on a detail page.
          </strong>{" "}
          It sits outside the outer app-shell. The nav must be inside the
          boundary that changes when leaving the top-level route group.
        </li>
        <li>
          <strong className="font-medium text-neutral-200">
            Opening a modal resets or animates the background.
          </strong>{" "}
          The background was keyed from{" "}
          <code className="font-mono text-neutral-300">usePathname()</code>.
          Resolve the owned{" "}
          <code className="font-mono text-neutral-300">children</code> slot and
          keep <code className="font-mono text-neutral-300">@modal</code> as a
          sibling.
        </li>
        <li>
          <strong className="font-medium text-neutral-200">
            Route rules stop matching after keys are shared.
          </strong>{" "}
          The shared key was also used as the transition id. Keep{" "}
          <code className="font-mono text-neutral-300">ssgoi-app-main</code> as
          a React lifetime key only; the data attribute must remain the real
          route.
        </li>
        <li>
          <strong className="font-medium text-neutral-200">
            Project tabs replay a full-page transition.
          </strong>{" "}
          A changing boundary was placed around the project child or the outer
          key uses the full pathname. Key the shell to the project base path and
          leave the immediate child unmarked when the swap should be instant.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        The rules that generalize
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          Use one provider for one navigation surface. Nested lifetimes need
          nested boundaries, not nested providers.
        </li>
        <li>
          Reuse a key only while that exact persistent shell should stay
          mounted; return a different key when navigation leaves it.
        </li>
        <li>
          Keep the transition id equal to the logical route owned by the
          boundary, even when several routes share one React key.
        </li>
        <li>
          Let route groups and parallel slots describe layout ownership. Keep
          the name-to-key resolver centralized instead of duplicating pathname
          tests across layouts.
        </li>
      </ul>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-500">
        Copy-ready resolver, layouts, route matrix, and verification checklist:{" "}
        <a
          href={LLMS_PATTERN}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          /llms/complex-routing.txt
        </a>
        . For a smaller working example, see the{" "}
        <Link
          href="/demo/google-photos"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Google Photos demo
        </Link>{" "}
        or start from the{" "}
        <a
          href="https://github.com/meursyphus/ssgoi/tree/HEAD/templates/nextjs"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Next.js template
        </a>
        .
      </p>
    </div>
  );
}
