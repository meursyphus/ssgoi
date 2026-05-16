import type { Query } from "comwit";
import type { ProfileMe } from "@/demo/instagram/api/profile";

export type ProfileState = {
  me: Query<ProfileMe | null, void>;
};

export type ProfileActions = {
  loadMe(): Promise<void>;
};

export type { ProfileMe, Highlight } from "@/demo/instagram/api/profile";
