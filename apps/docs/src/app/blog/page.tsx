import type { Metadata } from "next";
import { Link } from "@/lib/link";
import { SiteLogo } from "@/components/site-logo";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Page transitions, animation, and native-feel web UX",
  description:
    "Guides and deep dives on page transitions, the View Transition API, spring physics, and building web apps that feel like native apps.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
  openGraph: {
    title: "SSGOI Blog — Page transitions & native-feel web UX",
    description:
      "Guides and deep dives on page transitions, the View Transition API, spring physics, and building web apps that feel like native apps.",
    url: "/blog",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SSGOI Blog",
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <main data-ssgoi-transition="/blog" className="relative min-h-dvh bg-black">
      <JsonLd
        data={[
          blogSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-6">
        <SiteLogo />

        <header className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl">
            Blog.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-neutral-400">
            Guides and deep dives on page transitions, animation, and building
            web apps that feel native.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-16 text-sm text-neutral-500">No posts yet.</p>
        ) : (
          <ul className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-1.5 py-6"
                >
                  <time
                    dateTime={p.date}
                    className="font-mono text-xs uppercase tracking-[0.18em] text-orange-500/80"
                  >
                    {formatDate(p.date)}
                  </time>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-100 group-hover:text-white">
                    {p.title}
                  </h2>
                  <p className="leading-relaxed text-neutral-400">
                    {p.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
