export type CheckoutStep = "review" | "method" | "confirm";

export type CheckoutMethod = "card" | "naver" | "kakao";

export type CheckoutState = {
  step: CheckoutStep;
  selectedMethod: CheckoutMethod;
};

export type CheckoutActions = {
  reset(): void;
  setMethod(method: CheckoutMethod): void;
  goNext(): void;
  goPrev(): void;
};
