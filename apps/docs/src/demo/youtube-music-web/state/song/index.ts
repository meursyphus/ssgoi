import { create } from "comwit";
import { song } from "./model";
import { initActions } from "./actions/init";
import { uiActions } from "./actions/ui";
import type { SongActions, SongState } from "./types";

export * from "./types";

export const useSong = create<SongState, SongActions>(song, {
  actions: [initActions, uiActions],
});
