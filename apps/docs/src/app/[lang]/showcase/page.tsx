import { ShowcaseGrid } from "@/components/showcase/showcase-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase | SSGOI",
  description: "Discover amazing websites built with SSGOI - Universal page transition library for the web",
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <ShowcaseGrid />
    </div>
  );
}