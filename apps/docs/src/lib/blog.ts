import { BLOG_POSTS } from "./blog.generated";
import { slugify } from "./slug";

type GeneratedBlogPost = {
  slug: string;
  frontmatter: string;
  content: string;
  html: string;
};

const blogPosts = BLOG_POSTS as readonly GeneratedBlogPost[];

export type PostFaq = { question: string; answer: string };

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date, e.g. "2026-05-31" */
  date: string;
  /** ISO date of last meaningful edit; defaults to `date` */
  updated?: string;
  author?: string;
  /** Optional per-post cover used for social previews and structured data. */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  tags?: string[];
  /** drives the per-post FAQPage JSON-LD */
  faq?: PostFaq[];
};

export type PostMeta = PostFrontmatter & { slug: string };

export type Post = { meta: PostMeta; content: string; html: string };

export type PostHeading = { level: 2 | 3; title: string; id: string };

const HEADING = /<(h[23])>([\s\S]*?)<\/\1>/g;

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(+dec))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const withIds = new Map<string, { html: string; headings: PostHeading[] }>();

/**
 * Gives every generated <h2>/<h3> the id search links to. Both the page and
 * the search index read headings through here, so anchors cannot drift.
 */
function withHeadingIds(slug: string, html: string) {
  const cached = withIds.get(slug);
  if (cached) return cached;
  const headings: PostHeading[] = [];
  const used = new Map<string, number>();
  const out = html.replace(HEADING, (_, tag: string, inner: string) => {
    const title = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
    const base = slugify(title) || "section";
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    const id = n ? `${base}-${n}` : base;
    headings.push({ level: tag === "h2" ? 2 : 3, title, id });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  const entry = { html: out, headings };
  withIds.set(slug, entry);
  return entry;
}

export function getPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getPost(slug: string): Post | null {
  const post = blogPosts.find((entry) => entry.slug === slug);
  if (!post) return null;
  return {
    meta: { ...(JSON.parse(post.frontmatter) as PostFrontmatter), slug },
    content: post.content,
    html: withHeadingIds(slug, post.html).html,
  };
}

export function getPostHeadings(slug: string): PostHeading[] {
  const post = blogPosts.find((entry) => entry.slug === slug);
  return post ? withHeadingIds(slug, post.html).headings : [];
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
