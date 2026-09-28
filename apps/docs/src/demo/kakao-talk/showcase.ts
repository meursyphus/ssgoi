import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/kakao-talk";

export const kakaoTalkShowcase: ShowcaseApp = {
  slug: "kakao-talk",
  name: "KakaoTalk",
  tagline: "Tab axis + sheet profile + drill chat detail",
  platforms: ["mobile"],
  category: "Messenger",
  badge: "New",
  logo: "/kakao-talk-icon.svg",
  demoOrigin: BASE,
  transitions: ["axis", "sheet", "drill", "fade", "hero"],
  sourcePath: "apps/docs/src/demo/kakao-talk",
  previewTransition: "axis",
  // ~35 s loop along the bottom tabs (Friends → Chats → More → Friends).
  // Each tab opens something and closes it with a real history back, so the
  // sheet drops, the drill slides out and the photo shrinks into its bubble.
  // Riley's room opens twice from Chats: once for a photo, once for the
  // drawer (two deep each, and short, so other previews never wait long).
  // Sheets open photo-backed profiles so the rise reads at card size.
  tourStartLabel: "Friends",
  tour: [
    { push: `${BASE}/profile/f-002`, transition: "sheet", label: "Profile" },
    { back: true },
    { replace: `${BASE}/chats`, transition: "axis", label: "Chats" },
    { push: `${BASE}/chats/c-002`, transition: "drill", label: "Chat room" },
    {
      push: `${BASE}/chats/c-002/photo/m-002-3`,
      transition: "hero",
      label: "Photo",
    },
    { back: true },
    { back: true },
    { push: `${BASE}/search`, transition: "fade", label: "Search" },
    { back: true },
    { push: `${BASE}/chats/c-002`, transition: "drill", label: "Chat room" },
    {
      push: `${BASE}/chats/c-002/drawer`,
      transition: "drill",
      label: "Drawer",
    },
    { back: true },
    { back: true },
    { replace: `${BASE}/more`, transition: "axis", label: "More" },
    { push: `${BASE}/profile/me`, transition: "sheet", label: "My profile" },
    { back: true },
    { replace: BASE, transition: "axis", label: "Friends" },
  ],
  // One clip per flow, in the order a user meets them: the tab axis, list →
  // detail, the sheets, then the flows inside a room. Each clip starts on
  // exitPath, pushes enterPath and comes back with a real history back.
  clips: [
    {
      title: "Friends → Chats (axis)",
      transition: "axis",
      enterPath: `${BASE}/chats`,
      exitPath: BASE,
      intervalMs: 2400,
      caption: "The bottom tabs slide sideways, and the tab bar stays put",
    },
    {
      title: "Chats → More (axis)",
      transition: "axis",
      enterPath: `${BASE}/more`,
      exitPath: `${BASE}/chats`,
      intervalMs: 2400,
      caption:
        "Tab order sets the direction, so coming back slides the other way",
    },
    {
      title: "Chats → Chat room (drill)",
      transition: "drill",
      enterPath: `${BASE}/chats/c-002`,
      exitPath: `${BASE}/chats`,
      intervalMs: 2600,
      caption: "A room pushes in from the right over the chat list",
    },
    {
      title: "Chats → Search (fade)",
      transition: "fade",
      enterPath: `${BASE}/search`,
      exitPath: `${BASE}/chats`,
      intervalMs: 2400,
      caption: "Search swaps in place, from any of the three tabs",
    },
    {
      title: "Friends → Profile (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/profile/f-002`,
      exitPath: BASE,
      intervalMs: 2600,
      caption: "The profile card rises while the friend list stays still",
    },
    {
      title: "Friends → Add friend (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/add-friend`,
      exitPath: BASE,
      intervalMs: 2600,
      caption: "The header's add-friend button opens a sheet of suggestions",
    },
    {
      title: "Chats → New chat (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/new-chat`,
      exitPath: `${BASE}/chats`,
      intervalMs: 2600,
      caption: "The friend picker for a new chat rises over the list",
    },
    {
      title: "More → My profile (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/profile/me`,
      exitPath: `${BASE}/more`,
      intervalMs: 2600,
      caption: "Your own profile card rises from the More tab",
    },
    {
      title: "Chat room → Profile (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/profile/f-003?room=c-002`,
      exitPath: `${BASE}/chats/c-002`,
      intervalMs: 2600,
      caption: "Tapping a sender's avatar lifts their profile over the room",
    },
    {
      title: "Chat room → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/chats/c-002/photo/m-002-3`,
      exitPath: `${BASE}/chats/c-002`,
      intervalMs: 2800,
      caption: "The photo in the bubble grows into the full-screen viewer",
    },
    {
      title: "Chat room → Drawer (drill)",
      transition: "drill",
      enterPath: `${BASE}/chats/c-002/drawer`,
      exitPath: `${BASE}/chats/c-002`,
      intervalMs: 2600,
      caption:
        "The ≡ button drills into the room's drawer of photos and members",
    },
    {
      title: "Drawer → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/chats/c-002/photo/m-002-3`,
      exitPath: `${BASE}/chats/c-002/drawer`,
      intervalMs: 2800,
      caption:
        "A drawer thumbnail opens the same viewer and shrinks back into it",
    },
  ],
};
