import type { HomeData, SongCard, SongDetail } from "./types";

const COVERS = {
  taylor:
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80",
  bedroomPop:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  studyJazz:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
  cityPop:
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80",
  midnightDrive:
    "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80",
  acoustic:
    "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
  electroPop:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  rnb: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  rainyDay:
    "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=800&q=80",
  workout:
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
  classical:
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80",
  indie: "https://images.unsplash.com/photo-1501527459-cea9c6c14c2e?w=800&q=80",
  podcast:
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
  hipHop:
    "https://images.unsplash.com/photo-1571974599782-87624638275e?w=800&q=80",
  kpop: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
  lofi: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=800&q=80",
  rock: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&q=80",
  cozy: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80",
  driveSunset:
    "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&q=80",
  pianoVibe:
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80",
};

const songs: SongDetail[] = [
  {
    id: "wggigwtz4dQ",
    title: "1989 (Taylor's Version)",
    artist: "Taylor Swift",
    thumbnail: COVERS.taylor,
    duration: "3:31",
    plays: "1.2B 회 재생",
    album: "1989 (Taylor's Version)",
    releaseYear: 2023,
    description:
      "재녹음 시리즈의 정점. 1989의 모든 트랙이 새로운 사운드와 추가된 보너스 트랙으로 돌아왔다.",
    upNext: [
      mk("anti-hero", "Anti-Hero", "Taylor Swift", COVERS.taylor, "3:21"),
      mk("blank-space", "Blank Space", "Taylor Swift", COVERS.taylor, "3:51"),
      mk("style", "Style", "Taylor Swift", COVERS.taylor, "3:51"),
      mk("shake-it-off", "Shake It Off", "Taylor Swift", COVERS.taylor, "3:39"),
      mk(
        "wildest-dreams",
        "Wildest Dreams",
        "Taylor Swift",
        COVERS.taylor,
        "3:40",
      ),
      mk("bad-blood", "Bad Blood", "Taylor Swift", COVERS.taylor, "3:31"),
    ],
    lyrics:
      "I stay out too late\nGot nothing in my brain\nThat's what people say, mmm-mmm\nThat's what people say, mmm-mmm\n\nI go on too many dates\nBut I can't make 'em stay\nAt least that's what people say, mmm-mmm",
  },
  {
    id: "anti-hero",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    thumbnail: COVERS.electroPop,
    duration: "3:21",
    plays: "640M 회 재생",
    album: "Midnights",
    releaseYear: 2022,
    description:
      "Midnights의 리드 싱글. 자기 모순과 불안을 정직하게 풀어낸 곡.",
    upNext: relatedFromFallback(),
    lyrics:
      "I have this thing where I get older but just never wiser\nMidnights become my afternoons\nWhen my depression works the graveyard shift",
  },
  {
    id: "lofi-rainy",
    title: "Rainy Day Coffee Shop",
    artist: "Cozy Beats",
    thumbnail: COVERS.lofi,
    duration: "2:48",
    plays: "8.2M 회 재생",
    album: "Lofi Sessions, Vol. 3",
    releaseYear: 2024,
    description: "비 오는 카페에서 천천히 흐르는 로파이 비트.",
    upNext: relatedFromFallback(),
    lyrics: "(instrumental)",
  },
  {
    id: "study-jazz",
    title: "Late Night Study Jazz",
    artist: "The Coffee Quartet",
    thumbnail: COVERS.studyJazz,
    duration: "4:12",
    plays: "3.4M 회 재생",
    album: "Jazz for Focus",
    releaseYear: 2023,
    description: "조용한 트리오 재즈, 일에 집중하기 좋은 분위기.",
    upNext: relatedFromFallback(),
    lyrics: "(instrumental)",
  },
  {
    id: "city-pop",
    title: "Plastic Love",
    artist: "Mariya Takeuchi",
    thumbnail: COVERS.cityPop,
    duration: "4:51",
    plays: "260M 회 재생",
    album: "VARIETY",
    releaseYear: 1984,
    description: "시티팝의 상징. 80년대 도쿄의 밤을 그대로 옮긴 듯한 그루브.",
    upNext: relatedFromFallback(),
    lyrics: "突然のキスや熱いまなざしで\n恋のプログラムを狂わせないでね",
  },
];

