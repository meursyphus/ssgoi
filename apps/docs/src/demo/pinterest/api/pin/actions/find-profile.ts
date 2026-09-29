import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Profile } from "../types";

async function _findProfile(): Promise<Profile> {
  return { ...data.me(), boards: data.boards() };
}

export const findProfile = createAction(_findProfile);
