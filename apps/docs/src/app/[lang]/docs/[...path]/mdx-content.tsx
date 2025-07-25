import { MdxRemote } from "@/components/docs/mdx-remote";

interface MDXContentProps {
  content: string;
}

export async function MDXContent({ content }: MDXContentProps) {
  return <MdxRemote source={content} />;
}
