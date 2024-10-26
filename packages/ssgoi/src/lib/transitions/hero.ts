import { cubicOut } from 'svelte/easing';
import type { TransitionConfig as SvelteTransitionConfig } from 'svelte/transition';

export type TransitionConfig = (SvelteTransitionConfig | (() => SvelteTransitionConfig));
const out = 'position: absolute; left: 0px; top: 0px; width: 100%;';

type GetTransitionConfig = (node: HTMLElement, params: { getFromScrollTop: () => number; getToScrollTop: () => number }) => TransitionConfig;

type Transition<T = object> = (params?: T) => {
  in: GetTransitionConfig;
  out: GetTransitionConfig;
};

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

function findCommonKey(fromPage: HTMLElement, toPage: HTMLElement): string | null {
  const fromKeys = new Set(Array.from(fromPage.querySelectorAll('[data-hero-key]')).map(el => el.getAttribute('data-hero-key')));
  const toKeys = new Set(Array.from(toPage.querySelectorAll('[data-hero-key]')).map(el => el.getAttribute('data-hero-key')));

  for (const key of fromKeys) {
    if (toKeys.has(key)) {
      return key;
    }
  }
  return null;
}

function hero(): Transition<{
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}> {
  return ({
    duration = 500,
    delay = 0,
    easing = cubicOut,
  } = {}) => {
    let to_receive: HTMLElement | null = null;
    let to_send: HTMLElement | null = null;

    function transition(
      setItem: (node: HTMLElement) => void,
      getCounterpart: () => HTMLElement | null,
      clearCounterpart: () => void,
      intro: boolean
    ): GetTransitionConfig {
      return (node: HTMLElement, { getFromScrollTop, getToScrollTop }) => {
        setItem(node);
        return () => {
          const other_node = getCounterpart();
          if (!other_node) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => intro ? '' : out
            };
          }

          const from_node = intro ? other_node : node;
          const to_node = intro ? node : other_node;

          const commonKey = findCommonKey(from_node, to_node);
          if (!commonKey) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => intro ? '' : out
            };
          }

          const fromEl = getHeroEl(from_node, commonKey);
          const toEl = getHeroEl(to_node, commonKey);

          if (!fromEl || !toEl) {
            clearCounterpart();
            return {
              duration: 0,
              delay,
              easing,
              css: () => intro ? '' : out
            };
          }

          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const scrollTopDiff = getToScrollTop() - getFromScrollTop();

          console.log(fromEl, toEl, fromRect, toRect, commonKey);

          clearCounterpart();

          if (!intro) {
            return {
              duration: 0,
              css: () => out
            };
          }

          const style = getComputedStyle(toEl);
          const transform = style.transform === 'none' ? '' : style.transform;
          const currentStyle = toEl.getAttribute('style') || '';
          const dx = toRect.left - toRect.left;
          let dy = fromRect.top - toRect.top;
          dy += scrollTopDiff;

          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          return {
            duration,
            delay,
            easing,
            tick: (t: number, u: number) => {
              if (!toEl) return;

              toEl.setAttribute(
                'style',
                `${currentStyle}
                position: relative;
                transform-origin: top left;
                transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
                `
              );
            }
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
}

export default hero();