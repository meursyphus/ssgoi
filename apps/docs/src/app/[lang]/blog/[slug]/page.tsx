import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import { MDXContent } from "./mdx-content";
import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";
import { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";
import { BlogPostLink } from "@/components/blog/blog-post-link";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { BlogPostStructuredData } from "../structured-data";
import GiscusComments from "@/components/blog/giscus-comments";
import { SupportedLanguage } from "@/i18n/supported-languages";

interface BlogPostPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);

  if (!post) {
    return createSEOMetadata(
      {
        title: "Post Not Found - SSGOI Blog",
        description: "The requested blog post could not be found.",
      },
      lang
    );
  }

  return createSEOMetadata(
    {
      title: `${post.title} - SSGOI Blog`,
      description: post.description || `Read about ${post.title} on SSGOI Blog`,
      type: "article",
      url: `/${lang}/blog/${slug}`,
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
    },
    lang
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);

  if (!post) {
    notFound();
  }

  const t = await getServerTranslations("blog", lang);

  return (
    <>
      <BlogPostStructuredData post={post} lang={lang} />
      <SsgoiTransition id={`blog-${slug}`}>
        <article className="max-w-4xl mx-auto px-4 py-16">
          <BlogPostLink
            href={`/${lang}/blog`}
            fallbackHref={`/${lang}/blog`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            {t("backToBlog")}
          </BlogPostLink>

          {post.thumbnail && (
            <div className="flex justify-center mb-8">
              <img
                data-hero-key={`/${lang}/blog/${post.slug}`}
                src={post.thumbnail}
                alt={post.title}
                className="rounded-lg"
                style={{
                  width: post.thumbnailWidth,
                  aspectRatio: post.thumbnailWidth / post.thumbnailHeight,
                }}
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {post.date && (
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(lang, {
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
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
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

          <GiscusComments slug={slug} lang={lang as SupportedLanguage} />

          <footer className="mt-16 pt-8 border-t border-gray-800">
            <BlogPostLink
              href={`/${lang}/blog`}
              fallbackHref={`/${lang}/blog`}
              className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
            >
              {t("backToBlog")}
            </BlogPostLink>
          </footer>
        </article>
      </SsgoiTransition>
    </>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const languages = ["ko", "en"];
  const params = [];

  for (const lang of languages) {
    const posts = await getAllBlogPosts(lang);
    for (const post of posts) {
      params.push({
        lang,
        slug: post.slug,
      });
    }
  }

  return params;
}
