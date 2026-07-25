export type DocsNavNode = {
  id: string;
  title: string;
  href?: string;
  blurb?: string;
  children?: readonly DocsNavNode[];
  defaultOpen?: boolean;
};

export type DocsNavLink = DocsNavNode & {
  href: string;
  blurb: string;
};

export type DocsNavGroup = {
  id: string;
  label: string;
  items: readonly DocsNavNode[];
};

export const DOCS_NAV: readonly DocsNavGroup[] = [
  {
    id: "start",
    label: "Start",
    items: [
      {
        id: "overview",
        title: "Overview",
        href: "/docs",
        blurb: "What SSGOI is and how these docs work.",
      },
      {
        id: "quick-start",
        title: "Quick start",
        href: "/docs/install",
        blurb: "Install, change only 2–3 files, and see your first transition.",
      },
    ],
  },
  {
    id: "why-ssgoi",
    label: "Why SSGOI",
    items: [
      {
        id: "why-ssgoi",
        title: "Why SSGOI",
        href: "/docs/why-ssgoi",
        blurb: "The problems SSGOI solves for mobile web apps.",
      },
      {
        id: "compatibility",
        title: "Compatibility",
        href: "/docs/compatibility",
        blurb: "Routers and browser support.",
      },
      {
        id: "view-transition-api",
        title: "Why SSGOI doesn't use the View Transition API",
        href: "/docs/view-transition-api",
        blurb: "Live DOM, runtime layers, and precise geometry.",
      },
    ],
  },
  {
    id: "build-mobile-ux",
    label: "Build mobile UX",
    items: [
      {
        id: "transitions",
        title: "Transitions",
        href: "/docs/transitions",
        blurb: "Choose a transition from the UX you are building.",
        children: [
          {
            id: "transition-drill",
            title: "Drill",
            href: "/docs/transitions/drill",
            blurb: "List-to-detail navigation with hierarchical depth.",
          },
          {
            id: "transition-sheet",
            title: "Sheet",
            href: "/docs/transitions/sheet",
            blurb: "Compose, filters, and other temporary routes.",
          },
          {
            id: "transition-slide",
            title: "Slide",
            href: "/docs/transitions/slide",
            blurb: "Ordered tabs and steps.",
          },
          {
            id: "transition-zoom",
            title: "Zoom",
            href: "/docs/transitions/zoom",
            blurb: "Expand a card or image into its detail route.",
          },
          {
            id: "more-effects",
            title: "More effects",
            children: [
              {
                id: "transition-axis",
                title: "Axis",
                href: "/docs/transitions/axis",
                blurb: "Material shared-axis motion between siblings.",
              },
              {
                id: "transition-scroll",
                title: "Scroll",
                href: "/docs/transitions/scroll",
                blurb: "Vertical movement through an ordered sequence.",
              },
              {
                id: "transition-hero",
                title: "Hero",
                href: "/docs/transitions/hero",
                blurb: "Move a shared element between two routes.",
              },
              {
                id: "transition-fade",
                title: "Fade",
                href: "/docs/transitions/fade",
                blurb: "A calm, direction-free fade-through.",
              },
              {
                id: "transition-film",
                title: "Film",
                href: "/docs/transitions/film",
                blurb:
                  "A cinematic runtime scene with staggered springs and viewfinder corners.",
              },
              {
                id: "transition-strip",
                title: "Strip",
                href: "/docs/transitions/strip",
                blurb:
                  "Swap whole pages with translation and a shallow perspective turn.",
              },
              {
                id: "transition-blind",
                title: "Blind",
                href: "/docs/transitions/blind",
                blurb: "Reveal the next route through animated blinds.",
              },
              {
                id: "transition-rotate",
                title: "Rotate",
                href: "/docs/transitions/rotate",
                blurb: "Spin whole pages through a planar half-turn.",
              },
              {
                id: "transition-jaemin",
                title: "Jaemin",
                href: "/docs/transitions/jaemin",
                blurb: "An expressive layered page transition.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "configure",
    label: "Configure",
    items: [
      {
        id: "route-rules",
        title: "Route rules",
        href: "/docs/route-rules",
        blurb: "Match routes with on, from/to, and ordered rules.",
      },
      {
        id: "scroll-restoration",
        title: "Scroll behavior",
        href: "/docs/scroll-restoration",
        blurb: "Automatic reset and restoration, with exact overrides.",
      },
      {
        id: "persistent-layouts",
        title: "Persistent layouts",
        href: "/docs/nested-boundaries",
        blurb: "Keep a bottom nav or shell mounted across route changes.",
      },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    items: [
      {
        id: "frameworks-overview",
        title: "Overview",
        href: "/docs/frameworks",
        blurb: "Choose the guide for your framework and router.",
        children: [
          {
            id: "framework-nextjs",
            title: "Next.js",
            href: "/docs/frameworks/nextjs",
            blurb: "App Router provider and pathname boundary.",
          },
          {
            id: "framework-react-router",
            title: "React Router",
            href: "/docs/frameworks/react-router",
            blurb: "Boundary utility on useLocation().",
          },
          {
            id: "framework-tanstack-router",
            title: "TanStack Router",
            href: "/docs/frameworks/tanstack-router",
            blurb: "Boundary utility on router state.",
          },
          {
            id: "framework-sveltekit",
            title: "SvelteKit",
            href: "/docs/frameworks/sveltekit",
            blurb: "Boundary component built on onNavigate.",
          },
          {
            id: "framework-nuxt",
            title: "Vue / Nuxt",
            href: "/docs/frameworks/nuxt",
            blurb: "Keyed route boundary for Vue Router and Nuxt.",
          },
          {
            id: "framework-solidstart",
            title: "SolidStart",
            href: "/docs/frameworks/solidstart",
            blurb: "Keyed boundary component on useLocation().",
          },
          {
            id: "framework-qwik",
            title: "Qwik City",
            href: "/docs/frameworks/qwik",
            blurb: "QRL config factory and direct markers.",
          },
          {
            id: "framework-angular",
            title: "Angular",
            href: "/docs/frameworks/angular",
            blurb: "ssgoi directive above the router outlet.",
          },
        ],
      },
    ],
  },
  {
    id: "reference-debug",
    label: "Reference & debug",
    items: [
      {
        id: "route-boundaries",
        title: "Route boundaries",
        href: "/docs/boundaries",
        blurb: "How a boundary's key and route id control transitions.",
      },
      {
        id: "layout-shell",
        title: "Layout shell",
        href: "/docs/layout",
        blurb: "Set the OUT page's containing and stacking context.",
      },
      {
        id: "middleware",
        title: "Middleware",
        href: "/docs/middleware",
        blurb: "Normalize logical routes before matching.",
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting",
        href: "/docs/troubleshooting",
        blurb: "Find the cause of missing, jumping, or incorrect motion.",
      },
      {
        id: "how-it-works",
        title: "How it works",
        href: "/docs/how-it-works",
        blurb: "Unmount, reinsert, and animate, step by step.",
      },
    ],
  },
];

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

export function hasActiveDescendant(
  node: DocsNavNode,
  pathname: string,
): boolean {
  const currentPath = normalizePathname(pathname);

  return (
    node.children?.some(
      (child) =>
        (child.href !== undefined &&
          normalizePathname(child.href) === currentPath) ||
        hasActiveDescendant(child, currentPath),
    ) ?? false
  );
}

export function findDocsTrail(pathname: string): DocsNavNode[] {
  const currentPath = normalizePathname(pathname);

  function findInNodes(nodes: readonly DocsNavNode[]): DocsNavNode[] | null {
    for (const node of nodes) {
      if (
        node.href !== undefined &&
        normalizePathname(node.href) === currentPath
      ) {
        return [node];
      }

      const childTrail = node.children ? findInNodes(node.children) : null;
      if (childTrail) return [node, ...childTrail];
    }

    return null;
  }

  for (const group of DOCS_NAV) {
    const trail = findInNodes(group.items);
    if (trail) return trail;
  }

  return [];
}

export function flattenDocsNav(
  groups: readonly DocsNavGroup[] = DOCS_NAV,
): DocsNavLink[] {
  const links: DocsNavLink[] = [];
  const seen = new Set<string>();

  function visit(nodes: readonly DocsNavNode[]) {
    for (const node of nodes) {
      if (node.href && node.blurb && !seen.has(node.href)) {
        seen.add(node.href);
        links.push(node as DocsNavLink);
      }
      if (node.children) visit(node.children);
    }
  }

  for (const group of groups) visit(group.items);
  return links;
}

export const DOCS_NAV_FLAT: DocsNavLink[] = flattenDocsNav();

/**
 * The small set of parent destinations shown as cards on the overview page.
 * Keep this intentionally shallower than the complete sidebar tree.
 */
export const DOCS_NAV_PRIMARY: Array<{
  label: string;
  items: DocsNavLink[];
}> = [
  {
    label: "Start here",
    items: [
      DOCS_NAV_FLAT.find((item) => item.href === "/docs/install")!,
      DOCS_NAV_FLAT.find((item) => item.href === "/docs/transitions")!,
      DOCS_NAV_FLAT.find((item) => item.href === "/docs/nested-boundaries")!,
      DOCS_NAV_FLAT.find((item) => item.href === "/docs/frameworks")!,
    ],
  },
];
