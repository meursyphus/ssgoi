import { useParams, A } from "@solidjs/router";
import { SsgoiTransition } from "@ssgoi/solid";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function ItemDetail() {
  const params = useParams();
  const id = () => Number(params.id);
  const item = () => colors.find((c) => c.id === id());

  return (
    <SsgoiTransition id={`/item/${id()}`}>
      {item() ? (
        <div
          class="min-h-screen flex flex-col p-8 md:p-4 relative"
          style={{ "background-color": item()!.color }}
          data-hero-key={`color-${item()!.id}`}
        >
          <A
            href="/"
            class="inline-flex items-center gap-2 py-3 px-6 bg-black/30 text-white border-2 border-white/30 rounded-lg font-semibold cursor-pointer transition-all no-underline w-fit backdrop-blur-sm hover:bg-black/50 hover:border-white/50 hover:-translate-x-1"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Back
          </A>

          <div class="flex-1 flex flex-col items-center justify-center gap-8 mt-8">
            <div
              class="w-[200px] h-[200px] md:w-[150px] md:h-[150px] rounded-full shadow-2xl border-8 border-white/30"
              style={{ "background-color": item()!.color }}
            />
            <h1 class="text-6xl md:text-4xl font-bold text-white drop-shadow-lg m-0">
              {item()!.name}
            </h1>
            <p class="text-3xl md:text-2xl font-medium text-white/90 font-mono bg-black/30 py-3 px-6 rounded-lg backdrop-blur-sm">
              {item()!.color}
            </p>

            <div class="flex md:flex-col gap-8 md:gap-4 mt-8 md:w-full">
              <div class="bg-black/30 py-6 px-8 rounded-xl border-2 border-white/20 backdrop-blur-sm min-w-[200px] md:min-w-0">
                <div class="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">
                  RGB
                </div>
                <div class="text-xl font-semibold text-white font-mono">
                  {parseInt(item()!.color.slice(1, 3), 16)},
                  {parseInt(item()!.color.slice(3, 5), 16)},
                  {parseInt(item()!.color.slice(5, 7), 16)}
                </div>
              </div>
              <div class="bg-black/30 py-6 px-8 rounded-xl border-2 border-white/20 backdrop-blur-sm min-w-[200px] md:min-w-0">
                <div class="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">
                  HSL
                </div>
                <div class="text-xl font-semibold text-white font-mono">
                  Coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Item not found</div>
      )}
    </SsgoiTransition>
  );
}
