import { Loader2 } from "lucide-react";
import type { ChatThreadSimple } from "@/demo/kakao-talk/api/chat";
import { ThreadRow } from "./thread-row";

type Props = {
  pinned: ChatThreadSimple[];
  recent: ChatThreadSimple[];
  isLoading: boolean;
};

export function ThreadList({ pinned, recent, isLoading }: Props) {
  if (isLoading && pinned.length === 0 && recent.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
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
