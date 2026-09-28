import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { SaveResult } from "../types";

async function _toggleSave(id: string): Promise<SaveResult> {
  if (!data.byId(id)) throw new ActionError("Story not found");
  return { id, saved: data.toggleSaved(id) };
}

export const toggleSave = createAction(_toggleSave);
