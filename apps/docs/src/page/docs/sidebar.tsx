"use client";

import { useId, useState, type ComponentType } from "react";
import { ChevronRight, Menu, Monitor, Smartphone } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/lib/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import {
  AngularMark,
  NextMark,
  NuxtMark,
  QwikMark,
  ReactRouterMark,
  SolidStartMark,
  SvelteKitMark,
  TanStackRouterMark,
} from "@/components/router-logos";
import { SiteLogo } from "@/components/site-logo";
import {
  DOCS_NAV,
  findDocsLocation,
  type DocsNavIcon,
  type DocsNavNode,
  type DocsNavPlatform,
} from "./nav";

const ICONS: Record<DocsNavIcon, ComponentType<{ className?: string }>> = {
  nextjs: NextMark,
  "react-router": ReactRouterMark,
  "tanstack-router": TanStackRouterMark,
  sveltekit: SvelteKitMark,
  nuxt: NuxtMark,
  solidstart: SolidStartMark,
  qwik: QwikMark,
  angular: AngularMark,
};

/**
 * Two glyphs rather than lucide's combined monitor-and-phone mark: at 14px the
 * combined one collapses into a smudge, and "both" has to read at a glance.
 */
const PLATFORMS: Record<
  DocsNavPlatform,
  { icons: ComponentType<{ className?: string }>[]; label: string }
> = {
  web: { icons: [Monitor], label: "Built for web" },
  mobile: { icons: [Smartphone], label: "Built for mobile" },
  both: { icons: [Monitor, Smartphone], label: "Built for web and mobile" },
};

function normalize(value: string) {
  return value.length > 1 ? value.replace(/\/+$/, "") : value;
}

function isCurrentPage(node: DocsNavNode, pathname: string): boolean {
  return (
    node.href !== undefined && normalize(node.href) === normalize(pathname)
  );
}

/**
 * Every branch is rendered open. There is no disclosure control: a docs tree
 * this size is faster to scan than to operate.
 */
function DocsNavItem({
  node,
  pathname,
  depth,
  reserveIcon,
  touchFriendly,
  onNavigate,
}: {
  node: DocsNavNode;
  pathname: string;
  depth: number;
  reserveIcon: boolean;
  touchFriendly: boolean;
  onNavigate?: () => void;
}) {
  const current = isCurrentPage(node, pathname);
  const Icon = node.icon ? ICONS[node.icon] : undefined;
  const platform = node.platform ? PLATFORMS[node.platform] : undefined;

  const body = (
    <>
      {reserveIcon &&
        (Icon ? (
          <Icon className="h-4 w-4 shrink-0" />
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden />
        ))}
      <span className="min-w-0 truncate">{node.title}</span>
      {platform && (
        <span
          title={platform.label}
          className={[
            "ml-auto flex shrink-0 items-center gap-1 transition-colors",
            current
              ? "text-ink-dim"
              : "text-ink-faint/70 group-hover:text-ink-dim",
          ].join(" ")}
        >
          {platform.icons.map((PlatformIcon, index) => (
            <PlatformIcon key={index} className="h-3.5 w-3.5" aria-hidden />
          ))}
          <span className="sr-only">{platform.label}</span>
        </span>
      )}
    </>
  );

  const className = [
    "group relative flex min-w-0 items-center gap-2.5 rounded-md px-3 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
    touchFriendly ? "min-h-11" : "py-1.5",
    current
      ? "bg-raised font-medium text-ink"
      : "text-ink-dim hover:bg-raised/60 hover:text-ink",
  ].join(" ");

  // Nested items carry the rail on the row itself rather than on the list, so
  // the current page can light up its own segment of it. A separate indicator
  // bar would draw a second vertical line a few pixels from the first.
  const nested = depth > 0;
  const itemClassName = nested
    ? `border-l pl-2 ${current ? "border-brand" : "border-line"}`
    : undefined;

  return (
    <li className={itemClassName}>
      {node.href ? (
        <Link
          href={node.href}
          aria-current={current ? "page" : undefined}
          onClick={onNavigate}
          className={className}
        >
          {current && !nested && (
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand"
            />
          )}
          {body}
        </Link>
      ) : (
        <span className={className}>{body}</span>
      )}

      {node.children && node.children.length > 0 && (
        <DocsNavList
          nodes={node.children}
          pathname={pathname}
          depth={depth + 1}
          touchFriendly={touchFriendly}
          onNavigate={onNavigate}
        />
      )}
    </li>
  );
}

