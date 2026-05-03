import { ShowcaseGrid } from "@/components/showcase/showcase-grid";
import type { Metadata } from "next";
import { messages } from "@/messages";
import { SsgoiTransition } from "@/components/docs/ssgoi";
import { createSEOMetadata } from "@/lib/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createSEOMetadata({
    title: messages.showcase.metaTitle,
    description: messages.showcase.metaDescription,
  });

  return metadata;
}

export default function ShowcasePage() {
  return (
    <SsgoiTransition className="page" id="/ssgoi/showcase">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <ShowcaseGrid />
      </div>
    </SsgoiTransition>
  );
}
