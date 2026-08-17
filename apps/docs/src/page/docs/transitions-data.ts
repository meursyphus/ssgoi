import type { ShowcasePlatform } from "@/page/showcase/data";

export type UseKind = "drill-in" | "sibling" | "top-level" | "decorative";

/** Read by transition-detail.tsx to say what kind of navigation a preset is for. */
export const USE_META: Record<UseKind, { label: string; when: string }> = {
  "drill-in": {
    label: "Drill-in",
    when: "List → detail, going one level deeper.",
  },
  sibling: {
    label: "Sibling",
    when: "Between peer screens at the same level.",
  },
  "top-level": {
    label: "Top-level",
    when: "Switching tabs or root sections.",
  },
  decorative: {
    label: "Expressive",
    when: "Selected moments where motion supports the product tone.",
  },
};

export type TransitionDemoExample = {
  /** Route the live demo enters. */
  enterPath: string;
  /** Starting route for the live demo. */
  exitPath: string;
  platform?: ShowcasePlatform;
};

export type TransitionGif = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
};

export type TransitionSetting = {
  kind: "type" | "variant" | "option";
  value: string;
};

export type TransitionVariant = {
  /** Human-readable combination, e.g. "x · snappy". */
  label: string;
  /** The independent API dimensions represented by this example. */
  settings?: TransitionSetting[];
  /** What this exact combination communicates to the user. */
  ux: string;
  /**
   * Extra args shown inside the effect factory call, e.g. `type: "slide"`.
   * Route matching is configured separately on the transition rule.
   */
  args: string;
  /** Marks the default combination of the transition. */
  isDefault?: boolean;
  /** Recorded enter-and-return example from a demo published on ssgoi.dev. */
  gif?: TransitionGif;
  /** Additional published demos for the same configuration on another platform. */
  extraGifs?: TransitionGif[];
  /** Optional routes where the same configuration can be tried live. */
  demos?: TransitionDemoExample[];
};

export type TransitionDecision = {
  whenToUse: string;
  motion: string;
  avoidWhen: string;
};

export type TransitionIdentitySpec = {
  source: {
    label: string;
    attribute: "data-hero-exit-key" | "data-zoom-exit-key";
  };
  destination: {
    label: string;
    attribute: "data-hero-enter-key" | "data-zoom-enter-key";
  };
  keyRole: string;
  rules: string[];
  failure: string;
  code: string;
};

export type TransitionDoc = {
  name: string;
  /** One-liner used on the catalog card. */
  blurb: string;
  use: UseKind;
  /** Intro paragraph for the detail page header. */
  intro: string;
  /** The product decision this motion should encode. */
  decision: TransitionDecision;
  /** Natural route rule for this effect in the usage example. */
  ruleStyle: "stack" | "target" | "pair" | "ordered" | "fallback";
  /** Shared identity markers required by Hero and Zoom. */
  identity?: TransitionIdentitySpec;
  variants: TransitionVariant[];
};

function mobileGif(file: string, alt: string): TransitionGif {
  return {
    src: `/docs/transitions/${file}.gif`,
    alt,
    width: 360,
    height: 696,
  };
}

function webGif(
  file: string,
  alt: string,
  height: 360 | 400 = 400,
): TransitionGif {
  return {
    src: `/docs/transitions/${file}.gif`,
    alt,
    width: 640,
    height,
  };
}

