"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { slide } from "@ssgoi/react/view-transitions";
import { useProfile } from "@/demo/instagram/state/profile";
import { ProfileHeader } from "../profile-shell/header";
import { ProfileHeaderSkeleton } from "../profile-shell/header-skeleton";
import { ProfileTabs } from "../profile-shell/tabs";
import { ProfileTopBar } from "../profile-shell/top-bar";
import { ProfileBottomBar } from "../profile-shell/bottom-bar";

export function InstagramProfileLayoutClient({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const base = `/demo/instagram/profile/${id}`;

  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));

  useEffect(() => {
    profile.actions.loadMe();
  }, [profile.actions]);

  const config: SsgoiConfig = useMemo(
    () => ({
      transitions: [
        ...slide({
          paths: [base, `${base}/reels`, `${base}/remix`, `${base}/tagged`],
        }),
      ],
    }),
    [base],
  );

  const me = profile.me.data;

  return (
    <div className="flex h-full flex-col bg-white text-neutral-900">
      <ProfileTopBar
        username={me?.username ?? id}
        isPrivate={me?.isPrivate ?? true}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {me ? <ProfileHeader me={me} /> : <ProfileHeaderSkeleton />}
        <ProfileTabs id={id} />
        <Ssgoi config={config}>{children}</Ssgoi>
      </div>
      <ProfileBottomBar avatar={me?.avatar} />
    </div>
  );
}
