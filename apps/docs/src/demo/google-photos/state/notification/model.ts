import { model } from "comwit";
import type { NotificationState } from "./types";

export const notification = model<NotificationState>({
  // The seeded activity list starts with unread items.
  hasUnread: true,
});
