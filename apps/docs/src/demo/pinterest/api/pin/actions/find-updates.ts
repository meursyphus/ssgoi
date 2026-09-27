import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { InboxUpdate } from "../types";

async function _findUpdates(): Promise<InboxUpdate[]> {
  return data.updates();
}

export const findUpdates = createAction(_findUpdates);
