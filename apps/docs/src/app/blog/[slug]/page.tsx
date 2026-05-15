import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import { MDXContent } from "./mdx-content";
import { SsgoiTransition } from "@ssgoi/react";
import { Metadata } from "next";
import { messages } from "@/messages";
import { BlogPostLink } from "@/components/blog/blog-post-link";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { BlogPostStructuredData } from "../structured-data";
import GiscusComments from "@/components/blog/giscus-comments";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return createSEOMetadata({
      title: "Post Not Found - SSGOI Blog",
      description: "The requested blog post could not be found.",
    });
  }

  return createSEOMetadata({
    title: `${post.title} - SSGOI Blog`,
    description: post.description || `Read about ${post.title} on SSGOI Blog`,
    type: "article",
    url: `/blog/${slug}`,
    image: post.thumbnail
      ? {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      : undefined,
    article: {
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostStructuredData post={post} />
      <SsgoiTransition id={`blog-${slug}`}>
        <article className="max-w-4xl mx-auto px-4 py-16">
          <BlogPostLink
            href={`/blog`}
            fallbackHref={`/blog`}
            className="inline-flex items-center text-xs text-neutral-300 hover:text-white transition-colors mb-8"
          >
            {messages.blog.backToBlog}
          </BlogPostLink>

          {post.thumbnail && (
            <div className="flex justify-center mb-8">
              <img
                data-hero-key={`/blog/${post.slug}`}
                src={post.thumbnail}
                alt={post.title}
                className="rounded border border-white/5"
                style={{
                  width: post.thumbnailWidth,
                  aspectRatio: post.thumbnailWidth / post.thumbnailHeight,
                }}
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-3xl font-medium text-white mb-3">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              {post.date && (
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}

              {post.author && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-white/5 text-neutral-300 rounded border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            {await MDXContent({ content: post.content })}
          </div>

          <GiscusComments slug={slug} />

          <footer className="mt-16 pt-6 border-t border-white/5">
            <BlogPostLink
              href={`/blog`}
              fallbackHref={`/blog`}
              className="inline-flex items-center text-xs text-neutral-300 hover:text-white transition-colors"
            >
              {messages.blog.backToBlog}
            </BlogPostLink>
          </footer>
        </article>
      </SsgoiTransition>
    </>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
