import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { getPost, getRelatedPosts } from "~/data/posts";

export default component$(() => {
  const location = useLocation();
  const postId = location.params.id;
  const post = getPost(postId);
  const relatedPosts = getRelatedPosts(postId, 3);

  if (!post) {
    return (
      <div data-ssgoi-transition={`/posts/${postId}`}>
        <div class="min-h-screen bg-[#121212] px-4 py-8">
          <p class="text-gray-400">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ssgoi-transition={`/posts/${post.id}`}>
      <div class="min-h-screen bg-[#121212]">
        <div class="px-4 py-4">
          <Link
            href="/posts/"
            class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>
        </div>

        <div class="px-4 pb-6">
          <div class="flex items-center gap-3 mb-4 text-xs">
            <span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
              {post.category}
            </span>
            <span class="text-neutral-500">{post.readTime} min read</span>
          </div>

          <h1 class="text-xl font-medium text-white mb-3">{post.title}</h1>
          <p class="text-sm text-neutral-400 mb-6">{post.excerpt}</p>

          <div class="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              class="w-8 h-8 rounded-full"
            />
            <div>
              <div class="text-xs font-medium text-white">
                {post.author.name}
              </div>
              <div class="text-xs text-neutral-500">{post.author.role}</div>
              <div class="text-xs text-neutral-600">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        <img
          src={post.coverImage}
          alt={post.title}
          width={400}
          height={300}
          class="w-full h-48 object-cover"
        />

        <article class="px-4 py-6">
          <div class="prose prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h1
                    key={index}
                    class="text-lg font-medium text-white mb-4 mt-6"
                  >
                    {paragraph.substring(2)}
                  </h1>
                );
              }

              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    class="text-base font-medium text-white mb-3 mt-5"
                  >
                    {paragraph.substring(3)}
                  </h2>
                );
              }

              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    class="text-sm font-medium text-white mb-2 mt-4"
                  >
                    {paragraph.substring(4)}
                  </h3>
                );
              }

              if (paragraph.startsWith("- ")) {
                const items = paragraph
                  .split("\n- ")
                  .map((item) => item.replace(/^- /, ""));

                return (
                  <ul
                    key={index}
                    class="list-disc list-inside text-neutral-300 mb-4 space-y-1 pl-3 text-xs"
                  >
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} class="text-neutral-300 text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={index}
                  class="text-xs text-neutral-300 mb-4 leading-relaxed"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        <div class="px-4 pb-6">
          <div class="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div class="border-t border-white/5 px-4 py-6">
            <h3 class="text-sm font-medium text-white mb-3">More to Read</h3>
            <div class="space-y-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.id}/`}
                  class="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
                >
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    width={400}
                    height={300}
                    class="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div class="flex-1">
                    <h4 class="text-xs font-medium text-white line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p class="text-xs text-neutral-500 mt-0.5">
                      {relatedPost.readTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
