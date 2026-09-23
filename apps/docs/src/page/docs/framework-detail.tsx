import { NpmPill } from "@/components/npm-pill";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import { type FrameworkDoc } from "@/page/docs/frameworks-data";
import { Heading3, Section, link, measure, prose } from "@/page/docs/ui";

export function FrameworkDetailBody({ doc }: { doc: FrameworkDoc }) {
  return (
    <div className="mt-8">
      <NpmPill pkg={doc.pkg} />

      {doc.sections.map((section) => (
        <Section
          key={section.heading}
          title={section.heading}
          lead={section.body}
        >
          {section.code && (
            <CodeBlock
              className="mt-6"
              language={section.language ?? "tsx"}
              code={section.code}
            />
          )}
        </Section>
      ))}

      <nav
        aria-label={`${doc.name} router helpers`}
        className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm"
      >
        {doc.routers.map((router) => (
          <Link key={router.slug} href={`#${router.slug}`} className={link}>
            {router.name}
          </Link>
        ))}
      </nav>

      {doc.routers.map((router) => (
        <section
          key={router.slug}
          id={router.slug}
          aria-labelledby={`${router.slug}-heading`}
          className="mt-14 scroll-mt-24 border-t border-line pt-10"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2
              id={`${router.slug}-heading`}
              className="text-xl font-semibold tracking-tight text-ink"
            >
              {router.name}
            </h2>
            {router.experimental && (
              <span className="text-xs font-normal text-ink-faint">
                Experimental API
              </span>
            )}
          </div>
          <p className={`mt-3 ${measure} ${prose}`}>{router.lead}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {router.llmsUrl && (
              <a href={router.llmsUrl} className={link}>
                Agent guide
              </a>
            )}
            {router.templateUrl && (
              <a href={router.templateUrl} className={link}>
                Runnable template
              </a>
            )}
          </div>
          {router.sections.map((section) => (
            <div key={section.heading} className="mt-8">
              <Heading3>{section.heading}</Heading3>
              {section.body && (
                <p className={`mt-3 ${measure} ${prose}`}>{section.body}</p>
              )}
              {section.code && (
                <CodeBlock
                  className="mt-5"
                  language={section.language ?? "tsx"}
                  code={section.code}
                />
              )}
            </div>
          ))}
        </section>
      ))}

      <p className={`mt-14 border-t border-line pt-8 ${measure} ${prose}`}>
        {doc.native ? (
          <>
            Use native presets and verify behavior on devices. Web effects and
            DOM boundary setup do not apply unchanged to native views.
          </>
        ) : (
          <>
            The helpers connect your router to the common implementation.{" "}
            <Link href="/docs/boundaries" className={link}>
              Route boundaries
            </Link>{" "}
            explains how to connect another router directly.{" "}
            <Link href="/docs/transitions" className={link}>
              Transitions
            </Link>{" "}
            and{" "}
            <Link href="/docs/route-rules" className={link}>
              route rules
            </Link>{" "}
            apply across the web frameworks.
          </>
        )}
      </p>
    </div>
  );
}
