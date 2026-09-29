"use client";

import type { ChatDrawer } from "@/demo/kakao-talk/state/chat";
import { DrawerHeader } from "./drawer-header";
import { MediaSection } from "./media-section";
import { MemberSection } from "./member-section";
import { DrawerToggles } from "./drawer-toggles";

export default function ChatDrawerPage({
  initialData,
}: {
  initialData: ChatDrawer;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[#F2F3F5]">
      <DrawerHeader threadId={initialData.id} title={initialData.partnerName} />
      <div className="flex flex-1 flex-col gap-2 pb-4">
        <MediaSection
          threadId={initialData.id}
          label={initialData.photosLabel}
          photos={initialData.photos}
        />
        <MemberSection
          label={initialData.membersLabel}
          members={initialData.members}
        />
      </div>
      <DrawerToggles muted={initialData.muted} pinned={initialData.pinned} />
    </div>
  );
}
