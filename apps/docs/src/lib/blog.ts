import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostFaq = { question: string; answer: string };

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date, e.g. "2026-05-31" */
  date: string;
  /** ISO date of last meaningful edit; defaults to `date` */
  updated?: string;
  author?: string;
  tags?: string[];
  /** drives the per-post FAQPage JSON-LD */
  faq?: PostFaq[];
};

export type PostMeta = PostFrontmatter & { slug: string };

export type Post = { meta: PostMeta; content: string };

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { meta: { ...(data as PostFrontmatter), slug }, content };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
