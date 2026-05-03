import { notFound } from "next/navigation";
import { getPost, getNavigationData } from "@/lib/post";
import { MDXContent } from "./mdx-content";
import { DocsNavigation } from "@/components/docs/docs-navigation";
import { findNavigationLinks } from "@/lib/navigation-utils";
import { SsgoiTransition } from "@/components/docs/ssgoi";
import { Metadata } from "next";
import { DocsStructuredData } from "../structured-data";
import { createSEOMetadata } from "@/lib/seo-metadata";

interface DocsPageProps {
  params: Promise<{
    path: string[];
  }>;
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { path } = await params;
  const postPath = path.join("/");
  const post = await getPost(postPath);

  if (!post) {
    return createSEOMetadata({
      title: "Page Not Found - SSGOI",
      description: "The requested documentation page could not be found.",
    });
  }

  const currentUrl = `/docs/${postPath}`;

  const metadata = await createSEOMetadata({
    title: `${post.title} - SSGOI`,
    description:
      post.description || `Learn about ${post.title} in SSGOI documentation`,
    type: "article",
    url: currentUrl,
  });

  return metadata;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { path } = await params;
  const postPath = path.join("/");

  const [post, navigation] = await Promise.all([
    getPost(postPath),
    getNavigationData(),
  ]);

  if (!post) {
    notFound();
  }

  // Find previous and next navigation links
  const currentPath = `/docs/${postPath}`;
  const { prev, next } = findNavigationLinks(navigation, currentPath);

  const currentUrl = `https://ssgoi.dev/docs/${postPath}`;

  // Create breadcrumb data
  const breadcrumbs = [
    { name: "Home", url: `https://ssgoi.dev` },
    { name: "Docs", url: `https://ssgoi.dev/docs` },
    ...path.map((segment, index) => ({
      name: segment
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" "),
      url: `https://ssgoi.dev/docs/${path.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <>
      <DocsStructuredData
        title={post.title}
        description={post.description}
        url={currentUrl}
        breadcrumbs={breadcrumbs}
        prevDoc={prev}
        nextDoc={next}
      />
      <SsgoiTransition id={postPath}>
        <article className="max-w-none bg-[var(--color-background)]">
          <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
          {post.description && (
            <p className="text-xl text-gray-400 mb-8">{post.description}</p>
          )}
          {await MDXContent({ content: post.content })}
          <DocsNavigation prev={prev} next={next} />
        </article>
      </SsgoiTransition>
    </>
  );
}
