import type { Metadata } from "next";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading, Section, link, measure, prose } from "@/page/docs/ui";
import { CompatibilityBody, RoutersBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Browser and router support — what SSGOI runs on",
  description:
    "SSGOI keeps the router you already use and animates through the browser's own Web Animations API, so nothing in your navigation or rendering stack is replaced.",
  alternates: { canonical: "/docs/compatibility" },
  openGraph: buildOpenGraph({ path: "/docs/compatibility" }),
};

export default function DocsCompatibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Browser & router support", path: "/docs/compatibility" },
        ])}
      />
      <PageHeading
        title="Browser & router support"
        lead="SSGOI runs in the browsers you already support, with the router you already use."
      />

      <Section
        title="Browser runtime"
        lead="Springs are simulated up front and handed to the browser as keyframes, so the animation itself runs natively."
      >
        <CompatibilityBody />
      </Section>

      <Section
        title="Routers and frameworks"
        lead="SSGOI follows your framework's route lifecycle instead of replacing it, so navigation and SSR stay as they are."
      >
        <RoutersBody />
        <p className={`mt-6 ${measure} ${prose}`}>
          Each stack has its own setup page in the{" "}
          <Link href="/docs/frameworks" className={link}>
            framework guides
          </Link>
          . For how this relates to the browser&apos;s own View Transition API,
          see{" "}
          <Link href="/docs/view-transition-api" className={link}>
            why not View Transitions
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
