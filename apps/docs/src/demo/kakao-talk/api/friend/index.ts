import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findGroups } from "./actions/find-groups";
import { find } from "./actions/find";
import { findMe } from "./actions/find-me";

export const friend = resolveActions({ findGroups, find, findMe });
