export type ShowcasePlatform = "mobile" | "web";

export type ShowcaseClip = {
  /** human-readable label shown under/over the gif */
  title: string;
  /** path under /public — e.g. "/showcase/air-bnb/sheet.gif" */
  src: string;
  /** which ssgoi transition this clip demonstrates */
  transition: string;
  /** optional one-line caption for the clip */
  caption?: string;
};

export type ShowcaseApp = {
  /** url slug, e.g. "air-bnb" */
  slug: string;
  /** display name, e.g. "Airbnb-style" */
  name: string;
  /** short tagline shown on the card */
  tagline: string;
  /** which form factor(s) this showcase ships */
  platforms: ShowcasePlatform[];
  /** card thumbnail — first frame or the hero gif */
  thumbnail: string;
  /** category tag, e.g. "Travel", "Social", "Productivity" */
  category: string;
  /** optional path to the live demo route (e.g. "/demo/air-bnb"). omit if no live demo yet. */
  demoHref?: string;
  /** clips grouped by section, mirroring Mobbin's Screens / UI Elements / Flows split */
  clips: {
    screens?: ShowcaseClip[];
    flows?: ShowcaseClip[];
    elements?: ShowcaseClip[];
  };
};

export const showcases: ShowcaseApp[] = [
  // 첫 시드는 frontend-design 에이전트가 디자인 의뢰 후 채워 넣는다.
  // 예시:
  // {
  //   slug: "air-bnb",
  //   name: "Airbnb-style",
  //   tagline: "Sheet stack + hero image transition",
  //   platforms: ["mobile"],
  //   thumbnail: "/showcase/air-bnb/thumbnail.gif",
  //   category: "Travel",
  //   demoHref: "/demo/air-bnb",
  //   clips: {
  //     screens: [
  //       { title: "Home → Detail", src: "/showcase/air-bnb/sheet.gif", transition: "sheet" },
  //     ],
  //   },
  // },
];

export function findShowcase(slug: string): ShowcaseApp | undefined {
  return showcases.find((s) => s.slug === slug);
}
