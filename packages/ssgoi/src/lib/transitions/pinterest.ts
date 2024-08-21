import out from './boilerplate/out.js';
import type { Transition } from './type.js';


const pinterest: Transition = ({
  duration = 300,
  delay = 0,
  easing = (t) => t
}: { duration?: number; delay?: number; easing?: (t: number) => number } = {}) => {
  let to_receive: HTMLElement | null = null;
  let to_send: HTMLElement | null = null;

  function transition(setItem: (node: HTMLElement) => void, getCounterpart: () => HTMLElement | null, clearCounterpart: () => void, intro: boolean) {
    return (node: HTMLElement) => {
      setItem(node);
      return () => {
        const other_node = getCounterpart();
        if (other_node) {
          const from_node = intro ? other_node : node;
          const to_node = intro ? node : other_node;

          const commonKey = findCommonKey(from_node, to_node);
          if (!commonKey) {
            clearCounterpart();
            return {};
          }

          const from_rect = getPinterestRect(from_node, commonKey);
          const to_rect = getPinterestRect(to_node, commonKey);

          if (!from_rect || !to_rect) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: (t: number) => `${intro ? '' : out}` // fallback
            };
          }


          clearCounterpart();

          return {
            duration,
            delay,
            easing,
            css: (t: number, u: number) => `
              ${intro ? calculateInTransition(from_rect, to_rect, t) : calculateOutTransition(from_rect, to_rect, u)}
            `
          };
        }

        clearCounterpart();
        return {
          duration: 0,
          delay,
          easing,
          css: (t: number) => `${intro ? '' : out}` // fallback
        };
      };
    };
  }

  return {
    in: transition(
      (node) => { to_receive = node; },
      () => to_send,
      () => { to_send = null; },
      true
    ),
    out: transition(
      (node) => { to_send = node; },
      () => to_receive,
      () => { to_receive = null; },
      false
    )
  };
};

export default pinterest;

function getPinterestRect(page: HTMLElement, key: string): DOMRect | null {
  const element = page.querySelector(`[data-pinterest-key="${key}"]`);
  return element ? element.getBoundingClientRect() : null;
}

function findCommonKey(fromPage: HTMLElement, toPage: HTMLElement): string | null {
  const fromKeys = new Set(Array.from(fromPage.querySelectorAll('[data-pinterest-key]')).map(el => el.getAttribute('data-pinterest-key')));
  const toKeys = new Set(Array.from(toPage.querySelectorAll('[data-pinterest-key]')).map(el => el.getAttribute('data-pinterest-key')));

  for (const key of fromKeys) {
    if (toKeys.has(key)) {
      return key;
    }
  }
  return null;
}

function calculateInTransition(fromRect: DOMRect, toRect: DOMRect, t: number) {
  // 시작 크기를 이미지의 원래 크기로 설정
  const startClip = Math.max(fromRect.width, fromRect.height) / 2;
  const endClip = Math.max(window.innerWidth, window.innerHeight) * 1.5; // 화면보다 약간 크게 설정

  return `
    transform-origin: ${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px;
    transform: scale(${1 + (fromRect.width / toRect.width - 1) * (1 - t)});
    clip-path: circle(${startClip + (endClip - startClip) * t}px at center);
    opacity: 1;
  `;
}

function calculateOutTransition(fromRect: DOMRect, toRect: DOMRect, t: number) {
  return `
    transform-origin: ${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px;
    transform: scale(${1 + (toRect.width / fromRect.width - 1) * t});
    opacity: ${1 - t};
  `;
}