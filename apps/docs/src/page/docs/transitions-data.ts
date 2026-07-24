import type { ShowcasePlatform } from "@/page/showcase/data";

export type UseKind = "drill-in" | "sibling" | "top-level" | "decorative";

export const USE_META: Record<
  UseKind,
  { label: string; when: string; cls: string }
> = {
  "drill-in": {
    label: "Drill-in",
    when: "List → detail, going one level deeper.",
    cls: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  },
  sibling: {
    label: "Sibling",
    when: "Between peer screens at the same level.",
    cls: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  },
  "top-level": {
    label: "Top-level",
    when: "Switching tabs or root sections.",
    cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  },
  decorative: {
    label: "Decorative",
    when: "A flourish — use anywhere for effect.",
    cls: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  },
};

export type TransitionDemoExample = {
  /** Route the iframe plays the "enter" leg to. */
  enterPath: string;
  /** Route it returns to — also the starting frame. */
  exitPath: string;
  /** Frame style for this demo. Defaults to "mobile". */
  platform?: ShowcasePlatform;
};

export type TransitionVariant = {
  /** Section label, e.g. "parallax" or "x · snappy". */
  label: string;
  /** One-line UX note: what it looks/feels like, when to reach for it. */
  ux: string;
  /**
   * Extra args shown inside the effect factory call, e.g. `type: "slide"`.
   * Route matching is configured separately on the transition rule.
   */
  args: string;
  /** Marks the default behavior of the transition. */
  isDefault?: boolean;
  /**
   * Zero or more live demos for this variant — a variant can show several
   * flows. Empty until real examples are wired; the renderer shows a
   * "demo coming soon" placeholder until then.
   */
  demos?: TransitionDemoExample[];
};

export type TransitionDoc = {
  name: string;
  /** One-liner used on the catalog card. */
  blurb: string;
  use: UseKind;
  /** Intro paragraph for the detail page header. */
  intro: string;
  /** Natural route rule for this effect in the usage example. */
  ruleStyle: "pair" | "ordered";
  variants: TransitionVariant[];
};

