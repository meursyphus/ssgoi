import type { Query } from "comwit";
import type { PinSimple, PinDetail } from "@/demo/pinterest/api/pin";

export type PinState = {
  pins: Query<PinSimple[], void>;
  searchResults: PinSimple[];
  searchQuery: string;
  isSearching: boolean;
  currentPin: PinDetail | null;
};

export type PinActions = {
  init(detail: PinDetail): void;
  loadPins(): Promise<void>;
  search(query: string): Promise<void>;
};

export type { PinSimple, PinDetail };
