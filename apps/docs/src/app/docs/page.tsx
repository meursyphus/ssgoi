import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph, faqSchema } from "@/lib/seo";
import { DocsHero } from "@/page/docs/sections";
import { Section, link, measure, prose, proseDim } from "@/page/docs/ui";
import {
  ChromeMark,
  EdgeMark,
  FirefoxMark,
  SafariMark,
} from "@/components/browser-logos";
import {
  NextMark,
  NuxtMark,
  ReactRouterMark,
  SvelteKitMark,
} from "@/components/router-logos";

export const metadata: Metadata = {
  title: "Docs — Native app-like page transitions for mobile web apps",
  description:
    "Understand why SSGOI exists, add it with one provider file and one layout edit, choose a mobile transition, and go deeper only when your routing UX needs it.",
  alternates: { canonical: "/docs" },
  openGraph: buildOpenGraph({
    path: "/docs",
    title: "SSGOI Docs — Native app-like motion, without replacing your router",
    description:
      "Add route-aware, interruptible page transitions with one provider file and one layout edit, then grow into scroll restoration and persistent layouts when needed.",
  }),
};

const DOCS_FAQ = faqSchema([
  {
    question: "Which frameworks does SSGOI support?",
    answer:
      "React (with Next.js, React Router or TanStack Router), Svelte and SvelteKit, Vue and Nuxt, Solid and SolidStart, Qwik City, and Angular. SSGOI does not replace your router: it watches the page node your router already swaps, so whichever router you use keeps owning URLs, history and data loading.",
  },
  {
    question: "How do SSGOI page transitions work?",
    answer:
      "When the URL changes, your framework destroys the routed node and builds a new one. That is what SSGOI reacts to. Instead of letting the old page vanish, SSGOI keeps the real DOM node it was rendered from, puts it back on the page with position: absolute, and animates it out while the new page animates in. The preset you chose decides how the two move, and the old node is removed once the motion settles.",
  },
  {
    question:
      "Why does the SSGOI wrapper need the classes relative, z-0, and overflow-x-clip?",
    answer:
      "The three classes go on the element you wrap the Ssgoi provider in, and each one handles the page that is leaving. relative makes that element the positioned ancestor the leaving page is placed against; without it the leaving page is measured against the document and lands in the wrong spot. z-0 gives the element its own stacking context, so the layers a transition creates — some presets stack as high as z-index 9999 — stay inside your shell instead of covering a fixed header; the leaving page itself can never fall behind your background, because transitions never use a negative z-index. overflow-x-clip stops a horizontal scrollbar from flashing while slide, drill or strip move a page off screen: use clip and not hidden, because overflow-x: hidden turns the wrapper into the scroll container and scroll restore then targets the wrong element.",
  },
]);

const DOCS_BREADCRUMB = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Docs", path: "/docs" },
]);

const START_PATHS = [
  {
    title: "Set it up",
    body: "Install the package for your framework, write the config and the route boundary, then edit the layout you already have.",
    href: "/docs/install",
  },
  {
    title: "Get the wrapper right",
    body: "Three classes on the element you wrap <Ssgoi> in. Read it when the page that leaves lands in the wrong place, or when a transition paints over a fixed header.",
    href: "/docs/layout",
  },
  {
    title: "Mark the region that changes",
    body: "One node, keyed by the route so the framework rebuilds it, and named so your rules can match it. Read it when you are unsure what to wrap.",
    href: "/docs/boundaries",
  },
  {
    title: "Choose the motion",
    body: "Start with Drill, Sheet, Slide, or Zoom, then browse the rest of the catalog.",
    href: "/docs/transitions",
  },
  {
    title: "Decide per route",
    body: "Write rules with on, except, from/to, and ordered when one transition is not enough.",
    href: "/docs/route-rules",
  },
  {
    title: "Keep a layout still",
    body: "Hold a bottom nav or header in place while the routed content moves beneath it.",
    href: "/docs/nested-boundaries",
  },
] as const;

const WHY_SSGOI = [
  {
    title: "Keep the navigation you already have",
    body: "Your framework still owns URLs, history, SSR, and data loading. SSGOI only watches one route boundary in the DOM.",
    href: "/docs/frameworks",
  },
  {
    title: "Set it up",
    body: "One provider file, plus one edit to the layout you already have. Everything else stays optional until the app needs it.",
    href: "/docs/install",
  },
  {
    title: "Springs, played by the browser",
    body: "Spring motion is simulated up front and handed to the browser as keyframes, so nothing runs per frame in JavaScript.",
    href: "/docs/why-ssgoi",
  },
  {
    title: "Work with the real leaving page",
    body: "The page that leaves is the real DOM node, not a snapshot, so presets can measure it, keep its media playing, and add temporary layers around it.",
    href: "/docs/view-transition-api",
  },
] as const;

