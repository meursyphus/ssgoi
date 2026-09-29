import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ReelDetail } from "../types";

async function _findReel(id: string): Promise<ReelDetail> {
  const reel = data.reelById(id);
  if (!reel) throw new ActionError("릴스를 찾을 수 없습니다");
  return reel;
}

export const findReel = createAction(_findReel);
