"use client";

import { Link } from "@/lib/link";
import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";

const BASE = "/demo/instagram";

/**
 * 게시물 헤더 + 이미지. `detail`은 단일 게시물 화면(이미지가 zoom 도착점,
 * 작성자 링은 스토리 zoom 출발점), `feed`는 홈 피드 카드(키 없음 — 홈에서는
 * 스토리 트레이가 스토리 출발점이라 키가 겹치지 않게 한다).
 */
export function FeedDetailImage({
  post,
  author,
  variant = "detail",
}: {
  post: PostDetail;
  author: ProfileMe | null;
  variant?: "detail" | "feed";
}) {
  const isMine = !post.author;
  const username = post.author?.username ?? author?.username;
  const avatar = post.author?.avatar ?? author?.avatar;
  const isDetail = variant === "detail";

  const avatarImg = avatar ? (
    <img
      src={avatar}
      alt={username}
      width={32}
      height={32}
      className="h-8 w-8 rounded-[16px] object-cover"
      data-zoom-exit-key={isDetail ? username : undefined}
    />
  ) : (
    <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />
  );

  return (
    <>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {isDetail && username ? (
          <Link
            href={`${BASE}/stories/${username}`}
            scroll={false}
            aria-label={`${username} 스토리 보기`}
            className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px] active:scale-95 transition-transform"
          >
            <div className="rounded-full bg-white p-[1.5px]">{avatarImg}</div>
          </Link>
        ) : (
          <div className="rounded-full p-[3px]">{avatarImg}</div>
        )}
        <div className="flex-1">
          {isMine && username ? (
            <Link
              href={`${BASE}/profile/${username}`}
              scroll={false}
              className="text-[13px] font-semibold text-neutral-900"
            >
              {username}
            </Link>
          ) : (
            <p className="text-[13px] font-semibold text-neutral-900">
              {username ?? "deaseungseung94"}
            </p>
          )}
        </div>
        <button className="text-neutral-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={post.image}
          alt=""
          width={600}
          height={600}
          className="h-full w-full object-cover"
          data-zoom-enter-key={isDetail ? post.id : undefined}
        />
      </div>
    </>
  );
}
