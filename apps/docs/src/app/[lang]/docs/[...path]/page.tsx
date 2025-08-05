import { notFound } from "next/navigation";
import { getPost, getNavigationData } from "@/lib/post";
import { MDXContent } from "./mdx-content";
import { DocsNavigation } from "@/components/docs/docs-navigation";
import { findNavigationLinks } from "@/lib/navigation-utils";
import { SsgoiTransition } from "@/components/docs/ssgoi";
import { Metadata } from "next";
import { DocsStructuredData } from "@/components/structured-data";
import { createSEOMetadata, getLocaleMetadata } from "@/lib/seo-metadata";

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
    return createSEOMetadata({
      title: "Page Not Found - SSGOI",
      description: "The requested documentation page could not be found.",
    }, lang);
  }

  const baseUrl = "https://ssgoi.dev";
  const currentUrl = `/${lang}/docs/${postPath}`;
  const localeMetadata = getLocaleMetadata(lang);

  const metadata = await createSEOMetadata({
    title: `${post.title} - SSGOI`,
    description: post.description || `Learn about ${post.title} in SSGOI documentation`,
    type: "article",
    url: currentUrl,
    siteName: localeMetadata.siteName,
  }, lang);

  // Add language alternates
  metadata.alternates = {
    canonical: `${baseUrl}${currentUrl}`,
    languages: {
      "en-US": `${baseUrl}/en/docs/${postPath}`,
      "ko-KR": `${baseUrl}/ko/docs/${postPath}`,
      "ja-JP": `${baseUrl}/ja/docs/${postPath}`,
      "zh-CN": `${baseUrl}/zh/docs/${postPath}`,
    },
  };

  return metadata;
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
