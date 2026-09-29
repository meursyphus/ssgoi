export interface StoryAPI {
  /** Explore feed */
  findAll: () => Promise<StorySimple[]>;
  /** Story reader */
  find: (id: string) => Promise<StoryDetail>;
  /** "More stories" row under a story (3, never the story itself) */
  findRelated: (id: string) => Promise<StorySimple[]>;
  /** Saved tab — stories the mock user bookmarked */
  findSaved: () => Promise<StorySimple[]>;
  /** Bookmark / un-bookmark a story for the mock user */
  toggleSave: (id: string) => Promise<SaveResult>;
  /** Trips tab */
  findTrips: () => Promise<TripsOverview>;
  /** Profile tab */
  findProfile: () => Promise<Profile>;
  /** Activity screen (bell) */
  findActivity: () => Promise<ActivitySection[]>;
}

export type StorySimple = {
  id: string;
  title: string;
  /** wide cover photo for the feed card */
  cover: string;
  /** where the trip happened, e.g. "Kyoto, Japan" */
  location: string;
  /** one- or two-line teaser shown under the title */
  excerpt: string;
  author: string;
  authorInitial: string;
  /** tailwind background-color class for the author avatar circle */
  authorColor: string;
  /** pre-formatted timestamp label, e.g. "2d", "1w" */
  timeLabel: string;
  readMinutes: number;
  likes: number;
  saved: boolean;
};

export type StoryDetail = StorySimple & {
  /** article paragraphs after the excerpt (which doubles as the lede) */
  body: string[];
};

export type SaveResult = { id: string; saved: boolean };

export type Trip = {
  id: string;
  /** story opened from the trip tile (its cover is the tile image) */
  storyId: string;
  cover: string;
  place: string;
  /** e.g. "Apr 2026" or "Oct 12 – 18" */
  dateLabel: string;
  /** e.g. "5 days" or "6 nights · 2 travelers" */
  detailLabel: string;
};

export type TripsOverview = {
  /** e.g. "1 upcoming · 4 past" */
  summary: string;
  upcoming: Trip & {
    /** e.g. "In 15 days" */
    countdownLabel: string;
    /** e.g. "Trip guide by June Han" */
    guideLabel: string;
  };
  past: Trip[];
};

export type Profile = {
  name: string;
  handle: string;
  city: string;
  bio: string;
  stats: { label: string; value: string }[];
  recentlyRead: StorySimple[];
};

export type ActivityItem = {
  id: string;
  /** story/reminder rows open `storyId`; follow rows carry a Follow toggle */
  kind: "story" | "reminder" | "follow";
  /** "Voyage" for app reminders */
  actor: string;
  actorInitial: string;
  actorColor: string;
  /** sentence after the actor's name */
  text: string;
  /** optional quoted reply */
  quote?: string;
  timeLabel: string;
  isNew: boolean;
  /** story rows open this story */
  storyId?: string;
  storyTitle?: string;
  storyCover?: string;
};

export type ActivitySection = {
  title: string;
  items: ActivityItem[];
};
