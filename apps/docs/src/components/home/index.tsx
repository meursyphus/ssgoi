import { SsgoiTransition } from "@ssgoi/react";
import { HeroSection } from "./hero-section";
import { ElementTransitionSection } from "./element-transition-section";
import { FeaturesSection } from "./features-section";
import { DemoShowcaseSection } from "./demo-showcase-section";
import { FrameworksSection } from "./frameworks-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";

export function HomePageContent() {
  return (
    <SsgoiTransition
      id="/ssgoi"
      as="div"
      className="relative page !bg-transparent min-h-screen"
    >
      <HeroSection />
      <FeaturesSection />
      <DemoShowcaseSection />
      <ElementTransitionSection />
      <FrameworksSection />
      <CTASection />
      <Footer />
    </SsgoiTransition>
  );
}
