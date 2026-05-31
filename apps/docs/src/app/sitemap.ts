import type { MetadataRoute } from "next";
import { showcases } from "@/page/showcase/data";
import { getAllPosts } from "@/lib/blog";
import { DOCS_NAV_FLAT } from "@/page/docs/nav";

const BASE_URL = "https://ssgoi.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: "weekly",
    },
  ];

  const docsRoutes: MetadataRoute.Sitemap = DOCS_NAV_FLAT.filter(
    (i) => i.href !== "/docs",
  ).map((i) => ({
    url: `${BASE_URL}${i.href}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const showcaseRoutes: MetadataRoute.Sitemap = showcases.map((s) => ({
    url: `${BASE_URL}/showcase/${s.slug}`,
    lastModified: now,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...docsRoutes, ...showcaseRoutes, ...blogRoutes];
}
