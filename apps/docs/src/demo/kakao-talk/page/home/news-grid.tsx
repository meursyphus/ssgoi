import { Loader2 } from "lucide-react";
import { Link } from "@/lib/link";
import type { FriendNews } from "@/demo/kakao-talk/state/friend";

/** 소식 — 최근 프로필을 바꾼 친구들의 배경 카드. 탭하면 프로필 시트 */
export function NewsGrid({
  news,
  isLoading,
}: {
  news: FriendNews;
  isLoading: boolean;
}) {
  if (isLoading && news.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  return (
    <section className="px-4 pt-2">
      <h2 className="pb-2 text-[12px] font-medium text-neutral-500">
        {news.label}
      </h2>
      <ul className="grid grid-cols-2 gap-2">
        {news.items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/demo/kakao-talk/profile/${item.id}`}
              scroll={false}
              className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 transition-transform active:scale-[0.98]"
            >
              <img
                src={item.background}
                alt=""
                width={600}
                height={400}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/55" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                {item.updatedLabel}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-2.5">
                <img
                  src={item.avatar}
                  alt=""
                  width={200}
                  height={200}
                  className="h-8 w-8 flex-shrink-0 rounded-xl border border-white/60 object-cover"
                />
                <span className="truncate text-[13px] font-semibold text-white">
                  {item.name}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
