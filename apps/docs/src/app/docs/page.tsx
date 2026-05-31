import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs — Setup, transitions, and how SSGOI works",
  description:
    "Install SSGOI, mark your pages, and pick from 13 page transitions. Setup lives in plain-text llms.txt files your AI agent can read directly.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "SSGOI Docs — Setup, transitions, and how it works",
    description:
      "Install SSGOI, mark your pages, and pick from 13 page transitions. Setup lives in plain-text llms.txt files your AI agent can read directly.",
    url: "/docs",
  },
};

export { default } from "@/page/docs";
