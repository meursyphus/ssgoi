import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findGroups } from "./actions/find-groups";
import { find } from "./actions/find";
import { findMe } from "./actions/find-me";
import { search } from "./actions/search";
import { findRecommended } from "./actions/find-recommended";
import { findNews } from "./actions/find-news";
import { findPickable } from "./actions/find-pickable";

export const friend = resolveActions({
  findGroups,
  find,
  findMe,
  search,
  findRecommended,
  findNews,
  findPickable,
});
