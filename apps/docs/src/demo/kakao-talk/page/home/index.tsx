"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { TopHeader } from "./top-header";
import { PromoBanner } from "./promo-banner";
import { MeRow } from "./me-row";
import { FriendSection } from "./friend-section";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const friend = useFriend((state) => ({
    groups: state.groups,
    actions: state.actions,
  }));

  useEffect(() => {
    friend.actions.loadGroups();
  }, [friend.actions]);

  const { me, birthday, favorites, friends, friendsCountLabel } =
    friend.groups.data;

  return (
    <SsgoiTransition
      id="/demo/kakao-talk"
      className="flex min-h-full flex-col bg-white"
    >
      <TopHeader me={me} />
      <div className="flex-1 overflow-y-auto pb-16">
        <PromoBanner />
        <MeRow me={me} />
        {birthday.length > 0 && (
          <FriendSection
            title={`생일인 친구 ${birthday.length}`}
            friends={birthday}
            rowAction={() => <GiftButton />}
            footer={<MoreBirthdaysRow />}
          />
        )}
        {favorites.length > 0 && (
          <FriendSection
            title={`즐겨찾는 친구 ${favorites.length}`}
            friends={favorites}
          />
        )}
        <FriendSection
          title={friendsCountLabel}
          friends={friends}
          rightSlot={
            <span>
              <span className="text-neutral-700">가나다순</span>
              <span className="px-1.5 text-neutral-300">·</span>
              <span>업데이트순</span>
            </span>
          }
          footer={<ChannelLinks />}
        />
      </div>
    </SsgoiTransition>
  );
}

function GiftButton() {
  return (
    <button
      type="button"
      className="flex-shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-[12px] font-medium text-neutral-700 active:bg-black/[0.05]"
    >
      선물하기
    </button>
  );
}

function MoreBirthdaysRow() {
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFE9F0] text-lg">
          🎉
        </div>
        <span className="flex-1 truncate text-left text-[14px] text-neutral-900">
          친구의 생일을 확인해 보세요.
        </span>
        <span className="text-[12px] text-neutral-400">2</span>
        <ChevronRight className="h-4 w-4 text-neutral-300" />
      </button>
    </li>
  );
}

function ChannelLinks() {
  const ITEMS = [
    { label: "추천친구", count: 87, emoji: "🥰", bg: "bg-[#FFF1C2]" },
    { label: "채널", count: 12, emoji: "Ch", bg: "bg-[#FFE7B0]" },
  ] as const;
  return (
    <>
      {ITEMS.map((it) => (
        <li key={it.label}>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-neutral-700 ${it.bg}`}
            >
              {it.emoji}
            </div>
            <span className="flex-1 truncate text-left text-[14px] text-neutral-900">
              {it.label}
            </span>
            <span className="text-[12px] text-neutral-400">{it.count}</span>
            <ChevronRight className="h-4 w-4 text-neutral-300" />
          </button>
        </li>
      ))}
    </>
  );
}
