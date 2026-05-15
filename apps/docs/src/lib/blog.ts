import { readdir, readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

export interface BlogMetadata {
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  date: string;
  author: string;
  tags: string[];
}

function removeNumberPrefix(name: string): string {
  return name.replace(/^\d+[._-]/, "");
}

// Get the post directory path
function getPostPath(): string {
  return path.join(process.cwd(), "post");
}

/**
 * Get all blog posts metadata for listing
 * @returns Array of blog post metadata sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogMetadata[]> {
  try {
    const postPath = getPostPath();
    const files = await readdir(postPath);

    const posts: BlogMetadata[] = [];

    for (const file of files) {
      if (file.endsWith(".mdx") || file.endsWith(".md")) {
        const filePath = path.join(postPath, file);
        const content = await readFile(filePath, "utf-8");
        const { data } = matter(content);

        const fileName = removeNumberPrefix(file);
        const slug = fileName.replace(/\.(mdx|md)$/, "");

        posts.push({
          slug,
          title: data.title || slug,
          description: data.description,
          thumbnail: data.thumbnail,
          thumbnailWidth: data.thumbnailWidth,
          thumbnailHeight: data.thumbnailHeight,
          date: data.date,
          author: data.author,
          tags: data.tags,
        });
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - Blog post slug (filename without extension)
 * @returns Blog post with full content or null if not found
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const postPath = getPostPath();
    const files = await readdir(postPath);

    // Find the file with matching slug (ignoring number prefix)
    const matchingFile = files.find((file) => {
      if (!file.endsWith(".mdx") && !file.endsWith(".md")) return false;
      const fileName = removeNumberPrefix(file);
      const fileSlug = fileName.replace(/\.(mdx|md)$/, "");
      return fileSlug === slug;
    });

    if (!matchingFile) {
      return null;
    }

    const filePath = path.join(postPath, matchingFile);
    const content = await readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(content);

    return {
      slug,
      title: data.title || slug,
      description: data.description,
      thumbnail: data.thumbnail,
      thumbnailWidth: data.thumbnailWidth,
      thumbnailHeight: data.thumbnailHeight,
      date: data.date,
      author: data.author,
      tags: data.tags,
      content: markdownContent,
    };
  } catch (error) {
    console.error("Error reading blog post:", error);
    return null;
  }
}

/**
 * Get recent blog posts
 * @param limit - Number of posts to return
 * @returns Array of recent blog post metadata
 */
export async function getRecentBlogPosts(
  limit: number = 5,
): Promise<BlogMetadata[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.slice(0, limit);
}
