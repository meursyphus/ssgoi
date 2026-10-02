import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph, faqSchema } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import {
  NATIVE_APP_FEEL_FAQ,
  NativeAppFeelBody,
} from "@/page/docs/guide-pages";

const path = "/docs/native-app-feel";

export const metadata: Metadata = {
  title: "Make a web app feel native — WebView, PWA and Capacitor transitions",
  description:
    "A WebView or a PWA install does not make a web app feel native; navigation does. Add native-style page transitions, a persistent tab bar, scroll restoration and OS back gestures with SSGOI.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function NativeAppFeelPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Docs", path: "/docs" },
            { name: "Native app feel", path },
          ]),
          faqSchema([...NATIVE_APP_FEEL_FAQ]),
        ]}
      />
      <PageHeading
        title="Native app feel"
        lead="A WebView or a home-screen icon makes a web app installable. What makes it feel native is how it moves between screens."
      />
      <NativeAppFeelBody />
    </>
  );
}
