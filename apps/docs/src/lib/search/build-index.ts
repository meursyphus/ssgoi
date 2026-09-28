// Server-side only: imported by the /search-index.json route handler, never by
// a client component, so the docs data modules stay out of client bundles.
import { getAllPosts, getPostHeadings } from "@/lib/blog";
import { slugify } from "@/lib/slug";
import { DOCS_NAV, type DocsNavNode } from "@/page/docs/nav";
import { FRAMEWORK_DOCS } from "@/page/docs/frameworks-data";
import { TRANSITION_DOCS, USE_META } from "@/page/docs/transitions-data";
import { showcases } from "@/page/showcase/data";
import { DOCS_ALIASES, TRANSITION_TERMS, showcaseToDoc } from "./aliases";
import docsHeadings from "./docs-headings.generated.json";
import type { SearchDoc, SearchGroup } from "./types";

type PageHeadings = {
  title?: string;
  description?: string;
  headings: { level: number; title: string; id?: string }[];
};

const HEADINGS = docsHeadings as Record<string, PageHeadings>;

function snippet(value: string | undefined, max = 160) {
  if (!value) return undefined;
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

function joinTerms(parts: (string | undefined)[]) {
  const terms = parts.filter(Boolean).join(" | ");
  return terms || undefined;
}

/** "/docs/scroll-restoration" → "scroll restoration": the URL is a name too. */
function slugWords(href: string) {
  return href.split("/").slice(2).join(" ").replace(/-/g, " ");
}

function groupOf(navGroupId: string): SearchGroup {
  if (navGroupId === "transitions") return "transitions";
  if (navGroupId === "frameworks") return "frameworks";
  return "docs";
}

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const transitions = new Map(TRANSITION_DOCS.map((t) => [t.name, t]));
  const frameworks = new Map(FRAMEWORK_DOCS.map((f) => [f.slug, f]));

  const visit = (
    navGroup: (typeof DOCS_NAV)[number],
    nodes: readonly DocsNavNode[],
  ) => {
    for (const node of nodes) {
      const href = node.href;
      if (href && !href.includes("#")) {
        const group = groupOf(navGroup.id);
        const title =
          node.title === "Guide" ? `${navGroup.label} guide` : node.title;
        const transition = node.id.startsWith("transition-")
          ? transitions.get(node.id.slice("transition-".length))
          : undefined;
        const framework = node.id.startsWith("framework-")
          ? frameworks.get(node.id.slice("framework-".length))
          : undefined;

        if (transition) {
          docs.push({
            group,
            kind: "page",
            title,
            parent: "Transitions",
            href,
            text: snippet(node.blurb ?? transition.blurb),
            platform: node.platform,
            synonyms: TRANSITION_TERMS[transition.name],
            terms: joinTerms([
              `${transition.name} transition`,
              transition.blurb,
              USE_META[transition.use].label,
              transition.decision.whenToUse,
              ...transition.variants.map((v) => v.label),
            ]),
          });
          if (transition.identity) {
            docs.push({
              group,
              kind: "section",
              title: "Connect the source to the destination",
              parent: title,
              href: `${href}#identity-heading`,
              text: snippet(transition.identity.keyRole),
              terms: joinTerms([
                transition.identity.source.attribute,
                transition.identity.destination.attribute,
                "key id",
              ]),
            });
          }
        } else if (framework) {
          docs.push({
            group,
            kind: "page",
            title: framework.name,
            parent: "Frameworks",
            href,
            text: snippet(framework.lead),
            terms: joinTerms([
              framework.pkg,
              ...framework.sections.map((s) => s.heading),
              ...framework.routers.map((r) => r.name),
            ]),
          });
          for (const section of framework.sections) {
            docs.push({
              group,
              kind: "section",
              title: section.heading,
              parent: framework.name,
              href: `${href}#${slugify(section.heading)}`,
              text: snippet(section.body),
            });
          }
          for (const router of framework.routers) {
            docs.push({
              group,
              kind: "page",
              title: router.name,
              parent: framework.name,
              href: `${href}#${router.slug}`,
              text: snippet(router.lead),
              terms: joinTerms([
                framework.pkg,
                router.slug.replace(/-/g, " "),
                ...router.sections.map((s) => s.heading),
              ]),
            });
          }
        } else {
          const page = HEADINGS[href];
          docs.push({
            group,
            kind: "page",
            title,
            parent: navGroup.label,
            href,
            text: snippet(node.blurb),
            platform: node.platform,
            aliases: DOCS_ALIASES[href],
            terms: joinTerms([
              page?.title,
              page?.description,
              slugWords(href) || "docs documentation",
            ]),
          });
          for (const heading of page?.headings ?? []) {
            docs.push({
              group,
              kind: "section",
              title: heading.title,
              parent: title,
              href: `${href}#${heading.id ?? slugify(heading.title)}`,
            });
          }
        }
      }
      if (node.children) visit(navGroup, node.children);
    }
  };
  for (const navGroup of DOCS_NAV) visit(navGroup, navGroup.items);

  for (const showcase of showcases) docs.push(showcaseToDoc(showcase));

  for (const post of getAllPosts()) {
    const href = `/blog/${post.slug}`;
    docs.push({
      group: "blog",
      kind: "page",
      title: post.title,
      parent: "Blog",
      href,
      text: snippet(post.description),
      terms: joinTerms(post.tags ?? []),
    });
    for (const heading of getPostHeadings(post.slug)) {
      docs.push({
        group: "blog",
        kind: "section",
        title: heading.title,
        parent: post.title,
        href: `${href}#${heading.id}`,
      });
    }
  }

  // hrefs double as React keys and option ids in the palette.
  const seen = new Set<string>();
  return docs.filter((d) => !seen.has(d.href) && Boolean(seen.add(d.href)));
}
