import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { findComments } from "./actions/find-comments";
import { findReels } from "./actions/find-reels";
import { findReel } from "./actions/find-reel";
import { findTagged } from "./actions/find-tagged";
import { findExplore } from "./actions/find-explore";
import { findFeed } from "./actions/find-feed";

export const post = resolveActions({
  findAll,
  find,
  findComments,
  findReels,
  findReel,
  findTagged,
  findExplore,
  findFeed,
});
