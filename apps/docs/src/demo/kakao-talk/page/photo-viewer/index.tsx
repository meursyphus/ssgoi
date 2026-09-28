"use client";

import type { ChatPhoto } from "@/demo/kakao-talk/state/chat";
import { ViewerHeader } from "./viewer-header";

/** 사진 메시지 전체화면 — 말풍선 사진이 hero로 커져 들어온다 */
export default function PhotoViewerPage({
  initialData,
}: {
  initialData: ChatPhoto;
}) {
  return (
    <div className="flex min-h-full flex-col bg-black">
      <ViewerHeader
        threadId={initialData.threadId}
        senderName={initialData.senderName}
        sentAt={initialData.sentAt}
      />
      <div className="flex flex-1 items-center justify-center pb-14">
        <img
          src={initialData.imageUrl}
          alt=""
          width={400}
          height={300}
          data-hero-enter-key={initialData.messageId}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
