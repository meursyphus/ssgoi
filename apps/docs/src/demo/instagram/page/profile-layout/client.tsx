"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Ssgoi, SsgoiTransition, type SsgoiConfig } from "@ssgoi/react";
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

  const innerConfig: SsgoiConfig = useMemo(
    () => ({
      preserveScroll: false,
      transitions: [
        slide({
          paths: [base, `${base}/reels`, `${base}/remix`, `${base}/tagged`],
        }),
      ],
    }),
    [base],
  );

  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));

  useEffect(() => {
    profile.actions.loadMe();
  }, [profile.actions]);

  const me = profile.me.data;

  return (
    <SsgoiTransition
      id={base}
      className="relative block min-h-full w-full bg-white text-neutral-900"
    >
      <div className="sticky top-0 z-30 bg-white">
        <ProfileTopBar
          username={me?.username ?? id}
          isPrivate={me?.isPrivate ?? true}
        />
      </div>
      {me ? <ProfileHeader me={me} /> : <ProfileHeaderSkeleton />}
      <ProfileTabs id={id} />
      <Ssgoi config={innerConfig}>
        <div className="relative z-0">{children}</div>
      </Ssgoi>
      <div className="sticky bottom-0 z-30 bg-white">
        <ProfileBottomBar avatar={me?.avatar} />
      </div>
    </SsgoiTransition>
  );
}
