import { ref, computed, onBeforeUnmount } from 'vue';

export function useTimer() {
  const time = ref(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  let startTime: number;

  function startTimer() {
    stopTimer();
    startTime = performance.now();
    timerInterval = setInterval(() => {
      time.value = Math.floor(performance.now() - startTime);
    }, 10);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    time.value = 0;
  }

  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60000)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((time.value % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    const milliseconds = (time.value % 1000).toString().padStart(3, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  });

  onBeforeUnmount(() => stopTimer());

  return { time, formattedTime, startTimer, stopTimer, resetTimer };
}
