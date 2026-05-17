import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findThreads } from "./actions/find-threads";
import { findThread } from "./actions/find-thread";

export const chat = resolveActions({ findThreads, findThread });
