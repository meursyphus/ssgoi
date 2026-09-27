export type NotificationState = {
  /** Drives the bell's red dot; cleared once Notifications has been opened */
  hasUnread: boolean;
};

export type NotificationActions = {
  markAllRead(): void;
};
