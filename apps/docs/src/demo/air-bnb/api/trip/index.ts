import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { book } from "./actions/book";

export const trip = resolveActions({ findAll, book });
