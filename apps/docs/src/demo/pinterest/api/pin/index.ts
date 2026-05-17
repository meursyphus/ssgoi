import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { search } from "./actions/search";

export const pin = resolveActions({ findAll, find, search });
