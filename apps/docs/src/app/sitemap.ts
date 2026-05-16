import type { MetadataRoute } from "next";
import { showcases } from "@/page/showcase/data";

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
      url: `${BASE_URL}/showcase`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "weekly",
    },
  ];

  const showcaseRoutes: MetadataRoute.Sitemap = showcases.map((s) => ({
    url: `${BASE_URL}/showcase/${s.slug}`,
    lastModified: now,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...showcaseRoutes];
}
