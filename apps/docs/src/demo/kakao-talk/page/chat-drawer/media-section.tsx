import { ImageIcon } from "lucide-react";
import { Link } from "@/lib/link";
import type { ChatDrawer } from "@/demo/kakao-talk/state/chat";

/** 사진·동영상 — 썸네일을 누르면 뷰어로 (hero exit key) */
export function MediaSection({
  threadId,
  label,
  photos,
}: {
  threadId: string;
  label: string;
  photos: ChatDrawer["photos"];
}) {
  return (
    <section className="bg-white px-4 pb-4 pt-3">
      <h2 className="pb-2.5 text-[13px] font-semibold text-neutral-900">
        {label}
      </h2>
      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-xl bg-neutral-50 py-7 text-neutral-400">
          <ImageIcon className="h-5 w-5" strokeWidth={1.6} />
          <p className="text-[12px]">아직 주고받은 사진이 없어요</p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-1">
          {photos.map((p) => (
            <li key={p.id}>
              <Link
                href={`/demo/kakao-talk/chats/${threadId}/photo/${p.id}`}
                scroll={false}
                aria-label="사진 크게 보기"
                className="block aspect-square overflow-hidden rounded-lg bg-neutral-100 active:opacity-80"
              >
                <img
                  src={p.imageUrl}
                  alt=""
                  width={400}
                  height={300}
                  data-hero-exit-key={p.id}
                  className="h-full w-full object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
