"use client";

import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";

type Post = {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
};

const POSTS: Post[] = [
  {
    id: "p1",
    author: "Daeseung",
    handle: "moon",
    time: "1m",
    content: "방금 sheet 트랜지션 셋업 완료. FAB 누르면 부드럽게 위로 올라옴.",
  },
  {
    id: "p2",
    author: "Jaemin",
    handle: "jaemin",
    time: "12m",
    content: "월요일이라 그런가 코드가 안 짜진다 ㅠ 커피 한 잔 더 가야겠다.",
  },
  {
    id: "p3",
    author: "Hyeon",
    handle: "hyeon",
    time: "32m",
    content: "ssgoi 로 만든 모바일 인터랙션이 진짜 네이티브 같다. 이거 좋다.",
  },
  {
    id: "p4",
    author: "Soo",
    handle: "soo",
    time: "1h",
    content: "퇴근 시간에 발견한 좋은 카페 ☕️ 사진은 내일 올릴게요.",
  },
  {
    id: "p5",
    author: "Yuri",
    handle: "yuri",
    time: "2h",
    content: "Next.js 16 turbopack 기본화는 정말 빠르네. 빌드가 다르다.",
  },
  {
    id: "p6",
    author: "Min",
    handle: "min",
    time: "3h",
    content: "sheet 와 drill 의 UX 차이를 정리해봤어요. 곧 글로 공유합니다.",
  },
];

async function fetchPosts(): Promise<Post[]> {
  return POSTS;
}

export default function Sheet1Feed() {
  // Pretend we're calling an API. Suspense/async pages are unnecessary
  // for this client-side mock — we just want the call site shape.
  const posts = POSTS;
  void fetchPosts;

  return (
    <SsgoiTransition id="/g/sheet1">
      <div className="min-h-full bg-neutral-950 text-neutral-100">
        <header className="sticky top-0 z-10 border-b border-white/5 bg-neutral-950/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
              aria-label="Home"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 18l-6-6 6-6"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">Feed</h1>
          </div>
        </header>

        <main className="divide-y divide-white/5">
          {posts.map((post) => (
            <article key={post.id} className="px-4 py-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold">
                  {post.author[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-semibold text-neutral-100">
                      {post.author}
                    </span>
                    <span className="text-neutral-500">@{post.handle}</span>
                    <span className="text-neutral-500">· {post.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-neutral-200">
                    {post.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </main>

        <Link
          href="/g/sheet1/compose"
          aria-label="New post"
          className="fixed bottom-10 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl shadow-blue-500/40 transition-all hover:bg-blue-400 active:scale-95 md:absolute md:bottom-6"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
        </Link>
      </div>
    </SsgoiTransition>
  );
}
