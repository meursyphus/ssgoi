import { create } from "comwit";
import { notification } from "./model";
import { readActions } from "./actions/read";
import type { NotificationState, NotificationActions } from "./types";

export * from "./types";

export const useNotification = create<NotificationState, NotificationActions>(
  notification,
  {
    actions: [readActions],
  },
);
