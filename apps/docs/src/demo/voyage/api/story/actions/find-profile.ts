import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Profile } from "../types";

async function _findProfile(): Promise<Profile> {
  return data.profile();
}

export const findProfile = createAction(_findProfile);
