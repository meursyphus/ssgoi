import type { Query } from "comwit";
import type {
  Follows,
  ProfileMe,
  StoryDetail,
  StoryTrayItem,
} from "@/demo/instagram/api/profile";

export type ProfileState = {
  me: Query<ProfileMe | null, void>;
  storyTray: Query<StoryTrayItem[], void>;
  currentStory: StoryDetail | null;
  currentFollows: Follows | null;
};

export type ProfileActions = {
  loadMe(): Promise<void>;
  loadStoryTray(): Promise<void>;
  initStory(detail: StoryDetail): void;
  initFollows(follows: Follows): void;
};

export type {
  ProfileMe,
  Highlight,
  StoryDetail,
  StoryFrame,
  StoryTrayItem,
  Follows,
  FollowTab,
  FollowUser,
} from "@/demo/instagram/api/profile";
