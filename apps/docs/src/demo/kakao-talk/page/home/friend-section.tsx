import type { ReactNode } from "react";
import type { FriendSimple } from "@/demo/kakao-talk/api/friend";
import { FriendRow } from "./friend-row";

type Props = {
  title: string;
  rightSlot?: ReactNode;
  friends: FriendSimple[];
  /** 각 행 오른쪽에 붙는 액션 (예: "선물하기") — 생일 섹션용 */
  rowAction?: (friend: FriendSimple) => ReactNode;
  /** 섹션 마지막에 붙는 추가 행들 (예: "친구의 생일을 확인해 보세요") */
  footer?: ReactNode;
};

export function FriendSection({
  title,
  rightSlot,
  friends,
  rowAction,
  footer,
}: Props) {
  return (
    <section className="border-t border-neutral-100 pt-2">
      <div className="flex items-center justify-between px-4 py-1.5">
        <h2 className="text-[12px] font-medium text-neutral-500">{title}</h2>
        {rightSlot && (
          <div className="text-[11px] text-neutral-400">{rightSlot}</div>
        )}
      </div>
      <ul>
        {friends.map((f) => (
          <li key={f.id}>
            <FriendRow friend={f} action={rowAction?.(f)} />
          </li>
        ))}
        {footer}
      </ul>
    </section>
  );
}
