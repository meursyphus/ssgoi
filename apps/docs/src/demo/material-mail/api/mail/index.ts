import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";

export const mail = resolveActions({ findAll });
