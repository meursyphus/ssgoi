export type DocsNavItem = { title: string; href: string; blurb: string };
export type DocsNavGroup = { label: string; items: DocsNavItem[] };

export const DOCS_NAV: DocsNavGroup[] = [
  {
    label: "Get started",
    items: [
      {
        title: "Overview",
        href: "/docs",
        blurb: "What SSGOI is and how these docs work.",
      },
      {
        title: "Quick start",
        href: "/docs/install",
        blurb:
          "Install, wire three small files, and see your first transition.",
      },
      {
        title: "Transitions",
        href: "/docs/transitions",
        blurb: "Which transition fits which UX, and every option.",
      },
    ],
  },
  {
    label: "Deep dive",
    items: [
      {
        title: "Route boundaries",
        href: "/docs/nested-boundaries",
        blurb: "Why boundaries exist — walked through with a bottom nav.",
      },
      {
        title: "Scroll & middleware",
        href: "/docs/core-options",
        blurb: "Automatic rule-local scroll behavior and route middleware.",
      },
      {
        title: "Layout shell",
        href: "/docs/layout",
        blurb: "Set the OUT page's containing and stacking context.",
      },
      {
        title: "How it works",
        href: "/docs/how-it-works",
        blurb: "Unmount, reinsert, and animate, step by step.",
      },
      {
        title: "Compatibility",
        href: "/docs/compatibility",
        blurb: "Routers and browser support.",
      },
    ],
  },
  {
    label: "Frameworks",
    items: [
      {
        title: "React Router",
        href: "/docs/frameworks/react-router",
        blurb: "Boundary utility on useLocation().",
      },
      {
        title: "TanStack Router",
        href: "/docs/frameworks/tanstack-router",
        blurb: "Boundary utility on router state.",
      },
      {
        title: "SvelteKit",
        href: "/docs/frameworks/sveltekit",
        blurb: "Boundary component built on onNavigate.",
      },
      {
        title: "Nuxt",
        href: "/docs/frameworks/nuxt",
        blurb: "Keyed boundary component on the route path.",
      },
      {
        title: "SolidStart",
        href: "/docs/frameworks/solidstart",
        blurb: "Keyed boundary component on useLocation().",
      },
      {
        title: "Qwik City",
        href: "/docs/frameworks/qwik",
        blurb: "QRL config factory and direct markers.",
      },
      {
        title: "Angular",
        href: "/docs/frameworks/angular",
        blurb: "ssgoi directive above the router outlet.",
      },
    ],
  },
];

export const DOCS_NAV_FLAT: DocsNavItem[] = DOCS_NAV.flatMap((g) => g.items);

/** Groups shown as "Start here" cards on the overview page. */
export const DOCS_NAV_PRIMARY: DocsNavGroup[] = DOCS_NAV.filter(
  (g) => g.label !== "Frameworks",
);
