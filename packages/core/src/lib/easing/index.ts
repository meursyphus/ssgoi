// 기본 easing 함수들
export const linear = (t: number) => t;

export const easeIn = (t: number) => t * t;

export const easeOut = (t: number) => t * (2 - t);

export const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Cubic easing
export const easeInCubic = (t: number) => t * t * t;

export const easeOutCubic = (t: number) => (--t) * t * t + 1;

export const easeInOutCubic = (t: number) => 
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

// Quart easing
export const easeInQuart = (t: number) => t * t * t * t;

export const easeOutQuart = (t: number) => 1 - (--t) * t * t * t;

export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

// Expo easing
export const easeInExpo = (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

export const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeInOutExpo = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

// Elastic easing
export const easeOutElastic = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Back easing
export const easeInBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Bounce easing
export const easeOutBounce = (t: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};