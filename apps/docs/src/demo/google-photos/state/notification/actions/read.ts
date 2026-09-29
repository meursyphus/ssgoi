import { action } from "comwit";
import { notification } from "../model";
import type { NotificationActions } from "../types";

export const readActions = action<Pick<NotificationActions, "markAllRead">>(
  ({ state }) => {
    class ReadActions {
      private model = state(notification);
      markAllRead() {
        this.model.hasUnread = false;
      }
    }
    return new ReadActions();
  },
);
