"use client";

export function ProfileTopBar({
  username,
  isPrivate,
}: {
  username: string;
  isPrivate: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 pt-3 pb-2">
      {/* + new post */}
      <button className="-ml-1 grid h-10 w-10 place-items-center text-neutral-900">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      </button>

      {/* username + chevron */}
      <div className="flex flex-1 items-center justify-center gap-1.5">
        {isPrivate && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="5" y="11" width="14" height="9" rx="1.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        )}
        <span className="text-[18px] font-bold tracking-tight text-neutral-900">
          {username}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* hamburger */}
      <button className="-mr-1 grid h-10 w-10 place-items-center text-neutral-900">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
