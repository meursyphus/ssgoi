import type { Query } from "comwit";
import type {
  ActivityItem,
  ActivitySection,
  Profile,
  StoryDetail,
  StorySimple,
  Trip,
  TripsOverview,
} from "@/demo/voyage/api/story";

export type StoryState = {
  /** Explore feed */
  stories: Query<StorySimple[], void>;
  /** Saved tab */
  savedStories: Query<StorySimple[], void>;
  /** Story open in the reader */
  current: StoryDetail | null;
  /** True while the Saved tab is on screen */
  savedTabOpen: boolean;
  /** Bookmarks changed off the Saved tab; refresh it after it opens */
  savedNeedsRefresh: boolean;
  /** Red dot on the feed's bell until Activity is opened */
  hasUnreadActivity: boolean;
};

export type StoryActions = {
  /** Seeds the feed with server data so its zoom cards exist on first paint. */
  initFeed(stories: StorySimple[]): void;
  /** Seeds the Saved tab with server data (skipped once it has loaded). */
  initSaved(stories: StorySimple[]): void;
  /** Reader: silent SSR init, keeping any bookmark toggled this session. */
  init(detail: StoryDetail): void;
  loadStories(): Promise<void>;
  loadSaved(): Promise<void>;
  /** Bookmarks a story (or removes it) everywhere: feed, reader, Saved tab. */
  toggleSave(id: string): Promise<void>;
  enterSavedTab(): void;
  leaveSavedTab(): void;
  readActivity(): void;
};

export type {
  ActivityItem,
  ActivitySection,
  Profile,
  StoryDetail,
  StorySimple,
  Trip,
  TripsOverview,
};
