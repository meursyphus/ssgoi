import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MeProfile } from "@/demo/kakao-talk/state/friend";

export function MeRow({ me }: { me: MeProfile }) {
  return (
    <section className="pt-1">
      <h2 className="px-4 pb-1 pt-2 text-[12px] font-medium text-neutral-500">
        업데이트 프로필
      </h2>
      <Link
        href={`/demo/kakao-talk/profile/${me.id}`}
        className="flex items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
      >
        {me.avatar ? (
          <img
            src={me.avatar}
            alt={me.name}
            className="h-11 w-11 rounded-2xl bg-neutral-200 object-cover"
          />
        ) : (
          <div className="h-11 w-11 rounded-2xl bg-neutral-200" />
        )}
        <span className="flex-1 truncate text-[14px] font-medium text-neutral-900">
          내 프로필을 편집해 보세요.
        </span>
        <ChevronRight className="h-4 w-4 text-neutral-300" />
      </Link>
    </section>
  );
}
