<template>
  <div id="best-times-container">
    <h3>Best Times</h3>
    <ul id="best-times">
      <li v-if="bestTimes.length === 0">No times yet!</li>
      <li
        v-for="(time, index) in bestTimes"
        :key="index"
        :class="{ 'new-entry': time === newBestTime }"
      >
        <span class="rank">{{ index + 1 }}.</span>
        <span class="time">{{ formatTime(time) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    mines: {
      type: Number,
      required: true,
    },
  });

  const bestTimes = ref<number[]>([]);

  // Last value that got added to the best times list
  const newBestTime = ref<number | null>(null);

  onMounted(() => {
    loadBestTimes();
  });

  function newTimeEntry(time: number) {
    let times: number[] = JSON.parse(
      localStorage.getItem(`bestTimes-${props.width}-${props.height}-${props.mines}`) || '[]'
    );

    times.push(time);
    times.sort((a, b) => a - b);

    times = times.slice(0, 10);

    localStorage.setItem(
      `bestTimes-${props.width}-${props.height}-${props.mines}`,
      JSON.stringify(times)
    );

    loadBestTimes();
    newBestTime.value = time;
  }

  function loadBestTimes() {
    bestTimes.value = JSON.parse(
      localStorage.getItem(`bestTimes-${props.width}-${props.height}-${props.mines}`) || '[]'
    );
  }

  function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  }

  defineExpose({ newTimeEntry });
</script>

<style scoped>
  #best-times-container {
    position: absolute;
    height: 400px;
    right: 2vw;
    padding: 16px;
    margin-bottom: 64px;
    background-color: #f4f1de;
    border-radius: 12px;
    box-shadow: 0 0 0 2px orange inset !important;
  }

  #best-times-container h3 {
    margin-top: 0;
    margin-bottom: 20px;
    margin-right: 32px;
    font-size: 1.5rem;
    text-align: left;
    color: rgb(52, 50, 50);
  }

  #best-times {
    padding: 0;
    margin: 0;
  }

  #best-times li {
    display: grid;
    grid-template-columns: 2em auto;
    column-gap: 0.5em;
    padding: 4px 0;
    font-size: 18px;
    color: #333;
    font-family: monospace; /* makes alignment precise */
  }

  .new-entry {
    color: red;
    font-size: 20px;
    animation: flash 1s ease-in-out 5;
    will-change: transform;
  }

  @keyframes flash {
    0% {
      transform: scale(1);
      color: #333;
    }
    50% {
      transform: scale(1.05);
      color: red;
    }
    100% {
      transform: scale(1);
      color: #333;
    }
  }
</style>
