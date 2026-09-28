import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/link";
import type { MeProfile } from "@/demo/kakao-talk/state/friend";

/** 내 프로필 카드 — 프로필 시트로 */
export function MyCard({ me }: { me: MeProfile }) {
  return (
    <Link
      href={`/demo/kakao-talk/profile/${me.id}`}
      scroll={false}
      className="mx-4 mt-2 flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-4 ring-1 ring-black/[0.04] transition-transform active:scale-[0.99]"
    >
      {me.avatar ? (
        <img
          src={me.avatar}
          alt={me.name}
          width={200}
          height={200}
          className="h-14 w-14 flex-shrink-0 rounded-[20px] bg-neutral-200 object-cover"
        />
      ) : (
        <div className="h-14 w-14 flex-shrink-0 rounded-[20px] bg-neutral-200" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[16px] font-bold text-neutral-900">
          {me.name}
        </span>
        <span className="truncate text-[12px] text-neutral-500">
          {me.statusMessage}
        </span>
      </div>
      <span className="flex flex-shrink-0 items-center text-[12px] text-neutral-400">
        내 프로필
        <ChevronRight className="h-4 w-4 text-neutral-300" />
      </span>
    </Link>
  );
}
