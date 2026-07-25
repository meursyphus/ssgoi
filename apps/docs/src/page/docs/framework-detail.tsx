import { NpmPill } from "@/components/npm-pill";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import { type FrameworkDoc } from "@/page/docs/frameworks-data";
import { Section, link, measure, prose } from "@/page/docs/ui";

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-panel px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink-faint";

export function FrameworkDetailBody({ doc }: { doc: FrameworkDoc }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <NpmPill pkg={doc.pkg} />
        {doc.llmsUrl && (
          <a
            href={doc.llmsUrl}
            target="_blank"
            rel="noreferrer"
            className={pillClass}
          >
            Agent guide ↗
          </a>
        )}
        {doc.templateUrl && (
          <a
            href={doc.templateUrl}
            target="_blank"
            rel="noreferrer"
            className={pillClass}
          >
            Template ↗
          </a>
        )}
      </div>

      {doc.sections.map((section, i) => (
        <Section key={i} title={section.heading} lead={section.body}>
          {section.code && (
            <CodeBlock
              className="mt-6"
              language={section.language ?? "tsx"}
              code={section.code}
            />
          )}
        </Section>
      ))}

      <p className={`mt-14 border-t border-line pt-8 ${measure} ${prose}`}>
        Effects and route matching work the same everywhere, so{" "}
        <Link href="/docs/transitions" className={link}>
          Transitions
        </Link>{" "}
        and{" "}
        <Link href="/docs/boundaries" className={link}>
          Route boundaries
        </Link>{" "}
        apply here unchanged.
      </p>
    </div>
  );
}
