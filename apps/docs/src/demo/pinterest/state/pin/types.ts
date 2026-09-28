import type { Query } from "comwit";
import type {
  PinSimple,
  PinDetail,
  Board,
  Guide,
  Profile,
  InboxUpdate,
  ShareSheet,
} from "@/demo/pinterest/api/pin";

/** Which half of the profile's saved section is showing. */
export type SavedView = "pins" | "boards";

export type PinState = {
  /** Home feed for the selected board. */
  pins: Query<PinSimple[], string>;
  /** Home board tab ("모두" = everything). */
  board: string;
  /** The mock user's saved pins, newest first (the profile's 핀 tab). */
  saved: Query<PinSimple[], void>;
  /**
   * Pins unsaved during this visit. Like the native app, the saved grid keeps
   * their tiles until the next load, so going back still zooms into them.
   */
  unsavedIds: string[];
  savedView: SavedView;
  hasUnreadUpdates: boolean;
  currentPin: PinDetail | null;
};

export type PinActions = {
  init(detail: PinDetail): void;
  /** Seeds the home feed with server data so it renders on first paint. */
  initFeed(pins: PinSimple[]): void;
  /** Seeds the saved pins with server data (first call wins). */
  initSaved(pins: PinSimple[]): void;
  loadPins(): Promise<void>;
  selectBoard(board: string): Promise<void>;
  setSavedView(view: SavedView): void;
  /** Saves or unsaves the pin that is open (`currentPin`). */
  toggleSave(): void;
  readUpdates(): void;
};

export type {
  PinSimple,
  PinDetail,
  Board,
  Guide,
  Profile,
  InboxUpdate,
  ShareSheet,
};
