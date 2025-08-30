import { SsgoiTransition } from "@ssgoi/react";
import { HeroSection } from "./hero-section";
import { WhyTransitionsMatterSection } from "./why-transitions-matter-section";
import { TransitionShowcaseSection } from "./transition-showcase-section";
import { ComparisonSection } from "./comparison-section";
import { FeaturesTimelineSection } from "./features-timeline-section";
import { CtaSection } from "./cta-section";

interface HomePageContentProps {
  lang: string;
}

export function HomePageContent({ lang }: HomePageContentProps) {
  return (
    <SsgoiTransition id="/" as="div" className="relative">
      <HeroSection lang={lang} />
      <WhyTransitionsMatterSection lang={lang} />
      <TransitionShowcaseSection lang={lang} />
      <ComparisonSection lang={lang} />
      <FeaturesTimelineSection lang={lang} />
      <CtaSection lang={lang} />
    </SsgoiTransition>
  );
}