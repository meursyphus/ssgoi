import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/docs/mdx-components";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

interface MDXContentProps {
  content: string;
}

export async function MDXContent({ content }: MDXContentProps) {
  return (
    <MDXRemote
      source={content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeHighlight,
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["heading-link"],
                },
              },
            ],
          ],
        },
      }}
    />
  );
}