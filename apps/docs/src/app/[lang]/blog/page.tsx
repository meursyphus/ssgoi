import { getAllBlogPosts } from "@/lib/blog";
import { SsgoiTransition } from "@ssgoi/react";
import { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";
import { BlogList } from "@/components/blog/blog-list";

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

        <BlogList 
          posts={posts} 
          lang={lang} 
          translations={{
            noPostsYet: t("noPostsYet")
          }}
        />
      </div>
    </SsgoiTransition>
  );
}
