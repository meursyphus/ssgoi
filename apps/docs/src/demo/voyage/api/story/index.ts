import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { findRelated } from "./actions/find-related";
import { findSaved } from "./actions/find-saved";
import { toggleSave } from "./actions/toggle-save";
import { findTrips } from "./actions/find-trips";
import { findProfile } from "./actions/find-profile";
import { findActivity } from "./actions/find-activity";

export const story = resolveActions({
  findAll,
  find,
  findRelated,
  findSaved,
  toggleSave,
  findTrips,
  findProfile,
  findActivity,
});
