"use client";

import { Link } from "@/lib/link";
import type { Board } from "@/demo/pinterest/state/pin";

export function BoardGrid({ boards }: { boards: Board[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5">
      {boards.map((board) => (
        <BoardCard key={board.name} board={board} />
      ))}
    </div>
  );
}

function BoardCard({ board }: { board: Board }) {
  const [main, ...side] = board.covers;
  return (
    // Opening a board shows its ideas on the results page (drill).
    <Link
      href={`/demo/pinterest/search/${encodeURIComponent(board.name)}`}
      scroll={false}
      className="block active:opacity-80"
    >
      <div className="flex aspect-[3/2] gap-0.5 overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={main}
          alt=""
          width={400}
          height={600}
          className="h-full w-2/3 object-cover"
        />
        <div className="flex w-1/3 flex-col gap-0.5">
          {side.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              width={400}
              height={600}
              className="h-1/2 w-full object-cover"
            />
          ))}
        </div>
      </div>
      <p className="mt-2 truncate px-1 text-[15px] font-bold text-black">
        {board.name}
      </p>
      <p className="px-1 text-[12px] text-neutral-500">
        핀 {board.pinCount}개 · {board.updated}
      </p>
    </Link>
  );
}
