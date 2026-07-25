import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

const LLMS_PATTERN = "https://ssgoi.dev/llms/bottom-nav.txt";

export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        The quick start keys everything on the pathname. This page is about the
        day that stops being enough — walked through with the most common case:
        a bottom nav that some pages show and some don&apos;t. It explains what
        you need to achieve; the full implementation lives in the linked pattern
        file and templates.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-neutral-100">
        The situation
      </h2>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-neutral-400">
        <li>
          <code className="font-mono text-neutral-300">/</code>,{" "}
          <code className="font-mono text-neutral-300">/collections</code>,{" "}
          <code className="font-mono text-neutral-300">/create</code> — tab
          pages. All share one common bottom nav.
        </li>
        <li>
          <code className="font-mono text-neutral-300">/photo/[id]</code> —
          detail page. No nav.
        </li>
      </ul>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        The motion you want: tab → tab transitions the content while the nav
        stays perfectly still. Tab → detail sends the whole shell away — nav
        included. Detail → tab brings it back.
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        With{" "}
        <code className="font-mono text-neutral-300">key={"{pathname}"}</code>{" "}
        that&apos;s impossible: the key changes on <em>every</em> navigation,
        React remounts everything under the provider, and the nav animates away
        even on tab → tab.
      </p>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Why a boundary is two decisions
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        A route boundary carries two independent pieces of information, and the
        fix is realizing they don&apos;t have to be the same value:
      </p>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-neutral-400">
        <li>
          <code className="font-mono text-orange-400">key</code> — when does
          this region remount? Its React lifetime. This is what SSGOI observes.
        </li>
        <li>
          <code className="font-mono text-orange-400">id</code> (
          <code className="font-mono text-neutral-300">
            data-ssgoi-transition
          </code>
          ) — which route is this? This is what config rules match.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        The folder structure
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Next.js route groups change layout lifetime without changing URLs —
        which puts the nav in a layout only tab pages share:
      </p>
      <CodeBlock
        className="mt-5"
        language="text"
        code={`app/
  layout.tsx                 # one provider + outer "app-shell" boundary
  (main)/
    layout.tsx               # inner content boundary + the common BottomNav
    page.tsx                 # /
    collections/page.tsx     # /collections
    create/page.tsx          # /create
  (detail)/
    photo/[id]/page.tsx      # /photo/1 — no nav`}
      />

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        What to achieve: a key scope
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        No new API — you scope the <em>key</em> so React&apos;s remounts happen
        exactly where the motion should:
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          The boundary <code className="font-mono text-orange-400">id</code> is
          always the real route.
        </li>
        <li>
          The outer boundary&apos;s{" "}
          <code className="font-mono text-orange-400">key</code> stays constant
          (say{" "}
          <code className="font-mono text-neutral-300">
            &quot;main-shell&quot;
          </code>
          ) while the route is inside{" "}
          <code className="font-mono text-neutral-300">(main)</code> — so tab →
          tab never remounts the shell — and falls back to the pathname outside
          it, so entering or leaving the shell transitions the whole shell, nav
          included.
        </li>
        <li>
          An inner boundary keyed on the pathname sits <em>above</em> the nav
          and owns tab → tab transitions.
        </li>
      </ul>

      <CodeBlock
        className="mt-6"
        language="text"
        code={`┌─ outer boundary (key: "main-shell" inside (main)) ─────┐
│  ┌─ inner boundary (key: pathname) ─────────────────┐  │
│  │  tab page                                        │  │
│  └──────────────────────────────────────────────────┘  │
│  BottomNav (persistent, outside the inner boundary)    │
└────────────────────────────────────────────────────────┘

tab → tab     : inner boundary remounts · nav stays
tab → detail  : outer boundary remounts · nav leaves with it
detail → tab  : outer boundary re-enters with the nav`}
      />

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-400">
        When nested boundaries change in one DOM mutation, SSGOI uses the outer
        changed boundary. A nested boundary owns a transition only while its
        parent remains mounted.
      </p>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        The general rules
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Keep the key logic in one place (a small resolver component that layouts
        call with a semantic name) instead of letting every layout invent its
        own. Whatever shape it takes, it must follow:
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          Reuse a key only while that exact persistent shell should remain
          mounted; return a different key when navigation leaves the shell.
        </li>
        <li>
          A constant key is safe only when the router itself unmounts the
          boundary outside that route layout.
        </li>
        <li>
          The id still identifies the route rendered by that boundary, even when
          several routes share its React key.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        The same scope trick elsewhere
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          <span className="text-neutral-200">
            Sliding tabs under a persistent header
          </span>{" "}
          — the boundary above the header shares one key across the ordered
          routes (e.g. the project base path); the content boundary below it
          keys on the full path. The rule itself is just{" "}
          <code className="font-mono text-neutral-300">
            {"{ ordered: [...], transition: slide() }"}
          </code>
          .
        </li>
        <li>
          <span className="text-neutral-200">Intercepting modals</span> — during
          a soft interception the browser URL points at the modal while the
          background slot is unchanged, so the background boundary must derive
          its id and key from its own slot (
          <code className="font-mono text-neutral-300">
            useSelectedLayoutSegments(&quot;children&quot;)
          </code>
          ), not from the URL. Direct entry to the same URL resolves the detail
          slot and gets a detail key.
        </li>
      </ul>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-500">
        Full implementation — resolver code, modal handling, pitfalls:{" "}
        <a
          href={LLMS_PATTERN}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          /llms/bottom-nav.txt
        </a>
        . See it live in the{" "}
        <Link
          href="/demo/google-photos"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Google Photos demo
        </Link>{" "}
        or clone the{" "}
        <a
          href="https://github.com/meursyphus/ssgoi/tree/main/templates/nextjs"
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