function mk(
  id: string,
  title: string,
  artist: string,
  thumbnail: string,
  duration: string,
  extra: Partial<SongCard> = {},
): SongCard {
  return { id, title, artist, thumbnail, duration, ...extra };
}

function relatedFromFallback(): SongCard[] {
  return [
    mk(
      "lofi-rainy",
      "Rainy Day Coffee Shop",
      "Cozy Beats",
      COVERS.lofi,
      "2:48",
    ),
    mk(
      "study-jazz",
      "Late Night Study Jazz",
      "The Coffee Quartet",
      COVERS.studyJazz,
      "4:12",
    ),
    mk("city-pop", "Plastic Love", "Mariya Takeuchi", COVERS.cityPop, "4:51"),
    mk(
      "midnight-drive",
      "Midnight Drive",
      "Neon Skyline",
      COVERS.midnightDrive,
      "3:35",
    ),
    mk(
      "acoustic-sun",
      "Acoustic Sunrise",
      "Cas Walker",
      COVERS.acoustic,
      "3:09",
    ),
  ];
}

const homeShelves: HomeData = {
  hero: {
    id: "hero-mix",
    eyebrow: "당신을 위한 믹스",
    title: "1989 (Taylor's Version)",
    subtitle: "Taylor Swift • 21곡 · 1시간 12분",
    thumbnail: COVERS.taylor,
    sideTitle: "잊고 있던 즐겨찾기",
    sideItems: [
      mk("city-pop", "Plastic Love", "Mariya Takeuchi", COVERS.cityPop, "4:51"),
      mk(
        "midnight-drive",
        "Midnight Drive",
        "Neon Skyline",
        COVERS.midnightDrive,
        "3:35",
      ),
      mk(
        "acoustic-sun",
        "Acoustic Sunrise",
        "Cas Walker",
        COVERS.acoustic,
        "3:09",
      ),
      mk("indie-summer", "Indie Summer", "The Vanguard", COVERS.indie, "3:22"),
      mk("kpop-glow", "Glow Up", "Aurora Line", COVERS.kpop, "3:02"),
    ],
  },
  shelves: [
    {
      id: "quick-picks",
      title: "빠른 선곡",
      kind: "list",
      items: [
        mk("anti-hero", "Anti-Hero", "Taylor Swift", COVERS.electroPop, "3:21"),
        mk(
          "wggigwtz4dQ",
          "Cruel Summer",
          "Taylor Swift",
          COVERS.taylor,
          "2:58",
        ),
        mk(
          "city-pop",
          "Plastic Love",
          "Mariya Takeuchi",
          COVERS.cityPop,
          "4:51",
        ),
        mk(
          "midnight-drive",
          "Midnight Drive",
          "Neon Skyline",
          COVERS.midnightDrive,
          "3:35",
        ),
        mk(
          "acoustic-sun",
          "Acoustic Sunrise",
          "Cas Walker",
          COVERS.acoustic,
          "3:09",
        ),
        mk("rnb-velvet", "Velvet Hour", "S.O.U.L.", COVERS.rnb, "4:02"),
        mk(
          "indie-summer",
          "Indie Summer",
          "The Vanguard",
          COVERS.indie,
          "3:22",
        ),
        mk("kpop-glow", "Glow Up", "Aurora Line", COVERS.kpop, "3:02"),
      ],
    },
    {
      id: "listen-again",
      title: "다시 듣기",
      kind: "row",
      items: [
        mk(
          "lofi-rainy",
          "Lofi Rainy Mix",
          "Cozy Beats",
          COVERS.lofi,
          "1시간 28분",
          {
            subtitle: "플레이리스트 · 24곡",
          },
        ),
        mk(
          "study-jazz",
          "Jazz for Focus",
          "The Coffee Quartet",
          COVERS.studyJazz,
          "55분",
          {
            subtitle: "플레이리스트 · 14곡",
          },
        ),
        mk(
          "midnight-drive",
          "Synthwave Drive",
          "Neon Skyline",
          COVERS.midnightDrive,
          "1시간 9분",
          {
            subtitle: "라디오 · Synthwave",
          },
        ),
        mk(
          "rock-anthem",
          "Rock Anthems",
          "Various",
          COVERS.rock,
          "1시간 42분",
          {
            subtitle: "플레이리스트 · 30곡",
          },
        ),
        mk(
          "classical",
          "Morning Classical",
          "Various",
          COVERS.classical,
          "2시간 15분",
          {
            subtitle: "플레이리스트 · 38곡",
          },
        ),
        mk("kpop", "K-Pop Now", "Various", COVERS.kpop, "1시간 5분", {
          subtitle: "라디오 · K-Pop",
        }),
      ],
    },
    {
      id: "from-saved",
      title: "당신의 저장 목록에서",
      kind: "row",
      items: [
        mk(
          "bedroom-pop",
          "bedroom pop",
          "Clairo",
          COVERS.bedroomPop,
          "EP · 6곡",
        ),
        mk(
          "rainy-day",
          "Rainy Day Coffee",
          "Cozy Beats",
          COVERS.rainyDay,
          "앨범 · 9곡",
        ),
        mk(
          "electro-pop",
          "Electric Skin",
          "Polaris",
          COVERS.electroPop,
          "앨범 · 11곡",
        ),
        mk(
          "indie-summer",
          "Indie Summer",
          "The Vanguard",
          COVERS.indie,
          "앨범 · 10곡",
        ),
        mk(
          "piano-vibe",
          "Piano Reverie",
          "Akira Sato",
          COVERS.pianoVibe,
          "앨범 · 8곡",
        ),
        mk(
          "hip-hop",
          "Boom Bap Now",
          "Various",
          COVERS.hipHop,
          "플레이리스트 · 18곡",
        ),
      ],
    },
    {
      id: "stations",
      title: "분위기로 듣기",
      kind: "row",
      items: [
        mk("workout", "운동 부스터", "Various", COVERS.workout, "라디오", {
          subtitle: "라디오 · 운동",
        }),
        mk("cozy", "포근한 저녁", "Various", COVERS.cozy, "라디오", {
          subtitle: "라디오 · 휴식",
        }),
        mk(
          "drive-sunset",
          "선셋 드라이브",
          "Various",
          COVERS.driveSunset,
          "라디오",
          {
            subtitle: "라디오 · 드라이브",
          },
        ),
        mk(
          "podcast-am",
          "Morning Brew",
          "Daily Pod",
          COVERS.podcast,
          "팟캐스트",
          {
            subtitle: "팟캐스트 · Today",
          },
        ),
        mk(
          "classical-focus",
          "고전 음악 집중",
          "Various",
          COVERS.classical,
          "라디오",
          {
            subtitle: "라디오 · 집중",
          },
        ),
      ],
    },
  ],
};

export const data = {
  home: () => homeShelves,
  byId: (id: string): SongDetail | null => {
    const found = songs.find((s) => s.id === id);
    if (found) return { ...found, upNext: found.upNext.map((u) => ({ ...u })) };
    // fallback — synthesize a detail for any id referenced by cards
    const fromShelf = findCardEverywhere(id);
    if (!fromShelf) return null;
    return {
      ...fromShelf,
      album: fromShelf.title,
      releaseYear: 2024,
      description: "ssgoi 데모를 위한 가상 트랙입니다.",
      upNext: relatedFromFallback().filter((c) => c.id !== id),
      lyrics: "(instrumental)",
    };
  },
};

function findCardEverywhere(id: string): SongCard | null {
  const all: SongCard[] = [
    ...homeShelves.hero.sideItems,
    ...homeShelves.shelves.flatMap((s) => s.items),
  ];
  return all.find((c) => c.id === id) ?? null;
}
