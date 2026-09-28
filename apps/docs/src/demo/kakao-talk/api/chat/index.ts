import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findThreads } from "./actions/find-threads";
import { findThread } from "./actions/find-thread";
import { searchThreads } from "./actions/search-threads";
import { findDrawer } from "./actions/find-drawer";
import { findPhoto } from "./actions/find-photo";
import { findDmThreadId } from "./actions/find-dm-thread-id";
import { findRoomWith } from "./actions/find-room-with";
import { sendMessage } from "./actions/send-message";

export const chat = resolveActions({
  findThreads,
  findThread,
  searchThreads,
  findDrawer,
  findPhoto,
  findDmThreadId,
  findRoomWith,
  sendMessage,
});
