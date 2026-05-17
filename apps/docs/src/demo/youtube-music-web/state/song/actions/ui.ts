import { action } from "comwit";
import type { AppContext } from "@/lib/state";
import { song } from "../model";
import type { SongActions, SongState } from "../types";

export const uiActions = action<
  Pick<SongActions, "setTab" | "play">,
  AppContext
>(({ state, context }) => {
  class UiActions {
    private model = state(song);
    setTab(tab: SongState["tab"]) {
      this.model.tab = tab;
    }
    play(id: string) {
      context.router.push(`/demo/youtube-music-web/watch?v=${id}`);
    }
  }
  return new UiActions();
});
