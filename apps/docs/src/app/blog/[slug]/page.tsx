import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Link } from "@/lib/link";
import { SiteLogo } from "@/components/site-logo";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import {
  AUTHOR,
  SITE_NAME,
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";
import { getAllPosts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post)
    return { title: "Not found", robots: { index: false, follow: true } };

  const { title, description, date, updated } = post.meta;
  const url = `/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      publishedTime: date,
      modifiedTime: updated ?? date,
      authors: [post.meta.author ?? AUTHOR.name],
    },
    twitter: { title, description },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;
  const url = `${SITE_URL}/blog/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated ?? meta.date,
    author: {
      "@type": "Person",
      name: meta.author ?? AUTHOR.name,
      url: AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/ssgoi-logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE_URL}/og.png`,
    keywords: meta.tags?.join(", "),
  };

  const schemas = [
    articleSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: meta.title, path: `/blog/${slug}` },
    ]),
    ...(meta.faq?.length ? [faqSchema(meta.faq)] : []),
  ];

  return (
    <main
      data-ssgoi-transition={`/blog/${slug}`}
      className="relative min-h-dvh bg-black"
    >
      <JsonLd data={schemas} />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-6">
        <SiteLogo />

        <Link
          href="/blog"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100"
        >
          ← Blog
        </Link>

        <article className="mt-6">
          <header>
            <time
              dateTime={meta.date}
              className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80"
            >
              {formatDate(meta.date)}
            </time>
            <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-100 md:text-4xl">
              {meta.title}
            </h1>
            <p className="mt-4 leading-relaxed text-neutral-400">
              {meta.description}
            </p>
          </header>

          <div className="mt-4">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </article>
      </div>
    </main>
  );
}
