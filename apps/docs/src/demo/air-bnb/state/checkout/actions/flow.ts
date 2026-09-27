import { action } from "comwit";
import { checkout, MAX_GUESTS } from "../model";
import type {
  CheckoutActions,
  CheckoutMethod,
  CheckoutPayPlan,
} from "../types";

export const flowActions = action<CheckoutActions>(({ state }) => {
  class FlowActions {
    private model = state(checkout);

    reset() {
      this.model.selectedMethod = "card";
      this.model.dateLabel = null;
      this.model.guests = 1;
      this.model.payPlan = "full";
    }

    setMethod(method: CheckoutMethod) {
      this.model.selectedMethod = method;
    }

    setDates(dateLabel: string) {
      this.model.dateLabel = dateLabel;
    }

    setGuests(guests: number) {
      this.model.guests = Math.min(MAX_GUESTS, Math.max(1, guests));
    }

    setPayPlan(plan: CheckoutPayPlan) {
      this.model.payPlan = plan;
    }
  }
  return new FlowActions();
});
