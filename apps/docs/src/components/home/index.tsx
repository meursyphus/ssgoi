import { SsgoiTransition } from "@ssgoi/react";
import { HeroSection } from "./hero-section";
import { ElementTransitionSection } from "./element-transition-section";
import { FeaturesSection } from "./features-section";
import { CodeSection } from "./code-section";
import { FrameworksSection } from "./frameworks-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";

interface HomePageContentProps {
  lang: string;
}

export function HomePageContent({ lang }: HomePageContentProps) {
  return (
    <SsgoiTransition
      id="/ssgoi"
      as="div"
      className="relative page !bg-transparent min-h-screen"
    >
      <HeroSection lang={lang} />
      <FeaturesSection />
      <ElementTransitionSection />
      <CodeSection />
      <FrameworksSection />
      <CTASection lang={lang} />
      <Footer />
    </SsgoiTransition>
  );
}
