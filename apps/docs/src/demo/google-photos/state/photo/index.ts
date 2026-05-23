import { create } from "comwit";
import { photo } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { PhotoState, PhotoActions } from "./types";

export * from "./types";

export const usePhoto = create<PhotoState, PhotoActions>(photo, {
  actions: [initActions, loadActions],
});
