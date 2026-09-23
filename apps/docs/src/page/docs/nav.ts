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
        blurb: "One provider file, one layout edit, and your first transition.",
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
            platform: "both",
            blurb:
              "A temporary mobile or web screen rises over the current one.",
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
            platform: "web",
            blurb: "Vertical movement through an ordered web sequence.",
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
        id: "motion-overrides",
        title: "Motion overrides",
        href: "/docs/motion",
        blurb: "Tune named animations, physics, and overlap by direction.",
      },
      {
        id: "custom-transitions",
        title: "Custom transitions",
        href: "/docs/custom-transitions",
        blurb: "Define direction-specific lifecycles and custom integrators.",
      },
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
        blurb:
          "Choose the framework that owns your page, then connect its router.",
      },
      {
        id: "framework-react",
        title: "React",
        href: "/docs/frameworks/react",
        blurb:
          "Use SSGOI with React independently of your router. Router helpers are optional conveniences that connect a pathname and a page lifetime to the same React implementation.",
        children: [
          {
            id: "router-nextjs",
            title: "Next.js",
            href: "/docs/frameworks/react#nextjs",
            blurb:
              "Use the App Router helper to read the committed pathname, handle URL-hook suspension, and mark the routed region. It is included in @ssgoi/react.",
          },
          {
            id: "router-remix",
            title: "Remix",
            href: "/docs/frameworks/react#remix",
            blurb:
              "Use the Remix 2 entry with @remix-run/react. It reads Remix’s own router context, so it does not depend on a separately installed React Router version.",
          },
          {
            id: "router-react-router",
            title: "React Router",
            href: "/docs/frameworks/react#react-router",
            blurb:
              "Use the helper inside React Router 6 or 7. It follows the committed location; query-only navigation preserves the boundary.",
          },
          {
            id: "router-tanstack-router",
            title: "TanStack Router",
            href: "/docs/frameworks/react#tanstack-router",
            blurb:
              "Use this entry for TanStack Router 1, including React applications built with TanStack Start. Both use the same router context.",
          },
        ],
      },
      {
        id: "framework-svelte",
        title: "Svelte",
        href: "/docs/frameworks/svelte",
        blurb:
          "The Svelte package provides the common provider and transition API. Add the SvelteKit helper when Kit owns navigation.",
        children: [
          {
            id: "router-sveltekit",
            title: "SvelteKit",
            href: "/docs/frameworks/svelte#sveltekit",
            blurb:
              "Use onNavigate to detach outgoing content before SvelteKit updates its live children snippet. A key around that snippet alone is not sufficient.",
          },
        ],
      },
      {
        id: "framework-vue",
        title: "Vue",
        href: "/docs/frameworks/vue",
        blurb:
          "Use the Vue package for the provider and effects. Choose the helper for the router already installed in your app.",
        children: [
          {
            id: "router-vue-router",
            title: "Vue Router",
            href: "/docs/frameworks/vue#vue-router",
            blurb:
              "Use the helper with Vue Router 4 inside the common Vue provider.",
          },
          {
            id: "router-nuxt",
            title: "Nuxt",
            href: "/docs/frameworks/vue#nuxt",
            blurb:
              "Use the Nuxt-specific entry inside the common Vue provider. It observes the committed router state rather than Nuxt’s delayed useRoute value.",
          },
        ],
      },
      {
        id: "framework-solid",
        title: "Solid",
        href: "/docs/frameworks/solid",
        blurb:
          "Use the Solid package for common rendering and effects. Solid Router and SolidStart share the same boundary implementation.",
        children: [
          {
            id: "router-solid-router",
            title: "Solid Router",
            href: "/docs/frameworks/solid#solid-router",
            blurb:
              "Use the Solid Router entry for Solid applications. SolidStart’s existing entry uses this same implementation.",
          },
          {
            id: "router-solidstart",
            title: "SolidStart",
            href: "/docs/frameworks/solid#solidstart",
            blurb:
              "Use the same Solid Router boundary through the SolidStart entry.",
          },
        ],
      },
      {
        id: "framework-qwik",
        title: "Qwik",
        href: "/docs/frameworks/qwik",
        blurb:
          "Qwik keeps ownership of projected content and serializes state. Supply transition functions through a QRL factory and attach SSGOI to the layout that owns the routed slot.",
        children: [
          {
            id: "router-qwik-city",
            title: "Qwik City",
            href: "/docs/frameworks/qwik#qwik-city",
            blurb:
              "The computed boundary helper reads Qwik City’s location. The page keeps ownership of its DOM and slots; apply the returned id and key to its own root.",
          },
        ],
      },
      {
        id: "framework-angular",
        title: "Angular",
        href: "/docs/frameworks/angular",
        blurb:
          "Use the common ssgoi directive above the changing page region. The optional Angular Router directive supplies each page’s boundary.",
        children: [
          {
            id: "router-angular-router",
            title: "Angular Router",
            href: "/docs/frameworks/angular#angular-router",
            blurb:
              "A structural directive marks a page’s real DOM root and recreates its embedded view when its route key changes. The application keeps its RouterOutlet.",
          },
        ],
      },
      {
        id: "framework-react-native",
        title: "React Native",
        href: "/docs/frameworks/react-native",
        blurb:
          "Native rendering and UI-thread playback use the same matching and physics concepts, with native fade/slide presets. This native integration remains experimental.",
        children: [
          {
            id: "router-expo-router",
            title: "Expo Router",
            href: "/docs/frameworks/react-native#expo-router",
            blurb:
              "The file-based boundary discovers screens and retains outgoing native views until playback completes. It replaces the Stack in that layout.",
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
      if (
        node.href &&
        !node.href.includes("#") &&
        node.blurb &&
        !seen.has(node.href)
      ) {
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
