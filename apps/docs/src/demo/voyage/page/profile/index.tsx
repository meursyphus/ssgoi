"use client";

import type { Profile } from "@/demo/voyage/state/story";
import { TabHeader } from "../shared/tab-header";
import { ProfileHeader } from "./profile-header";
import { RecentlyRead } from "./recently-read";

export default function ProfilePage({ profile }: { profile: Profile }) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <TabHeader title="Profile" />
      <div className="flex-1 pb-8">
        <ProfileHeader profile={profile} />
        <RecentlyRead stories={profile.recentlyRead} />
      </div>
    </div>
  );
}
