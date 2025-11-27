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

  <!-- Donate button -->
  <div id="donate-button-wrapper">
    <div id="donate-text">buy me a cheeseburger 🍔</div>
    <div id="donate-button"></div>
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
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.onload = () => {
      // @ts-ignore
      PayPal.Donation.Button({
        env: 'production',
        hosted_button_id: '4P4HQY7FCL5EY',
        image: {
          src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif',
          alt: 'Donate with PayPal button',
          title: 'PayPal - The safer, easier way to pay online!',
        },
      }).render('#donate-button');
    };
    document.body.appendChild(script);
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

  #donate-button-wrapper {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 6px;
    pointer-events: none; /* so only the actual button is clickable */
  }

  #donate-text {
    background: #fff4c2;
    border: 1px solid #e0d18b;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 14px;
    color: #444;
    font-weight: 600;
    pointer-events: auto; /* allow selecting text */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  #donate-button {
    pointer-events: auto; /* so the PayPal button is clickable */
  }
</style>
