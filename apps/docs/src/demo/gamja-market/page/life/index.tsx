"use client";

import type { PostSimple } from "@/demo/gamja-market/api/post";
import { TabHeader } from "@/demo/gamja-market/page/shared/tab-header";
import { PostCard } from "./post-card";

export default function LifePage({ posts }: { posts: PostSimple[] }) {
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6] pb-6">
      <TabHeader title="동네생활">
        <span className="text-[13px] font-medium text-gray-500">
          둔촌동 이웃 이야기
        </span>
      </TabHeader>
      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
