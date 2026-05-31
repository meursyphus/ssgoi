import type { MDXComponents } from "mdx/types";
import { Link } from "@/lib/link";

function isInternal(href?: string) {
  return !!href && href.startsWith("/");
}

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-12 text-balance text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 border-t border-white/[0.06] pt-10 text-balance text-2xl font-semibold tracking-tight text-neutral-100 md:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 text-xl font-semibold tracking-tight text-neutral-100"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-5 leading-relaxed text-neutral-300" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mt-5 list-disc space-y-2 pl-6 leading-relaxed text-neutral-300 marker:text-neutral-600"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-neutral-300 marker:text-neutral-600"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: ({ href, children, ...rest }) => {
    if (isInternal(href)) {
      return (
        <Link
          href={href as string}
          className="text-orange-400 underline decoration-orange-400/40 underline-offset-4 hover:decoration-orange-400"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-orange-400 underline decoration-orange-400/40 underline-offset-4 hover:decoration-orange-400"
        {...rest}
      >
        {children}
      </a>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-orange-500/40 pl-4 italic text-neutral-400"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-orange-200"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 font-mono text-[13px] leading-relaxed text-neutral-200 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-neutral-200"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/[0.06]" />,
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-white/10 px-3 py-2 font-semibold text-neutral-200"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-white/[0.05] px-3 py-2 text-neutral-300"
      {...props}
    />
  ),
};
