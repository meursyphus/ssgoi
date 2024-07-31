import { getContext, setContext } from 'svelte';
import { cubicOut } from 'svelte/easing';
import type { CrossfadeParams, TransitionConfig } from 'svelte/transition';
import { isFunction } from '$lib/utils/index.js';

const KEY = Symbol('hero');

type HeroContext = {
	send: ReturnType<typeof crossfade>[0];
	receive: ReturnType<typeof crossfade>[1];
};

export const init = () => {
	const [send, receive] = crossfade();
	setContext(KEY, { send, receive });
	return { send, receive };
};

export const get = () => {
	return getContext<HeroContext>(KEY);
};

function crossfade(): [
	(
		node: Element,
		params: CrossfadeParams & {
			key: string;
		}
	) => () => TransitionConfig,
	(
		node: Element,
		params: CrossfadeParams & {
			key: string;
			scrollTop?: number;
		}
	) => () => TransitionConfig
] {
	const to_receive: ClientRectMap = new Map();
	const to_send: ClientRectMap = new Map();

	return [transition(to_send, to_receive, false), transition(to_receive, to_send, true)];
}

function transition(items: ClientRectMap, counterparts: ClientRectMap, intro: boolean) {
	return (node: Element, params: CrossfadeParams & { key: string; scrollTop?: number }) => {
		const rect = node.getBoundingClientRect();
		items.set(params.key, {
			rect
		});
		return () => {
			if (counterparts.has(params.key)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const { rect } = counterparts.get(params.key)!;
				counterparts.delete(params.key);

				return corssfadeForHero({ from: rect, node, params, intro });
			}

			// if the node is disappearing altogether
			// (i.e. wasn't claimed by the other list)
			// then we need to supply an outro
			items.delete(params.key);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return fallback();
		};
	};
}

function corssfadeForHero({
	from,
	node,
	params,
	intro
}: {
	from: DOMRect;
	node: Element;
	params: CrossfadeParams & { scrollTop?: number };
	intro: boolean;
}): TransitionConfig {
	const { delay = 0, duration = (d: number) => Math.sqrt(d) * 30, easing = cubicOut } = params;

	const to = node.getBoundingClientRect();

	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const dx = from.left - to.left - (document.scrollingElement?.scrollLeft || 0);
	let dy = from.top - to.top - (document.scrollingElement?.scrollTop || 0);

	let ready = false;
	dy += params.scrollTop || 0;
	ready = true;

	/*
		todo: visible 영역을 벗어나면 transition을 하지 않습니다.
	*/
	const isTooFar = false; // dx ** 2 + dy ** 2 > 90000;

	const dw = from.width / to.width;
	const dh = from.height / to.height;
	const d = Math.sqrt(dx * dx + dy * dy);

	const currentStyle = node.getAttribute('style') || '';

	return {
		delay,
		duration: isFunction(duration) ? duration(d) : duration,
		easing,
		tick: (t, u) => {
			if (!intro) return;

			if (!ready) {
				node.setAttribute('style', `${currentStyle} visibility: hidden;`);
			} else if (isTooFar) {
				node.setAttribute('style', currentStyle);
			} else {
				node.setAttribute(
					'style',
					`${currentStyle}
              position: relative; 
              transform-origin: top left;
              transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${
								t + (1 - t) * dw
							}, ${t + (1 - t) * dh});`
				);
			}
		}
	};
}

// fallback는 svelte의 transition에서 빠르게 이동할 경우 에러가 나는 걸 방지한 조치 입니다.

// 문제 상황은 아래와 같습니다.
// https://svelte.dev/repl/a319a067d66e4b26b677ae94db22261c?version=3.31.0
function fallback(): TransitionConfig {
	return {
		duration: 0,
		css: () => ''
	};
}

type ClientRectMap<KEY = string> = Map<KEY, { rect: DOMRect }>;
