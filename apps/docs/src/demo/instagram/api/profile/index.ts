import { resolveActions } from "@/lib/utils";

export * from "./types";

import { getMe } from "./actions/get-me";

export const profile = resolveActions({ getMe });
