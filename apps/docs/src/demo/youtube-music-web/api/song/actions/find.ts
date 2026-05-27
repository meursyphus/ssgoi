import { ActionError, createAction } from "@/lib/utils";
import { data } from "../data";
import type { SongDetail } from "../types";

async function _find(id: string): Promise<SongDetail> {
  const detail = data.byId(id);
  if (!detail) throw new ActionError("해당 트랙을 찾을 수 없습니다");
  return detail;
}

export const find = createAction(_find);
