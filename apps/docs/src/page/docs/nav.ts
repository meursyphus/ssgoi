/**
 * Docs information architecture.
 *
 * Order follows what a reader actually does: set it up, pick the motion,
 * configure the routes, wire their framework. The pages that explain *why*
 * come after, because nobody reads them before their first transition works.
 *
 * Layout shell and Route boundaries sit directly under Quick start — that is
 * where they are first linked from, and a title alone would never earn a click.
 *
 * Transitions and Frameworks each open with a "Guide" overview and nest their
 * pages underneath. Nobody navigates to a catalog on purpose, so the overview
 * introduces the group rather than competing with it for a click, and the
 * indent is what says the pages below belong to it.
 */

/** Keys resolved to a logo component in the sidebar (nav stays JSX-free). */
export type DocsNavIcon =
  | "nextjs"
  | "react-router"
  | "tanstack-router"
  | "sveltekit"
  | "nuxt"
  | "solidstart"
  | "qwik"
  | "angular";

/**
 * Where a preset belongs. Every transition runs anywhere; this is the surface
 * the motion was designed for, so the sidebar can be scanned by the product
 * being built instead of by preset name.
 */
export type DocsNavPlatform = "web" | "mobile" | "both";

export type DocsNavNode = {
  id: string;
  title: string;
  href?: string;
  blurb?: string;
  icon?: DocsNavIcon;
  platform?: DocsNavPlatform;
  children?: readonly DocsNavNode[];
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
        blurb: "What SSGOI does and where to go next.",
      },
      {
        id: "quick-start",
        title: "Quick start",
        href: "/docs/install",
        blurb: "Two new files, one layout edit, and your first transition.",
      },
      {
        id: "layout-shell",
        title: "Layout shell",
        href: "/docs/layout",
        blurb: "The three classes the wrapper element needs, and why.",
      },
      {
        id: "route-boundaries",
        title: "Route boundaries",
        href: "/docs/boundaries",
        blurb: "The key decides what remounts. The id decides what matches.",
      },
    ],
  },
  {
    id: "transitions",
    label: "Transitions",
    items: [
      {
        id: "transitions",
        title: "Guide",
        href: "/docs/transitions",
        blurb: "Pick an effect from the navigation you are building.",
        children: [
          {
            id: "transition-drill",
            title: "Drill",
            href: "/docs/transitions/drill",
            platform: "mobile",
            blurb: "List to detail, one level deeper.",
          },
          {
            id: "transition-sheet",
            title: "Sheet",
            href: "/docs/transitions/sheet",
            platform: "mobile",
            blurb: "A temporary screen rises over the current one.",
          },
          {
            id: "transition-slide",
            title: "Slide",
            href: "/docs/transitions/slide",
            platform: "mobile",
            blurb: "Tabs and steps that have a left-to-right order.",
          },
          {
            id: "transition-zoom",
            title: "Zoom",
            href: "/docs/transitions/zoom",
            platform: "mobile",
            blurb: "A card or image opens into its own page.",
          },
          {
            id: "transition-axis",
            title: "Axis",
            href: "/docs/transitions/axis",
            platform: "mobile",
            blurb: "Material shared-axis motion between peer screens.",
          },
          {
            id: "transition-scroll",
            title: "Scroll",
            href: "/docs/transitions/scroll",
            platform: "mobile",
            blurb: "Vertical movement through an ordered sequence.",
          },
          {
            id: "transition-hero",
            title: "Hero",
            href: "/docs/transitions/hero",
            platform: "both",
            blurb: "One shared element travels between two pages.",
          },
          {
            id: "transition-fade",
            title: "Fade",
            href: "/docs/transitions/fade",
            platform: "web",
            blurb: "A calm cross-fade with no direction.",
          },
          {
            id: "transition-film",
            title: "Film",
            href: "/docs/transitions/film",
            platform: "web",
            blurb: "A cinematic scene built at runtime.",
          },
          {
            id: "transition-strip",
            title: "Strip",
            href: "/docs/transitions/strip",
            platform: "web",
            blurb: "Whole pages slide with a shallow perspective turn.",
          },
          {
            id: "transition-blind",
            title: "Blind",
            href: "/docs/transitions/blind",
            platform: "web",
            blurb: "The next page appears through animated blinds.",
          },
          {
            id: "transition-rotate",
            title: "Rotate",
            href: "/docs/transitions/rotate",
            platform: "web",
            blurb: "Pages spin through a flat half-turn.",
          },
          {
            id: "transition-jaemin",
            title: "Jaemin",
            href: "/docs/transitions/jaemin",
            platform: "web",
            blurb: "An expressive layered page transition.",
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
        blurb: "Match routes with on, from/to, and ordered.",
      },
      {
        id: "scroll-restoration",
        title: "Scroll behavior",
        href: "/docs/scroll-restoration",
        blurb: "When a page comes back where you left it, and when it resets.",
      },
      {
        id: "persistent-layouts",
        title: "Persistent layouts",
        href: "/docs/nested-boundaries",
        blurb: "Keep a bottom nav still while the pages under it change.",
      },
      {
        id: "middleware",
        title: "Middleware",
        href: "/docs/middleware",
        blurb: "Strip locale or tenant prefixes before rules match.",
      },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    items: [
      {
        id: "frameworks-overview",
        title: "Guide",
        href: "/docs/frameworks",
        blurb: "One page per framework and router.",
        children: [
          {
            id: "framework-nextjs",
            title: "React / Next.js",
            href: "/docs/frameworks/nextjs",
            icon: "nextjs",
            blurb: "App Router provider and pathname boundary.",
          },
          {
            id: "framework-react-router",
            title: "React Router",
            href: "/docs/frameworks/react-router",
            icon: "react-router",
            blurb: "Boundary built on useLocation().",
          },
          {
            id: "framework-tanstack-router",
            title: "TanStack Router",
            href: "/docs/frameworks/tanstack-router",
            icon: "tanstack-router",
            blurb: "Boundary built on router state.",
          },
          {
            id: "framework-sveltekit",
            title: "SvelteKit",
            href: "/docs/frameworks/sveltekit",
            icon: "sveltekit",
            blurb: "Boundary component built on onNavigate.",
          },
          {
            id: "framework-nuxt",
            title: "Vue / Nuxt",
            href: "/docs/frameworks/nuxt",
            icon: "nuxt",
            blurb: "Keyed route boundary for Vue Router and Nuxt.",
          },
          {
            id: "framework-solidstart",
            title: "SolidStart",
            href: "/docs/frameworks/solidstart",
            icon: "solidstart",
            blurb: "Keyed boundary component on useLocation().",
          },
          {
            id: "framework-qwik",
            title: "Qwik City",
            href: "/docs/frameworks/qwik",
            icon: "qwik",
            blurb: "QRL config factory and direct markers.",
          },
          {
            id: "framework-angular",
            title: "Angular",
            href: "/docs/frameworks/angular",
            icon: "angular",
            blurb: "ssgoi directive above the router outlet.",
          },
        ],
      },
    ],
  },
  {
    id: "core-concepts",
    label: "Core concepts",
    items: [
      {
        id: "how-it-works",
        title: "How it works",
        href: "/docs/how-it-works",
        blurb: "Unmount, put the old page back, animate, clean up.",
      },
      {
        id: "why-ssgoi",
        title: "Why SSGOI",
        href: "/docs/why-ssgoi",
        blurb: "What it is for, and what it deliberately leaves alone.",
      },
      {
        id: "view-transition-api",
        title: "Why not View Transitions",
        href: "/docs/view-transition-api",
        blurb: "Where the browser API ends and SSGOI's presets begin.",
      },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    items: [
      {
        id: "compatibility",
        title: "Browser & router support",
        href: "/docs/compatibility",
        blurb: "Which browsers and routers are covered.",
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting",
        href: "/docs/troubleshooting",
        blurb: "Nothing moves, the wrong thing moves, or the page jumps.",
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

export type DocsLocation = {
  group: DocsNavGroup;
  trail: DocsNavNode[];
};

export function findDocsLocation(pathname: string): DocsLocation | null {
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
    if (trail) return { group, trail };
  }

  return null;
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
