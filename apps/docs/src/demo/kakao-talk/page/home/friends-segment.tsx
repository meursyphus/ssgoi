"use client";

import { useState } from "react";
import { Link } from "@/lib/link";
import type { FriendGroups } from "@/demo/kakao-talk/state/friend";
import { PromoBanner } from "./promo-banner";
import { MeRow } from "./me-row";
import { FriendSection } from "./friend-section";
import { UpcomingBirthdays } from "./upcoming-birthdays";
import { SortToggle } from "./sort-toggle";
import { ChannelLinks } from "./channel-links";

export function FriendsSegment({ groups }: { groups: FriendGroups }) {
  const { me, birthday, favorites, friends, friendsCountLabel } = groups;
  // Re-draw the list once the re-sorted data lands — only after a tap, not
  // when the tab mounts mid-transition.
  const [sorted, setSorted] = useState(false);
  return (
    <>
      <PromoBanner />
      <MeRow me={me} />
      {birthday.length > 0 && (
        <FriendSection
          title={`생일인 친구 ${birthday.length}`}
          friends={birthday}
          rowAction={(f) => <GiftLink friendId={f.id} />}
          footer={
            <UpcomingBirthdays
              items={groups.upcomingBirthdays}
              countLabel={groups.upcomingBirthdaysCountLabel}
            />
          }
        />
      )}
      {favorites.length > 0 && (
        <FriendSection
          title={`즐겨찾는 친구 ${favorites.length}`}
          friends={favorites}
        />
      )}
      <FriendSection
        key={groups.sort}
        title={friendsCountLabel}
        friends={friends}
        animateIn={sorted}
        rightSlot={
          <SortToggle value={groups.sort} onChange={() => setSorted(true)} />
        }
        footer={<ChannelLinks />}
      />
    </>
  );
}

/** 생일 친구의 선물하기 — 선물 버튼이 있는 그 친구의 프로필 시트로 */
function GiftLink({ friendId }: { friendId: string }) {
  return (
    <Link
      href={`/demo/kakao-talk/profile/${friendId}`}
      scroll={false}
      className="flex-shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-[12px] font-medium text-neutral-700 active:bg-black/[0.05]"
    >
      선물하기
    </Link>
  );
}
