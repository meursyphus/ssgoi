import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { search } from "./actions/search";
import { findGuides } from "./actions/find-guides";
import { findProfile } from "./actions/find-profile";
import { findSaved } from "./actions/find-saved";
import { findUpdates } from "./actions/find-updates";
import { findShare } from "./actions/find-share";

export const pin = resolveActions({
  findAll,
  find,
  search,
  findGuides,
  findProfile,
  findSaved,
  findUpdates,
  findShare,
});
