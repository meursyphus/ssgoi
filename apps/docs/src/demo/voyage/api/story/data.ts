import type {
  ActivitySection,
  Profile,
  StoryDetail,
  StorySimple,
  TripsOverview,
} from "./types";

const cover = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`;

const seed: StorySimple[] = [
  {
    id: "s-001",
    title: "Three slow mornings in the hills above Kyoto",
    cover: cover("photo-1493976040374-85c8e12f0c0e"),
    location: "Kyoto, Japan",
    excerpt:
      "I came for the temples and stayed for the quiet. Every morning began with fog rolling off the bamboo and a cup of matcha I didn't want to finish.",
    author: "Mina Seo",
    authorInitial: "M",
    authorColor: "bg-rose-500",
    timeLabel: "2d",
    readMinutes: 6,
    likes: 248,
    saved: false,
  },
  {
    id: "s-002",
    title: "Chasing the green light over Tromsø",
    cover: cover("photo-1519681393784-d120267933ba"),
    location: "Tromsø, Norway",
    excerpt:
      "We waited four nights in the cold for the aurora. On the fifth, the whole sky cracked open at once and nobody said a word.",
    author: "Idris Vale",
    authorInitial: "I",
    authorColor: "bg-indigo-500",
    timeLabel: "4d",
    readMinutes: 8,
    likes: 1024,
    saved: true,
  },
  {
    id: "s-003",
    title: "A week of long lunches in Tuscany",
    cover: cover("photo-1500382017468-9049fed747ef"),
    location: "Val d'Orcia, Italy",
    excerpt:
      "No itinerary, just a rented Fiat and a list of trattorias from a friend's grandmother. The hills did the rest.",
    author: "Carla Pires",
    authorInitial: "C",
    authorColor: "bg-amber-500",
    timeLabel: "1w",
    readMinutes: 5,
    likes: 512,
    saved: false,
  },
  {
    id: "s-004",
    title: "The trail that almost beat me in Patagonia",
    cover: cover("photo-1469474968028-56623f02e42e"),
    location: "Torres del Paine, Chile",
    excerpt:
      "Day three, the wind was strong enough to lean on. I have never felt smaller or more awake at the same time.",
    author: "Theo Brandt",
    authorInitial: "T",
    authorColor: "bg-emerald-500",
    timeLabel: "1w",
    readMinutes: 11,
    likes: 776,
    saved: false,
  },
  {
    id: "s-005",
    title: "Sunset trams and pastéis in Lisbon",
    cover: cover("photo-1585208798174-6cedd86e019a"),
    location: "Lisbon, Portugal",
    excerpt:
      "I got beautifully lost in Alfama every single day. The 28 tram became my unreliable, charming compass.",
    author: "June Han",
    authorInitial: "J",
    authorColor: "bg-sky-500",
    timeLabel: "2w",
    readMinutes: 4,
    likes: 333,
    saved: true,
  },
  {
    id: "s-006",
    title: "Glassy water and empty roads on Jeju",
    cover: cover("photo-1584345015538-213f90f9ccbc"),
    location: "Jeju, South Korea",
    excerpt:
      "Rented a tiny car, circled the island clockwise, and stopped at every coastal café that looked like nobody knew about it.",
    author: "Noah Park",
    authorInitial: "N",
    authorColor: "bg-teal-500",
    timeLabel: "3w",
    readMinutes: 7,
    likes: 198,
    saved: false,
  },
  {
    id: "s-007",
    title: "Reflections at the foot of Banff",
    cover: cover("photo-1501785888041-af3ef285b470"),
    location: "Banff, Canada",
    excerpt:
      "The lake was so still it doubled the mountains. We sat on the dock until our coffee went cold, which felt like the point.",
    author: "Elsa Moreau",
    authorInitial: "E",
    authorColor: "bg-violet-500",
    timeLabel: "1mo",
    readMinutes: 6,
    likes: 905,
    saved: false,
  },
];

/** Article paragraphs that follow each story's excerpt (the lede). */
const bodies: Record<string, string[]> = {
  "s-001": [
    "I stayed in a small ryokan in Ōhara, forty minutes north of the city by bus. The owner served breakfast at seven sharp: grilled mackerel, pickles from her own garden, and rice so glossy it looked lacquered.",
    "After breakfast I walked the lane up to Sanzen-in before the tour buses arrived. The moss garden was still wet, and the only sound was a monk raking gravel somewhere out of sight.",
    "By the third morning I had stopped taking photos. I sat on the veranda with my tea, watched the fog lift off the cedar slopes, and let the day decide what it wanted to be.",
  ],
  "s-002": [
    "Our guide checked the forecast every hour and drove us further inland each night, chasing gaps in the cloud. By the fourth night we knew every petrol station between Tromsø and the Finnish border.",
    "On the fifth night she pulled over at a frozen lake near Skibotn and told us to wait. At 11:40 a faint green arc appeared over the ridge. Ten minutes later it was everywhere, rippling like a curtain someone had shaken out.",
    "Bring more layers than you think you need, a thermos, and spare batteries in an inside pocket. The cold drains them in minutes, and you will not want to miss the moment because your camera gave up.",
  ],
  "s-003": [
    "The list had eleven trattorias on it, written in pencil on the back of a recipe card. We made it to seven, and went back to the one in Bagno Vignoni three times.",
    "Lunch in Val d'Orcia is not a meal, it is an afternoon. Pici with garlic and tomato, a plate of pecorino from Pienza, and a carafe of house red that cost less than the parking.",
    "In the evenings we drove the white roads between the cypress lines with the windows down. No music, just the sound of gravel and the smell of cut hay drifting in.",
  ],
  "s-004": [
    "The W Trek is supposed to be the gentle version. Nobody mentioned that the wind in the French Valley can knock you off your feet, or that the walk to Grey Glacier would be the wettest hour of my life.",
    "On day three I sat behind a boulder for twenty minutes, too tired to decide whether to go on. A couple from Santiago shared their mate and a bag of dried peaches, and somehow that was enough to get me moving.",
    "The towers at sunrise were worth every blister. We left the refugio at four in the morning with headlamps and reached the lagoon just as the granite turned from grey to burning orange.",
  ],
  "s-005": [
    "I stayed in a tiled walk-up in Alfama with a window that looked straight onto the tram line. The 28 rattled past at seven every morning, and I stopped setting an alarm.",
    "Pastéis de nata are best from the small bakeries, eaten warm and standing up. My favourite was a counter near Largo do Chafariz de Dentro, where the owner dusted them with cinnamon without asking.",
    "Evenings meant climbing to the Miradouro de Santa Luzia, finding a spot on the wall, and watching the river turn gold. Somebody always had a guitar, and nobody was in a hurry to leave.",
  ],
  "s-006": [
    "I picked up a tiny electric car at the airport and drove the coastal road clockwise, with no plan beyond keeping the sea on my left. The loop takes about four hours if you never stop. I took four days.",
    "The best cafés had no signs: converted stone houses in Woljeong-ri and Pyoseon with a single window facing the water. I ordered hallabong juice in every one of them, and it never got old.",
    "On the last morning I climbed Seongsan Ilchulbong in the dark to catch the sunrise. The crater filled with light slowly, then all at once, and the haenyeo divers were already heading out below.",
  ],
  "s-007": [
    "We rented a canoe at Moraine Lake at six in the morning, before the shuttle crowds arrived. The water was glass, and every stroke sent perfect rings out toward the Valley of the Ten Peaks.",
    "Afternoons were for the Plain of Six Glaciers trail, with a stop at the old teahouse for lemon cake and a pot of Earl Grey. The walk down was quieter, just the creek and the odd marmot whistle.",
    "On our last night we sat on the dock at Two Jack Lake until the stars came out. Nobody talked much. It felt like the mountains were doing enough talking for all of us.",
  ],
};

/** The mock user's bookmarks. Mutable, so the Saved tab reflects toggles. */
const savedIds = new Set(seed.filter((s) => s.saved).map((s) => s.id));

const withSaved = (s: StorySimple): StorySimple => ({
  ...s,
  saved: savedIds.has(s.id),
});

const byId = (id: string) => seed.find((s) => s.id === id) ?? null;

const coverOf = (id: string) => byId(id)?.cover ?? "";

const trips: TripsOverview = {
  summary: "1 upcoming · 4 past",
  upcoming: {
    id: "t-lisbon",
    storyId: "s-005",
    cover: coverOf("s-005"),
    place: "Lisbon, Portugal",
    dateLabel: "Oct 12 – 18",
    detailLabel: "6 nights · 2 travelers",
    countdownLabel: "In 15 days",
    guideLabel: "Trip guide by June Han",
  },
  past: [
    {
      id: "t-kyoto",
      storyId: "s-001",
      cover: coverOf("s-001"),
      place: "Kyoto, Japan",
      dateLabel: "Apr 2026",
      detailLabel: "5 days",
    },
    {
      id: "t-tromso",
      storyId: "s-002",
      cover: coverOf("s-002"),
      place: "Tromsø, Norway",
      dateLabel: "Jan 2026",
      detailLabel: "6 days",
    },
    {
      id: "t-jeju",
      storyId: "s-006",
      cover: coverOf("s-006"),
      place: "Jeju, South Korea",
      dateLabel: "Aug 2025",
      detailLabel: "4 days",
    },
    {
      id: "t-banff",
      storyId: "s-007",
      cover: coverOf("s-007"),
      place: "Banff, Canada",
      dateLabel: "Jun 2025",
      detailLabel: "8 days",
    },
  ],
};

const profile: Omit<Profile, "recentlyRead"> = {
  name: "Alex Kim",
  handle: "@alexkim",
  city: "Seoul",
  bio: "Slow travel, early trains and far too many photos of doorways.",
  stats: [
    { label: "Countries", value: "11" },
    { label: "Trips", value: "5" },
    { label: "Followers", value: "1.2k" },
  ],
};

const recentlyReadIds = ["s-003", "s-004", "s-007", "s-006"];

const storyActivity = (
  id: string,
  storyId: string,
  actor: string,
  text: string,
  timeLabel: string,
  isNew: boolean,
  quote?: string,
) => {
  const story = byId(storyId);
  const author = seed.find((s) => s.author === actor);
  return {
    id,
    kind: "story" as const,
    actor,
    actorInitial: author?.authorInitial ?? actor[0],
    actorColor: author?.authorColor ?? "bg-[#FF5A5F]",
    text,
    quote,
    timeLabel,
    isNew,
    storyId,
    storyTitle: story?.title,
    storyCover: story?.cover,
  };
};

const followActivity = (
  id: string,
  actor: string,
  timeLabel: string,
  isNew: boolean,
) => {
  const author = seed.find((s) => s.author === actor);
  return {
    id,
    kind: "follow" as const,
    actor,
    actorInitial: author?.authorInitial ?? actor[0],
    actorColor: author?.authorColor ?? "bg-neutral-400",
    text: "started following you.",
    timeLabel,
    isNew,
  };
};

const activity: ActivitySection[] = [
  {
    title: "New",
    items: [
      storyActivity(
        "a-1",
        "s-001",
        "Mina Seo",
        "published a new story",
        "2h",
        true,
      ),
      storyActivity(
        "a-2",
        "s-002",
        "Idris Vale",
        "replied to your comment on",
        "5h",
        true,
        "Night five was the charm. Keep your batteries warm!",
      ),
      followActivity("a-3", "Carla Pires", "1d", true),
    ],
  },
  {
    title: "Earlier",
    items: [
      {
        ...storyActivity(
          "a-4",
          "s-005",
          "Voyage",
          "Your Lisbon trip starts in 15 days. Revisit your trip guide:",
          "2d",
          false,
        ),
        kind: "reminder",
      },
      storyActivity(
        "a-5",
        "s-006",
        "Noah Park",
        "liked your comment on",
        "3d",
        false,
      ),
      followActivity("a-6", "Elsa Moreau", "5d", false),
      storyActivity(
        "a-7",
        "s-004",
        "Theo Brandt",
        "published a new story",
        "1w",
        false,
      ),
    ],
  },
];

export const data = {
  all: () => seed.map(withSaved),
  byId: (id: string): StoryDetail | null => {
    const story = byId(id);
    return story ? { ...withSaved(story), body: bodies[id] ?? [] } : null;
  },
  /** The next three stories in feed order, wrapping around. */
  related: (id: string) => {
    const index = seed.findIndex((s) => s.id === id);
    return [1, 2, 3].map((step) =>
      withSaved(seed[(index + step) % seed.length]),
    );
  },
  saved: () => seed.filter((s) => savedIds.has(s.id)).map(withSaved),
  toggleSaved: (id: string) => {
    if (savedIds.has(id)) savedIds.delete(id);
    else savedIds.add(id);
    return savedIds.has(id);
  },
  trips: (): TripsOverview => structuredClone(trips),
  profile: (): Profile => ({
    ...structuredClone(profile),
    recentlyRead: recentlyReadIds
      .map(byId)
      .filter((s): s is StorySimple => s !== null)
      .map(withSaved),
  }),
  activity: (): ActivitySection[] => structuredClone(activity),
};
