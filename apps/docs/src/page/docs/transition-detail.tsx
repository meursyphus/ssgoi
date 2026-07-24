import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";
import { TransitionDemo } from "@/components/transition-demo";
import {
  USE_META,
  variantCall,
  type TransitionDoc,
  type TransitionVariant,
} from "@/page/docs/transitions-data";

export function TransitionDetailBody({ doc }: { doc: TransitionDoc }) {
  const meta = USE_META[doc.use];
  const effect = `${doc.name}()`;
  const rule =
    doc.ruleStyle === "ordered"
      ? `{
      ordered: ["/first", "/second", "/third"],
      transition: ${effect},
    }`
      : `{ from: "/list", to: "/detail/:id", transition: ${effect} }`;

  const setup = `import { ${doc.name} } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    ${rule},
  ],
};`;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <span
          className={
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider " +
            meta.cls
          }
        >
          {meta.label}
        </span>
        <span className="text-sm text-neutral-500">{meta.when}</span>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-100">Usage</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
          Put the effect in a route rule. The factory only describes animation;
          the rule describes where it applies and resolves forward/backward.
          Shown for React — the same config works across adapters.
        </p>
        <CodeBlock className="mt-4" code={setup} />
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-100">
          {doc.variants.length > 1 ? "Variants" : "Behavior"}
        </h2>
        <ul className="mt-5 flex flex-col gap-8">
          {doc.variants.map((v) => (
            <VariantRow key={v.label} doc={doc} variant={v} />
          ))}
        </ul>
      </section>

      <div className="mt-12 flex items-center justify-between border-t border-white/[0.06] pt-6 text-sm">
        <Link
          href="/docs/transitions"
          className="text-neutral-400 transition-colors hover:text-neutral-100"
        >
          ← All transitions
        </Link>
        <a
          href={`https://ssgoi.dev/llms/${doc.name}.txt`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-400 transition-colors hover:text-orange-400"
        >
          /llms/{doc.name}.txt ↗
        </a>
      </div>
    </div>
  );
}

function VariantRow({
  doc,
  variant,
}: {
  doc: TransitionDoc;
  variant: TransitionVariant;
}) {
  const demos = variant.demos ?? [];

  return (
    <li className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
      {demos.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {demos.map((demo) => (
            <li
              key={`${demo.enterPath}→${demo.exitPath}`}
              className="flex justify-center rounded-xl bg-neutral-900/40 p-3"
            >
              <TransitionDemo
                platform={demo.platform ?? "mobile"}
                enterPath={demo.enterPath}
                exitPath={demo.exitPath}
                title={`${doc.name} · ${variant.label}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center rounded-xl bg-neutral-900/40 py-10">
          <span className="text-xs text-neutral-500">Demo coming soon</span>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <h3 className="font-mono text-base font-semibold text-neutral-100">
          {variant.label}
        </h3>
        {variant.isDefault && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
            default
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
        {variant.ux}
      </p>
      <CodeBlock className="mt-4" code={variantCall(doc, variant)} />
    </li>
  );
}
