import { MetadataRoute } from "next";
import { SUPPORTED_LANGUAGES } from "@/i18n/supported-languages";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllDocPaths } from "@/lib/get-all-doc-paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ssgoi.dev";

  // Get all documentation paths dynamically
  const docPaths = await getAllDocPaths();

  // Generate sitemap entries for all languages and paths
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add homepage
  sitemapEntries.push({
    url: baseUrl,
    changeFrequency: "monthly",
    priority: 1,
  });

  // Add language-specific entries
  for (const lang of SUPPORTED_LANGUAGES) {
    // Add language homepage
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Add docs landing page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/docs`,
      changeFrequency: "monthly",
      priority: 0.9,
    });

    // Add all documentation pages
    docPaths.forEach((path) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/docs/${path}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

    // Add blog landing page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Dynamically add all blog posts with their actual dates
    const blogPosts = await getAllBlogPosts(lang);
    blogPosts.forEach((post) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : undefined,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  }

  return sitemapEntries;
}
