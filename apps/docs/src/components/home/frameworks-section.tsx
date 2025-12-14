export function FrameworksSection() {
  const frameworks = [
    { name: "React", status: "available" },
    { name: "Svelte", status: "available" },
    { name: "Vue", status: "available" },
    { name: "Angular", status: "available" },
    { name: "SolidJS", status: "available" },
    { name: "Qwik", status: "soon" },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
            Frameworks
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            모든 프레임워크 지원
          </h2>
          <p className="text-xs text-neutral-500">
            같은 API, 같은 경험. 프레임워크에 관계없이 일관된 전환 효과.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {frameworks.map((fw) => (
            <div
              key={fw.name}
              className={`px-4 py-2 rounded border text-xs ${
                fw.status === "available"
                  ? "bg-white/[0.02] border-white/10 text-neutral-300"
                  : "border-white/5 text-neutral-600"
              }`}
            >
              {fw.name}
              {fw.status === "soon" && (
                <span className="ml-2 text-[10px] text-neutral-600">soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
