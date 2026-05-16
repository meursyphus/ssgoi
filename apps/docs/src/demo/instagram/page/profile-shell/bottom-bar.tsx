"use client";

export function ProfileBottomBar({ avatar }: { avatar?: string }) {
  return (
    <div className="flex items-center justify-around border-t border-neutral-200 bg-white px-2 pb-2 pt-2">
      <BottomIcon>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z"
            strokeLinejoin="round"
          />
        </svg>
      </BottomIcon>
      <BottomIcon>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
          <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
        </svg>
      </BottomIcon>
      <BottomIcon>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            strokeLinejoin="round"
          />
        </svg>
      </BottomIcon>
      <BottomIcon>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-5-5" strokeLinecap="round" />
        </svg>
      </BottomIcon>
      <BottomIcon>
        <div className="h-7 w-7 overflow-hidden rounded-full ring-2 ring-neutral-900">
          {avatar ? (
            <img src={avatar} alt="me" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full animate-pulse bg-neutral-200" />
          )}
        </div>
      </BottomIcon>
    </div>
  );
}

function BottomIcon({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-10 w-10 place-items-center text-neutral-900">
      {children}
    </button>
  );
}
