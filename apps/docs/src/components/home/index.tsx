import { SsgoiTransition } from "@ssgoi/react";
import { HeroSection } from "./hero-section";
import { FrameworkSection } from "./framework-section";
import { WhySsgoiSection } from "./why-ssgoi-section";
import { CodeExampleSection } from "./code-example-section";
import { CtaSection } from "./cta-section";

interface HomePageContentProps {
  lang: string;
}

export function HomePageContent({ lang }: HomePageContentProps) {
  return (
    <SsgoiTransition id="/" as="div" className="relative">
      <HeroSection lang={lang} />
      <FrameworkSection lang={lang} />
      <WhySsgoiSection lang={lang} />
      <CodeExampleSection lang={lang} />
      <CtaSection lang={lang} />
    </SsgoiTransition>
  );
}