const BROWSERS = [
  { name: "Chrome", icon: ChromeMark },
  { name: "Safari", icon: SafariMark },
  { name: "Firefox", icon: FirefoxMark },
  { name: "Edge", icon: EdgeMark },
] as const;

const ROUTERS = [
  { name: "Next.js", icon: NextMark },
  { name: "React Router", icon: ReactRouterMark },
  { name: "SvelteKit", icon: SvelteKitMark },
  { name: "Nuxt", icon: NuxtMark },
] as const;

export default function DocsOverviewPage() {
  return (
    <>
      <JsonLd data={[DOCS_FAQ, DOCS_BREADCRUMB]} />
      <DocsHero />

      <Section
        title="Where to start"
        lead="The first three get your first transition running — the Quick start links to the other two at the step that needs them. The rest is there when routing gets specific."
      >
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {START_PATHS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block py-4">
                <span className="font-medium text-ink-soft transition-colors group-hover:text-ink">
                  {item.title}
                </span>
                <span className={`mt-1 block ${measure} ${proseDim}`}>
                  {item.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Let the motion say where the user went"
        lead="A list going to a detail page should not look like a tab switch. Each preset carries a different spatial meaning."
      >
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <TransitionPreview
            name="Drill"
            description="List to detail, with depth and an obvious way back."
            href="/docs/transitions/drill"
            src="/readme-drill.gif"
          />
          <TransitionPreview
            name="Sheet"
            description="A focused task rises while the origin stays in view behind it."
            href="/docs/transitions/sheet"
            src="/blog/view-transition-api-limitations/sheet-blur-full.gif"
          />
        </div>
        <p className={`mt-8 ${measure} ${prose}`}>
          <Link href="/docs/transitions/slide" className={link}>
            Slide
          </Link>{" "}
          suits ordered tabs and steps, and{" "}
          <Link href="/docs/transitions/zoom" className={link}>
            Zoom
          </Link>{" "}
          unfolds a selected card into its detail route. The{" "}
          <Link href="/docs/transitions" className={link}>
            full catalog
          </Link>{" "}
          has the rest.
        </p>
      </Section>

      <Section
        title="Routers and browsers it runs on"
        lead="SSGOI watches the DOM lifecycle your framework already drives, so routing and SSR behave exactly as they did before."
      >
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <LogoRow
            heading="Browsers"
            items={BROWSERS}
            href="/docs/compatibility"
            linkLabel="Browser and router support"
          />
          <LogoRow
            heading="Frameworks"
            items={ROUTERS}
            href="/docs/frameworks"
            linkLabel="All framework guides"
          />
        </div>
      </Section>

      <Section
        title="Why SSGOI"
        lead="Why SSGOI is built this way, and where each decision is explained."
      >
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {WHY_SSGOI.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block py-4">
                <span className="font-medium text-ink-soft transition-colors group-hover:text-ink">
                  {item.title}
                </span>
                <span className={`mt-1 block ${measure} ${proseDim}`}>
                  {item.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <aside
        className={`mt-14 border-t border-line pt-8 ${measure} ${proseDim}`}
      >
        Coding agents can read{" "}
        <a href="https://ssgoi.dev/llms.txt" className={link}>
          /llms.txt
        </a>
        ; SSGOI is{" "}
        <a
          href="https://github.com/meursyphus/ssgoi/blob/HEAD/LICENSE"
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          MIT licensed
        </a>
        .
      </aside>
    </>
  );
}

function TransitionPreview({
  name,
  description,
  href,
  src,
}: {
  name: string;
  description: string;
  href: string;
  src: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="flex justify-center overflow-hidden rounded-2xl border border-line bg-panel px-6 pt-6 transition-colors group-hover:border-line-strong">
        <Image
          src={src}
          alt={`${name} page transition running on a phone screen`}
          width={360}
          height={696}
          unoptimized
          className="h-auto w-full max-w-[200px] rounded-t-[1.4rem] border-x border-t border-line-strong"
        />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{name}</h3>
      <p className={`mt-1 ${prose}`}>{description}</p>
    </Link>
  );
}

function LogoRow({
  heading,
  items,
  href,
  linkLabel,
}: {
  heading: string;
  items: readonly {
    name: string;
    icon: ComponentType<{ className?: string }>;
  }[];
  href: string;
  linkLabel: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-ink">{heading}</h3>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {items.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <Icon className="h-8 w-8" />
            <span className="truncate text-sm text-ink-faint">{name}</span>
          </div>
        ))}
      </div>
      <p className={`mt-5 ${prose}`}>
        <Link href={href} className={link}>
          {linkLabel}
        </Link>
      </p>
    </div>
  );
}
