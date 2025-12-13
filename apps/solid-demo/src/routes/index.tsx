import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { SsgoiTransition, transition, TransitionScope } from "@ssgoi/solid";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function Home() {
  const [showShapes, setShowShapes] = createSignal(true);
  const [stiffness, setStiffness] = createSignal(300);
  const [damping, setDamping] = createSignal(30);

  // TransitionScope demo states
  const [showScopeContainer, setShowScopeContainer] = createSignal(true);
  const [showLocalChild, setShowLocalChild] = createSignal(true);
  const [showGlobalChild, setShowGlobalChild] = createSignal(true);

  return (
    <SsgoiTransition id="/">
      <div class="max-w-[1200px] mx-auto p-8">
        <div class="text-center py-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-12 shadow-xl">
          <h1 class="text-5xl md:text-4xl font-bold text-white drop-shadow-md">
            SSGOI Solid Demo
          </h1>
        </div>

        {/* Hero Transition Section */}
        <div class="mb-16 p-8 bg-neutral-800 rounded-xl shadow-lg">
          <h2 class="text-3xl font-semibold mb-8 text-gray-100 border-b-2 border-neutral-600 pb-2">
            Hero Transition
          </h2>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 md:gap-4 mb-8">
            {colors.map((item) => (
              <A
                href={`/item/${item.id}`}
                class="aspect-square rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl no-underline"
                style={{ "background-color": item.color }}
                data-hero-key={`color-${item.id}`}
              >
                <span class="text-lg font-semibold text-white drop-shadow-md">
                  {item.name}
                </span>
              </A>
            ))}
          </div>
        </div>

        {/* DOM Transition Section */}
        <div class="mb-8 p-8 bg-neutral-800 rounded-xl shadow-lg">
          <div class="flex flex-col gap-6 md:gap-4">
            <div class="flex gap-4 justify-center">
              <button
                class={`px-8 py-3 border-2 rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  stiffness() === 100
                    ? "border-purple-600 text-white shadow-lg"
                    : "border-neutral-600 bg-neutral-700 text-gray-100 hover:bg-neutral-600"
                }`}
                style={
                  stiffness() === 100
                    ? {
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }
                    : {}
                }
                onClick={() => {
                  setStiffness(100);
                  setDamping(20);
                }}
              >
                Smooth
              </button>
              <button
                class={`px-8 py-3 border-2 rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  stiffness() === 300
                    ? "border-purple-600 text-white shadow-lg"
                    : "border-neutral-600 bg-neutral-700 text-gray-100 hover:bg-neutral-600"
                }`}
                style={
                  stiffness() === 300
                    ? {
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }
                    : {}
                }
                onClick={() => {
                  setStiffness(300);
                  setDamping(30);
                }}
              >
                Normal
              </button>
              <button
                class={`px-8 py-3 border-2 rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  stiffness() === 500
                    ? "border-purple-600 text-white shadow-lg"
                    : "border-neutral-600 bg-neutral-700 text-gray-100 hover:bg-neutral-600"
                }`}
                style={
                  stiffness() === 500
                    ? {
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }
                    : {}
                }
                onClick={() => {
                  setStiffness(500);
                  setDamping(40);
                }}
              >
                Fast
              </button>
            </div>

            <div class="flex items-center justify-center gap-4 md:flex-col md:items-stretch">
              <label class="font-semibold text-gray-100 min-w-[100px]">
                Stiffness
              </label>
              <input
                type="number"
                class="p-2 border-2 border-neutral-600 rounded-md w-[120px] text-base bg-neutral-700 text-gray-100"
                value={stiffness()}
                onInput={(e) => setStiffness(Number(e.currentTarget.value))}
                min="1"
                max="1000"
              />
              <span class="text-gray-400 text-sm">(1-1000)</span>
            </div>

            <div class="flex items-center justify-center gap-4 md:flex-col md:items-stretch">
              <label class="font-semibold text-gray-100 min-w-[100px]">
                Damping
              </label>
              <input
                type="number"
                class="p-2 border-2 border-neutral-600 rounded-md w-[120px] text-base bg-neutral-700 text-gray-100"
                value={damping()}
                onInput={(e) => setDamping(Number(e.currentTarget.value))}
                min="0"
                max="100"
              />
              <span class="text-gray-400 text-sm">(0-100)</span>
            </div>
          </div>
        </div>

        <div class="text-center mb-8">
          <button
            onClick={() => setShowShapes(!showShapes())}
            class="px-10 py-4 text-white border-none rounded-lg text-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(102,126,234,0.6)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(102,126,234,0.4)]"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {showShapes() ? "Hide Elements" : "Show Elements"}
          </button>
        </div>

        <div class="p-8 bg-neutral-800 rounded-xl shadow-lg">
          <h2 class="text-3xl font-semibold mb-8 text-gray-100 border-b-2 border-neutral-600 pb-2">
            DOM Transition
          </h2>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-8 md:gap-6 justify-items-center">
            {/* Fade */}
            <div class="flex flex-col items-center gap-4">
              <div class="w-[120px] h-[120px] flex items-center justify-center">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "fade",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          element.style.opacity = progress.toString();
                        },
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          element.style.opacity = progress.toString();
                        },
                      }),
                    })}
                    class="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-red-400 to-red-500"
                  />
                )}
              </div>
              <p class="font-semibold text-gray-100 text-base">Fade</p>
            </div>

            {/* Scale + Rotate */}
            <div class="flex flex-col items-center gap-4">
              <div class="w-[120px] h-[120px] flex items-center justify-center">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "scale-rotate",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                          opacity: progress.toString(),
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                          opacity: progress.toString(),
                        }),
                      }),
                    })}
                    class="w-[100px] h-[100px]"
                    style={{
                      width: 0,
                      height: 0,
                      "border-left": "50px solid transparent",
                      "border-right": "50px solid transparent",
                      "border-bottom": "100px solid #4ecdc4",
                      background: "transparent",
                    }}
                  />
                )}
              </div>
              <p class="font-semibold text-gray-100 text-base">
                Scale + Rotate
              </p>
            </div>

            {/* Slide In */}
            <div class="flex flex-col items-center gap-4">
              <div class="w-[120px] h-[120px] flex items-center justify-center">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "slide-in",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `translateX(${(1 - progress) * -100}px)`,
                          opacity: progress.toString(),
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `translateX(${(1 - progress) * -100}px)`,
                          opacity: progress.toString(),
                        }),
                      }),
                    })}
                    class="w-[100px] h-[100px] bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg"
                  />
                )}
              </div>
              <p class="font-semibold text-gray-100 text-base">Slide In</p>
            </div>

            {/* Bounce Scale */}
            <div class="flex flex-col items-center gap-4">
              <div class="w-[120px] h-[120px] flex items-center justify-center">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "bounce-scale",
                      in: (element) => ({
                        spring: {
                          stiffness: stiffness() * 0.8,
                          damping: damping() * 0.7,
                        },
                        tick: (progress) => {
                          const scale = 0.5 + progress * 0.5;
                          element.style.transform = `scale(${scale})`;
                          element.style.opacity = progress.toString();
                        },
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          const scale = 0.5 + progress * 0.5;
                          element.style.transform = `scale(${scale})`;
                          element.style.opacity = progress.toString();
                        },
                      }),
                    })}
                    class="w-[100px] h-[95px] bg-gradient-to-br from-yellow-300 to-orange-400"
                    style={{
                      "clip-path":
                        "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    }}
                  />
                )}
              </div>
              <p class="font-semibold text-gray-100 text-base">Bounce Scale</p>
            </div>
          </div>
        </div>

        {/* TransitionScope Demo Section */}
        <div class="p-8 bg-neutral-800 rounded-xl shadow-lg mt-8">
          <h2 class="text-3xl font-semibold mb-8 text-gray-100 border-b-2 border-neutral-600 pb-2">
            TransitionScope Demo
          </h2>
          <p class="text-gray-400 mb-6 leading-relaxed">
            <strong class="text-gray-200">Local scope:</strong> Skip animation
            when mounting/unmounting with parent scope.
            <br />
            <strong class="text-gray-200">Global scope (default):</strong>{" "}
            Always run animation.
          </p>

          <div class="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              class="px-6 py-3 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              onClick={() => setShowScopeContainer(!showScopeContainer())}
            >
              {showScopeContainer()
                ? "Hide Scope Container"
                : "Show Scope Container"}
            </button>
            <button
              class="px-6 py-3 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              onClick={() => setShowLocalChild(!showLocalChild())}
              disabled={!showScopeContainer()}
            >
              {showLocalChild() ? "Hide Local Child" : "Show Local Child"}
            </button>
            <button
              class="px-6 py-3 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              onClick={() => setShowGlobalChild(!showGlobalChild())}
              disabled={!showScopeContainer()}
            >
              {showGlobalChild() ? "Hide Global Child" : "Show Global Child"}
            </button>
          </div>

          <div class="flex gap-8 justify-center min-h-[200px] items-center">
            {showScopeContainer() && (
              <TransitionScope>
                <div class="p-8 border-2 border-dashed border-neutral-600 rounded-xl flex gap-6 bg-neutral-700/50">
                  <div class="text-center">
                    <p class="mb-2 font-semibold text-gray-200">Local Scope</p>
                    {showLocalChild() && (
                      <div
                        ref={transition({
                          key: "scope-local-child",
                          scope: "local",
                          in: () => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress.toString(),
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                          out: () => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress.toString(),
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                        })}
                        class="w-20 h-20 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      />
                    )}
                    <p class="text-xs text-gray-500 mt-2">
                      Skips when scope unmounts
                    </p>
                  </div>

                  <div class="text-center">
                    <p class="mb-2 font-semibold text-gray-200">Global Scope</p>
                    {showGlobalChild() && (
                      <div
                        ref={transition({
                          key: "scope-global-child",
                          // scope: "global" is default
                          in: () => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress.toString(),
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                          out: () => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress.toString(),
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                        })}
                        class="w-20 h-20 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        }}
                      />
                    )}
                    <p class="text-xs text-gray-500 mt-2">Always animates</p>
                  </div>
                </div>
              </TransitionScope>
            )}
          </div>

          <div class="mt-6 p-4 bg-neutral-700/50 rounded-lg text-sm text-gray-400">
            <strong class="text-gray-200">Test scenarios:</strong>
            <ul class="mt-2 ml-6 list-disc leading-loose">
              <li>
                <strong class="text-gray-300">
                  Toggle individual children:
                </strong>{" "}
                Both should animate (scope is stable)
              </li>
              <li>
                <strong class="text-gray-300">Toggle Scope Container:</strong>{" "}
                Local child should NOT animate, Global child should animate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
