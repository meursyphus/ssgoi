import { resolveActions } from "@/lib/utils";

export * from "./types";

import { explore } from "./actions/explore";

export const search = resolveActions({ explore });