export const TRANSITION_DOCS: TransitionDoc[] = [
  {
    name: "drill",
    blurb: "iOS-style hierarchical navigation.",
    use: "drill-in",
    intro:
      "Hierarchical push/pop, like an iOS navigation stack. Use it when the user goes one level deeper — a list into its detail — and back out again.",
    ruleStyle: "pair",
    variants: [
      {
        label: "parallax",
        isDefault: true,
        args: 'type: "parallax"',
        ux: "Layered depth: the outgoing page recedes a touch while the new page slides over it. The default — reads as real hierarchy.",
        demos: [
          {
            enterPath: "/demo/gamja-market/products/p-001",
            exitPath: "/demo/gamja-market",
          },
          {
            enterPath: "/demo/kakao-talk/chats/c-001",
            exitPath: "/demo/kakao-talk/chats",
          },
        ],
      },
      {
        label: "slide",
        args: 'type: "slide"',
        ux: "Flat cross-faded horizontal slide, no parallax. Lighter and faster when depth feels like too much.",
        demos: [
          {
            enterPath:
              "/demo/pinterest/search/%EC%97%AC%EC%9E%90%20%EC%B9%98%EB%A7%88",
            exitPath: "/demo/pinterest/search",
          },
        ],
      },
    ],
  },
  {
    name: "fade",
    blurb: "Calm cross-fade. Safe default.",
    use: "top-level",
    intro:
      "A calm symmetric cross-fade. The safe default for any navigation where you don't want to imply direction or hierarchy.",
    ruleStyle: "pair",
    variants: [
      {
        label: "fade",
        isDefault: true,
        args: "",
        ux: "Both pages cross-fade. Neutral and direction-less — great for top-level/tab switches.",
        demos: [
          {
            enterPath: "/demo/silent-room/tension",
            exitPath: "/demo/silent-room",
            platform: "web",
          },
        ],
      },
    ],
  },
  {
    name: "slide",
    blurb: "Horizontal push.",
    use: "sibling",
    intro:
      "A horizontal push between peer screens. Direction follows path order — forward slides left, back slides right.",
    ruleStyle: "ordered",
    variants: [
      {
        label: "slide",
        isDefault: true,
        args: "",
        ux: "Pages push horizontally in the direction of travel. Good for moving between siblings at the same level.",
        demos: [
          {
            enterPath: "/demo/instagram/profile/deaseungseung94/reels",
            exitPath: "/demo/instagram/profile/deaseungseung94",
          },
        ],
      },
    ],
  },
  {
    name: "axis",
    blurb: "Material shared-axis. Coordinated slide + fade.",
    use: "sibling",
    intro:
      "Material Design shared-axis: a coordinated slide + fade along one axis. Pick the axis that matches the spatial relationship between screens.",
    ruleStyle: "ordered",
    variants: [
      {
        label: "x",
        isDefault: true,
        args: 'type: "x"',
        ux: "Horizontal shared-axis; direction follows path order. The default tone is fluid.",
      },
      {
        label: "x · snappy",
        args: 'type: "x", variant: "snappy"',
        ux: "Same horizontal axis with a tighter, snappier spring — feels more immediate.",
        demos: [
          {
            enterPath: "/demo/kakao-talk/chats",
            exitPath: "/demo/kakao-talk",
          },
        ],
      },
      {
        label: "y",
        args: 'type: "y"',
        ux: "Vertical shared-axis; direction follows path order.",
      },
      {
        label: "y · non-directional",
        args: 'type: "y", variant: "non-directional"',
        ux: "Vertical axis where every move slides the same way, ignoring path order.",
      },
      {
        label: "z",
        args: 'type: "z"',
        ux: "Z-axis depth — pages scale through each other, the container-transform feel.",
      },
    ],
  },
  {
    name: "scroll",
    blurb: "Vertical page scroll.",
    use: "sibling",
    intro:
      "Pages scroll vertically as if stacked. Reads as continuous movement through a sequence.",
    ruleStyle: "ordered",
    variants: [
      {
        label: "directional",
        isDefault: true,
        args: 'type: "directional"',
        ux: "Path order decides direction — earlier→later scrolls up, the reverse scrolls down.",
      },
      {
        label: "non-directional",
        args: 'type: "non-directional"',
        ux: "Every navigation scrolls upward regardless of order — good for paginated or onboarding flows.",
        demos: [
          {
            enterPath: "/showcase",
            exitPath: "/",
            platform: "web",
          },
        ],
      },
    ],
  },
  {
    name: "sheet",
    blurb: "Bottom sheet, slides up.",
    use: "drill-in",
    intro:
      "A bottom sheet that slides up over the current page — for modal-like detail that keeps the origin in context.",
    ruleStyle: "pair",
    variants: [
      {
        label: "static",
        isDefault: true,
        args: 'type: "static"',
        ux: "The sheet rises over a static background page. The default.",
        demos: [
          {
            enterPath: "/demo/gamja-market/review/o-001",
            exitPath: "/demo/gamja-market",
          },
          {
            enterPath: "/demo/youtube-music-web/watch?v=wggigwtz4dQ",
            exitPath: "/demo/youtube-music-web",
            platform: "web",
          },
        ],
      },
      {
        label: "scale",
        args: 'type: "scale"',
        ux: "The background page scales down as the sheet rises — iOS-style stacked-card depth.",
        demos: [
          {
            enterPath: "/demo/material-mail/compose",
            exitPath: "/demo/material-mail",
          },
        ],
      },
      {
        label: "blur",
        args: 'type: "blur"',
        ux: "The background page blurs and recedes behind the rising sheet — a modal pushing the page out of focus.",
        demos: [
          {
            enterPath: "/demo/voyage/compose",
            exitPath: "/demo/voyage",
          },
        ],
      },
    ],
  },
  {
    name: "hero",
    blurb: "Shared element. data-hero-enter-key / data-hero-exit-key.",
    use: "drill-in",
    intro:
      "A shared-element transition: a tagged element flies from its spot on one page to its spot on the next. Mark the element with data-hero-enter-key / data-hero-exit-key.",
    ruleStyle: "pair",
    variants: [
      {
        label: "static",
        isDefault: true,
        args: 'type: "static"',
        ux: "Incoming chrome snaps in while the shared element morphs to its new position. The default.",
        demos: [
          {
            enterPath: "/demo/airbnb-photo-tour/photos/kitchen-1",
            exitPath: "/demo/airbnb-photo-tour",
            platform: "web",
          },
        ],
      },
      {
        label: "fade",
        args: 'type: "fade"',
        ux: "Both pages cross-fade as whole surfaces while the shared element morphs — softer hand-off.",
        demos: [
          {
            enterPath: "/demo/google-photos/p/ph-001",
            exitPath: "/demo/google-photos",
          },
        ],
      },
    ],
  },
  {
    name: "zoom",
    blurb: "Card expands to detail. data-zoom-*-key.",
    use: "drill-in",
    intro:
      "A card expands into its detail view. Tag the source and target with data-zoom-enter-key / data-zoom-exit-key.",
    ruleStyle: "pair",
    variants: [
      {
        label: "static",
        isDefault: true,
        args: 'type: "static"',
        ux: "The card holds in place while the detail expands over it. The default.",
        demos: [
          {
            enterPath: "/demo/instagram/feed/p-001",
            exitPath: "/demo/instagram/profile/deaseungseung94",
          },
        ],
      },
      {
        label: "expand",
        args: 'type: "expand"',
        ux: "The card itself expands to become the full detail surface.",
        demos: [
          {
            enterPath: "/demo/pinterest/feed/pin-1",
            exitPath: "/demo/pinterest",
          },
        ],
      },
      {
        label: "blur",
        args: 'type: "blur"',
        ux: "The background blurs as the detail zooms in — a focus pull.",
        demos: [
          {
            enterPath: "/demo/air-bnb/listings/l-003",
            exitPath: "/demo/air-bnb",
          },
        ],
      },
      {
        label: "fade",
        args: 'variant: "fade"',
        ux: "Modifier on any zoom type: adds a cross-fade for a softer expand.",
      },
    ],
  },
  {
    name: "strip",
    blurb: "3D Y-axis flip.",
    use: "decorative",
    intro:
      "A 3D flip around the Y-axis, like turning a card. A decorative flourish for moments that want a little drama.",
    ruleStyle: "pair",
    variants: [
      {
        label: "strip",
        isDefault: true,
        args: "",
        ux: "Pages flip in 3D around the vertical axis.",
        demos: [
          {
            enterPath: "/demo/nora-hale/about",
            exitPath: "/demo/nora-hale",
            platform: "web",
          },
        ],
      },
    ],
  },
  {
    name: "blind",
    blurb: "Window-blinds wipe.",
    use: "decorative",
    intro:
      "A window-blinds wipe — the page reveals in slats. Decorative; pick the axis the slats open along.",
    ruleStyle: "pair",
    variants: [
      {
        label: "horizontal",
        isDefault: true,
        args: 'type: "horizontal"',
        ux: "Blinds wipe along the horizontal axis. The default.",
      },
      {
        label: "vertical",
        args: 'type: "vertical"',
        ux: "Blinds open along the vertical axis.",
      },
    ],
  },
  {
    name: "film",
    blurb: "Cinematic shrink + tile.",
    use: "decorative",
    intro:
      "A cinematic shrink-and-tile with film-strip corner borders. Decorative — for a movie-reel feel.",
    ruleStyle: "pair",
    variants: [
      {
        label: "film",
        isDefault: true,
        args: "",
        ux: "Pages shrink and tile with cinematic corner borders.",
        demos: [
          {
            enterPath: "/demo/lumen/cinematic-eye",
            exitPath: "/demo/lumen",
            platform: "web",
          },
        ],
      },
      {
        label: "custom border",
        args: 'options: { borderColor: "#f97316" }',
        ux: "Override the cinematic corner-border color via options.borderColor.",
      },
    ],
  },
  {
    name: "rotate",
    blurb: "Card flip.",
    use: "decorative",
    intro: "A full card flip between pages. A playful decorative transition.",
    ruleStyle: "pair",
    variants: [
      {
        label: "rotate",
        isDefault: true,
        args: "",
        ux: "One page flips over to reveal the next.",
        demos: [
          {
            enterPath: "/demo/honeydrop/drop",
            exitPath: "/demo/honeydrop",
            platform: "web",
          },
        ],
      },
    ],
  },
  {
    name: "jaemin",
    blurb: "Playful rotated zoom.",
    use: "decorative",
    intro:
      "A playful rotated zoom — the signature flourish. Decorative, for personality.",
    ruleStyle: "pair",
    variants: [
      {
        label: "jaemin",
        isDefault: true,
        args: "",
        ux: "Pages zoom in with a slight rotation for a lively feel.",
        demos: [
          {
            enterPath: "/demo/yuzu-club/flavors",
            exitPath: "/demo/yuzu-club",
            platform: "web",
          },
        ],
      },
    ],
  },
];

export const TRANSITION_NAMES = TRANSITION_DOCS.map((t) => t.name);

export function getTransitionDoc(name: string): TransitionDoc | undefined {
  return TRANSITION_DOCS.find((t) => t.name === name);
}

/** Effect-only factory call string for a variant, e.g. `drill({ type: "slide" })`. */
export function variantCall(
  doc: TransitionDoc,
  variant: TransitionVariant,
): string {
  return variant.args ? `${doc.name}({ ${variant.args} })` : `${doc.name}()`;
}
