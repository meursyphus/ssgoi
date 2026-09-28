import type { ChatThreadSimple } from "@/demo/kakao-talk/state/chat";
import { ThreadRow } from "../chats/thread-row";

/** 채팅방 결과 — 누르면 채팅방으로 drill */
export function RoomResults({
  label,
  items,
}: {
  label: string;
  items: ChatThreadSimple[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-2 border-t border-neutral-100 pt-2">
      <h2 className="px-4 py-1.5 text-[12px] font-medium text-neutral-500">
        {label}
      </h2>
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            <ThreadRow thread={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}
