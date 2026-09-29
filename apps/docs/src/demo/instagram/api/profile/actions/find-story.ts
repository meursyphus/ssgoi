import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { StoryDetail } from "../types";

async function _findStory(id: string): Promise<StoryDetail> {
  const story = data.storyById(id);
  if (!story) throw new ActionError("스토리를 찾을 수 없습니다");
  return story;
}

export const findStory = createAction(_findStory);
