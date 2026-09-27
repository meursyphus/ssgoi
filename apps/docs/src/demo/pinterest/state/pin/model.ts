import { model, query, keepPreviousData } from "comwit";
import { pin as pinAPI } from "@/demo/pinterest/api/pin";
import type { PinState } from "./types";

export const HOME_BOARD_ALL = "모두";

export const pin = model<PinState>({
  pins: query<PinState["pins"]["data"], string>({
    initialData: [],
    queryFn: (board) =>
      pinAPI.findAll(board === HOME_BOARD_ALL ? {} : { board }),
    placeholderData: keepPreviousData,
  }),
  board: HOME_BOARD_ALL,
  saved: query<PinState["saved"]["data"], void>({
    initialData: [],
    queryFn: () => pinAPI.findSaved(),
  }),
  unsavedIds: [],
  savedView: "boards",
  hasUnreadUpdates: true,
  currentPin: null,
});
