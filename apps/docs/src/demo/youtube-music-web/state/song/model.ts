import { model } from "comwit";
import type { SongState } from "./types";

export const song = model<SongState>({
  current: null,
  tab: "up-next",
});
