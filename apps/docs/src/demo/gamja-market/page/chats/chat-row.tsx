import { Link } from "@/lib/link";
import type { ChatRoomSimple } from "@/demo/gamja-market/state/chat";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function ChatRow({ room }: { room: ChatRoomSimple }) {
  return (
    <Link
      href={routes.order(room.orderId)}
      scroll={false}
      className="flex items-center gap-3 px-4 py-4 active:bg-black/[0.03]"
    >
      <div className="relative h-12 w-12 shrink-0">
        <img
          src={room.avatar}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-[15px] font-bold text-gray-900">
            {room.name}
          </span>
          <span className="shrink-0 text-[12px] text-gray-400">
            {room.region} · {room.time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="line-clamp-1 flex-1 text-[14px] text-gray-600">
            {room.lastMessage}
          </p>
          {room.unreadCount > 0 ? (
            <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#2db400] px-1 text-[11px] font-bold text-white">
              {room.unreadCount}
            </span>
          ) : null}
        </div>
      </div>

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={room.thumbnail}
          alt=""
          width={44}
          height={44}
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
