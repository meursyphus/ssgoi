import { messages } from "@/messages";
import { Metadata } from "next";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { HomePageContent } from "@/components/home";

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({
    title: messages.metadata.title,
    description: messages.metadata.description,
    type: "website",
    url: `/`,
  });
}

export default async function Home() {
  return <HomePageContent />;
}
