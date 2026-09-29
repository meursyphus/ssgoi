import { Loader2 } from "lucide-react";
import type { ChatThreadSimple } from "@/demo/kakao-talk/api/chat";
import { ThreadRow } from "./thread-row";

type Props = {
  pinned: ChatThreadSimple[];
  recent: ChatThreadSimple[];
  isLoading: boolean;
  /** 결과가 없을 때 문구 (필터 적용 시) */
  emptyLabel?: string;
};

export function ThreadList({ pinned, recent, isLoading, emptyLabel }: Props) {
  if (isLoading && pinned.length === 0 && recent.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (emptyLabel && pinned.length === 0 && recent.length === 0) {
    return (
      <p className="py-16 text-center text-[13px] text-neutral-400">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul>
      {[...pinned, ...recent].map((t) => (
        <li key={t.id}>
          <ThreadRow thread={t} />
        </li>
      ))}
    </ul>
  );
}
