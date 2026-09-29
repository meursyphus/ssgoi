import type { FriendSimple } from "@/demo/kakao-talk/state/friend";
import { FriendRow } from "../home/friend-row";

/** 친구 결과 — 누르면 프로필 시트 */
export function FriendResults({
  label,
  items,
}: {
  label: string;
  items: FriendSimple[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="pt-2">
      <h2 className="px-4 py-1.5 text-[12px] font-medium text-neutral-500">
        {label}
      </h2>
      <ul>
        {items.map((f) => (
          <li key={f.id}>
            <FriendRow friend={f} />
          </li>
        ))}
      </ul>
    </section>
  );
}
