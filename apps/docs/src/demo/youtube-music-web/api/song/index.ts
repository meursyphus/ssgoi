import { resolveActions } from "@/lib/utils";

export * from "./types";

import { home } from "./actions/home";
import { find } from "./actions/find";

export const song = resolveActions({ home, find });
