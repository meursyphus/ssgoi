import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

const LLMS_PATTERN = "https://ssgoi.dev/llms/bottom-nav.txt";

export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        Put boundaries in persistent layouts, not in every page. The boundary
        key controls which region remounts;{" "}
        <code className="font-mono text-neutral-200">
          data-ssgoi-transition
        </code>{" "}
        keeps the real pathname used by your transition config.
      </p>

      <CodeBlock
        className="mt-8"
        code={`"use client";

import { usePathname } from "next/navigation";

export function RouteBoundary({ children, scope = (path) => path }) {
  const pathname = usePathname();

  return (
    <div
      key={scope(pathname)}
      data-ssgoi-transition={pathname}
    >
      {children}
    </div>
  );
}`}
      />

      <ul className="mt-8 space-y-3 text-sm leading-relaxed text-neutral-400">
        <li>
          Return the pathname to remount this boundary on every route change.
        </li>
        <li>
          Return the same key for routes that share one persistent layout.
        </li>
        <li>
          Keep the real pathname in the transition attribute even when the key
          is stable.
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Bottom navigation
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Use route groups to separate tab screens from fullscreen details. The
        tab layout owns the bottom nav.
      </p>

      <CodeBlock
        className="mt-6"
        code={`app/
  layout.tsx                 # one <Ssgoi config={config}>
  (tabs)/
    layout.tsx               # stable shell + bottom nav
    page.tsx                 # /
    collections/page.tsx     # /collections
    create/page.tsx          # /create
  (detail)/
    layout.tsx               # pathname boundary, no nav
    photo/[id]/page.tsx`}
      />

      <CodeBlock
        className="mt-6"
        code={`// app/(tabs)/layout.tsx
export default function TabsLayout({ children }) {
  return (
    <RouteBoundary scope={() => "tabs-shell"}>
      <RouteBoundary>
        {children}
      </RouteBoundary>
      <BottomNav />
    </RouteBoundary>
  );
}

// app/(detail)/layout.tsx
export default function DetailLayout({ children }) {
  return <RouteBoundary>{children}</RouteBoundary>;
}`}
      />

      <ul className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-400">
        <li>
          <code className="font-mono text-orange-400">tab → tab</code>: the
          outer key stays <code>tabs-shell</code>; only the inner pathname
          boundary remounts. The nav stays still.
        </li>
        <li>
          <code className="font-mono text-orange-400">tab → detail</code>: the
          route group exits, so the outer shell leaves. The nav is inside that
          boundary and leaves with the page.
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
        code={`const config = {
  transitions: [
    {
      ordered: [
        "/products/all",
        "/products/electronics",
        "/products/fashion",
      ],
      transition: slide(),
    },
  ],
};

export default function ProductsLayout({ children }) {
  return (
    <RouteBoundary scope={() => "products-layout"}>
      <ProductHeader />
      <ProductTabs />
      <RouteBoundary>{children}</RouteBoundary>
    </RouteBoundary>
  );
}`}
      />

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        Keep one provider and one transition config. Boundary scope functions
        describe layout lifetime only; they do not belong in{" "}
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
