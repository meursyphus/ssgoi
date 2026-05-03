import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllDocPaths } from "@/lib/get-all-doc-paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ssgoi.dev";

  // Get all documentation paths dynamically
  const docPaths = await getAllDocPaths();

  // Generate sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add homepage
  sitemapEntries.push({
    url: baseUrl,
    changeFrequency: "monthly",
    priority: 1,
  });

  // Add all documentation pages
  docPaths.forEach((path) => {
    sitemapEntries.push({
      url: `${baseUrl}/docs/${path}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Add blog landing page
  sitemapEntries.push({
    url: `${baseUrl}/blog`,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  // Dynamically add all blog posts with their actual dates
  const blogPosts = await getAllBlogPosts();
  blogPosts.forEach((post) => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: "never",
      priority: 0.9,
    });
  });

  return sitemapEntries;
}
