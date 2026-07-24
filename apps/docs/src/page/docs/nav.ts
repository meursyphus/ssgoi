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
      {
        title: "Layout",
        href: "/docs/layout",
        blurb: "The three classes on the wrapper.",
      },
      {
        title: "Persistent boundaries",
        href: "/docs/nested-boundaries",
        blurb: "Keep tabs and navigation mounted.",
      },
      {
        title: "How it works",
        href: "/docs/how-it-works",
        blurb: "Clone & absolute, step by step.",
      },
    ],
  },
];

export const DOCS_NAV_FLAT: DocsNavItem[] = DOCS_NAV.flatMap((g) => g.items);
