import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import {
  USE_META,
  variantCall,
  type TransitionDoc,
  type TransitionIdentitySpec,
  type TransitionSetting,
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
      : doc.ruleStyle === "stack"
        ? `{
      on: "/products/**",
      except: "/products",
      transition: ${effect},
    }`
        : doc.ruleStyle === "target"
          ? `{ on: "/compose", transition: ${effect} }`
          : `{
      from: "/list",
      to: "/detail/*",
      transition: ${effect},
    }`;

  const setup = `import { ${doc.name} } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    ${rule},
  ],
};`;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
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

      <section className="mt-8" aria-labelledby="decision-heading">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-400">
          Start with the interaction
        </p>
        <h2
          id="decision-heading"
          className="mt-2 text-xl font-semibold tracking-tight text-neutral-100"
        >
          When this motion fits
        </h2>
        <dl className="mt-5 grid gap-3 md:grid-cols-3">
          <DecisionItem
            label="When to use"
            value={doc.decision.whenToUse}
            accent
          />
          <DecisionItem label="What moves" value={doc.decision.motion} />
          <DecisionItem label="Avoid when" value={doc.decision.avoidWhen} />
        </dl>
      </section>

      <section
        className="mt-12 border-t border-white/[0.06] pt-10"
        aria-labelledby="route-config-heading"
      >
        <h2
          id="route-config-heading"
          className="text-lg font-semibold text-neutral-100"
        >
          Apply it to a route relationship
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
          The factory chooses the motion. The surrounding rule chooses where it
          applies and gives SSGOI enough route context to resolve forward and
          backward. This example uses React; the config shape is shared by the
          framework adapters.
        </p>
        <CodeBlock className="mt-4" language="ts" code={setup} />
      </section>

      {doc.identity && <IdentitySection identity={doc.identity} />}

      <section
        className="mt-12 border-t border-white/[0.06] pt-10"
        aria-labelledby="combinations-heading"
      >
        <h2
          id="combinations-heading"
          className="text-lg font-semibold text-neutral-100"
        >
          {doc.variants.length > 1 ? "Available configurations" : "Behavior"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
          A <code className="font-mono text-neutral-300">type</code> changes the
          motion model. A{" "}
          <code className="font-mono text-neutral-300">variant</code> modifies
          that model, and an{" "}
          <code className="font-mono text-neutral-300">option</code> changes a
          supporting detail. Each recording shows the configured effect in its
          route context.
        </p>
        <ul className="mt-6 flex flex-col gap-8">
          {doc.variants.map((variant) => (
            <VariantRow key={variant.label} doc={doc} variant={variant} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="agent-guide-heading"
        className="mt-12 border-t border-white/[0.06] pt-8"
      >
        <h2
          id="agent-guide-heading"
          className="text-lg font-semibold text-neutral-100"
        >
          Agent guide
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
          The plain-text spec includes the complete props, required markup, and
          a focused config fragment for an AI coding agent.
        </p>
        <a
          href={`https://ssgoi.dev/llms/transitions/${doc.name}.txt`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-xs text-neutral-200 transition-colors hover:border-orange-400/50 hover:bg-orange-400/[0.06] hover:text-orange-300"
        >
          /llms/transitions/{doc.name}.txt
          <span aria-hidden>↗</span>
        </a>
      </section>

      <nav
        aria-label="Transition documentation"
        className="mt-10 border-t border-white/[0.06] pt-6 text-sm"
      >
        <Link
          href="/docs/transitions"
          className="text-neutral-400 transition-colors hover:text-neutral-100"
        >
          ← All transitions
        </Link>
      </nav>
    </div>
  );
}

function DecisionItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-5 " +
        (accent
          ? "border-orange-500/25 bg-orange-500/[0.055]"
          : "border-white/[0.06] bg-white/[0.015]")
      }
    >
      <dt
        className={
          "text-xs font-semibold uppercase tracking-[0.14em] " +
          (accent ? "text-orange-400" : "text-neutral-500")
        }
      >
        {label}
      </dt>
      <dd className="mt-3 text-sm leading-relaxed text-neutral-300">{value}</dd>
    </div>
  );
}

function IdentitySection({ identity }: { identity: TransitionIdentitySpec }) {
  return (
    <section
      className="mt-12 border-t border-white/[0.06] pt-10"
      aria-labelledby="identity-heading"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange-400">
        Required element identity
      </p>
      <h2
        id="identity-heading"
        className="mt-2 text-lg font-semibold text-neutral-100"
      >
        Connect the source to the destination
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
        {identity.keyRole}
      </p>

      <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <IdentityMarker
          label={identity.source.label}
          attribute={identity.source.attribute}
        />
        <div
          className="flex items-center justify-center text-xl text-orange-400"
          aria-hidden
        >
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </div>
        <IdentityMarker
          label={identity.destination.label}
          attribute={identity.destination.attribute}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
          <h3 className="text-sm font-semibold text-neutral-200">
            Matching rules
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-400">
            {identity.rules.map((rule) => (
              <li key={rule} className="flex gap-2.5">
                <span className="mt-[0.1rem] text-orange-400" aria-hidden>
                  ·
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.045] p-5">
          <h3 className="text-sm font-semibold text-amber-200">
            When it does nothing
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {identity.failure}
          </p>
        </div>
      </div>

      <CodeBlock className="mt-5" language="tsx" code={identity.code} />
    </section>
  );
}

function IdentityMarker({
  label,
  attribute,
}: {
  label: string;
  attribute: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-neutral-950/50 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </p>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-sm text-orange-300">
        {attribute}=&quot;same-id&quot;
      </code>
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
  const isMobile = variant.gif.width <= 360;

  return (
    <li className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015]">
      <figure className="border-b border-white/[0.06] bg-gradient-to-b from-[#17110d] to-[#0b0908]">
        <div
          className={"flex justify-center " + (isMobile ? "p-5 sm:p-7" : "p-0")}
        >
          <Image
            src={variant.gif.src}
            alt={variant.gif.alt}
            width={variant.gif.width}
            height={variant.gif.height}
            sizes={isMobile ? "360px" : "(min-width: 1024px) 640px, 100vw"}
            unoptimized
            className={
              isMobile
                ? "h-auto w-full max-w-[360px] rounded-[1.5rem] border border-white/10 shadow-2xl shadow-black/30"
                : "h-auto w-full"
            }
          />
        </div>
        <figcaption className="sr-only">{variant.gif.alt}</figcaption>
      </figure>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {variant.settings?.map((setting) => (
            <SettingBadge
              key={`${setting.kind}:${setting.value}`}
              setting={setting}
            />
          ))}
          {!variant.settings?.length && (
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              single behavior
            </span>
          )}
          {variant.isDefault && (
            <span className="rounded-full border border-orange-400/25 bg-orange-400/[0.07] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-orange-300">
              default combination
            </span>
          )}
        </div>

        <h3 className="mt-4 font-mono text-base font-semibold text-neutral-100">
          {variant.label}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-300">
          {variant.ux}
        </p>
        <CodeBlock
          className="mt-5"
          language="ts"
          code={variantCall(doc, variant)}
        />

        {demos.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {demos.map((demo, index) => (
              <Link
                key={`${demo.exitPath}→${demo.enterPath}`}
                href={demo.exitPath}
                prefetch={false}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-orange-400"
              >
                {demos.length > 1
                  ? `Open live demo ${index + 1}`
                  : "Open live demo"}
                <span
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            ))}
            <span className="text-xs text-neutral-600">
              Opens at the source screen
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

function SettingBadge({ setting }: { setting: TransitionSetting }) {
  const style =
    setting.kind === "type"
      ? "border-sky-400/25 bg-sky-400/[0.07] text-sky-300"
      : setting.kind === "variant"
        ? "border-violet-400/25 bg-violet-400/[0.07] text-violet-300"
        : "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300";

  return (
    <span
      className={
        "inline-flex items-center overflow-hidden rounded-full border text-[10px] font-medium uppercase tracking-wider " +
        style
      }
    >
      <span className="border-r border-current/15 px-2 py-1 opacity-70">
        {setting.kind}
      </span>
      <code className="px-2 py-1 font-mono normal-case tracking-normal">
        {setting.value}
      </code>
    </span>
  );
}
