"use client";

import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import type { FriendList } from "@/demo/kakao-talk/state/friend";
import { FriendRow } from "../home/friend-row";

type Props = {
  list: FriendList;
  isLoading: boolean;
  addedIds: string[];
  onToggle: (id: string) => void;
  query: string;
};

/** 추천친구 — 행은 프로필 시트, 오른쪽 버튼은 제자리 토글 */
export function RecommendedList({
  list,
  isLoading,
  addedIds,
  onToggle,
  query,
}: Props) {
  if (isLoading && list.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  return (
    <section className="border-t border-neutral-100 pt-2">
      <h2 className="px-4 py-1.5 text-[12px] font-medium text-neutral-500">
        {list.label}
      </h2>
      {list.items.length === 0 ? (
        <p className="px-6 py-16 text-center text-[13px] text-neutral-400">
          &lsquo;{query.trim()}&rsquo;(으)로 찾은 사람이 없어요.
        </p>
      ) : (
        <ul>
          {list.items.map((f) => {
            const added = addedIds.includes(f.id);
            return (
              <li key={f.id}>
                <FriendRow
                  friend={f}
                  via="add-friend"
                  action={
                    <motion.button
                      type="button"
                      onClick={() => onToggle(f.id)}
                      aria-pressed={added}
                      whileTap={{ scale: 0.92 }}
                      className={`flex h-8 min-w-[64px] flex-shrink-0 items-center justify-center gap-1 rounded-full px-3 text-[12px] font-semibold transition-colors ${
                        added
                          ? "border border-neutral-200 bg-white text-neutral-500"
                          : "bg-[#FEE500] text-neutral-900"
                      }`}
                    >
                      {added && <Check className="h-3.5 w-3.5" />}
                      {added ? "추가됨" : "추가"}
                    </motion.button>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
      <p className="px-4 pb-8 pt-4 text-[11px] leading-relaxed text-neutral-400">
        내 연락처에 있거나 함께 아는 친구가 많은 사람을 추천해요.
      </p>
    </section>
  );
}
