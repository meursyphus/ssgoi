/* eslint-disable @typescript-eslint/no-explicit-any */
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx-components";
import svelte from "@/lib/highlights/svelte";
import vue from "@/lib/highlights/vue";
import { common } from "lowlight";

// Syntax highlighting styles are in globals.css

interface MdxRemoteProps {
  source: string;
  components?: Record<string, any>;
}

const defaultComponents = {
  h1: (props: any) => (
    <h1 className="text-xl font-medium mt-8 mb-4 text-neutral-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-lg font-medium mt-6 mb-3 text-neutral-200" {...props} />
  ),
  h3: (props: any) => (
    <h3
      className="text-base font-medium mt-4 mb-2 text-neutral-300"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="mb-4 text-sm text-neutral-400 leading-relaxed" {...props} />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc pl-5 mb-4 text-sm text-neutral-400 space-y-1"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal pl-5 mb-4 text-sm text-neutral-400 space-y-1"
      {...props}
    />
  ),
  li: (props: any) => <li className="mb-1" {...props} />,
  code: (props: any) => {
    const { children, className, ...rest } = props;
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-neutral-400 font-mono border border-white/5"
          {...rest}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: any) => {
    const { children, ...rest } = props;
    return (
      <pre
        className="hljs bg-[#111] border border-white/5 p-4 rounded-lg overflow-x-auto mb-4 text-xs"
        {...rest}
      >
        {children}
      </pre>
    );
  },
  blockquote: (props: any) => (
    <blockquote
      className="border-l border-neutral-700 pl-4 italic my-4 text-sm text-neutral-500"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="text-neutral-400 underline underline-offset-2 hover:text-neutral-200 transition-colors"
      {...props}
    />
  ),
  strong: (props: any) => (
    <strong className="font-medium text-neutral-200" {...props} />
  ),
  em: (props: any) => <em className="italic text-neutral-500" {...props} />,
  hr: (props: any) => <hr className="border-white/5 my-8" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-white/5" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-white/[0.02]" {...props} />,
  tbody: (props: any) => (
    <tbody className="divide-y divide-white/5" {...props} />
  ),
  tr: (props: any) => <tr {...props} />,
  th: (props: any) => (
    <th
      className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="px-4 py-2 text-xs text-neutral-400" {...props} />
  ),
};

export async function MdxRemote({ source, components = {} }: MdxRemoteProps) {
  return (
    <MDXRemote
      source={source}
      components={{
        ...defaultComponents,
        ...mdxComponents,
        ...components,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypeHighlight,
              {
                languages: { ...common, svelte, vue },
              },
            ],
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ],
        },
      }}
    />
  );
}
