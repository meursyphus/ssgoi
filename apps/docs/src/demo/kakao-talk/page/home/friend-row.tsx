import type { ReactNode } from "react";
import { Link } from "@/lib/link";
import type { FriendSimple } from "@/demo/kakao-talk/api/friend";

type Props = {
  friend: FriendSimple;
  action?: ReactNode;
};

export function FriendRow({ friend, action }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 active:bg-black/[0.03]">
      <Link
        href={`/demo/kakao-talk/profile/${friend.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <img
          src={friend.avatar}
          alt={friend.name}
          className="h-11 w-11 rounded-2xl bg-neutral-200 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-medium text-neutral-900">
            {friend.name}
          </span>
          {friend.statusMessage && (
            <span className="truncate text-[12px] text-neutral-500">
              {friend.statusMessage}
            </span>
          )}
        </div>
      </Link>
      {action}
    </div>
  );
}
