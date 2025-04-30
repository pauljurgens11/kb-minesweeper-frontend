<template>
  <Analytics />
  <SpeedInsights />
  <div v-if="isMobile">
    <MobileWarning />
  </div>
  <div v-else>
    <Header />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
  import { Analytics } from '@vercel/analytics/vue';
  import { SpeedInsights } from '@vercel/speed-insights/vue';

  import { RouterView } from 'vue-router';
  import Header from './components/Header.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import MobileWarning from './components/MobileWarning.vue';

  const isMobile = ref(window.innerWidth < 768);

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile);
  });
</script>

<style>
  body {
    font-family: 'Lato', serif;
    background-color: #f0eeeb;
  }
</style>
