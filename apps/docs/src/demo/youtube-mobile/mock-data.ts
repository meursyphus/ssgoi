export type Channel = {
  id: string;
  name: string;
  handle: string;
  /** Avatar image. The signed-in user's own channel has none (initials). */
  image?: string;
  banner?: string;
  subscribers: string;
  videoCount: string;
  about: string;
};

export type MockVideo = {
  id: string;
  title: string;
  channelId: string;
  channel: string;
  views: string;
  ago: string;
  image: string;
  duration?: string;
  live?: boolean;
  topics: string[];
  likes: number;
  comments: string;
  description: string;
};

export type MockShort = {
  id: string;
  title: string;
  channelId: string;
  channel: string;
  views: string;
  image: string;
  likes: number;
  comments: string;
  caption: string;
};

export type Comment = { author: string; ago: string; text: string };

export const BASE = "/demo/youtube-mobile";

/** 21400 → "21K", 1_200_000 → "1.2M" (YouTube's compact counts). */
export function compactCount(value: number) {
  if (value >= 1_000_000) return `${+(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}K`;
  if (value >= 1000) return `${+(value / 1000).toFixed(1)}K`;
  return String(value);
}

const unsplash = (photo: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const SELF_CHANNEL_ID = "alexmakes";

export const channels: Channel[] = [
  {
    id: "maya-builds",
    name: "Maya Builds",
    handle: "@mayabuilds",
    image: "https://picsum.photos/seed/yt-maya/160/160",
    banner: unsplash("1497215728101-856f4ea42174", 1100, 300),
    subscribers: "1.4M subscribers",
    videoCount: "212 videos",
    about: "Workspaces, tools and the habits that make long projects finish.",
  },
  {
    id: "field-notes",
    name: "Field Notes",
    handle: "@fieldnotes",
    image: "https://picsum.photos/seed/yt-field/160/160",
    banner: unsplash("1506905925346-21bda4d32df4", 1100, 300),
    subscribers: "3.2M subscribers",
    videoCount: "486 videos",
    about: "Slow travel, live music and long mixes for making things.",
  },
  {
    id: "studio-kitchen",
    name: "Studio Kitchen",
    handle: "@studiokitchen",
    image: "https://picsum.photos/seed/yt-kitchen/160/160",
    banner: unsplash("1490645935967-10de6ba17061", 1100, 300),
    subscribers: "918K subscribers",
    videoCount: "301 videos",
    about: "Weeknight cooking from a small restaurant kitchen.",
  },
  {
    id: "open-studio",
    name: "Open Studio",
    handle: "@openstudio",
    image: "https://picsum.photos/seed/yt-studio/160/160",
    banner: unsplash("1561070791-2526d30994b5", 1100, 300),
    subscribers: "264K subscribers",
    videoCount: "97 videos",
    about: "A product design team sharing how the work really gets done.",
  },
  {
    id: "new-architecture",
    name: "New Architecture",
    handle: "@newarchitecture",
    image: "https://picsum.photos/seed/yt-architecture/160/160",
    banner: unsplash("1503387762-592deb58ef4e", 1100, 300),
    subscribers: "1.1M subscribers",
    videoCount: "158 videos",
    about: "Buildings that work with the climate instead of against it.",
  },
];

const selfChannel: Channel = {
  id: SELF_CHANNEL_ID,
  name: "Alex Morgan",
  handle: "@alexmakes",
  subscribers: "No subscribers",
  videoCount: "No videos",
  about: "Collecting ideas for a first Short.",
};

export const videos: MockVideo[] = [
  {
    id: "deep-work-desk",
    title: "I rebuilt my workspace for deep work",
    channelId: "maya-builds",
    channel: "Maya Builds",
    views: "418K views",
    ago: "2 days ago",
    image: unsplash("1497366754035-f200968a6e72", 1100, 620),
    duration: "12:48",
    topics: ["Design"],
    likes: 21400,
    comments: "1.1K",
    description:
      "One desk, two lamps and a rule about the phone. Everything I changed after a month of tracking where my focus went.",
  },
  {
    id: "mountain-morning",
    title: "A quiet morning in the mountains",
    channelId: "field-notes",
    channel: "Field Notes",
    views: "2.1M views",
    ago: "1 week ago",
    image: unsplash("1464822759023-fed622ff2c3b", 1100, 620),
    duration: "18:06",
    topics: ["Travel"],
    likes: 96000,
    comments: "3.4K",
    description:
      "Sunrise at the hut, coffee on the stove and a slow walk to the ridge. No music, just the wind.",
  },
  {
    id: "weeknight-recipes",
    title: "Five weeknight recipes worth saving",
    channelId: "studio-kitchen",
    channel: "Studio Kitchen",
    views: "780K views",
    ago: "4 days ago",
    image: unsplash("1504674900247-0877df9cc836", 1100, 620),
    duration: "15:22",
    topics: ["Cooking"],
    likes: 32000,
    comments: "842",
    description:
      "Five dinners, one shopping list. Each one is on the table in under thirty minutes.",
  },
  {
    id: "timber-house",
    title: "Inside a timber house that stays cool without AC",
    channelId: "new-architecture",
    channel: "New Architecture",
    views: "1.1M views",
    ago: "3 days ago",
    image: unsplash("1600585154340-be6161a56a0c", 1100, 620),
    duration: "16:40",
    topics: ["Design"],
    likes: 54000,
    comments: "2.2K",
    description:
      "Deep eaves, cross ventilation and a thermal mass floor. A walk through every decision with the architect.",
  },
  {
    id: "sourdough",
    title: "Sourdough without the stress",
    channelId: "studio-kitchen",
    channel: "Studio Kitchen",
    views: "96K views",
    ago: "5 hours ago",
    image: unsplash("1509440159596-0249088772ff", 1100, 620),
    duration: "22:14",
    topics: ["Cooking"],
    likes: 7800,
    comments: "311",
    description:
      "A forgiving schedule for people with day jobs. Feed at night, bake before work.",
  },
  {
    id: "design-critique",
    title: "How we run a design critique in 20 minutes",
    channelId: "open-studio",
    channel: "Open Studio",
    views: "41K views",
    ago: "6 hours ago",
    image: unsplash("1531403009284-440f080d1e12", 1100, 620),
    duration: "11:05",
    topics: ["Design"],
    likes: 3900,
    comments: "128",
    description:
      "The exact agenda, the questions we ban and the one rule that keeps feedback useful.",
  },
  {
    id: "jazz-radio",
    title: "Late-night jazz radio for slow evenings",
    channelId: "field-notes",
    channel: "Field Notes",
    views: "1.2K watching",
    ago: "Started streaming 3 hours ago",
    image: unsplash("1415201364774-f6f0bb35f28f", 1100, 620),
    live: true,
    topics: ["Music"],
    likes: 18000,
    comments: "Live chat",
    description:
      "Saxophone, brushes and upright bass, streaming all night. Recorded live at small clubs.",
  },
  {
    id: "design-details",
    title: "Design details you notice every day",
    channelId: "open-studio",
    channel: "Open Studio",
    views: "96K views",
    ago: "3 weeks ago",
    image: unsplash("1497366811353-6870744d04b2", 1100, 620),
    duration: "9:41",
    topics: ["Design"],
    likes: 6100,
    comments: "204",
    description:
      "Door handles, crossing signals and receipt layouts. Small decisions that quietly shape a day.",
  },
  {
    id: "afternoon-mix",
    title: "An afternoon mix for making things",
    channelId: "field-notes",
    channel: "Field Notes",
    views: "1.3M views",
    ago: "5 months ago",
    image: unsplash("1524368535928-5b5e00ddc76b", 1100, 620),
    duration: "2:10:23",
    topics: ["Music"],
    likes: 41000,
    comments: "1.9K",
    description:
      "Two hours of warm, wordless music for sketching, coding or cleaning the studio.",
  },
  {
    id: "city-walks",
    title: "The best city walks this year",
    channelId: "maya-builds",
    channel: "Maya Builds",
    views: "655K views",
    ago: "1 month ago",
    image: unsplash("1477959858617-67f85cf4f1df", 1100, 620),
    duration: "21:30",
    topics: ["Travel"],
    likes: 28000,
    comments: "976",
    description:
      "Seven routes you can finish before lunch, with the cafés and bookshops worth stopping for.",
  },
];

export const shortVideos: MockShort[] = [
  {
    id: "tiny-desk",
    title: "The tiny desk setup that fixed my focus",
    channelId: "maya-builds",
    channel: "Maya Builds",
    views: "1.2M views",
    image: unsplash("1516321318423-f06f85e504b3", 600, 920),
    likes: 48000,
    comments: "612",
    caption:
      "The tiny desk setup that fixed my focus. Part two is on the channel.",
  },
  {
    id: "sunset-concert",
    title: "A sunset concert in thirty seconds",
    channelId: "field-notes",
    channel: "Field Notes",
    views: "842K views",
    image: unsplash("1501386761578-eac5c94b800a", 600, 920),
    likes: 92000,
    comments: "1.4K",
    caption: "A sunset concert in thirty seconds. Turn the sound on.",
  },
  {
    id: "plating-tricks",
    title: "Three plating tricks from a pastry chef",
    channelId: "studio-kitchen",
    channel: "Studio Kitchen",
    views: "603K views",
    image: unsplash("1556910103-1c02745aae4d", 600, 920),
    likes: 31000,
    comments: "287",
    caption:
      "Three plating tricks from a pastry chef. The spoon swoosh is last.",
  },
  {
    id: "cool-building",
    title: "Why this building stays cool all summer",
    channelId: "new-architecture",
    channel: "New Architecture",
    views: "2.4M views",
    image: unsplash("1487958449943-2429e8be8625", 600, 920),
    likes: 156000,
    comments: "3.1K",
    caption:
      "Why this building stays cool all summer, explained in one sketch.",
  },
];

const byId = <T extends { id: string }>(list: T[], id: string) =>
  list.find((item) => item.id === id);

const pick = (ids: string[]) =>
  ids.map((id) => byId(videos, id)).filter((v): v is MockVideo => !!v);

export function findVideo(id: string) {
  return byId(videos, id);
}

export function findShort(id: string) {
  return byId(shortVideos, id);
}

export function findChannel(id: string) {
  return id === SELF_CHANNEL_ID ? selfChannel : byId(channels, id);
}

export function upNext(id: string) {
  return videos.filter((video) => video.id !== id).slice(0, 6);
}

export function videosByChannel(channelId: string) {
  return videos.filter((video) => video.channelId === channelId);
}

export const EXPLORE_TOPICS = ["Music", "Live", "Cooking", "Design", "Travel"];
export const HOME_CHIPS = ["All", ...EXPLORE_TOPICS];

/** Home: one lead video above the Shorts shelf for "All", else a filtered feed. */
export function homeFeed(chip: string) {
  if (chip === "All") {
    return {
      lead: pick(["deep-work-desk"]),
      shorts: shortVideos,
      rest: pick(["mountain-morning", "weeknight-recipes", "timber-house"]),
    };
  }
  const matches = videos.filter((video) =>
    chip === "Live" ? video.live : video.topics.includes(chip),
  );
  return { lead: matches, shorts: [], rest: [] };
}

export const SUBSCRIPTION_FILTERS = [
  "All",
  "Today",
  "Videos",
  "Shorts",
  "Live",
  "Podcasts",
];

export function subscriptionFeed(filter: string) {
  const latest = pick([
    "sourdough",
    "design-critique",
    "deep-work-desk",
    "timber-house",
    "weeknight-recipes",
    "mountain-morning",
  ]);
  const shelf = shortVideos.slice(0, 3);
  switch (filter) {
    case "Today":
      return {
        shorts: [],
        videos: pick(["jazz-radio", "sourdough", "design-critique"]),
      };
    case "Videos":
      return { shorts: [], videos: latest };
    case "Shorts":
      return { shorts: shelf, videos: [] };
    case "Live":
      return { shorts: [], videos: pick(["jazz-radio"]) };
    case "Podcasts":
      return { shorts: [], videos: [] };
    default:
      return { shorts: shelf, videos: latest };
  }
}

export const historyItems = [
  { video: findVideo("design-details")!, progress: 0.35 },
  { video: findVideo("afternoon-mix")!, progress: 0.8 },
  { video: findVideo("city-walks")!, progress: 1 },
];

export const LIBRARY_FILTERS = [
  "Recent",
  "Playlists",
  "Downloads",
  "Podcasts",
  "Music",
];

const libraryItems = [
  {
    id: "saved-creative-ideas",
    title: "Saved creative ideas",
    subtitle: "Private · Playlist · 12 videos",
    kind: "playlist" as const,
    video: findVideo("design-critique")!,
    filters: ["Recent", "Playlists"],
  },
  {
    id: "weekend-listening",
    title: "Weekend listening",
    subtitle: "Private · Playlist · 8 videos",
    kind: "playlist" as const,
    video: findVideo("jazz-radio")!,
    filters: ["Recent", "Playlists", "Music"],
  },
  {
    id: "sourdough-download",
    title: "Sourdough without the stress",
    subtitle: "Studio Kitchen · Downloaded",
    kind: "download" as const,
    video: findVideo("sourdough")!,
    filters: ["Recent", "Downloads"],
  },
];

export function libraryFor(filter: string) {
  return libraryItems.filter((item) => item.filters.includes(filter));
}

/**
 * Where minimize lands on a deep-linked watch page (no in-demo history to go
 * back to): the tab whose first screen shows this video's thumbnail, so the
 * player shrinks back into a card instead of swapping without a zoom source.
 */
export function watchParent(id: string) {
  const has = (list: MockVideo[]) => list.some((video) => video.id === id);
  if (has(homeFeed("All").lead)) return BASE;
  if (has(historyItems.map((item) => item.video))) return `${BASE}/profile`;
  if (has(subscriptionFeed("All").videos.slice(0, 1))) {
    return `${BASE}/subscriptions`;
  }
  if (has(libraryFor("Recent").map((item) => item.video))) {
    return `${BASE}/profile`;
  }
  return BASE;
}

export const RECENT_SEARCHES = [
  "desk setup for deep work",
  "sourdough schedule",
  "jazz for slow evenings",
  "timber house tour",
];

const STOP_WORDS = new Set(["the", "for", "and", "with", "you", "how", "this"]);

/** Title/channel/topic matches first, then videos on the same topics. */
export function searchVideos(query: string) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  if (words.length === 0) return [];
  const matches = videos.filter((video) => {
    const haystack =
      `${video.title} ${video.channel} ${video.topics.join(" ")}`.toLowerCase();
    return words.some((word) => haystack.includes(word));
  });
  const topics = new Set(matches.flatMap((video) => video.topics));
  const related = videos.filter(
    (video) =>
      !matches.includes(video) &&
      video.topics.some((topic) => topics.has(topic)),
  );
  return [...matches, ...related].slice(0, 5);
}

