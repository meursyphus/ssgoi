import Image from "next/image";
import type { ReactNode } from "react";
import { Link } from "@/lib/link";

/* -------------------------------------------------------------------------- */
/* Class tokens                                                               */
/*                                                                            */
/* Every docs page composes from these. Body copy is 15px/28 at --color-ink-  */
/* soft; anything dimmer than --color-ink-dim is reserved for metadata that   */
/* nobody has to read. Brand orange is not in this file on purpose: it is     */
/* spent once per page, on the one thing the reader should act on.            */
/* -------------------------------------------------------------------------- */

export const prose = "text-[0.9375rem] leading-7 text-ink-soft";
export const proseDim = "text-[0.9375rem] leading-7 text-ink-dim";
export const caption = "text-sm leading-6 text-ink-faint";

export const link =
  "text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:decoration-ink-dim";

export const card = "rounded-xl border border-line-strong bg-panel p-5";

export const inlineCode =
  "rounded bg-raised px-1.5 py-0.5 font-mono text-[0.9em] text-ink";

/** Measure for running text. Wider than the old max-w-xl, which broke lines early. */
export const measure = "max-w-[62ch]";

/* -------------------------------------------------------------------------- */
/* Page structure                                                             */
/* -------------------------------------------------------------------------- */

export function PageHeading({
  title,
  lead,
}: {
  title: string;
  lead?: ReactNode;
}) {
  return (
    <header>
      <h1 className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.5rem]">
        {title}
      </h1>
      {lead && (
        <p
          className={`mt-4 text-pretty ${measure} text-lg leading-8 text-ink-dim`}
        >
          {lead}
        </p>
      )}
    </header>
  );
}

export function Section({
  title,
  lead,
  id,
  children,
}: {
  title: string;
  lead?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-line pt-10" aria-labelledby={id}>
      <h2
        id={id}
        className="text-xl font-semibold tracking-[-0.01em] text-ink md:text-[1.375rem]"
      >
        {title}
      </h2>
      {lead && <p className={`mt-3 ${measure} ${prose}`}>{lead}</p>}
      {children}
    </section>
  );
}

/** A sub-heading inside a Section. */
export function Heading3({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <h3 id={id} className="text-base font-semibold text-ink">
      {children}
    </h3>
  );
}

/* -------------------------------------------------------------------------- */
/* Callout                                                                    */
/*                                                                            */
/* One quiet rule on the left. No label chip, no tinted panel — the sentence  */
/* is the emphasis.                                                           */
/* -------------------------------------------------------------------------- */

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className={`border-l-2 border-line-strong pl-5 ${measure} ${prose}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ordered steps — the number is real sequence information, so it stays       */
/* -------------------------------------------------------------------------- */

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="mt-8 flex flex-col gap-10">{children}</ol>;
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3">
      <span
        className="pt-0.5 font-mono text-sm tabular-nums text-ink-faint"
        aria-hidden
      >
        {n}
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <div className="col-start-2 mt-3">{children}</div>
    </li>
  );
}

/** A short numbered sequence used as a checklist, not as page structure. */
export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ol className="mt-5 flex flex-col gap-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.75rem_minmax(0,1fr)] text-[0.9375rem] leading-7 text-ink-soft"
        >
          <span
            className="font-mono text-sm tabular-nums text-ink-faint"
            aria-hidden
          >
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Table                                                                      */
/* -------------------------------------------------------------------------- */

export function DocsTable({
  head,
  rows,
  minWidth,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  minWidth?: string;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-line-strong">
      <table
        className="w-full text-left text-[0.9375rem]"
        style={minWidth ? { minWidth } : undefined}
      >
        <thead>
          <tr className="border-b border-line-strong bg-raised">
            {head.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className="px-4 py-3 font-semibold text-ink"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    "px-4 py-3.5 align-top leading-7 " +
                    (j === 0 ? "font-medium text-ink" : "text-ink-soft")
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Figure — diagrams and recordings carry the explanation, so they stay big   */
/* -------------------------------------------------------------------------- */

export function Figure({
  src,
  alt,
  width,
  height,
  caption: captionText,
  priority,
  unoptimized,
  sizes = "(min-width: 1024px) 768px, 100vw",
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`mt-8 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className="h-auto w-full"
        />
      </div>
      {captionText && (
        <figcaption className={`mt-3 ${measure} ${caption}`}>
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Read next — a list, not a wall of cards                                    */
/* -------------------------------------------------------------------------- */

export function NextLinks({
  title = "Read next",
  links,
}: {
  title?: string;
  links: Array<{ href: string; title: string; body?: string }>;
}) {
  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <ul className="mt-2 divide-y divide-line">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-baseline gap-4 py-3.5 transition-colors"
            >
              <span className="font-medium text-ink-soft transition-colors group-hover:text-ink">
                {item.title}
              </span>
              {item.body && (
                <span className="hidden flex-1 text-sm text-ink-faint sm:block">
                  {item.body}
                </span>
              )}
              <span
                className="ml-auto shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Call to action — the single brand-coloured element a page is allowed       */
/* -------------------------------------------------------------------------- */

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-brand-soft"
    >
      {children}
      <span
        className="transition-transform group-hover:translate-x-0.5"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-faint"
    >
      {children}
    </Link>
  );
}
