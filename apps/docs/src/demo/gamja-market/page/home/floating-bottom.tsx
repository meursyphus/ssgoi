import { CartBar } from "./cart-bar";
import { ReviewFab } from "./review-fab";

export function FloatingBottom() {
  return (
    // 20px above the tab bar (tabs-shell/bottom-nav.tsx), which is 48px plus
    // its bottom padding, max(inset, 12px): 48 + 20 = 4.25rem.
    <div className="sticky bottom-[calc(max(var(--safe-bottom),0.75rem)+4.25rem)] z-20 px-4">
      <div className="mb-3 flex justify-end">
        <ReviewFab />
      </div>
      <CartBar />
    </div>
  );
}
