import { getAllBlogPosts } from "@/lib/blog";
import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";
import { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { BlogListStructuredData } from "./structured-data";

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getServerTranslations("blog", lang);

  return createSEOMetadata(
    {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
      url: `/${lang}/blog`,
    },
    lang,
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const posts = await getAllBlogPosts(lang);
  const t = await getServerTranslations("blog", lang);

  return (
    <>
      <BlogListStructuredData posts={posts} lang={lang} />
      <SsgoiTransition id="blog">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-2xl font-medium text-white mb-2">
              {t("pageTitle")}
            </h1>
            <p className="text-sm text-neutral-400">{t("pageDescription")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="group block"
              >
                <article className="border border-white/5 rounded transition-colors duration-200 hover:border-white/10">
                  {post.thumbnail && (
                    <div
                      data-hero-key={`/${lang}/blog/${post.slug}`}
                      className="relative aspect-video bg-neutral-900 overflow-hidden rounded-t"
                    >
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-90"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-sm font-medium text-white mb-2 line-clamp-2">
                      {post.title}
                    </h2>

                    {post.description && (
                      <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      {post.date && (
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString(lang, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}

                      {post.author && <span>{post.author}</span>}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-white/5 text-neutral-400 rounded border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-neutral-400">{t("noPostsYet")}</p>
            </div>
          )}
        </div>
      </SsgoiTransition>
    </>
  );
}
