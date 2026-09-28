import { MessageCircle, ThumbsUp } from "lucide-react";
import type { PostSimple } from "@/demo/gamja-market/api/post";
import { AttachedProduct } from "./attached-product";

export function PostCard({ post }: { post: PostSimple }) {
  return (
    <article className="bg-white px-4 py-5">
      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
        {post.category}
      </span>
      <h2 className="mt-2 break-keep text-[15px] font-bold leading-snug text-gray-900">
        {post.title}
      </h2>
      <p className="mt-1 line-clamp-2 break-keep text-[13px] leading-relaxed text-gray-600">
        {post.body}
      </p>
      {post.product ? <AttachedProduct product={post.product} /> : null}
      <div className="mt-3 flex items-center justify-between text-[12px] text-gray-400">
        <span>
          {post.author} · {post.region} · {post.time}
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
        </span>
      </div>
    </article>
  );
}