function DocsNavList({
  nodes,
  pathname,
  depth,
  touchFriendly,
  onNavigate,
  labelledBy,
}: {
  nodes: readonly DocsNavNode[];
  pathname: string;
  depth: number;
  touchFriendly: boolean;
  onNavigate?: () => void;
  labelledBy?: string;
}) {
  const reserveIcon = nodes.some((node) => node.icon);

  return (
    <ul
      aria-labelledby={labelledBy}
      className={["flex flex-col", depth > 0 ? "ml-3 mt-0.5" : "mt-1.5"].join(
        " ",
      )}
    >
      {nodes.map((node) => (
        <DocsNavItem
          key={node.id}
          node={node}
          pathname={pathname}
          depth={depth}
          reserveIcon={reserveIcon}
          touchFriendly={touchFriendly}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}

function DocsNavigation({
  pathname,
  touchFriendly = false,
  onNavigate,
}: {
  pathname: string;
  touchFriendly?: boolean;
  onNavigate?: () => void;
}) {
  const labelId = useId();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-7 text-sm">
      {DOCS_NAV.map((group) => {
        const groupLabelId = `${labelId}-${group.id}`;
        return (
          <section key={group.id} aria-labelledby={groupLabelId}>
            <h2
              id={groupLabelId}
              className="px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-faint"
            >
              {group.label}
            </h2>
            <DocsNavList
              nodes={group.items}
              pathname={pathname}
              depth={0}
              touchFriendly={touchFriendly}
              onNavigate={onNavigate}
              labelledBy={groupLabelId}
            />
          </section>
        );
      })}
    </nav>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  return <DocsNavigation pathname={pathname} />;
}

function DocsMobileNavForPath({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const location = findDocsLocation(pathname);
  // Group over ancestors: "Transitions / Drill" places the page, where the
  // literal trail would only say "Guide / Drill".
  const context = location
    ? `${location.group.label} / ${location.trail[location.trail.length - 1].title}`
    : "Documentation";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-5">
        <SiteLogo className="shrink-0" />
        <span className="h-5 w-px shrink-0 bg-line-strong" aria-hidden />
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 text-left text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
            aria-label={`Open documentation navigation. Current page: ${context}`}
          >
            <Menu aria-hidden className="h-4 w-4 shrink-0 text-ink-faint" />
            <span className="min-w-0 flex-1 truncate">{context}</span>
            <ChevronRight
              aria-hidden
              className="h-4 w-4 shrink-0 text-ink-faint"
            />
          </button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="left"
        className="w-[min(88vw,22rem)] gap-0 border-line-strong bg-canvas p-0 text-ink [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button]:text-ink-dim [&>button]:focus-visible:ring-brand/60"
      >
        <SheetHeader className="border-b border-line px-5 py-5 pr-16">
          <SheetTitle className="text-left text-base text-ink">
            Documentation
          </SheetTitle>
          <SheetDescription className="sr-only">
            Browse SSGOI documentation sections and pages.
          </SheetDescription>
        </SheetHeader>
        <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-6">
          <DocsNavigation
            pathname={pathname}
            touchFriendly
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();

  // This is the only mobile header in docs. The logo provides a direct route
  // home while the rest of the bar opens the documentation navigation.
  // Remounting on navigation closes the drawer even for browser back/forward.
  return (
    <div className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur lg:hidden">
      <DocsMobileNavForPath key={pathname} pathname={pathname} />
    </div>
  );
}
