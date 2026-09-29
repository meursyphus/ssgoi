import { action } from "comwit";
import { pin } from "../model";
import type { PinActions } from "../types";

export const loadActions = action<Pick<PinActions, "loadPins" | "selectBoard">>(
  ({ state }) => {
    class LoadActions {
      private model = state(pin);
      async loadPins() {
        await this.model.pins.query(this.model.board);
      }
      async selectBoard(board: string) {
        this.model.board = board;
        await this.model.pins.query(board);
      }
    }
    return new LoadActions();
  },
);
