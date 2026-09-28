import { createAction } from "@/lib/utils";
import { order } from "@/demo/gamja-market/api/order";
import { chatTime, lastMessageFor, store, unreadCountFor } from "../data";
import type { ChatRoomSimple } from "../types";

async function _findAll(): Promise<ChatRoomSimple[]> {
  const orders = await order.findAll();
  return [...orders]
    .sort((a, b) => b.orderedAt.localeCompare(a.orderedAt))
    .map((o) => ({
      id: `c-${o.id}`,
      orderId: o.id,
      name: store.name,
      avatar: store.avatar,
      region: store.region,
      time: chatTime(o.orderedAt),
      lastMessage: lastMessageFor(o),
      thumbnail: o.thumbnail,
      unreadCount: unreadCountFor(o),
    }));
}

export const findAll = createAction(_findAll);
