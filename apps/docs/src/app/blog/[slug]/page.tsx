import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import {
  AUTHOR,
  SITE_NAME,
  SITE_URL,
  breadcrumbSchema,
  buildOpenGraph,
  faqSchema,
  twitterMeta,
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

  const {
    title,
    description,
    date,
    updated,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
  } = post.meta;
  const url = `/blog/${slug}`;
  const socialImage = image
    ? {
        url: image,
        width: imageWidth ?? 1200,
        height: imageHeight ?? 630,
        alt: imageAlt ?? title,
      }
    : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...buildOpenGraph({
        type: "article",
        path: url,
        title: `${title} | ${SITE_NAME}`,
        description,
        publishedTime: date,
        modifiedTime: updated ?? date,
        authors: [post.meta.author ?? AUTHOR.name],
        tags: post.meta.tags,
      }),
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    ...(socialImage
      ? {
          twitter: {
            ...twitterMeta,
            title,
            description,
            images: [socialImage.url],
          },
        }
      : {}),
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

  const { meta, html } = post;
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
    image: meta.image ? `${SITE_URL}${meta.image}` : `${SITE_URL}/og.png`,
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
    <main>
      <JsonLd data={schemas} />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8 lg:pt-12">
        <Link
          href="/blog"
          className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-neutral-300 shadow-sm transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden
          />
          Back to Blog
        </Link>

        <article className="mt-10">
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

          <div
            className="blog-content mt-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </main>
  );
}
