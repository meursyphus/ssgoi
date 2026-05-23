import { action } from "comwit";
import { toast } from "sonner";
import { checkout } from "../model";
import type { CheckoutActions, CheckoutMethod, CheckoutStep } from "../types";

const ORDER: CheckoutStep[] = ["review", "method", "confirm"];

export const flowActions = action<CheckoutActions>(({ state }) => {
  class FlowActions {
    private model = state(checkout);

    reset() {
      this.model.step = "review";
      this.model.selectedMethod = "card";
    }

    setMethod(method: CheckoutMethod) {
      this.model.selectedMethod = method;
    }

    goNext() {
      const idx = ORDER.indexOf(this.model.step);
      if (idx < 0 || idx === ORDER.length - 1) {
        toast.success("결제가 완료되었습니다");
        return;
      }
      this.model.step = ORDER[idx + 1];
    }

    goPrev() {
      const idx = ORDER.indexOf(this.model.step);
      if (idx <= 0) return;
      this.model.step = ORDER[idx - 1];
    }
  }
  return new FlowActions();
});
