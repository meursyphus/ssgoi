import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { TransitionDemo } from "@/components/transition-demo";
import { Link } from "@/lib/link";
import {
  TRANSITION_DOCS,
  getTransitionDoc,
  type TransitionDoc,
} from "@/page/docs/transitions-data";
import {
  DocsTable,
  Heading3,
  NextLinks,
  Section,
  caption,
  card,
  inlineCode,
  link,
  measure,
  prose,
} from "@/page/docs/ui";

type Recommendation = {
  name: "drill" | "sheet" | "slide" | "zoom";
  ux: string;
  rule: string;
};

/**
 * The four presets with live demos on this page. `rule` is the form the preset
 * is normally written with and must agree with UX_DECISION_ROWS below and with
 * `ruleStyle` in transitions-data.ts.
 */
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

const UX_DECISION_ROWS: Array<{ ux: string; name: string; rule: string }> = [
  { ux: "A list opens a detail page", name: "drill", rule: "on + except" },
  {
    ux: "Tabs or steps with a left-right order",
    name: "slide",
    rule: "ordered",
  },
  { ux: "Peer screens, Material shared axis", name: "axis", rule: "ordered" },
  { ux: "Compose, filters, a modal-like route", name: "sheet", rule: "on" },
  {
    ux: "A card or image expands into detail",
    name: "zoom",
    rule: "from / to",
  },
  {
    ux: "One element carries across two pages",
    name: "hero",
    rule: "from / to",
  },
  {
    ux: "A vertical sequence, editorial paging",
    name: "scroll",
    rule: "ordered",
  },
  {
    ux: "Anything unrelated (the fallback)",
    name: "fade",
    rule: `priority: -100, on: "/**"`,
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
      <p className={`${measure} ${prose}`}>
        Start from what the user is doing — opening a detail page, switching
        tabs, expanding a card — and pick the effect that matches. The Rule
        column is the shape you write around it; the three shapes are explained
        below.
      </p>

      <DocsTable
        head={["What the user is doing", "Transition", "Rule"]}
        rows={UX_DECISION_ROWS.map((row) => [
          row.ux,
          <Link
            key={row.name}
            href={`/docs/transitions/${row.name}`}
            className={`font-mono ${link}`}
          >
            {row.name}
          </Link>,
          <code key="rule" className={inlineCode}>
            {row.rule}
          </code>,
        ])}
        minWidth="580px"
      />

      <p className={`mt-4 ${measure} ${prose}`}>
        The rest — film, strip, rotate and jaemin — are picked for tone rather
        than for a route relationship, so any rule form works with them.
      </p>

      <Section
        id="rule-forms-heading"
        title="The three rule forms"
        lead="An effect describes how pages move. The rule around it describes where that applies and which way is forward."
      >
        <DocsTable
          head={["Rule", "What it matches"]}
          rows={[
            [
              <code key="on" className={inlineCode}>
                on
              </code>,
              <>
                A family of routes. Entering it is forward, leaving it is
                backward, and <code className={inlineCode}>except</code> carves
                out the entry point. Both <code className={inlineCode}>on</code>{" "}
                and <code className={inlineCode}>except</code> accept an array
                of patterns.
              </>,
            ],
            [
              <code key="pair" className={inlineCode}>
                from / to
              </code>,
              <>
                One exact relationship. It matches both directions unless you
                set <code className={inlineCode}>bidirectional: false</code>,
                and each side accepts an array of patterns.
              </>,
            ],
            [
              <code key="ordered" className={inlineCode}>
                ordered
              </code>,
              "A list of routes in order — one pattern per slot. Both ends must land on different entries; their index order decides the direction.",
            ],
          ]}
          minWidth="520px"
        />

        <p className={`mt-6 ${measure} ${prose}`}>
          When several rules match, the winner is decided by{" "}
          <code className={inlineCode}>priority</code>, then by how specific the
          paths are, then by declaration order — the earliest rule wins, not the
          last. A rule with no <code className={inlineCode}>priority</code> is
          0, which is why a negative value parks a broad fallback under
          everything else.{" "}
          <Link href="/docs/route-rules" className={link}>
            Route rules
          </Link>{" "}
          has the full pattern syntax and the scoring.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Each form also carries a scroll default:{" "}
          <code className={inlineCode}>from / to</code> and{" "}
          <code className={inlineCode}>on</code> restore the source and reset
          the destination, <code className={inlineCode}>ordered</code> restores
          both.{" "}
          <Link href="/docs/scroll-restoration" className={link}>
            Scroll behavior
          </Link>{" "}
          covers the overrides.
        </p>
      </Section>

      <Section
        id="featured-heading"
        title="See the four most common ones move"
        lead="These four cover most mobile navigation. Open one for its variants and props."
      >
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
      </Section>

      <Section
        id="config-patterns-heading"
        title="Drill into a family, or open a sheet above tabs"
        lead={
          <>
            Two configs you can paste. Both go in the array returned by{" "}
            <code className={inlineCode}>transitions</code> in your{" "}
            <code className={inlineCode}>&lt;Ssgoi&gt;</code> config.
          </>
        }
      >
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <ConfigPattern
            title="Drill into a route family"
            body="The list is the boundary. Entering any descendant drills in; returning to the list drills out."
            code={`{
  on: "/products/**",
  except: "/products",
  transition: drill(),
}`}
          />
          <ConfigPattern
            title="Open a sheet above ordered tabs"
            body={
              <>
                The tab order owns sideways movement. A second rule opens the
                compose route as a sheet.{" "}
                <code className={inlineCode}>on: &quot;/compose&quot;</code>{" "}
                would cover arrivals from anywhere; listing the tabs as{" "}
                <code className={inlineCode}>from</code> keeps the sheet to the
                tab bar.
              </>
            }
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
      </Section>

      <Section
        id="more-transitions-heading"
        title="More transitions"
        lead={
          <>
            Reach for these when the screen needs a different spatial model or a
            more expressive treatment. The same list in plain text:{" "}
            <a
              href="https://ssgoi.dev/llms/transitions.txt"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              transitions.txt
            </a>
            .
          </>
        }
      >
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {MORE_TRANSITIONS.map((doc) => (
            <CompactTransitionCard key={doc.name} doc={doc} />
          ))}
        </ul>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Pattern syntax, specificity and priority in full",
          },
          {
            href: "/docs/scroll-restoration",
            title: "Scroll behavior",
            body: "Which page keeps its scroll position",
          },
          {
            href: "/docs/frameworks",
            title: "Frameworks",
            body: "Where the config goes in your stack",
          },
        ]}
      />
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
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line-strong bg-panel">
        <div className="flex min-h-[428px] items-center justify-center border-b border-line bg-canvas p-5">
          {preview ? (
            <TransitionDemo
              platform={preview.demo.platform ?? "mobile"}
              enterPath={preview.demo.enterPath}
              exitPath={preview.demo.exitPath}
              title={`${doc.name} · ${preview.variantLabel}`}
            />
          ) : (
            <span className={caption}>Demo coming soon</span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-mono text-lg font-semibold text-ink">
            {doc.name}
          </h3>
          <p className={`mt-2 ${prose}`}>{doc.blurb}</p>
          <p className={`mt-3 ${caption}`}>
            {recommendation.ux} · rule:{" "}
            <code className={inlineCode}>{recommendation.rule}</code>
          </p>
          <Link
            href={`/docs/transitions/${doc.name}`}
            className={`mt-5 self-start text-[0.9375rem] ${link}`}
          >
            Variants and usage
          </Link>
        </div>
      </article>
    </li>
  );
}

function ConfigPattern({
  title,
  body,
  code,
}: {
  title: string;
  body: ReactNode;
  code: string;
}) {
  return (
    <div>
      <Heading3>{title}</Heading3>
      <p className={`mt-2 ${prose}`}>{body}</p>
      <CodeBlock className="mt-4" language="ts" code={code} />
    </div>
  );
}

function CompactTransitionCard({ doc }: { doc: TransitionDoc }) {
  return (
    <li>
      <Link
        href={`/docs/transitions/${doc.name}`}
        className={`flex h-full flex-col ${card} transition-colors hover:border-ink-faint`}
      >
        <span className="font-mono text-base font-semibold text-ink">
          {doc.name}
        </span>
        <p className={`mt-2 ${prose}`}>{doc.blurb}</p>
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
