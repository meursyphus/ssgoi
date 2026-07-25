import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  type Post,
} from "../data/posts";

export function PostsPage() {
  const posts = getAllPosts();

  return (
    <div class="min-h-full bg-[#121212]">
      <div class="px-4 py-6">
        <div class="mb-6">
          <h1 class="text-sm font-medium text-white mb-1">Latest Posts</h1>
          <p class="text-xs text-neutral-500">
            Insights on Svelte, Flutter, and web development
          </p>
        </div>

        <div class="space-y-2">
          <For each={posts}>
            {(post) => (
              <A
                href={`/posts/${post.id}`}
                class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10"
                inactiveClass=""
                activeClass=""
              >
                <div class="flex gap-3 p-3">
                  <div class="flex-shrink-0">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      class="w-16 h-16 rounded object-cover bg-[#111]"
                    />
                  </div>

                  <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h2 class="text-sm font-medium text-white mb-1 line-clamp-2">
                        {post.title}
                      </h2>
                      <p class="text-xs text-neutral-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div class="flex items-center gap-2 mt-1">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        class="w-3 h-3 rounded-full"
                      />
                      <span class="text-xs text-neutral-500">
                        {post.author.name}
                      </span>
                      <span class="text-xs text-neutral-600">-</span>
                      <span class="text-xs text-neutral-500">
                        {post.readTime}m
                      </span>
                      <span class="text-xs px-2 py-0.5 bg-white/5 text-neutral-400 rounded ml-auto">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export function PostDetailPage(props: { postId: string }) {
  const post = createMemo(() => getPost(props.postId));
  const relatedPosts = createMemo(() => getRelatedPosts(props.postId, 3));

  return (
    <Show
      when={post()}
      fallback={
        <div class="min-h-full bg-[#121212] px-4 py-8">
          <p class="text-gray-400">Post not found</p>
        </div>
      }
    >
      {(post) => (
        <div class="min-h-screen bg-[#121212]">
          <div class="px-4 py-4">
            <A
              href="/posts"
              class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
              inactiveClass=""
              activeClass=""
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
            </A>
          </div>

          <div class="px-4 pb-6">
            <div class="flex items-center gap-3 mb-4 text-xs">
              <span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
                {post().category}
              </span>
              <span class="text-neutral-500">{post().readTime} min read</span>
            </div>

            <h1 class="text-xl font-medium text-white mb-3">{post().title}</h1>
            <p class="text-sm text-neutral-400 mb-6">{post().excerpt}</p>

            <div class="flex items-center gap-3">
              <img
                src={post().author.avatar}
                alt={post().author.name}
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="text-xs font-medium text-white">
                  {post().author.name}
                </div>
                <div class="text-xs text-neutral-500">{post().author.role}</div>
                <div class="text-xs text-neutral-600">
                  {formatDate(post().publishedAt)}
                </div>
              </div>
            </div>
          </div>

          <img
            src={post().coverImage}
            alt={post().title}
            class="w-full h-48 object-cover"
          />

          <article class="px-4 py-6">
            <PostContent post={post()} />
          </article>

          <div class="px-4 pb-6">
            <div class="flex flex-wrap gap-1.5">
              <For each={post().tags}>
                {(tag) => (
                  <span class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                )}
              </For>
            </div>
          </div>

          <Show when={relatedPosts().length > 0}>
            <div class="border-t border-white/5 px-4 py-6">
              <h3 class="text-sm font-medium text-white mb-3">More to Read</h3>
              <div class="space-y-2">
                <For each={relatedPosts()}>
                  {(relatedPost) => (
                    <A
                      href={`/posts/${relatedPost.id}`}
                      class="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
                      inactiveClass=""
                      activeClass=""
                    >
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
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
                    </A>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      )}
    </Show>
  );
}

function PostContent(props: { post: Post }) {
  const paragraphs = () => props.post.content.split("\n\n");

  return (
    <div class="prose prose-invert max-w-none">
      <For each={paragraphs()}>
        {(paragraph) => (
          <Show
            when={paragraph.startsWith("# ")}
            fallback={
              <Show
                when={paragraph.startsWith("## ")}
                fallback={
                  <Show
                    when={paragraph.startsWith("### ")}
                    fallback={
                      <Show
                        when={paragraph.startsWith("- ")}
                        fallback={
                          <p class="text-xs text-neutral-300 mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        }
                      >
                        <ul class="list-disc list-inside text-neutral-300 mb-4 space-y-1 pl-3 text-xs">
                          <For
                            each={paragraph
                              .split("\n- ")
                              .map((item) => item.replace(/^- /, ""))}
                          >
                            {(item) => (
                              <li class="text-neutral-300 text-xs">{item}</li>
                            )}
                          </For>
                        </ul>
                      </Show>
                    }
                  >
                    <h3 class="text-sm font-medium text-white mb-2 mt-4">
                      {paragraph.substring(4)}
                    </h3>
                  </Show>
                }
              >
                <h2 class="text-base font-medium text-white mb-3 mt-5">
                  {paragraph.substring(3)}
                </h2>
              </Show>
            }
          >
            <h1 class="text-lg font-medium text-white mb-4 mt-6">
              {paragraph.substring(2)}
            </h1>
          </Show>
        )}
      </For>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
