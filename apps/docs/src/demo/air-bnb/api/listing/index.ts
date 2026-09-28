import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { findMany } from "./actions/find-many";
import { findCollection } from "./actions/find-collection";
import { findDestinations } from "./actions/find-destinations";

export const listing = resolveActions({
  findAll,
  find,
  findMany,
  findCollection,
  findDestinations,
});
