"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { useDemoBack } from "@/lib/hooks";

type Props = {
  isMe: boolean;
  dmThreadId: string;
  openedFromRoomId?: string;
  openedVia?: string;
};

const CELL =
  "flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10";

// Screens a room can't drill back to (the drill pair would slide the 서랍 in
// from the right, the 친구 추가 sheet would rise). Opened from these, the
// profile stays in history: Back from the room lifts it again, X closes it.
const KEEP_PROFILE_VIA = new Set(["drawer", "add-friend"]);

export function ProfileActions({
  isMe,
  dmThreadId,
  openedFromRoomId,
  openedVia,
}: Props) {
  const router = useRouter();
  const roomHref = `/demo/kakao-talk/chats/${dmThreadId}`;
  // Opened from this room's own message avatar: close the profile back onto
  // it (no duplicate room entry). Direct entry replaces with the room.
  const backToRoom = useDemoBack(roomHref, {
    match: (pathname) => pathname === roomHref,
  });

  // The profile sheet drops away and the room is already underneath.
  // Replace (not push) so Back from the room skips the dismissed profile.
  const openChat = () => {
    if (openedFromRoomId === dmThreadId) {
      backToRoom();
    } else if (openedVia && KEEP_PROFILE_VIA.has(openedVia)) {
      router.push(roomHref, { scroll: false });
    } else {
      router.replace(roomHref, { scroll: false });
    }
  };

  return (
    <div className="px-4 pb-5 pt-2">
      <div className="flex items-stretch overflow-hidden rounded-2xl bg-white/15 backdrop-blur">
        <div className="flex flex-1 items-center">
          <button type="button" onClick={openChat} className={CELL}>
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="text-[14px] font-medium">
              {isMe ? "나와의 채팅" : "1:1 채팅"}
            </span>
          </button>
        </div>
        <div className="flex flex-1 items-center">
          <div className="h-6 w-px bg-white/20" />
          <button type="button" className={CELL}>
            <Phone className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="text-[14px] font-medium">통화</span>
          </button>
        </div>
      </div>
    </div>
  );
}
