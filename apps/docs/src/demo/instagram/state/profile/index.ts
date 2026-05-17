import { create } from "comwit";
import { profile } from "./model";
import { loadActions } from "./actions/load";
import type { ProfileState, ProfileActions } from "./types";

export * from "./types";

export const useProfile = create<ProfileState, ProfileActions>(profile, {
  actions: [loadActions],
});
