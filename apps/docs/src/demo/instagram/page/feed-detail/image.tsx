"use client";

import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";

export function FeedDetailImage({
  post,
  author,
}: {
  post: PostDetail;
  author: ProfileMe | null;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
          <div className="rounded-full bg-white p-[1.5px]">
            {author ? (
              <img
                src={author.avatar}
                alt={author.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-neutral-900">
            {author?.username ?? "deaseungseung94"}
          </p>
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
          data-zoom-enter-key={post.id}
        />
      </div>
    </>
  );
}
