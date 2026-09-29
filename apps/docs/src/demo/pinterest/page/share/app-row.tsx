"use client";

import { Link2, MessageSquare, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        fill="#3C1E1E"
        d="M12 4C7.03 4 3 7.13 3 11c0 2.49 1.66 4.67 4.16 5.9-.18.64-.66 2.33-.76 2.69-.12.45.17.44.35.32.14-.09 2.26-1.53 3.17-2.15.67.1 1.37.15 2.08.15 4.97 0 9-3.13 9-7s-4.03-7-9-7z"
      />
    </svg>
  );
}

export function AppRow({ pinId }: { pinId: string }) {
  async function copyLink() {
    const url = `${window.location.origin}/demo/pinterest/feed/${pinId}`;
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      // Clipboard can be blocked (e.g. inside an iframe); the toast still confirms.
    }
    toast("링크를 복사했어요", { duration: 1500 });
  }

  const apps = [
    {
      label: "링크 복사",
      icon: <Link2 className="h-6 w-6" strokeWidth={2.4} />,
      bg: "bg-neutral-100 text-black",
      onClick: copyLink,
    },
    {
      label: "메시지",
      icon: <MessageSquare className="h-6 w-6" strokeWidth={2.4} />,
      bg: "bg-[#34C759] text-white",
      onClick: () => toast("메시지 앱으로 공유했어요", { duration: 1500 }),
    },
    {
      label: "카카오톡",
      icon: <KakaoIcon />,
      bg: "bg-[#FEE500]",
      onClick: () => toast("카카오톡으로 공유했어요", { duration: 1500 }),
    },
    {
      label: "더보기",
      icon: <MoreHorizontal className="h-6 w-6" strokeWidth={2.4} />,
      bg: "bg-neutral-100 text-black",
      onClick: () => toast("다른 앱으로 공유했어요", { duration: 1500 }),
    },
  ];

  return (
    <section aria-label="앱으로 공유" className="pt-6">
      <h2 className="px-4 pb-3 text-[16px] font-bold text-black">공유 대상</h2>
      <div className="grid grid-cols-4 px-2">
        {apps.map((app) => (
          <button
            key={app.label}
            type="button"
            onClick={app.onClick}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-full transition-transform active:scale-95 ${app.bg}`}
            >
              {app.icon}
            </span>
            <span className="text-[12px] text-black">{app.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
