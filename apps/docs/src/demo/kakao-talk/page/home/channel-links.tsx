import { Link } from "@/lib/link";
import { ChevronRight } from "lucide-react";

const ROW = "flex w-full items-center gap-3 px-4 py-2 active:bg-black/[0.03]";

/** 친구 목록 맨 아래 — 추천친구(친구 추가 화면) · 채널 */
export function ChannelLinks() {
  return (
    <>
      <li>
        <Link href="/demo/kakao-talk/add-friend" scroll={false} className={ROW}>
          <RowContent
            label="추천친구"
            count={87}
            emoji="🥰"
            bg="bg-[#FFF1C2]"
          />
        </Link>
      </li>
      <li>
        <button type="button" className={ROW}>
          <RowContent label="채널" count={12} emoji="Ch" bg="bg-[#FFE7B0]" />
        </button>
      </li>
    </>
  );
}

function RowContent({
  label,
  count,
  emoji,
  bg,
}: {
  label: string;
  count: number;
  emoji: string;
  bg: string;
}) {
  return (
    <>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-neutral-700 ${bg}`}
      >
        {emoji}
      </div>
      <span className="flex-1 truncate text-left text-[14px] text-neutral-900">
        {label}
      </span>
      <span className="text-[12px] text-neutral-400">{count}</span>
      <ChevronRight className="h-4 w-4 text-neutral-300" />
    </>
  );
}
