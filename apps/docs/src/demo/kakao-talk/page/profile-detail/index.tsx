"use client";

import { useFriend, type FriendProfile } from "@/demo/kakao-talk/state/friend";
import { ProfileHeader } from "./profile-header";
import { ProfileHero } from "./profile-hero";
import { ProfileActions } from "./profile-actions";
export default function ProfileDetailPage({
  initialData,
  dmThreadId,
  openedFromRoomId,
  openedVia,
}: {
  initialData: FriendProfile;
  /** 이 친구와의 1:1 방 (없으면 빈 방 dm-<id>) */
  dmThreadId: string;
  /** 채팅방 말풍선 아바타에서 열었을 때 그 방 id */
  openedFromRoomId?: string;
  /** 프로필을 연 화면 — "drawer"(채팅방 서랍), "add-friend"(친구 추가) */
  openedVia?: string;
}) {
  const friend = useFriend((state) => ({
    actions: state.actions,
  }));
  friend.actions.init(initialData);
  return (
    <div className="relative flex min-h-full flex-col bg-[#A6AEBE]">
      <ProfileHeader />
      <ProfileHero profile={initialData} />
      <ProfileActions
        isMe={initialData.id === "me"}
        dmThreadId={dmThreadId}
        openedFromRoomId={openedFromRoomId}
        openedVia={openedVia}
      />
    </div>
  );
}
