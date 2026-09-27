export type CheckoutStep = "review" | "method" | "confirm";

export type CheckoutMethod = "card" | "naver" | "kakao";

export type CheckoutPayPlan = "full" | "split";

export type CheckoutState = {
  selectedMethod: CheckoutMethod;
  /** Chosen stay dates; null keeps the listing's default dates */
  dateLabel: string | null;
  guests: number;
  payPlan: CheckoutPayPlan;
};

export type CheckoutActions = {
  reset(): void;
  setMethod(method: CheckoutMethod): void;
  setDates(dateLabel: string): void;
  setGuests(guests: number): void;
  setPayPlan(plan: CheckoutPayPlan): void;
};
