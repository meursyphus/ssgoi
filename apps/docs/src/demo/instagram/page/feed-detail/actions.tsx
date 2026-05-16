"use client";

export function FeedDetailActions() {
  return (
    <div className="flex items-center gap-3.5 px-3 pt-3 text-neutral-900">
      <ActionIcon>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </ActionIcon>
      <ActionIcon>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </ActionIcon>
      <ActionIcon>
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" />
      </ActionIcon>
      <div className="flex-1" />
      <ActionIcon>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </ActionIcon>
    </div>
  );
}

function ActionIcon({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-9 w-9 place-items-center -ml-1 first:-ml-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        {children}
      </svg>
    </button>
  );
}
