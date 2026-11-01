import { Slot, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useSsgoi } from "@ssgoi/qwik";
import { ssgoiConfig$ } from "../lib/ssgoi-config";

export default component$(() => {
  const location = useLocation();
  const ssgoiRoot = useSignal<HTMLElement>();

  useSsgoi(ssgoiRoot, {
    config$: ssgoiConfig$,
    framework: { location },
  });

  return (
    <div class="h-[100svh] md:h-screen grow flex items-center justify-center bg-[#121212] relative overflow-hidden lg:p-6">
      <div class="w-full max-w-[390px] h-full lg:h-[min(844px,calc(100svh-3rem))] lg:rounded-[2.5rem] overflow-hidden lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black/50 relative z-10 bg-[#121212]">
        <div class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>
        <div class="h-full min-h-0 bg-[#121212] flex z-0">
          <div class="w-full min-h-0 bg-[#121212] flex flex-col overflow-hidden relative">
            {/* The one scroll container, outside every boundary. Boundaries
                sit on the roots of the group layouts and pages under <Slot />. */}
            <main
              ref={ssgoiRoot}
              data-ssgoi-root=""
              id="demo-content"
              class="flex-1 min-h-0 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
            >
              <Slot />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
});
