"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
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
  /** 정렬을 바꿨을 때 목록을 살짝 새로 그려 보인다 */
  animateIn?: boolean;
};

export function FriendSection({
  title,
  rightSlot,
  friends,
  rowAction,
  footer,
  animateIn = false,
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
        {friends.map((f, i) => (
          <motion.li
            key={f.id}
            initial={animateIn ? { opacity: 0, y: 4 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
          >
            <FriendRow friend={f} action={rowAction?.(f)} />
          </motion.li>
        ))}
        {footer}
      </ul>
    </section>
  );
}
