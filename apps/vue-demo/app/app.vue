<template>
  <Ssgoi :config="ssgoiConfig">
    <div style="position: relative; min-height: 100vh; width: 100%">
      <NuxtPage />
    </div>
  </Ssgoi>
</template>

<script setup lang="ts">
import { Ssgoi } from '@ssgoi/vue';
import { hero } from '@ssgoi/vue/view-transitions';
import type { SsgoiConfig } from '@ssgoi/vue';

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // Use hero transition between main and item detail pages
    {
      from: '/',
      to: '/item/*',
      transition: hero({ spring: { stiffness: 5, damping: 1 } }),
      symmetric: true,
    },
  ],
};
</script>
