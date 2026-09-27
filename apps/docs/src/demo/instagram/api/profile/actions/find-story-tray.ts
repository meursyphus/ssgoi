import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { StoryTrayItem } from "../types";

async function _findStoryTray(): Promise<StoryTrayItem[]> {
  return data.storyTray();
}

export const findStoryTray = createAction(_findStoryTray);
