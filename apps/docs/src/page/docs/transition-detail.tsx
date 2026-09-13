import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import {
  USE_META,
  variantCall,
  type TransitionDoc,
  type TransitionGif,
  type TransitionIdentitySpec,
  type TransitionSetting,
  type TransitionVariant,
} from "@/page/docs/transitions-data";
import {
  DocsTable,
  Heading3,
  NextLinks,
  Note,
  Section,
  caption,
  inlineCode,
  link,
  measure,
  prose,
  proseDim,
} from "@/page/docs/ui";

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
          : doc.ruleStyle === "fallback"
            ? `{ priority: -100, on: "/**", transition: ${effect} }`
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

  const hasSettings = doc.variants.some((v) => v.settings?.length);

  return (
    <div className="mt-4">
      {/* Orienting line, not metadata: it names the relationship this motion  */}
      {/* reads as, so it stays at lead weight directly under the h1 lead.     */}
      <p className={`${measure} ${proseDim}`}>
        {meta.label} — {meta.when}
      </p>

      <Section title="When this motion fits" id="decision-heading">
        <dl className="mt-6 border-t border-line">
          <DecisionRow label="When to use" value={doc.decision.whenToUse} />
          <DecisionRow label="What moves" value={doc.decision.motion} />
          <DecisionRow label="Avoid when" value={doc.decision.avoidWhen} />
        </dl>
      </Section>

      <Section
        title="Add it to a route rule"
        id="route-config-heading"
        lead={
          <>
            <code className={inlineCode}>{effect}</code> sets the motion; the
            rule around it decides which navigations get it. The config shape is
            the same in every framework.
          </>
        }
      >
        <CodeBlock className="mt-6" language="ts" code={setup} />
        <p className={`mt-4 ${measure} ${prose}`}>
          Pattern forms, priority and the scroll defaults that come with each
          rule shape are on{" "}
          <Link href="/docs/route-rules" className={link}>
            Route rules
          </Link>
          .
        </p>
      </Section>

      {doc.identity && <IdentitySection identity={doc.identity} />}

      <Section
        title={doc.variants.length > 1 ? "Configurations" : "Behavior"}
        id="combinations-heading"
        lead={
          hasSettings ? (
            <>
              <code className={inlineCode}>type</code>,{" "}
              <code className={inlineCode}>variant</code> and{" "}
              <code className={inlineCode}>option</code> are independent. Each
              clip is recorded from a demo published on ssgoi.dev. Combinations
              without a published demo keep the API details without a substitute
              clip.
            </>
          ) : undefined
        }
      >
        <ul className="mt-8 flex flex-col gap-12">
          {doc.variants.map((variant) => (
            <VariantRow key={variant.label} doc={doc} variant={variant} />
          ))}
        </ul>
      </Section>

      <p className={`mt-14 border-t border-line pt-8 ${measure} ${prose}`}>
        Agent guide:{" "}
        <a
          href={`https://ssgoi.dev/llms/transitions/${doc.name}.txt`}
          target="_blank"
          rel="noreferrer"
          className={`${link} font-mono text-[0.9em]`}
        >
          /llms/transitions/{doc.name}.txt
        </a>{" "}
        — every prop, the required markup, and a config fragment as plain text.
      </p>

      <NextLinks
        links={[
          {
            href: "/docs/transitions",
            title: "All transitions",
            body: "Compare the 12 documented effects side by side",
          },
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Match routes, break ties, control scroll",
          },
        ]}
      />
    </div>
  );
}

function DecisionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-x-8 border-b border-line py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
      <dt className="text-[0.9375rem] font-medium leading-7 text-ink">
        {label}
      </dt>
      <dd className={`${prose} mt-1 sm:mt-0`}>{value}</dd>
    </div>
  );
}

function IdentitySection({ identity }: { identity: TransitionIdentitySpec }) {
  return (
    <Section
      title="Connect the source to the destination"
      id="identity-heading"
      lead={identity.keyRole}
    >
      <DocsTable
        head={["Page", "Attribute on the element"]}
        rows={[
          [
            identity.source.label,
            <code key="source" className={inlineCode}>
              {identity.source.attribute}=&quot;same-id&quot;
            </code>,
          ],
          [
            identity.destination.label,
            <code key="destination" className={inlineCode}>
              {identity.destination.attribute}=&quot;same-id&quot;
            </code>,
          ],
        ]}
        minWidth="420px"
      />

      <ul
        className={`mt-6 list-disc space-y-2 pl-5 marker:text-ink-faint ${measure} ${prose}`}
      >
        {identity.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <div className="mt-6">
        <Note>{identity.failure}</Note>
      </div>

      <CodeBlock className="mt-6" language="tsx" code={identity.code} />
    </Section>
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
  const gifs = [
    ...(variant.gif ? [variant.gif] : []),
    ...(variant.extraGifs ?? []),
  ];

  return (
    <li>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Heading3>{variant.label}</Heading3>
        {variant.settings?.map((setting) => (
          <SettingBadge
            key={`${setting.kind}:${setting.value}`}
            setting={setting}
          />
        ))}
        {variant.isDefault && <span className={caption}>default</span>}
      </div>

      <p className={`mt-2 ${measure} ${prose}`}>{variant.ux}</p>

      {gifs.map((gif) => (
        <TransitionFigure key={gif.src} gif={gif} />
      ))}

      <CodeBlock
        className="mt-5"
        language="ts"
        code={variantCall(doc, variant)}
      />

      {demos.length > 0 && (
        <p className={`mt-4 ${prose}`}>
          {demos.map((demo, index) => (
            <span key={`${demo.exitPath}→${demo.enterPath}`}>
              {index > 0 && " · "}
              <Link href={demo.exitPath} prefetch={false} className={link}>
                {demos.length > 1
                  ? `Open live demo ${index + 1}`
                  : "Open live demo"}
              </Link>
            </span>
          ))}
          <span className={`ml-3 ${caption}`}>Opens at the source screen</span>
        </p>
      )}
    </li>
  );
}

function TransitionFigure({ gif }: { gif: TransitionGif }) {
  const isMobile = gif.width <= 360;

  return (
    <figure className="mt-6">
      <div
        className={
          "flex justify-center overflow-hidden rounded-xl border border-line bg-panel " +
          (isMobile ? "p-5 sm:p-7" : "")
        }
      >
        <Image
          src={gif.src}
          alt={gif.alt}
          width={gif.width}
          height={gif.height}
          sizes={isMobile ? "360px" : "(min-width: 1024px) 640px, 100vw"}
          unoptimized
          className={
            isMobile
              ? "h-auto w-full max-w-[360px] rounded-[1.5rem] border border-line-strong"
              : "h-auto w-full"
          }
        />
      </div>
      {gif.label && (
        <figcaption className={`mt-2 ${caption}`}>{gif.label}</figcaption>
      )}
    </figure>
  );
}

/** `kind: value` names real API values, so it keeps the mono face. */
function SettingBadge({ setting }: { setting: TransitionSetting }) {
  return (
    <span className="rounded-full border border-line bg-raised px-2 py-0.5 font-mono text-xs text-ink-dim">
      {setting.kind}: {setting.value}
    </span>
  );
}
