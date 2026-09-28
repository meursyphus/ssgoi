import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { findSaved } from "./actions/find-saved";
import { toggle } from "./actions/toggle";

export const wishlist = resolveActions({ findAll, findSaved, toggle });
