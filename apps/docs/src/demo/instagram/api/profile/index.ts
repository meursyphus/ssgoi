import { resolveActions } from "@/lib/utils";

export * from "./types";

import { getMe } from "./actions/get-me";
import { findStory } from "./actions/find-story";
import { findStoryTray } from "./actions/find-story-tray";
import { findFollows } from "./actions/find-follows";

export const profile = resolveActions({
  getMe,
  findStory,
  findStoryTray,
  findFollows,
});
