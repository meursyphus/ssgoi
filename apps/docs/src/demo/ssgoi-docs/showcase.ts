import type { ShowcaseApp } from "@/page/showcase/types";

export const ssgoiDocsShowcase: ShowcaseApp = {
  slug: "ssgoi-docs",
  name: "ssgoi.dev",
  tagline: "Non-directional scroll between landing and examples",
  platforms: ["web"],
  category: "Docs",
  badge: "New",
  logo: "/ssgoi-logo.png",
  demoOrigin: "/",
  transitions: ["scroll"],
  sourcePath: "apps/docs/src/components/docs-ssgoi-provider.tsx",
  previewTransition: "scroll",
  clips: [
    {
      title: "Landing ↔ Examples",
      transition: "scroll",
      enterPath: "/showcase",
      exitPath: "/",
      caption:
        "Non-directional scroll — the outgoing page glides up while the incoming page fades in",
    },
  ],
};
