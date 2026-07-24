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
        title: "Install",
        href: "/docs/install",
        blurb: "Add the package for your framework.",
      },
      {
        title: "Layout shell",
        href: "/docs/layout",
        blurb: "Set the OUT page's containing and stacking context.",
      },
      {
        title: "Route boundaries",
        href: "/docs/nested-boundaries",
        blurb: "Use keys to define routed-region lifetime.",
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
    label: "Guide",
    items: [
      {
        title: "Transitions",
        href: "/docs/transitions",
        blurb: "The thirteen built-in transitions.",
      },
    ],
  },
];

export const DOCS_NAV_FLAT: DocsNavItem[] = DOCS_NAV.flatMap((g) => g.items);
