import { vTransition } from '@meursyphus/ssgoi-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('transition', vTransition);
});