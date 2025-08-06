import { MetadataRoute } from "next";
import { SUPPORTED_LANGUAGES } from "@/i18n/supported-languages";
import { getAllBlogPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ssgoi.dev";

  // Define all documentation paths (these rarely change)
  const docPaths = [
    "getting-started/introduction",
    "getting-started/quick-start",
    "core-concepts/element-transitions",
    "core-concepts/view-transitions",
  ];

  // Generate sitemap entries for all languages and paths
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add homepage
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  });

  // Add language-specific entries
  for (const lang of SUPPORTED_LANGUAGES) {
    // Add language homepage
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Add docs landing page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly", // Docs structure rarely changes
      priority: 0.9,
    });

    // Add all documentation pages
    docPaths.forEach((path) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/docs/${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly", // Docs content rarely changes
        priority: 0.8,
      });
    });

    // Add blog landing page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly", // Blog list updates weekly
      priority: 0.9,
    });

    // Dynamically add all blog posts
    const blogPosts = await getAllBlogPosts(lang);
    blogPosts.forEach((post) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: "weekly", // Individual blog posts may get updates
        priority: 0.7,
      });
    });
  }

  return sitemapEntries;
}
