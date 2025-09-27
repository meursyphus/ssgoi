"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import Link from "next/link";
import { fetchWithCache } from "@/lib/github-cache";

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface ContributorsSectionProps {
  lang: string;
}

export function ContributorsSection({ lang }: ContributorsSectionProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      const CONTRIBUTORS_CACHE_KEY = "ssgoi_github_contributors";
      const CONTRIBUTORS_TTL = 50 * 60 * 1000; // 50 minutes

      try {
        const data = await fetchWithCache<Contributor[]>(
          "https://api.github.com/repos/meursyphus/ssgoi/contributors",
          CONTRIBUTORS_CACHE_KEY,
          CONTRIBUTORS_TTL,
        );
        setContributors(data);
      } catch (error) {
        console.error("Failed to fetch contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  if (contributors.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            {lang === "ko" ? "기여자" : "Contributors"}
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            {lang === "ko"
              ? "이 프로젝트를 함께 만들어가는 분들께 감사드립니다"
              : "Thanks to all the amazing people who contribute to this project"}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {contributors.map((contributor, index) => (
              <Link
                key={contributor.id}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative transition-transform duration-300 hover:scale-110"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-vivid-orange via-vivid-pink to-vivid-purple opacity-0 blur transition duration-300 group-hover:opacity-75" />
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="relative h-16 w-16 rounded-full border-2 border-gray-700 bg-gray-800 transition-all duration-300 group-hover:border-gray-500 sm:h-20 sm:w-20"
                  />
                  <div className="absolute bottom-0 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-gray-300 ring-2 ring-gray-700 transition-all duration-300 group-hover:bg-gray-700 group-hover:ring-gray-600">
                    {contributor.contributions}
                  </div>
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  @{contributor.login}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center">
            <Link
              href="https://github.com/meursyphus/ssgoi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-gray-200 transition-all duration-300 hover:bg-gray-700 hover:text-gray-100"
            >
              <Github className="h-5 w-5" />
              {lang === "ko" ? "GitHub에서 기여하기" : "Contribute on GitHub"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
