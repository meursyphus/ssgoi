import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

const LLMS_PATTERN = "https://ssgoi.dev/llms/bottom-nav.txt";

export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        A changed boundary key makes React unmount the old routed region and
        mount a new one.{" "}
        <code className="font-mono text-neutral-200">
          data-ssgoi-transition
        </code>{" "}
        gives SSGOI the route id used by transition config. Put boundaries in
        layouts that own those regions, not in every page.
      </p>

      <CodeBlock
        className="mt-8"
        code={`// app/ssgoi-route-boundary.tsx
"use client";

import { type ReactNode } from "react";
import {
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";

type BoundaryName = "app-shell" | "main-content" | "project-content";

function isRouteGroup(segment: string) {
  return segment.startsWith("(") && segment.endsWith(")");
}

function normalizeSegment(segment: string) {
  return segment
    .replace("(...)", "")
    .replace("(..)", "")
    .replace("(.)", "");
}

function pathFromSegments(segments: string[]) {
  const path = segments
    .filter((segment) => !isRouteGroup(segment))
    .map(normalizeSegment)
    .filter(Boolean)
    .join("/");

  return path ? "/" + path : null;
}

function resolveBoundary(
  name: BoundaryName,
  pathname: string,
  segments: string[],
) {
  const ownedRoute = pathFromSegments(segments) ?? pathname;

  if (name === "app-shell") {
    const routeGroup = segments.find(isRouteGroup);
    if (routeGroup === "(main)") {
      return { id: ownedRoute, key: "main-shell" };
    }

    const project = ownedRoute.match(/^\\/projects\\/[^/]+/)?.[0];
    return { id: ownedRoute, key: project ?? ownedRoute };
  }

  if (name === "project-content") {
    const project = pathname.match(/^\\/projects\\/[^/]+/)?.[0];
    const child = pathFromSegments(segments);
    const id = project && child ? project + child : project ?? ownedRoute;
    return { id, key: id };
  }

  return { id: ownedRoute, key: ownedRoute };
}

export function SsgoiRouteBoundary({
  children,
  name,
}: {
  children: ReactNode;
  name: BoundaryName;
}) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments("children");
  const boundary = resolveBoundary(name, pathname, segments);

  return (
    <div key={boundary.key} data-ssgoi-transition={boundary.id}>
      {children}
    </div>
  );
}`}
      />

      <ul className="mt-8 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          Layout files pass a semantic name such as{" "}
          <code className="font-mono text-neutral-300">app-shell</code>,{" "}
          <code className="font-mono text-neutral-300">main-content</code>, or{" "}
          <code className="font-mono text-neutral-300">project-content</code>.
        </li>
        <li>
          The central resolver reuses a key only while that named shell should
          remain mounted, and returns a different key when it should leave.
        </li>
        <li>
          A constant key is safe only when the router itself unmounts the
          boundary outside that route layout.
        </li>
        <li>
          The route id still identifies the route rendered by that boundary,
          even when several routes share its React key.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Bottom navigation
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Use route groups to separate main screens from fullscreen details. One
        named app-shell boundary spans both groups; the main layout owns only
        its changing content boundary and bottom nav.
      </p>

      <CodeBlock
        className="mt-6"
        code={`app/
  layout.tsx                 # one <Ssgoi> + named app-shell boundary
  (main)/
    layout.tsx               # content boundary + bottom nav
    page.tsx                 # /
    collections/page.tsx     # /collections
    create/page.tsx          # /create
  (detail)/
    photo/[id]/page.tsx`}
      />

      <CodeBlock
        className="mt-6"
        code={`// app/layout.tsx — inside the single <Ssgoi>
<SsgoiRouteBoundary name="app-shell">
  {children}
</SsgoiRouteBoundary>

// app/(main)/layout.tsx
export default function MainLayout({ children }) {
  return (
    <>
      <SsgoiRouteBoundary name="main-content">
        {children}
      </SsgoiRouteBoundary>
      <BottomNav />
    </>
  );
}
`}
      />

      <ul className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-400">
        <li>
          <code className="font-mono text-orange-400">tab → tab</code>: the
          common app key stays <code>main-shell</code>; only the inner content
          boundary remounts. The nav stays still.
        </li>
        <li>
          <code className="font-mono text-orange-400">tab → detail</code>: the
          common app key changes to the detail id. The nav is inside that
          boundary and leaves with the page; no duplicate detail boundary is
          needed.
        </li>
        <li>
          When nested boundaries leave together, SSGOI uses the outer changed
          boundary. When only the child changes, it uses the child.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Sliding tabs inside a layout
      </h2>

      <CodeBlock
        className="mt-6"
        code={`const PROJECT_PATHS = [
  "/projects/acme/overview",
  "/projects/acme/docs",
  "/projects/acme/activity",
];

const config = {
  transitions: [
    {
      ordered: PROJECT_PATHS,
      transition: slide(),
    },
  ],
};

// Common app layout
<SsgoiRouteBoundary name="app-shell">
  {children}
</SsgoiRouteBoundary>

export default function ProjectLayout({ children }) {
  return (
    <>
      <ProjectHeader />
      <ProjectTabs />
      <SsgoiRouteBoundary name="project-content">
        {children}
      </SsgoiRouteBoundary>
    </>
  );
}`}
      />

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Intercepting modals
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        During a soft interception, <code>usePathname()</code> points at the
        modal URL while the background <code>children</code> slot is unchanged.
        Resolve the background boundary id and key from{" "}
        <code>useSelectedLayoutSegments(&quot;children&quot;)</code>. In the
        layout that owns <code>@modal</code>,{" "}
        <code>useSelectedLayoutSegment(&quot;modal&quot;) !== null</code> is an
        explicit active-modal check. Direct entry to the same URL selects the
        detail children slot, so it receives the detail key instead.
      </p>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        Keep one provider and one transition config. Boundary-name resolvers
        describe routed-region ownership; they do not belong in{" "}
        <code className="font-mono text-neutral-300">SsgoiConfig</code>. See the{" "}
        <Link
          href="/demo/google-photos"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Google Photos demo
        </Link>{" "}
        or the concise agent guide at{" "}
        <a
          href={LLMS_PATTERN}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          /llms/bottom-nav.txt
        </a>
        .
      </p>
    </div>
  );
}
