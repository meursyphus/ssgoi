import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/instagram";
// The demo origin redirects here, so the tour starts and ends on the grid.
const PROFILE = `${BASE}/profile/deaseungseung94`;

export const instagramShowcase: ShowcaseApp = {
  slug: "instagram",
  name: "Instagram",
  tagline: "Zoom into posts + sheet stories and create + slide between tabs",
  platforms: ["mobile"],
  category: "Social",
  badge: "New",
  logo: "/instagram-icon.svg",
  demoOrigin: BASE,
  transitions: ["zoom", "slide", "sheet", "drill", "fade"],
  sourcePath: "apps/docs/src/demo/instagram",
  previewTransition: "zoom",
  // ~37 s loop: the profile's tabs left to right (grid → reels → tagged),
  // then the bottom nav in order (Profile → Home → Explore → Profile). Every
  // screen opened on the way closes with a real history back, so its effect
  // plays in reverse (post folds into its tile, sheets slide down, followers
  // drill out). Most moves match a detail clip below,
  // so a screen found in search opens that clip.
  tourStart: PROFILE,
  tourStartLabel: "Profile",
  tour: [
    { push: `${BASE}/feed/p-001`, transition: "zoom", label: "Post" },
    {
      push: `${BASE}/stories/deaseungseung94`,
      transition: "sheet",
      label: "Story",
    },
    { back: true },
    { back: true },
    {
      push: `${BASE}/follows/followers`,
      transition: "drill",
      label: "Followers",
    },
    { back: true },
    { replace: `${PROFILE}/reels`, transition: "slide", label: "Reels tab" },
    { push: `${BASE}/reels/r-001`, transition: "zoom", label: "Reel" },
    { back: true },
    { replace: `${PROFILE}/tagged`, transition: "slide", label: "Tagged" },
    { replace: `${BASE}/home`, transition: "fade", label: "Home" },
    { push: `${BASE}/stories/miso_devv`, transition: "sheet", label: "Story" },
    { back: true },
    { push: `${BASE}/create`, transition: "sheet", label: "New post" },
    { back: true },
    { replace: `${BASE}/explore`, transition: "fade", label: "Explore" },
    { push: `${BASE}/feed/p-008`, transition: "zoom", label: "Post" },
    {
      push: `${BASE}/feed/p-008/comments`,
      transition: "sheet",
      label: "Comments",
    },
    { back: true },
    { back: true },
    { replace: PROFILE, transition: "fade", label: "Profile" },
  ],
  // Detail page: one player per flow, tabs first, then tiles into their
  // screens, the sheets, and a story opened from inside a post. Each player
  // starts on exitPath, pushes enterPath and returns with a real back.
  clips: [
    {
      title: "Home → Explore (fade)",
      transition: "fade",
      enterPath: `${BASE}/explore`,
      exitPath: `${BASE}/home`,
      caption: "Bottom-nav tabs cross-fade, each keeping its own scroll",
    },
    {
      title: "Grid → Reels tab (slide)",
      transition: "slide",
      enterPath: `${PROFILE}/reels`,
      exitPath: PROFILE,
      caption: "Profile tabs slide in tab order; the header stays put",
    },
    {
      title: "Grid → Post (zoom static)",
      transition: "zoom",
      enterPath: `${BASE}/feed/p-001`,
      exitPath: PROFILE,
      caption: "The tapped thumbnail expands into the post",
    },
    {
      title: "Explore → Post (zoom static)",
      transition: "zoom",
      enterPath: `${BASE}/feed/p-008`,
      exitPath: `${BASE}/explore`,
      caption: "Explore tiles open the same way and fold back on Back",
    },
    {
      title: "Reels tab → Reel (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/reels/r-001`,
      exitPath: `${PROFILE}/reels`,
      caption: "The 9:16 tile grows into the full-screen reel",
    },
    {
      title: "Home → Story (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/stories/miso_devv`,
      exitPath: `${BASE}/home`,
      caption: "A story-tray ring slides the story up over the feed",
    },
    {
      title: "Highlight → Story (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/stories/hl-blog`,
      exitPath: PROFILE,
      caption: "A highlight circle slides its story up over the profile",
    },
    {
      title: "Profile → Followers (drill)",
      transition: "drill",
      enterPath: `${BASE}/follows/followers`,
      exitPath: PROFILE,
      caption: "The follower count pushes the list in from the right",
    },
    {
      title: "Profile → New post (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/create`,
      exitPath: PROFILE,
      caption: "The create flow slides up over the profile",
    },
    {
      title: "Post → Comments (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/feed/p-008/comments`,
      exitPath: `${BASE}/feed/p-008`,
      caption: "Comments rise over the post and slide back down",
    },
    {
      title: "Post → Story (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/stories/deaseungseung94`,
      exitPath: `${BASE}/feed/p-001`,
      caption: "The author's ring on a post slides their story up",
    },
  ],
};
