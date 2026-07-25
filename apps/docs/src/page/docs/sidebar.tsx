"use client";

import { useId, useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/lib/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import {
  DOCS_NAV,
  findDocsTrail,
  hasActiveDescendant,
  type DocsNavNode,
} from "./nav";

function isCurrentPage(node: DocsNavNode, pathname: string): boolean {
  const normalize = (value: string) =>
    value.length > 1 ? value.replace(/\/+$/, "") : value;

  return (
    node.href !== undefined && normalize(node.href) === normalize(pathname)
  );
}

function linkClassName({
  current,
  withinCurrentTrail,
  touchFriendly,
}: {
  current: boolean;
  withinCurrentTrail: boolean;
  touchFriendly: boolean;
}) {
  return [
    "relative min-w-0 flex-1 rounded-lg px-3 text-left transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60",
    touchFriendly ? "flex min-h-11 items-center py-2" : "block py-1.5",
    current
      ? "bg-white/[0.07] font-medium text-neutral-100"
      : withinCurrentTrail
        ? "font-medium text-neutral-200 hover:bg-white/[0.03] hover:text-neutral-100"
        : "text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100",
  ].join(" ");
}

function DocsNavBranch({
  node,
  pathname,
  depth,
  touchFriendly,
  onNavigate,
}: {
  node: DocsNavNode;
  pathname: string;
  depth: number;
  touchFriendly: boolean;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const current = isCurrentPage(node, pathname);
  const activeDescendant = hasActiveDescendant(node, pathname);
  const [open, setOpen] = useState(
    current || activeDescendant || node.defaultOpen === true,
  );

  const currentMarker = current ? (
    <span
      aria-hidden
      className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-orange-400"
    />
  ) : null;

  if (!hasChildren) {
    if (!node.href) return null;

    return (
      <li>
        <Link
          href={node.href}
          aria-current={current ? "page" : undefined}
          onClick={onNavigate}
          className={linkClassName({
            current,
            withinCurrentTrail: false,
            touchFriendly,
          })}
        >
          {currentMarker}
          <span className="block truncate">{node.title}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex min-w-0 items-center gap-0.5">
          {node.href ? (
            <Link
              href={node.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={linkClassName({
                current,
                withinCurrentTrail: activeDescendant,
                touchFriendly,
              })}
            >
              {currentMarker}
              <span className="block truncate">{node.title}</span>
            </Link>
          ) : (
            <span
              className={[
                "min-w-0 flex-1 px-3 text-sm",
                touchFriendly ? "py-3" : "py-1.5",
                activeDescendant
                  ? "font-medium text-neutral-200"
                  : "text-neutral-400",
              ].join(" ")}
            >
              <span className="block truncate">{node.title}</span>
            </span>
          )}

          <CollapsibleTrigger asChild>
            <button
              type="button"
              aria-label={`${open ? "Collapse" : "Expand"} ${node.title}`}
              className={[
                "flex shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors",
                "hover:bg-white/[0.04] hover:text-neutral-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60",
                touchFriendly ? "h-11 w-11" : "h-8 w-8",
              ].join(" ")}
            >
              <ChevronRight
                aria-hidden
                className={[
                  "h-3.5 w-3.5 transition-transform duration-200",
                  open ? "rotate-90" : "",
                ].join(" ")}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <DocsNavList
            nodes={node.children ?? []}
            pathname={pathname}
            depth={depth + 1}
            touchFriendly={touchFriendly}
            onNavigate={onNavigate}
          />
        </CollapsibleContent>
      </Collapsible>
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
  return (
    <ul
      aria-labelledby={labelledBy}
      className={[
        "flex flex-col gap-0.5",
        depth > 0 ? "ml-3 mt-0.5 border-l border-white/[0.07] pl-2" : "mt-2",
      ].join(" ")}
    >
      {nodes.map((node) => (
        <DocsNavBranch
          key={node.id}
          node={node}
          pathname={pathname}
          depth={depth}
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
              className="px-3 text-xs font-medium uppercase tracking-wider text-neutral-500"
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

  return <DocsNavigation key={pathname} pathname={pathname} />;
}

function DocsMobileNavForPath({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const trail = findDocsTrail(pathname);
  const context =
    trail.length > 0
      ? trail.map((node) => node.title).join(" / ")
      : "Documentation";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="mx-auto flex w-full max-w-6xl px-5 py-2">
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-2 text-left text-sm text-neutral-300 transition-colors hover:bg-white/[0.03] hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            aria-label={`Open documentation navigation. Current page: ${context}`}
          >
            <Menu aria-hidden className="h-4 w-4 shrink-0 text-orange-400" />
            <span className="min-w-0 flex-1 truncate">
              <span className="text-neutral-500">Docs</span>
              <span aria-hidden className="px-2 text-neutral-700">
                /
              </span>
              <span>{context}</span>
            </span>
            <ChevronRight
              aria-hidden
              className="h-4 w-4 shrink-0 text-neutral-600"
            />
          </button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="left"
        className="w-[min(88vw,22rem)] gap-0 border-white/10 bg-[#0e0b08] p-0 text-neutral-100 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button]:text-neutral-400 [&>button]:focus-visible:ring-orange-400/60"
      >
        <SheetHeader className="border-b border-white/[0.07] px-5 py-5 pr-16">
          <SheetTitle className="text-left text-base text-neutral-100">
            Documentation
          </SheetTitle>
          <SheetDescription className="sr-only">
            Browse SSGOI documentation sections and pages.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-6">
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

  // Remounting on navigation closes the drawer even for browser back/forward.
  return (
    <div className="sticky top-16 z-40 border-b border-white/[0.06] bg-black/85 backdrop-blur lg:hidden md:top-20">
      <DocsMobileNavForPath key={pathname} pathname={pathname} />
    </div>
  );
}
