import type { Query } from "comwit";
import type {
  FriendGroups,
  FriendProfile,
  MeProfile,
} from "@/demo/kakao-talk/api/friend";

export type FriendState = {
  groups: Query<FriendGroups, void>;
  currentProfile: FriendProfile | null;
};

export type FriendActions = {
  init(profile: FriendProfile): void;
  loadGroups(): Promise<void>;
};

export type { FriendGroups, FriendProfile, MeProfile };
