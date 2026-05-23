import type { ShowcaseApp } from "@/page/showcase/types";

export const honeydropShowcase: ShowcaseApp = {
  slug: "honeydrop",
  name: "HONEYDROP",
  tagline: "Rotate transition — full-screen drops spin between chapters",
  platforms: ["web"],
  category: "Campaign",
  badge: "New",
  logo: "/honeydrop-icon.svg",
  demoOrigin: "/demo/honeydrop",
  transitions: ["rotate"],
  sourcePath: "apps/docs/src/demo/honeydrop",
  previewTransition: "rotate",
  clips: [
    {
      title: "The Court → The Drop",
      transition: "rotate",
      enterPath: "/demo/honeydrop/drop",
      exitPath: "/demo/honeydrop",
      caption:
        "Rotate transition — the page spins 180° in place while crossfading into the next chapter",
    },
  ],
};
