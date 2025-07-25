import _Demo from "../../demo";

export function Demo({ autoPlay = false }: { autoPlay?: boolean }) {
  return (
    <div className="flex justify-center items-center my-12">
      <div className="relative max-w-sm w-full">
        {/* 모바일 프레임 */}
        <div className="relative overflow-hidden rounded-[3rem] border-8 border-white/10 bg-black shadow-2xl">
          <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* Demo Component */}
          <div className="aspect-[9/19.5]">
            <_Demo autoPlay={autoPlay} />
          </div>
        </div>
      </div>
    </div>
  );
}
