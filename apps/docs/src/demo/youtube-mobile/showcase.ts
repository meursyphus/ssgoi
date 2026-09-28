import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/youtube-mobile";

export const youtubeMobileShowcase: ShowcaseApp = {
  slug: "youtube-mobile",
  name: "YouTube Mobile",
  tagline: "Axis-y tabs + zoom expand into the player + drill to channels",
  platforms: ["mobile"],
  category: "Video & Streaming",
  badge: "New",
  logo: "/youtube-mobile-icon.svg",
  demoOrigin: BASE,
  transitions: ["axis", "zoom", "drill", "fade", "sheet"],
  sourcePath: "apps/docs/src/demo/youtube-mobile",
  previewTransition: "axis",
  // ~42 s loop through the tabs in bottom-nav order (Home → Shorts →
  // Subscriptions → You → Home, axis). Each tab opens what its own screen
  // links to and closes it with a real history back, which replays the
  // push's effect in reverse. Home: the lead card zooms into the player and
  // its channel row drills one level deeper. Shorts: Remix raises Create
  // (sheet), then the bell drills into Notifications, whose thumbnail zooms
  // into the player. Subscriptions: a Shorts card zooms full screen. You: a
  // History card zooms into the player and Search fades in. The remaining
  // entry points (Home's bell and search, channel avatars, a channel's
  // uploads, Up next) play on the detail clips and in the effect loops.
  tourStartLabel: "Home",
  tour: [
    {
      push: `${BASE}/watch/deep-work-desk`,
      transition: "zoom",
      label: "Watch",
    },
    {
      push: `${BASE}/channel/maya-builds`,
      transition: "drill",
      label: "Channel",
    },
    { back: true },
    { back: true },
    { replace: `${BASE}/shorts`, transition: "axis", label: "Shorts" },
    { push: `${BASE}/create`, transition: "sheet", label: "Create" },
    { back: true },
    {
      push: `${BASE}/notifications`,
      transition: "drill",
      label: "Notifications",
    },
    {
      push: `${BASE}/watch/jazz-radio`,
      transition: "zoom",
      label: "Watch",
    },
    { back: true },
    { back: true },
    {
      replace: `${BASE}/subscriptions`,
      transition: "axis",
      label: "Subscriptions",
    },
    { push: `${BASE}/shorts/tiny-desk`, transition: "zoom", label: "Short" },
    { back: true },
    { replace: `${BASE}/profile`, transition: "axis", label: "You" },
    {
      push: `${BASE}/watch/design-details`,
      transition: "zoom",
      label: "Watch",
    },
    { back: true },
    // Recent searches are text only; a shorter hold keeps the card lively.
    {
      push: `${BASE}/search`,
      transition: "fade",
      label: "Search",
      dwell: 1100,
    },
    { back: true },
    { replace: BASE, transition: "axis", label: "Home" },
  ],
  // One clip per flow, each a push from exitPath and a real back to it:
  // tabs, then list → detail, search and the create sheet, then flows that
  // start on a detail screen (Watch, Channel, Notifications).
  clips: [
    {
      title: "Home → Subscriptions (axis y)",
      transition: "axis",
      enterPath: `${BASE}/subscriptions`,
      exitPath: BASE,
      intervalMs: 2800,
      caption:
        "Every bottom-nav destination rises through the same soft cross-fade",
    },
    {
      title: "Home → Watch (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/watch/deep-work-desk`,
      exitPath: BASE,
      intervalMs: 3000,
      caption: "The tapped thumbnail grows into the player at the top",
    },
    {
      title: "Home → Short (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/shorts/sunset-concert`,
      exitPath: BASE,
      intervalMs: 3000,
      caption: "A Shorts shelf card grows into the full-screen vertical player",
    },
    {
      title: "Subscriptions → Short (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/shorts/tiny-desk`,
      exitPath: `${BASE}/subscriptions`,
      intervalMs: 3000,
      caption: "A subscription's short grows into the vertical player",
    },
    {
      title: "You → Watch (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/watch/design-details`,
      exitPath: `${BASE}/profile`,
      intervalMs: 3000,
      caption: "A History card resumes the video by growing into the player",
    },
    {
      title: "Subscriptions → Channel (drill)",
      transition: "drill",
      enterPath: `${BASE}/channel/field-notes`,
      exitPath: `${BASE}/subscriptions`,
      intervalMs: 2800,
      caption: "Channel avatars push the channel page in from the right",
    },
    {
      title: "Home → Notifications (drill)",
      transition: "drill",
      enterPath: `${BASE}/notifications`,
      exitPath: BASE,
      intervalMs: 2800,
      caption: "The bell pushes the notification inbox in from the right",
    },
    {
      title: "Home → Search (fade)",
      transition: "fade",
      enterPath: `${BASE}/search`,
      exitPath: BASE,
      intervalMs: 2600,
      caption: "Search fades in over the feed in place, with no slide",
    },
    {
      title: "Home → Create (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/create`,
      exitPath: BASE,
      intervalMs: 3000,
      caption: "The create surface rises without carrying the bottom nav",
    },
    {
      title: "Watch → Up next (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/watch/mountain-morning`,
      exitPath: `${BASE}/watch/deep-work-desk`,
      intervalMs: 3000,
      caption: "An Up next card grows into the player in place of the video",
    },
    {
      title: "Watch → Channel (drill)",
      transition: "drill",
      enterPath: `${BASE}/channel/maya-builds`,
      exitPath: `${BASE}/watch/deep-work-desk`,
      intervalMs: 2800,
      caption: "The channel row under the player drills into the channel",
    },
    {
      title: "Channel → Watch (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/watch/weeknight-recipes`,
      exitPath: `${BASE}/channel/studio-kitchen`,
      intervalMs: 3000,
      caption:
        "A channel's upload grows into the player; Back shrinks it into place",
    },
    {
      title: "Notifications → Watch (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/watch/jazz-radio`,
      exitPath: `${BASE}/notifications`,
      intervalMs: 3000,
      caption: "A notification's small thumbnail expands into the player",
    },
    {
      title: "Notifications → Channel (drill)",
      transition: "drill",
      enterPath: `${BASE}/channel/studio-kitchen`,
      exitPath: `${BASE}/notifications`,
      intervalMs: 2800,
      caption:
        "An avatar in the inbox pushes its channel one level deeper, same slide",
    },
  ],
};
