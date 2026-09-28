export interface NotificationAPI {
  /** Activity list — newest first, thumbnails already resolved */
  findAll: () => Promise<NotificationItem[]>;
}

/** What a row opens: a single photo (hero) or a collection (drill) */
export type NotificationTarget =
  | { type: "photo"; photoId: string }
  | { type: "collection"; collectionId: string };

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  /** Pre-formatted relative time, e.g. "2h" */
  time: string;
  unread: boolean;
  target: NotificationTarget;
  thumbSrc: string;
  /** Intrinsic size of the thumbnail's photo — keeps the hero ratio right */
  width: number;
  height: number;
};
