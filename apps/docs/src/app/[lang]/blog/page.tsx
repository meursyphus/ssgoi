import { getAllBlogPosts } from "@/lib/blog";
import { SsgoiTransition } from "@ssgoi/react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getServerTranslations("blog", lang);

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
      url: `https://ssgoi.dev/${lang}/blog`,
      images: [
        {
          url: "https://ssgoi.dev/og.png",
          width: 1200,
          height: 630,
          alt: "SSGOI - Page Transition Library",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
      images: ["https://ssgoi.dev/og.png"],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const posts = await getAllBlogPosts(lang);
  const t = await getServerTranslations("blog", lang);

  return (
    <SsgoiTransition id="blog">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-xl text-gray-400">{t("pageDescription")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-gray-900 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                {post.thumbnail && (
                  <div
                    data-hero-key={`/${lang}/blog/${post.slug}`}
                    className="relative aspect-video bg-gray-800 overflow-hidden rounded-t-lg"
                  >
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
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
            <p className="text-gray-400">{t("noPostsYet")}</p>
          </div>
        )}
      </div>
    </SsgoiTransition>
  );
}
