import { action, silent } from "comwit";
import { song } from "../model";
import type { SongActions, SongDetail } from "../types";

export const initActions = action<Pick<SongActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(song);
    init(detail: SongDetail) {
      silent(() => {
        this.model.current = detail;
      });
    }
  }
  return new InitActions();
});
