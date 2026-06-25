"use client";

import { useFriend, type FriendProfile } from "@/demo/kakao-talk/state/friend";
import { ProfileHeader } from "./profile-header";
import { ProfileHero } from "./profile-hero";
import { ProfileActions } from "./profile-actions";
export default function ProfileDetailPage({
  initialData,
}: {
  initialData: FriendProfile;
}) {
  const friend = useFriend((state) => ({
    actions: state.actions,
  }));
  friend.actions.init(initialData);
  return (
    <div className="relative flex min-h-full flex-col bg-[#A6AEBE]">
      <ProfileHeader />
      <ProfileHero profile={initialData} />
      <ProfileActions />
    </div>
  );
}
