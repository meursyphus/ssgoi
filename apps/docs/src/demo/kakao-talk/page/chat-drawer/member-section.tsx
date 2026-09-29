import { Link } from "@/lib/link";
import type { ChatDrawer } from "@/demo/kakao-talk/state/chat";

/** 대화상대 — 나 먼저. 누르면 프로필 시트 (서랍에서 열었다고 알린다) */
export function MemberSection({
  label,
  members,
}: {
  label: string;
  members: ChatDrawer["members"];
}) {
  return (
    <section className="bg-white pb-2 pt-3">
      <h2 className="px-4 pb-1 text-[13px] font-semibold text-neutral-900">
        {label}
      </h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            <Link
              href={`/demo/kakao-talk/profile/${m.id}?via=drawer`}
              scroll={false}
              className="flex items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
            >
              <img
                src={m.avatar}
                alt={m.name}
                className="h-10 w-10 rounded-2xl bg-neutral-200 object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-[14px] text-neutral-900">
                {m.name}
              </span>
              {m.isMe && (
                <span className="flex h-5 items-center rounded-full bg-neutral-700 px-1.5 text-[10px] font-bold text-white">
                  나
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
