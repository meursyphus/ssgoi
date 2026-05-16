"use client";

import { SsgoiTransition } from "@ssgoi/react";

export default function ProfileRemixPage({ id }: { id: string }) {
  return (
    <SsgoiTransition
      className="min-h-screen"
      id={`/demo/instagram/profile/${id}/remix`}
    >
      <div className="flex min-h-[400px] flex-col items-center justify-center px-10 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-neutral-900">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path
              d="M15 4l5 5-5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M20 9H8a4 4 0 0 0-4 4v0" strokeLinecap="round" />
            <path
              d="M9 20l-5-5 5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4 15h12a4 4 0 0 0 4-4v0" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-3 text-[18px] font-semibold text-neutral-900">
          리믹스
        </p>
        <p className="mt-1 max-w-[240px] text-[13px] leading-snug text-neutral-500">
          다른 사용자가 만든 리믹스가 여기에 표시됩니다.
        </p>
      </div>
    </SsgoiTransition>
  );
}
