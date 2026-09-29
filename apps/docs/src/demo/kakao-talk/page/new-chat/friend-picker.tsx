"use client";

import { Loader2 } from "lucide-react";
import { Checkbox } from "@/lib/components/ui/checkbox";
import type { FriendList } from "@/demo/kakao-talk/state/friend";

type Props = {
  list: FriendList;
  isLoading: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

/** 친구 목록 + 체크박스. 행 어디를 눌러도 선택이 바뀐다 */
export function FriendPicker({
  list,
  isLoading,
  selectedIds,
  onToggle,
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
      <ul className="pb-8">
        {list.items.map((f) => {
          const checked = selectedIds.includes(f.id);
          const inputId = `pick-${f.id}`;
          return (
            <li key={f.id}>
              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
              >
                <img
                  src={f.avatar}
                  alt=""
                  className="h-11 w-11 rounded-2xl bg-neutral-200 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-medium text-neutral-900">
                    {f.name}
                  </span>
                  {f.statusMessage && (
                    <span className="truncate text-[12px] text-neutral-500">
                      {f.statusMessage}
                    </span>
                  )}
                </div>
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onCheckedChange={() => onToggle(f.id)}
                  aria-label={`${f.name} 선택`}
                  className="size-[22px] rounded-full border-neutral-300 data-[state=checked]:border-[#FEE500] data-[state=checked]:bg-[#FEE500] data-[state=checked]:text-neutral-900"
                />
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
