<script lang="ts">
	import { get } from './context/pageTransition.js';
	import { transitions } from './index.js';
	import type { Transition } from './transitions/type.js';

	export let animations: { path?: string; transtion: Transition; duration?: number }[] = [];

	const context = get();
	function transtionIn(node: Element) {
		const { from } = context;
		const defaultAnimation = animations.find((animation) => !animation.path);
		const matchedAnimation = animations.find((animation) => animation.path === from?.url.pathname);
		const animation = matchedAnimation ??
			defaultAnimation ?? { transtion: transitions.none, duration: 0 };

		return animation.transtion.in(node, { duration: animation.duration });
	}

	function transitionOut(node: Element) {
		const { to } = context;
		const defaultAnimation = animations.find((animation) => !animation.path);
		const matchedAnimation = animations.find((animation) => animation.path === to?.url.pathname);
		const animation = matchedAnimation ??
			defaultAnimation ?? { transtion: transitions.none, duration: 0 };

		return animation.transtion.out(node, { duration: animation.duration });
	}
</script>

<div in:transtionIn|global out:transitionOut|global>
	<slot />
</div>
