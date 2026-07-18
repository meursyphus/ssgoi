import { BLOG_POSTS } from "./blog.generated";

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

export function getPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getPost(slug: string): Post | null {
  const post = blogPosts.find((entry) => entry.slug === slug);
  if (!post) return null;
  return {
    meta: { ...(JSON.parse(post.frontmatter) as PostFrontmatter), slug },
    content: post.content,
    html: post.html,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
