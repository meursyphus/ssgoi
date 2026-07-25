import { CodeBlock } from "@/components/code-block";
import { TransitionDemo } from "@/components/transition-demo";
import { Link } from "@/lib/link";
import {
  TRANSITION_DOCS,
  USE_META,
  getTransitionDoc,
  type TransitionDoc,
} from "@/page/docs/transitions-data";

type Recommendation = {
  name: "drill" | "sheet" | "slide" | "zoom";
  ux: string;
  rule: string;
};

const MOBILE_RECOMMENDATIONS: Recommendation[] = [
  {
    name: "drill",
    ux: "List → detail",
    rule: "on + except",
  },
  {
    name: "sheet",
    ux: "Compose, filters, temporary tasks",
    rule: "on",
  },
  {
    name: "slide",
    ux: "Tabs and ordered steps",
    rule: "ordered",
  },
  {
    name: "zoom",
    ux: "Card or image → detail",
    rule: "from / to",
  },
];

const RECOMMENDED_NAMES = new Set(
  MOBILE_RECOMMENDATIONS.map(({ name }) => name),
);

const MORE_TRANSITIONS = TRANSITION_DOCS.filter(
  ({ name }) => !RECOMMENDED_NAMES.has(name as Recommendation["name"]),
);

export function TransitionsCatalog() {
  return (
    <div className="mt-8">
      <section aria-labelledby="mobile-ux-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-400">
              Start with the interaction
            </p>
            <h2
              id="mobile-ux-heading"
              className="mt-2 text-xl font-semibold tracking-tight text-neutral-100"
            >
              Mobile UX recommendations
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
            Pick the relationship users should understand first. Variants and
            exact props live on each effect page.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {MOBILE_RECOMMENDATIONS.map((recommendation) => {
            const doc = getTransitionDoc(recommendation.name);
            if (!doc) return null;

            return (
              <FeaturedTransitionCard
                key={doc.name}
                doc={doc}
                recommendation={recommendation}
              />
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="config-patterns-heading"
        className="mt-14 border-t border-white/[0.06] pt-10"
      >
        <h2
          id="config-patterns-heading"
          className="text-xl font-semibold tracking-tight text-neutral-100"
        >
          Two useful config patterns
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          Effects describe motion; the surrounding rule describes the route
          relationship and resolves its forward and backward direction.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ConfigPattern
            eyebrow="Drill · on + except"
            title="Enter a route family"
            body="The list is the boundary. Entering any descendant drills in; returning to the list drills out."
            code={`{
  on: "/products/**",
  except: "/products",
  transition: drill(),
}`}
          />
          <ConfigPattern
            eyebrow="Sheet · from / to"
            title="Open a task above ordered tabs"
            body="The tab order owns sideways movement. A separate relationship opens the compose route as a sheet from any tab."
            code={`const TABS = ["/feed", "/search", "/profile"];

[
  {
    ordered: TABS,
    transition: slide(),
  },
  {
    from: TABS,
    to: "/compose",
    transition: sheet({ type: "blur" }),
  },
]`}
          />
        </div>
      </section>

      <section
        aria-labelledby="more-transitions-heading"
        className="mt-14 border-t border-white/[0.06] pt-10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
              Full effect index
            </p>
            <h2
              id="more-transitions-heading"
              className="mt-2 text-xl font-semibold tracking-tight text-neutral-100"
            >
              More transitions
            </h2>
          </div>
          <a
            href="https://ssgoi.dev/llms/transitions.txt"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-neutral-500 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            agent catalog ↗
          </a>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          Reach for these when the product calls for a different spatial model
          or a more expressive visual treatment.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {MORE_TRANSITIONS.map((doc) => (
            <CompactTransitionCard key={doc.name} doc={doc} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function FeaturedTransitionCard({
  doc,
  recommendation,
}: {
  doc: TransitionDoc;
  recommendation: Recommendation;
}) {
  const preview = getRepresentativeDemo(doc);

  return (
    <li>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015]">
        <div className="flex min-h-[428px] items-center justify-center bg-gradient-to-b from-[#17110d] to-[#0b0908] p-5">
          {preview ? (
            <TransitionDemo
              platform={preview.demo.platform ?? "mobile"}
              enterPath={preview.demo.enterPath}
              exitPath={preview.demo.exitPath}
              title={`${doc.name} · ${preview.variantLabel}`}
            />
          ) : (
            <span className="text-xs text-neutral-500">Demo coming soon</span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium uppercase tracking-wider text-orange-300">
              {recommendation.ux}
            </span>
            <span className="text-neutral-700" aria-hidden>
              ·
            </span>
            <code className="font-mono text-neutral-500">
              {recommendation.rule}
            </code>
          </div>
          <h3 className="mt-3 font-mono text-lg font-semibold text-neutral-100">
            {doc.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            {doc.blurb}
          </p>
          <Link
            href={`/docs/transitions/${doc.name}`}
            className="group mt-5 inline-flex items-center gap-2 self-start text-sm font-medium text-neutral-200 transition-colors hover:text-orange-400"
          >
            Variants and usage
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      </article>
    </li>
  );
}

function ConfigPattern({
  eyebrow,
  title,
  body,
  code,
}: {
  eyebrow: string;
  title: string;
  body: string;
  code: string;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
      <p className="font-mono text-xs text-orange-400">{eyebrow}</p>
      <h3 className="mt-2 text-base font-semibold tracking-tight text-neutral-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
      <CodeBlock className="mt-5" language="ts" code={code} />
    </article>
  );
}

function CompactTransitionCard({ doc }: { doc: TransitionDoc }) {
  const meta = USE_META[doc.use];
  const variantLabel =
    doc.variants.length === 1
      ? "1 behavior"
      : `${doc.variants.length} variants`;

  return (
    <li>
      <Link
        href={`/docs/transitions/${doc.name}`}
        className="group flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-semibold text-neutral-100 transition-colors group-hover:text-orange-400">
            {doc.name}
          </span>
          <span
            className={
              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
              meta.cls
            }
          >
            {meta.label}
          </span>
          <span
            className="ml-auto text-neutral-600 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400"
            aria-hidden
          >
            →
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-300">
          {doc.blurb}
        </p>
        <p className="mt-auto pt-4 font-mono text-xs text-neutral-600">
          {variantLabel}
        </p>
      </Link>
    </li>
  );
}

function getRepresentativeDemo(doc: TransitionDoc) {
  const variant =
    doc.variants.find(
      (candidate) => candidate.isDefault && candidate.demos?.length,
    ) ?? doc.variants.find((candidate) => candidate.demos?.length);
  const demo = variant?.demos?.[0];

  if (!variant || !demo) return null;
  return { demo, variantLabel: variant.label };
}