export const TRANSITION_DOCS: TransitionDoc[] = [
  {
    name: "drill",
    blurb: "Mobile hierarchy with an unmistakable back direction.",
    use: "drill-in",
    intro:
      "Drill gives parent-to-child navigation the push/pop language familiar from mobile navigation stacks.",
    decision: {
      whenToUse:
        "Use it for a list opening a detail, or any parent route opening one child level.",
      motion:
        "The child enters from the side; going back reverses the motion and reveals the parent.",
      avoidWhen:
        "Avoid it for peer tabs, filters, or destinations with no parent-child relationship.",
    },
    ruleStyle: "stack",
    variants: [
      {
        label: "parallax",
        settings: [{ kind: "type", value: "parallax" }],
        isDefault: true,
        args: 'type: "parallax"',
        ux: "The child slides over the parent while the parent recedes slightly. This layered depth makes hierarchy easiest to read.",
        gif: mobileGif(
          "drill-parallax",
          "A product list recedes while its detail page slides in, then reverses back to the list.",
        ),
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
        settings: [{ kind: "type", value: "slide" }],
        args: 'type: "slide"',
        ux: "Both pages move on one flat plane. Choose it when the parent-child relationship is clear without extra depth.",
        gif: mobileGif(
          "drill-slide",
          "A search result page slides flat into its child page and back without parallax.",
        ),
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
    blurb: "A calm, directionless fade-through.",
    use: "top-level",
    intro:
      "Fade uses a fade-through sequence: the outgoing page fades first, then the incoming page appears.",
    decision: {
      whenToUse:
        "Use it for calm switches between unrelated screens or top-level destinations.",
      motion:
        "The old page fades out before the new page fades in, so the surfaces do not compete.",
      avoidWhen:
        "Avoid it when hierarchy, order, or travel direction should remain visible.",
    },
    // Fade is the catch-all, so its usage example is the low-priority
    // fallback rule the rest of the docs recommend — not a from/to pair.
    ruleStyle: "fallback",
    variants: [
      {
        label: "fade-through",
        isDefault: true,
        args: "",
        ux: "A single neutral behavior with no directional cue. It is sequential, not a symmetric cross-fade.",
        gif: webGif(
          "fade-default",
          "One editorial page fades away before the next page fades into view.",
        ),
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
    blurb: "Ordered sibling screens moving side to side.",
    use: "sibling",
    intro:
      "Slide turns route order into a simple horizontal direction for peer screens.",
    decision: {
      whenToUse:
        "Use it for tabs, steps, dates, or other siblings with an obvious previous and next.",
      motion:
        "Forward pushes the current page left; backward reverses the same movement.",
      avoidWhen:
        "Avoid it for parent-to-child navigation or unordered destinations.",
    },
    ruleStyle: "ordered",
    variants: [
      {
        label: "slide",
        isDefault: true,
        args: "",
        ux: "One behavior: a direct horizontal push whose direction comes from the ordered route list.",
        gif: mobileGif(
          "slide-default",
          "Peer profile tabs push horizontally in route order and reverse when going back.",
        ),
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
    blurb: "Material shared-axis motion along x, y, or z.",
    use: "sibling",
    intro:
      "Axis coordinates translation, scale, and fade along one spatial axis. Choose the axis that matches the relationship in your UI.",
    decision: {
      whenToUse:
        "Use it for restrained Material-style movement between related peer screens.",
      motion:
        "Both pages coordinate along x, y, or z; route order supplies direction where the chosen type supports it.",
      avoidWhen: "Avoid it when the screens have no believable spatial axis.",
    },
    ruleStyle: "ordered",
    variants: [
      {
        label: "x · default",
        settings: [
          { kind: "type", value: "x" },
          { kind: "variant", value: "default" },
        ],
        isDefault: true,
        args: 'type: "x"',
        ux: "A fluid horizontal shared-axis transition. Route order decides left and right.",
        gif: mobileGif(
          "axis-x-default",
          "Two checkout steps move along a fluid horizontal shared axis.",
        ),
        demos: [
          {
            enterPath: "/demo/air-bnb/listings/l-003/checkout/method",
            exitPath: "/demo/air-bnb/listings/l-003/checkout/review",
          },
        ],
      },
      {
        label: "x · snappy",
        settings: [
          { kind: "type", value: "x" },
          { kind: "variant", value: "snappy" },
        ],
        args: 'type: "x", variant: "snappy"',
        ux: "The same horizontal model with a tighter spring for fast, compact interfaces.",
        gif: mobileGif(
          "axis-x-snappy",
          "Two messaging screens switch with a quick horizontal shared-axis spring.",
        ),
        demos: [
          {
            enterPath: "/demo/kakao-talk/chats",
            exitPath: "/demo/kakao-talk",
          },
        ],
      },
      {
        label: "y · default",
        settings: [
          { kind: "type", value: "y" },
          { kind: "variant", value: "default" },
        ],
        args: 'type: "y"',
        ux: "A vertical shared axis whose direction reverses with route order.",
      },
      {
        label: "y · non-directional",
        settings: [
          { kind: "type", value: "y" },
          { kind: "variant", value: "non-directional" },
        ],
        args: 'type: "y", variant: "non-directional"',
        ux: "Every destination enters with the same vertical gesture, even when route order reverses.",
        gif: mobileGif(
          "axis-y-non-directional",
          "Video destinations always enter with the same vertical shared-axis gesture.",
        ),
        demos: [
          {
            enterPath: "/demo/youtube-mobile/subscriptions",
            exitPath: "/demo/youtube-mobile",
          },
        ],
      },
      {
        label: "z · default",
        settings: [
          { kind: "type", value: "z" },
          { kind: "variant", value: "default" },
        ],
        args: 'type: "z"',
        ux: "Pages scale through depth, similar to a restrained container transform.",
      },
    ],
  },
  {
    name: "scroll",
    blurb: "A vertical sequence between full web pages.",
    use: "sibling",
    intro:
      "Scroll makes full web pages travel like a vertical sequence. It is a page transition, not browser scroll-position restoration.",
    decision: {
      whenToUse:
        "Use it for full-viewport web chapters, showcases, or an editorial sequence that should feel vertically continuous.",
      motion:
        "The next page travels upward into view; directional mode reverses that travel when users go back.",
      avoidWhen:
        "Avoid it for mobile app navigation, ordinary document scrolling, or pages that are not part of one sequence.",
    },
    ruleStyle: "ordered",
    variants: [
      {
        label: "directional",
        settings: [{ kind: "type", value: "directional" }],
        isDefault: true,
        args: 'type: "directional"',
        ux: "Route order decides direction: forward travels up and backward travels down.",
      },
      {
        label: "non-directional",
        settings: [{ kind: "type", value: "non-directional" }],
        args: 'type: "non-directional"',
        ux: "Every destination enters upward, including the return trip.",
        gif: webGif(
          "scroll-non-directional",
          "The ssgoi.dev home page and an Airbnb demo detail page replace each other with upward web-page motion.",
          360,
        ),
        demos: [
          {
            enterPath: "/showcase/air-bnb",
            exitPath: "/",
            platform: "web",
          },
        ],
      },
    ],
  },
  {
    name: "sheet",
    blurb: "A temporary task rising over its origin on mobile or web.",
    use: "drill-in",
    intro:
      "Sheet opens a temporary task from the bottom on mobile or web while preserving a visual relationship with the page beneath it.",
    decision: {
      whenToUse:
        "Use it for compose, filters, settings, or a short task that should keep its origin in context.",
      motion:
        "The task rises from the bottom; the background can stay still, scale back, or blur.",
      avoidWhen:
        "Avoid it for a permanent top-level destination or a deep flow that needs its own navigation stack.",
    },
    ruleStyle: "target",
    variants: [
      {
        label: "static",
        settings: [{ kind: "type", value: "static" }],
        isDefault: true,
        args: 'type: "static"',
        ux: "The sheet rises while the page underneath stays fixed. The clearest, quietest option.",
        gif: {
          ...mobileGif(
            "sheet-static",
            "A temporary task slides up as a bottom sheet over a stationary page.",
          ),
          label: "Mobile · Gamja Market",
        },
        extraGifs: [
          {
            ...webGif(
              "sheet-static-web",
              "A YouTube Music now-playing screen rises over the stationary desktop web app, then closes back to the home screen.",
              360,
            ),
            label: "Web · YouTube Music",
          },
        ],
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
        settings: [{ kind: "type", value: "scale" }],
        args: 'type: "scale"',
        ux: "The page scales back as the sheet rises, creating stacked-card depth.",
        gif: mobileGif(
          "sheet-scale",
          "A compose sheet rises while the page beneath scales into the background.",
        ),
        demos: [
          {
            enterPath: "/demo/material-mail/compose",
            exitPath: "/demo/material-mail",
          },
        ],
      },
      {
        label: "blur",
        settings: [{ kind: "type", value: "blur" }],
        args: 'type: "blur"',
        ux: "A live backdrop sits between the two pages, blurring and dimming the origin while the sheet rises above it.",
        gif: mobileGif(
          "sheet-blur",
          "A compose sheet rises while the originating page recedes into blur.",
        ),
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
    blurb: "One or more shared elements continue into the next page.",
    use: "drill-in",
    intro:
      "Hero preserves the identity of matching elements across two pages while the surrounding surfaces change.",
    decision: {
      whenToUse:
        "Use it when a thumbnail, avatar, or other stable entity appears on both pages and should visibly continue.",
      motion:
        "Each matched element morphs from its source bounds into its destination bounds; multiple distinct pairs can move together.",
      avoidWhen:
        "Avoid it when there is no stable shared identity. If one card should open into the whole page, Zoom is usually clearer.",
    },
    ruleStyle: "pair",
    identity: {
      source: {
        label: "Source page",
        attribute: "data-hero-exit-key",
      },
      destination: {
        label: "Destination page",
        attribute: "data-hero-enter-key",
      },
      keyRole:
        "The attribute value is the element's stable identity. Source and destination values must match exactly.",
      rules: [
        "You may mark multiple distinct key pairs; Hero animates every pair it can match.",
        "Keep each identity unique on a page. If a key is duplicated, the first element in DOM order is used.",
        "Pairs without a matching key on the other page are skipped.",
      ],
      failure:
        "With no matching pairs, Hero has no shared element to animate and becomes a no-op.",
      code: `{/* Source: list or collapsed page */}
<img
  data-hero-exit-key={item.id}
  src={item.thumbnail}
  alt={item.alt}
/>

{/* Destination: detail or expanded page */}
<img
  data-hero-enter-key={item.id}
  src={item.full}
  alt={item.alt}
/>`,
    },
    variants: [
      {
        label: "static · default",
        settings: [
          { kind: "type", value: "static" },
          { kind: "variant", value: "default" },
        ],
        isDefault: true,
        args: 'type: "static"',
        ux: "The surrounding pages switch without a surface fade while the shared element continues between them.",
      },
      {
        label: "fade · default",
        settings: [
          { kind: "type", value: "fade" },
          { kind: "variant", value: "default" },
        ],
        args: 'type: "fade"',
        ux: "The surrounding pages fade as the shared element continues, softening the hand-off.",
        gif: mobileGif(
          "hero-fade-default",
          "A photo morphs into its detail position while the surrounding pages fade.",
        ),
        demos: [
          {
            enterPath: "/demo/google-photos/p/ph-001",
            exitPath: "/demo/google-photos",
          },
        ],
      },
      {
        label: "static · smooth",
        settings: [
          { kind: "type", value: "static" },
          { kind: "variant", value: "smooth" },
        ],
        args: 'type: "static", variant: "smooth"',
        ux: "Smooth changes the shared element's interpolation for a softer, more continuous morph. It is independent of the static/fade type.",
        gif: webGif(
          "hero-static-smooth",
          "Several photo elements smoothly morph into a gallery while the page surfaces switch directly.",
        ),
        demos: [
          {
            enterPath: "/demo/airbnb-photo-tour/photos/kitchen-1",
            exitPath: "/demo/airbnb-photo-tour",
            platform: "web",
          },
        ],
      },
      {
        label: "fade · smooth",
        settings: [
          { kind: "type", value: "fade" },
          { kind: "variant", value: "smooth" },
        ],
        args: 'type: "fade", variant: "smooth"',
        ux: "Combines the smooth shared-element interpolation with a fading page hand-off.",
      },
    ],
  },
  {
    name: "zoom",
    blurb: "One selected card or image opens into a whole detail page.",
    use: "drill-in",
    intro:
      "The whole detail page unfolds from the selected card or image, using that element as its spatial anchor.",
    decision: {
      whenToUse:
        "Use it when a selected card or image should visibly open into its dedicated detail page.",
      motion:
        "One matched source expands toward the destination while the rest of the page follows the chosen type.",
      avoidWhen:
        "Avoid it when several shared elements should move together, or when the detail page cannot provide exactly one destination marker.",
    },
    ruleStyle: "pair",
    identity: {
      source: {
        label: "Source page",
        attribute: "data-zoom-exit-key",
      },
      destination: {
        label: "Destination page",
        attribute: "data-zoom-enter-key",
      },
      keyRole:
        "The value identifies the selected entity. The destination key must exactly match the source card or image that opened it.",
      rules: [
        "A list may contain many exit markers as long as each key is unique.",
        "The detail page must contain exactly one enter marker.",
        "If the same exit key is duplicated, the first element in DOM order is used.",
      ],
      failure:
        "An empty, missing, or mismatched key is a no-op. Zero or more than one enter marker on the destination is also a no-op.",
      code: `{/* Source: many unique cards are allowed */}
<img
  data-zoom-exit-key={photo.id}
  src={photo.thumbnail}
  alt={photo.alt}
/>

{/* Destination: exactly one enter marker */}
<img
  data-zoom-enter-key={photo.id}
  src={photo.full}
  alt={photo.alt}
/>`,
    },
    variants: [
      {
        label: "static · default",
        settings: [
          { kind: "type", value: "static" },
          { kind: "variant", value: "default" },
        ],
        isDefault: true,
        args: 'type: "static"',
        ux: "The originating surface stays visually steady while the selected content opens above it.",
        gif: mobileGif(
          "zoom-static-default",
          "A selected post opens into its detail page over a visually steady background.",
        ),
        demos: [
          {
            enterPath: "/demo/instagram/feed/p-001",
            exitPath: "/demo/instagram/profile/deaseungseung94",
          },
        ],
      },
      {
        label: "static · fade",
        settings: [
          { kind: "type", value: "static" },
          { kind: "variant", value: "fade" },
        ],
        args: 'type: "static", variant: "fade"',
        ux: "Adds a fade to the static background hand-off while retaining the same anchored zoom.",
      },
      {
        label: "expand · default",
        settings: [
          { kind: "type", value: "expand" },
          { kind: "variant", value: "default" },
        ],
        args: 'type: "expand"',
        ux: "The selected card grows into the detail surface, making containment feel explicit.",
        gif: mobileGif(
          "zoom-expand-default",
          "A selected card expands until it becomes the full detail surface.",
        ),
        demos: [
          {
            enterPath: "/demo/pinterest/feed/pin-1",
            exitPath: "/demo/pinterest",
          },
        ],
      },
      {
        label: "expand · fade",
        settings: [
          { kind: "type", value: "expand" },
          { kind: "variant", value: "fade" },
        ],
        args: 'type: "expand", variant: "fade"',
        ux: "Keeps the card-to-surface expansion but fades surrounding content for a softer reveal.",
      },
      {
        label: "blur · default",
        settings: [
          { kind: "type", value: "blur" },
          { kind: "variant", value: "default" },
        ],
        args: 'type: "blur"',
        ux: "The background loses focus as the selected content advances, creating a strong focus pull.",
      },
      {
        label: "blur · fade",
        settings: [
          { kind: "type", value: "blur" },
          { kind: "variant", value: "fade" },
        ],
        args: 'type: "blur", variant: "fade"',
        ux: "Combines the focus-pull blur type with the optional fade modifier.",
        gif: mobileGif(
          "zoom-blur-fade",
          "A listing image zooms into detail as the background blurs and fades.",
        ),
        demos: [
          {
            enterPath: "/demo/air-bnb/listings/l-003",
            exitPath: "/demo/air-bnb",
          },
        ],
      },
    ],
  },
  {
    name: "strip",
    blurb: "A perspective page swap with card-deck energy.",
    use: "decorative",
    intro:
      "Strip translates both pages through a shallow ±20° perspective turn, like exchanging cards in a deck.",
    decision: {
      whenToUse:
        "Use it for a gallery, portfolio, or selected card-deck moment that benefits from a strong perspective cue.",
      motion:
        "Pages translate past one another while tilting in perspective; it is not a full Y-axis flip.",
      avoidWhen:
        "Avoid it for frequent utility navigation or motion-sensitive experiences.",
    },
    ruleStyle: "pair",
    variants: [
      {
        label: "strip",
        isDefault: true,
        args: "",
        ux: "One expressive behavior: a translated perspective swap between whole pages.",
        gif: webGif(
          "strip-default",
          "Two portfolio pages trade places with a shallow perspective turn.",
        ),
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
    name: "film",
    blurb: "A cinematic shrink-and-tile with framed corners.",
    use: "decorative",
    intro:
      "Film builds a cinematic scene at runtime, keeps video live, and coordinates the pages and viewfinder corners with multiple springs.",
    decision: {
      whenToUse:
        "Use it for a selected cinematic moment, title sequence, or media experience.",
      motion:
        "Whole pages shrink and tile through the frame while corner borders reinforce the film treatment.",
      avoidWhen:
        "Avoid it for frequent or simple navigation, and on performance-critical flows.",
    },
    ruleStyle: "pair",
    variants: [
      {
        label: "default",
        isDefault: true,
        args: "",
        ux: "A runtime scene keeps video live while the pages and viewfinder corners move on coordinated spring timelines.",
        gif: webGif(
          "film-default",
          "Two cinematic pages shrink and tile through framed corners.",
          360,
        ),
        demos: [
          {
            enterPath: "/demo/lumen/cinematic-eye",
            exitPath: "/demo/lumen",
            platform: "web",
          },
        ],
      },
      {
        label: "borderColor",
        settings: [{ kind: "option", value: "borderColor" }],
        args: 'options: { borderColor: "#f97316" }',
        ux: "This does not change the motion. It only customizes the cinematic corner-border color.",
      },
    ],
  },
  {
    name: "rotate",
    blurb: "A whole-page planar spin.",
    use: "decorative",
    intro:
      "Rotate spins the outgoing and incoming pages through opposite 180° turns in the screen plane.",
    decision: {
      whenToUse:
        "Use it for a playful or emphatic switch where a full-screen spin fits the product personality.",
      motion:
        "The outgoing page rotates to 180° and disappears halfway; the incoming page unwinds from -180°.",
      avoidWhen:
        "Avoid it for frequent utility navigation, dense reading flows, or motion-sensitive contexts.",
    },
    ruleStyle: "pair",
    variants: [
      {
        label: "rotate",
        isDefault: true,
        args: "",
        ux: "One behavior: opposite planar half-turns with a clean midpoint hand-off.",
        gif: webGif(
          "rotate-default",
          "One product page spins away as the destination spins into place.",
        ),
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
    blurb: "A playful rotated zoom for a signature moment.",
    use: "decorative",
    intro:
      "Jaemin combines zoom and rotation into one deliberately playful page change.",
    decision: {
      whenToUse:
        "Use it for one special destination where product personality matters more than restraint.",
      motion:
        "The destination advances with a lively zoom and slight rotation.",
      avoidWhen:
        "Avoid it for everyday navigation, quick reading flows, or motion-sensitive contexts.",
    },
    ruleStyle: "pair",
    variants: [
      {
        label: "jaemin",
        isDefault: true,
        args: "",
        ux: "One signature behavior: a rotated zoom that makes the destination feel celebratory.",
        gif: webGif(
          "jaemin-default",
          "A playful page zooms and rotates into a colorful destination.",
        ),
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

export function getTransitionDoc(name: string): TransitionDoc | undefined {
  return TRANSITION_DOCS.find((t) => t.name === name);
}

/** Effect-only factory call string for a recorded combination. */
export function variantCall(
  doc: TransitionDoc,
  variant: TransitionVariant,
): string {
  return variant.args ? `${doc.name}({ ${variant.args} })` : `${doc.name}()`;
}
