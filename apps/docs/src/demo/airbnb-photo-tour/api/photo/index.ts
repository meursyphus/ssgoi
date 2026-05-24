import { resolveActions } from "@/lib/utils";

export * from "./types";

import { find } from "./actions/find";
import { getTour } from "./actions/get-tour";

export const photo = resolveActions({ find, getTour });
