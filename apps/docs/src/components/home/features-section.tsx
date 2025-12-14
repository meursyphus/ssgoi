import { Zap, Globe, Layers, Sparkles } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "제로 설정",
      description: "복잡한 설정 없이 바로 시작. 기본값만으로도 충분합니다.",
    },
    {
      icon: Globe,
      title: "모든 브라우저",
      description:
        "Chrome의 View Transitions API에 의존하지 않아 Safari, Firefox에서도 동작합니다.",
    },
    {
      icon: Layers,
      title: "SSR 지원",
      description:
        "Next.js, Nuxt, SvelteKit 등 모든 SSR 프레임워크와 완벽 호환됩니다.",
    },
    {
      icon: Sparkles,
      title: "물리 기반 애니메이션",
      description:
        "스프링 물리학을 사용해 자연스럽고 반응적인 전환을 제공합니다.",
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-xl font-light tracking-tight">왜 SSGOI인가</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
