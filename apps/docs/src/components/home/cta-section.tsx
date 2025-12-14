import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

interface CTASectionProps {
  lang: string;
}

export function CTASection({ lang }: CTASectionProps) {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-light tracking-tight mb-4">
          지금 시작하세요
        </h2>
        <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">
          몇 분 안에 네이티브 수준의 페이지 전환을 구현할 수 있습니다.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/${lang}/docs`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            문서 보기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs text-neutral-400 border border-white/10 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
