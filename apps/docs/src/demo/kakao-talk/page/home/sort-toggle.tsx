"use client";

import { useFriend, type FriendSort } from "@/demo/kakao-talk/state/friend";

const OPTIONS: { key: FriendSort; label: string }[] = [
  { key: "name", label: "가나다순" },
  { key: "updated", label: "업데이트순" },
];

export function SortToggle({
  value,
  onChange,
}: {
  value: FriendSort;
  onChange?: (sort: FriendSort) => void;
}) {
  const friend = useFriend((state) => ({ actions: state.actions }));
  return (
    <span className="flex items-center">
      {OPTIONS.map((opt, i) => (
        <span key={opt.key} className="flex items-center">
          {i > 0 && <span className="px-1.5 text-neutral-300">·</span>}
          <button
            type="button"
            aria-pressed={value === opt.key}
            onClick={() => {
              if (value === opt.key) return;
              onChange?.(opt.key);
              friend.actions.setSort(opt.key);
            }}
            className={`transition-colors ${
              value === opt.key
                ? "font-medium text-neutral-700"
                : "text-neutral-400 active:text-neutral-600"
            }`}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </span>
  );
}
