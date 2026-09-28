import { MessageSquarePlus, Search, UserPlus, NotebookPen } from "lucide-react";
import { Link } from "@/lib/link";

const SHORTCUTS = [
  {
    label: "친구 추가",
    href: "/demo/kakao-talk/add-friend",
    Icon: UserPlus,
    tint: "bg-[#FFF1C2] text-[#8A6A00]",
  },
  {
    label: "새 채팅",
    href: "/demo/kakao-talk/new-chat",
    Icon: MessageSquarePlus,
    tint: "bg-[#E3F1FF] text-[#2B6CB0]",
  },
  {
    label: "나와의 채팅",
    href: "/demo/kakao-talk/chats/dm-me",
    Icon: NotebookPen,
    tint: "bg-[#E6F7EC] text-[#2F855A]",
  },
  {
    label: "통합 검색",
    href: "/demo/kakao-talk/search",
    Icon: Search,
    tint: "bg-[#F1ECFF] text-[#6B46C1]",
  },
] as const;

export function ShortcutGrid() {
  return (
    <section className="px-4 pt-6">
      <h2 className="pb-2 text-[12px] font-medium text-neutral-500">
        자주 쓰는 기능
      </h2>
      <ul className="grid grid-cols-2 gap-2">
        {SHORTCUTS.map(({ label, href, Icon, tint }) => (
          <li key={label}>
            <Link
              href={href}
              scroll={false}
              className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-3.5 transition-transform active:scale-[0.98] active:bg-neutral-50"
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${tint}`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="truncate text-[14px] font-medium text-neutral-900">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
