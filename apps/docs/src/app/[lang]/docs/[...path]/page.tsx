import { notFound } from "next/navigation";
import { getPost, getNavigationData } from "@/lib/post";
import { MDXContent } from "./mdx-content";
import { DocsNavigation } from "@/components/docs/docs-navigation";
import { findNavigationLinks } from "@/lib/navigation-utils";
import { SsgoiTransition } from "@/components/docs/ssgoi";
import { Metadata } from "next";
import { DocsStructuredData } from "@/components/structured-data";

interface DocsPageProps {
  params: Promise<{
    lang: string;
    path: string[];
  }>;
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { lang, path } = await params;
  const postPath = path.join("/");
  const post = await getPost(lang, postPath);

  if (!post) {
    return {
      title: "Page Not Found - SSGOI",
    };
  }

  const baseUrl = "https://ssgoi.dev";
  const currentUrl = `${baseUrl}/${lang}/docs/${postPath}`;

  // Language-specific metadata
  const langMetadata = {
    en: {
      locale: "en_US",
      siteName: "SSGOI Documentation",
    },
    ko: {
      locale: "ko_KR",
      siteName: "SSGOI 문서",
    },
    ja: {
      locale: "ja_JP",
      siteName: "SSGOIドキュメント",
    },
    zh: {
      locale: "zh_CN",
      siteName: "SSGOI 文档",
    },
  };

  const currentLangMetadata =
    langMetadata[lang as keyof typeof langMetadata] || langMetadata.en;

  return {
    title: `${post.title} - SSGOI`,
    description:
      post.description || `Learn about ${post.title} in SSGOI documentation`,
    alternates: {
      canonical: currentUrl,
      languages: {
        "en-US": `${baseUrl}/en/docs/${postPath}`,
        "ko-KR": `${baseUrl}/ko/docs/${postPath}`,
        "ja-JP": `${baseUrl}/ja/docs/${postPath}`,
        "zh-CN": `${baseUrl}/zh/docs/${postPath}`,
      },
    },
    openGraph: {
      title: `${post.title} - SSGOI`,
      description:
        post.description || `Learn about ${post.title} in SSGOI documentation`,
      url: currentUrl,
      siteName: currentLangMetadata.siteName,
      locale: currentLangMetadata.locale,
      type: "article",
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
      title: `${post.title} - SSGOI`,
      description:
        post.description || `Learn about ${post.title} in SSGOI documentation`,
      images: ["https://ssgoi.dev/og.png"],
    },
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { lang, path } = await params;
  const postPath = path.join("/");

  const [post, navigation] = await Promise.all([
    getPost(lang, postPath),
    getNavigationData(lang),
  ]);

  if (!post) {
    notFound();
  }

  // Find previous and next navigation links
  const currentPath = `/${lang}/docs/${postPath}`;
  const { prev, next } = findNavigationLinks(navigation, currentPath, lang);

  const currentUrl = `https://ssgoi.dev/${lang}/docs/${postPath}`;

  return (
    <>
      <DocsStructuredData
        title={post.title}
        description={post.description}
        url={currentUrl}
        lang={lang}
      />
      <SsgoiTransition id={postPath}>
        <article className="max-w-none bg-[var(--color-background)]">
          <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
          {post.description && (
            <p className="text-xl text-gray-400 mb-8">{post.description}</p>
          )}
          {await MDXContent({ content: post.content })}
          <DocsNavigation prev={prev} next={next} lang={lang} />
        </article>
      </SsgoiTransition>
    </>
  );
}
