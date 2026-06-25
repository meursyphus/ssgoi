import { Link } from "@/lib/link";
import { SiteNav } from "@/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, softwareApplicationSchema } from "@/lib/seo";
import { showcases } from "@/page/showcase/data";
import ShowcaseCatalog from "@/page/showcase/list";

const GITHUB_URL = "https://github.com/meursyphus/ssgoi";

const demoItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SSGOI Demos",
  itemListElement: showcases.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/showcase/${s.slug}`,
    name: s.name,
  })),
};

export default function HomePage() {
  return (
    <main className="relative min-h-dvh bg-black">
      <JsonLd data={[softwareApplicationSchema, demoItemListSchema]} />
      <SiteNav />
      <Hero />
      <ShowcaseCatalog />
    </main>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-16">
      <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
        Native page transitions{" "}
        <span className="text-orange-500">on the web.</span>
      </h1>
      <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-neutral-400 md:text-lg">
        Router- and framework-agnostic — React, Svelte, Vue, Solid, and Angular.
        Built on the Web Animations API, beyond what View Transitions can do.
        Browse real apps rebuilt below.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
        >
          Read the docs
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
        >
          Blog
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
        >
          <GitHubIcon className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </section>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.23 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z" />
    </svg>
  );
}
