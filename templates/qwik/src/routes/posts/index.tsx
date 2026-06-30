import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getAllPosts } from "~/data/posts";

export default component$(() => {
  const posts = getAllPosts();

  return (
    <div data-ssgoi-transition="/posts" class="min-h-full bg-[#121212]">
      <div class="min-h-full bg-[#121212] px-4 py-6">
        <div class="mb-6">
          <h1 class="text-sm font-medium text-white mb-1">Latest Posts</h1>
          <p class="text-xs text-neutral-500">
            Insights on Svelte, Flutter, and web development
          </p>
        </div>

        <div class="space-y-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}/`}
              class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10"
            >
              <div class="flex gap-3 p-3">
                <div class="flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={300}
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
                      width={24}
                      height={24}
                      class="w-3 h-3 rounded-full"
                    />
                    <span class="text-xs text-neutral-500">
                      {post.author.name}
                    </span>
                    <span class="text-xs text-neutral-600">&middot;</span>
                    <span class="text-xs text-neutral-500">
                      {post.readTime}m
                    </span>
                    <span class="text-xs px-2 py-0.5 bg-white/5 text-neutral-400 rounded ml-auto">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});
