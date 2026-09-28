export interface ChatAPI {
  /** Chat list: one room per order with the pickup store, newest first. */
  findAll: () => Promise<ChatRoomSimple[]>;
}

export type ChatRoomSimple = {
  id: string;
  /** Rooms open the order they belong to. */
  orderId: string;
  name: string;
  avatar: string;
  region: string;
  /** "5월 15일" */
  time: string;
  lastMessage: string;
  /** Item thumbnail on the right side of the row. */
  thumbnail: string;
  unreadCount: number;
};
