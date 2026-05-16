import { create } from "comwit";
import { pin } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import { searchActions } from "./actions/search";
import type { PinState, PinActions } from "./types";

export * from "./types";

export const usePin = create<PinState, PinActions>(pin, {
  actions: [initActions, loadActions, searchActions],
});
