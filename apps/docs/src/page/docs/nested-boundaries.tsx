import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

const LLMS_PATTERN = "https://ssgoi.dev/llms/bottom-nav.txt";

/**
 * Nested providers — the persistent bottom-nav pattern. Human-readable
 * companion to /llms/bottom-nav.txt; the live example is the Google Photos
 * demo (tab shell keeps the nav still on tab↔tab, drills it out on
 * tab→detail).
 */
export function NestedBoundariesBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        SSGOI animates the{" "}
        <code className="font-mono text-neutral-200">
          data-ssgoi-transition
        </code>{" "}
        boundary element — the whole subtree at once. A bottom tab bar breaks
        that model in two directions: switching tabs it must{" "}
        <em className="not-italic text-neutral-200">stand still</em>, but
        opening a detail screen it must{" "}
        <em className="not-italic text-neutral-200">
          slide away with the page
        </em>
        . One provider can&apos;t do both, so you nest a second one.
      </p>

      <CodeBlock
        className="mt-8"
        code={`// Tab shell — wraps ONLY the tab routes. Detail routes live outside it.
function TabShell({ children }) {
  const pathname = usePathname();
  return (
    // Outer boundary: React key is CONSTANT (never remounts on tab moves),
    // but the attribute keeps tracking the route.
    <div key="tab-shell" data-ssgoi-transition={pathname}>
      <Ssgoi config={tabsConfig}>{/* nested provider */}
        {/* Inner boundary: remounts per tab — the nested provider */}
        {/* runs its transition on the tab content only. */}
        <div key={pathname} data-ssgoi-transition={pathname}>
          {children}
        </div>
      </Ssgoi>
      <BottomNav /> {/* outside the nested root, inside the shell */}
    </div>
  );
}`}
      />

      <ul className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-400">
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-orange-400">
            tab ↔ tab
          </span>
          <span>
            The shell&apos;s key never changes, so it never remounts and the
            outer provider sees nothing. Only the inner boundary swaps — the
            nested provider animates the tab body while the bottom nav (and any
            sticky app bar in the shell) stays perfectly still.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-orange-400">
            tab → detail
          </span>
          <span>
            The whole shell unmounts (the detail route lives outside it). SSGOI
            reads the shell&apos;s attribute at that moment — the actual tab
            path — and pairs it with the detail boundary using the outer config.
            Nav and page drill out together; the detail screen is genuinely
            nav-free.
          </span>
        </li>
      </ul>

      <h2 className="mt-12 text-lg font-semibold text-neutral-100">
        Two configs, two jobs
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        The outer provider owns screen-level moves; the nested provider owns
        only the tab strip. Each boundary registers with its{" "}
        <em className="not-italic text-neutral-300">nearest</em> provider (
        <code className="font-mono text-neutral-300">
          closest(&quot;[data-ssgoi-root]&quot;)
        </code>
        ), so both boundaries can even carry the same path value without
        clashing.
      </p>

      <CodeBlock
        className="mt-6"
        code={`// Outer provider — list ↔ detail, sheets, shared elements.
const config: SsgoiConfig = {
  transitions: [
    drill({ enter: "/c/*", exit: "/collections" }),
    ...sheet({ enter: "/collage", exit: "/create" }),
    hero({ paths: ["/", "/c/*", "/p/*"], type: "fade" }),
  ],
};

// Nested provider — tab ↔ tab only.
const tabsConfig: SsgoiConfig = {
  transitions: [
    ...axis({
      paths: ["/", "/collections", "/create"],
      type: "y",
      variant: "non-directional",
    }),
  ],
};`}
      />

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-500">
        Don&apos;t reach for a nav slot rendered outside the provider instead —
        that keeps the nav on screen (frozen) during detail transitions. The
        double boundary is what lets it leave with the page. See it live in the{" "}
        <Link
          href="/demo/google-photos"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Google Photos demo
        </Link>
        , or hand your agent{" "}
        <a
          href={LLMS_PATTERN}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
        >
          /llms/bottom-nav.txt
        </a>
        .
      </p>
    </div>
  );
}
