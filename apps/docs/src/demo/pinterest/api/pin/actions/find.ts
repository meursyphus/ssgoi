import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { PinDetail } from "../types";

async function _find(id: string): Promise<PinDetail> {
  const pin = data.byId(id);
  if (!pin) throw new ActionError("핀을 찾을 수 없습니다");
  return pin;
}

export const find = createAction(_find);
