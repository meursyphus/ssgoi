import { model, query, keepPreviousData } from "comwit";
import { pin as pinAPI } from "@/demo/pinterest/api/pin";
import type { PinState } from "./types";

export const pin = model<PinState>({
  pins: query<PinState["pins"]["data"], void>({
    initialData: [],
    queryFn: () => pinAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  searchResults: [],
  searchQuery: "",
  isSearching: false,
  currentPin: null,
});
