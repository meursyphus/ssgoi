import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { StoryDetail } from "../types";

async function _find(id: string): Promise<StoryDetail> {
  const story = data.byId(id);
  if (!story) throw new ActionError("Story not found");
  return story;
}

export const find = createAction(_find);