export type Notification = {
  id: string;
  video: MockVideo;
  verb: string;
  ago: string;
  unread: boolean;
};

const notify = (
  id: string,
  videoId: string,
  verb: string,
  ago: string,
  unread: boolean,
): Notification => ({ id, video: findVideo(videoId)!, verb, ago, unread });

/** Notifications, newest first, already grouped the way the page shows them. */
export const notificationSections = [
  {
    title: "New",
    items: [
      notify("n1", "jazz-radio", "is live", "3 hours ago", true),
      notify("n2", "sourdough", "uploaded", "5 hours ago", true),
      notify("n3", "design-critique", "uploaded", "6 hours ago", true),
    ],
  },
  {
    title: "Earlier",
    items: [
      notify("n4", "deep-work-desk", "uploaded", "2 days ago", false),
      notify("n5", "timber-house", "uploaded", "3 days ago", false),
      notify("n6", "mountain-morning", "uploaded", "1 week ago", false),
    ],
  },
];

const COMMENTS = {
  workspace: [
    {
      author: "@noahdraws",
      ago: "1 day ago",
      text: "The part about lighting the desk from the side changed my whole setup.",
    },
    {
      author: "@june.k",
      ago: "2 days ago",
      text: "Saving this for when I finally get my own room to work in.",
    },
    {
      author: "@studio_ines",
      ago: "3 days ago",
      text: "Would love a follow-up on how this holds up after a year.",
    },
  ],
  studio: [
    {
      author: "@pm_hana",
      ago: "4 hours ago",
      text: "Banning 'I would have' in critiques is going straight into our team rules.",
    },
    {
      author: "@leo.makes",
      ago: "5 hours ago",
      text: "Twenty minutes and everyone leaves with a next step. That's the dream.",
    },
    {
      author: "@typeandcoffee",
      ago: "1 day ago",
      text: "The crossing signal example made me look at my street differently.",
    },
  ],
  architecture: [
    {
      author: "@archi_sun",
      ago: "1 day ago",
      text: "Those deep eaves are doing more work than any air conditioner could.",
    },
    {
      author: "@builder_tom",
      ago: "2 days ago",
      text: "Showed this to my contractor. We're changing the window plan.",
    },
    {
      author: "@mina.lives",
      ago: "3 days ago",
      text: "I want to live in the reading nook at 7:12.",
    },
  ],
  cooking: [
    {
      author: "@homecook_ray",
      ago: "3 hours ago",
      text: "Made the second one tonight. My kids asked for it again tomorrow.",
    },
    {
      author: "@minji.bakes",
      ago: "5 hours ago",
      text: "Finally a schedule that works with a nine-to-five.",
    },
    {
      author: "@tomas_eats",
      ago: "1 day ago",
      text: "The tip about salting the water earlier is so simple and so right.",
    },
  ],
  music: [
    {
      author: "@latecoder",
      ago: "12 minutes ago",
      text: "Third night in a row this is carrying my deadline.",
    },
    {
      author: "@sofia.sketch",
      ago: "1 hour ago",
      text: "Whoever picked the bass player deserves a raise.",
    },
    {
      author: "@rain_on_tin",
      ago: "2 hours ago",
      text: "Listening from Lisbon, raining here too.",
    },
  ],
  travel: [
    {
      author: "@walkwithmei",
      ago: "4 days ago",
      text: "Did route three last weekend. The bakery at the end is real and it is perfect.",
    },
    {
      author: "@ollie.outside",
      ago: "5 days ago",
      text: "The sound of the wind at 6:40 is the whole video for me.",
    },
    {
      author: "@kai_maps",
      ago: "1 week ago",
      text: "Adding every one of these to my list for the spring.",
    },
  ],
} satisfies Record<string, Comment[]>;

const COMMENT_TOPIC: Record<string, keyof typeof COMMENTS> = {
  "deep-work-desk": "workspace",
  "tiny-desk": "workspace",
  "design-critique": "studio",
  "design-details": "studio",
  "timber-house": "architecture",
  "cool-building": "architecture",
  "weeknight-recipes": "cooking",
  sourdough: "cooking",
  "plating-tricks": "cooking",
  "jazz-radio": "music",
  "afternoon-mix": "music",
  "sunset-concert": "music",
  "mountain-morning": "travel",
  "city-walks": "travel",
};

/** Comments for a video or a Short, by id. */
export function commentsFor(id: string) {
  return COMMENTS[COMMENT_TOPIC[id] ?? "workspace"];
}
