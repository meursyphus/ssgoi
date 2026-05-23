import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";

export const listing = resolveActions({ findAll, find });
