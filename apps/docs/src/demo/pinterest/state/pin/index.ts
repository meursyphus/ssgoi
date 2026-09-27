import { create } from "comwit";
import { pin } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import { interactActions } from "./actions/interact";
import type { PinState, PinActions } from "./types";

export * from "./types";
export { HOME_BOARD_ALL } from "./model";

export const usePin = create<PinState, PinActions>(pin, {
  actions: [initActions, loadActions, interactActions],
});
