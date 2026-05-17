import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { findReels } from "./actions/find-reels";
import { findTagged } from "./actions/find-tagged";

export const post = resolveActions({ findAll, find, findReels, findTagged });
