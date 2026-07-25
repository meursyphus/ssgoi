import { NpmPill } from "@/components/npm-pill";
import { CodeBlock } from "@/components/code-block";
import { type FrameworkDoc } from "@/page/docs/frameworks-data";

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
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-xs text-neutral-200 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            agent guide ↗
          </a>
        )}
        {doc.templateUrl && (
          <a
            href={doc.templateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-xs text-neutral-200 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            template ↗
          </a>
        )}
      </div>

      {doc.sections.map((section, i) => (
        <section key={i} className={section.heading ? "mt-12" : "mt-5"}>
          {section.heading && (
            <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
              {section.heading}
            </h2>
          )}
          {section.body && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              {section.body}
            </p>
          )}
          {section.code && (
            <CodeBlock
              className="mt-5"
              language={section.language ?? "tsx"}
              code={section.code}
            />
          )}
        </section>
      ))}

      <p className="mt-12 max-w-xl border-t border-white/[0.06] pt-8 text-sm leading-relaxed text-neutral-500">
        Transition config and route rules are shared across every framework —
        pick effects on the Transitions page, and read Route boundaries for
        persistent-layout key scoping. Those two pages apply here unchanged.
      </p>
    </div>
  );
}
