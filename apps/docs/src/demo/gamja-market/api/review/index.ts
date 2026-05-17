import { resolveActions } from "@/lib/utils";

export * from "./types";

import { create } from "./actions/create";

export const review = resolveActions({ create });
