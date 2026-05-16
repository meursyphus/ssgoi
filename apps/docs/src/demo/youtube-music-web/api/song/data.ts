import type { HomeData, ShelfCard, SongDetail } from "./types";

const COVERS = {
  irisOut:
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
  yinYang:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
  actually:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
  ghostagram:
    "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=600&q=80",
  yarrr:
    "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&q=80",
  nikeShoes:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  landingInLove:
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&q=80",
  rude: "https://images.unsplash.com/photo-1490375966855-d4209f8b0a02?w=600&q=80",
  catchCatch:
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
  duet: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600&q=80",
  spot: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
  showTheMoney:
    "https://images.unsplash.com/photo-1571974599782-87624638275e?w=600&q=80",
  bedroomPop:
    "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&q=80",
  lofi: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=600&q=80",
};

const card = (
  id: string,
  title: string,
  subtitle: string,
  thumbnail: string,
): ShelfCard => ({ id, title, subtitle, thumbnail });

const QUICK_PICKS: ShelfCard[] = [
  card(
    "yin-yang",
    "Yin and Yang (Fanxy Child Ver.)",
    "ZICO, Crush, DEAN & PENO • Yin and Yang (Fanxy C…",
    COVERS.yinYang,
  ),
  card(
    "actually-pt2",
    "Actually Pt. 2",
    "PENOMECO • 12M plays • Dry Flower",
    COVERS.actually,
  ),
  card(
    "ghostagram",
    "Ghostagram",
    "Spotbot • 3.2M plays • Ghostagram",
    COVERS.ghostagram,
  ),
  card("yarrr", "Yarrr", "HAON • 354K plays • Yarrr", COVERS.yarrr),
  card(
    "nike-shoes",
    "Nike Shoes (feat. Dynamic Duo)",
    "Beenzino • 34M plays • 2 4 : 2 6",
    COVERS.nikeShoes,
  ),
  card(
    "landing-in-love",
    "Landing in Love",
    "HANRORO • 68M plays • Take-off",
    COVERS.landingInLove,
  ),
  card("rude", "RUDE!", "Hearts2Hearts • 188M plays • RUDE!", COVERS.rude),
  card(
    "catch-catch",
    "Catch Catch",
    "YENA • 77M plays • LOVE CATCHER",
    COVERS.catchCatch,
  ),
];

const LISTEN_AGAIN: ShelfCard[] = [
  card("duet", "DUET", "Lilas Ikuta & ZICO • 527K views", COVERS.duet),
  card("spot", "SPOT! (feat. JENNIE)", "ZICO • 154M views", COVERS.spot),
  card(
    "show-the-money",
    "ON to the next one",
    "Crush, ZICO • Song • HAON",
    COVERS.showTheMoney,
  ),
  card(
    "bedroom-pop-mix",
    "Bedroom Pop Mix",
    "Clairo, beabadoobee • Mix",
    COVERS.bedroomPop,
  ),
  card("lofi-rainy", "Rainy Day Lofi", "Cozy Beats • 1 hr 28 min", COVERS.lofi),
];

const homeShelves: HomeData = {
  shelves: [
    {
      id: "quick-picks",
      title: "Quick picks",
      kind: "quick-picks",
      items: QUICK_PICKS,
    },
    {
      id: "listen-again",
      title: "Listen again",
      kind: "video-row",
      attribution: {
        name: "moon",
        avatar:
          "https://api.dicebear.com/9.x/initials/svg?seed=moon&backgroundType=gradientLinear",
      },
      items: LISTEN_AGAIN,
    },
  ],
};

const DEFAULT_UP_NEXT: ShelfCard[] = [
  card("kick-back", "KICK BACK", "Kenshi Yonezu • 3:24", COVERS.irisOut),
  card("lemon", "Lemon", "Kenshi Yonezu • 4:16", COVERS.bedroomPop),
  card("spot", "SPOT! (feat. JENNIE)", "ZICO • 3:02", COVERS.spot),
  card("duet", "DUET", "Lilas Ikuta & ZICO • 3:48", COVERS.duet),
  card("actually-pt2", "Actually Pt. 2", "PENOMECO • 3:21", COVERS.actually),
  card("ghostagram", "Ghostagram", "Spotbot • 2:55", COVERS.ghostagram),
];

const songs: SongDetail[] = [
  {
    id: "wggigwtz4dQ",
    title: "IRIS OUT",
    artist: "Kenshi Yonezu",
    album: "IRIS OUT",
    releaseYear: 2025,
    duration: "2:32",
    plays: "12M plays",
    thumbnail: COVERS.irisOut,
    description:
      "Kenshi Yonezu's 2025 single — the closing theme to a record-breaking anime feature.",
    upNext: DEFAULT_UP_NEXT,
    lyrics:
      "Step into the rain, eyes wide\nWhere the city forgets to sleep\nEverything we lose tonight\nIs everything we get to keep",
  },
];

export const data = {
  home: () => homeShelves,
  byId: (id: string): SongDetail | null => {
    const found = songs.find((s) => s.id === id);
    if (found) return { ...found, upNext: found.upNext.map((u) => ({ ...u })) };
    // Synthesize a detail entry from any shelf card referenced by id.
    const fromShelf =
      QUICK_PICKS.find((c) => c.id === id) ??
      LISTEN_AGAIN.find((c) => c.id === id) ??
      DEFAULT_UP_NEXT.find((c) => c.id === id);
    if (!fromShelf) return null;
    return {
      id: fromShelf.id,
      title: fromShelf.title,
      artist: fromShelf.subtitle.split(" • ")[0] ?? "Unknown",
      album: fromShelf.title,
      releaseYear: 2024,
      duration: "3:21",
      plays: "1M plays",
      thumbnail: fromShelf.thumbnail,
      description:
        "Mock track for the ssgoi YouTube Music showcase. Real metadata not available.",
      upNext: DEFAULT_UP_NEXT.filter((u) => u.id !== id),
      lyrics: "(instrumental)",
    };
  },
};
