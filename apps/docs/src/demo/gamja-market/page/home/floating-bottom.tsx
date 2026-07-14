import { CartBar } from "./cart-bar";
import { ReviewFab } from "./review-fab";

export function FloatingBottom() {
  return (
    <div className="sticky bottom-20 z-20 px-4">
      <div className="mb-3 flex justify-end">
        <ReviewFab />
      </div>
      <CartBar />
    </div>
  );
}
