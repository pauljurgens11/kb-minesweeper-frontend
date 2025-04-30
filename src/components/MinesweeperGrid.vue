<template>
  <div v-if="minesweeper" class="grid">
    <div
      v-for="(tile, index) in minesweeper.grid.flatMap((row) => row)"
      :key="`${tile.x}-${tile.y}`"
      class="tile"
      :class="{
        cursor: cursor.x === tile.x && cursor.y === tile.y,
        revealed: tile.state === TileState.Revealed,
      }"
    >
      <template v-if="tile.state === TileState.Revealed">
        <span v-if="tile.hasMine">💣</span>
        <img
          v-else-if="tile.adjacentMines > 0"
          :src="getNumberIcon(tile.adjacentMines)"
          :alt="`${tile.adjacentMines}`"
        />
      </template>
      <span v-else-if="tile.state === TileState.Flagged">🚩</span>
    </div>
  </div>

  <div class="timer">{{ formattedTime }}</div>

  <BestTimesList
    ref="bestTimesRef"
    :width="props.width"
    :height="props.height"
    :mines="props.mines"
  />
</template>

<script setup lang="ts">
  import { Minesweeper } from '@/composables/minesweeper';
  import { useTimer } from '@/composables/timer';
  import { TileState } from '@/types/tileTypes';
  import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
  import BestTimesList from './BestTimesList.vue';

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

  watchEffect(() => {
    document.documentElement.style.setProperty('--cols', props.width.toString());
    document.documentElement.style.setProperty('--rows', props.height.toString());
  });

  const minesweeper = ref<Minesweeper | null>(null);
  const { time, formattedTime, startTimer, stopTimer, resetTimer } = useTimer();

  let gameActive = true;
  let startTimerOnNextClick = true;
  const cursor = ref({ x: 0, y: 0 });

  const bestTimesRef = ref<InstanceType<typeof BestTimesList> | null>(null);

  onMounted(() => {
    try {
      startGame();
      window.addEventListener('keydown', handleKeydown);
    } catch (error) {
      console.error('Error initializing Minesweeper:', error);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    stopTimer();
  });

  const numberIcons = import.meta.glob<{ default: string }>('@/assets/tile_numbers/*.png', {
    eager: true,
  });

  const getNumberIcon = (adjacentMines: number): string => {
    return numberIcons[`/src/assets/tile_numbers/${adjacentMines}.png`]?.default || '';
  };

  function startGame() {
    gameActive = true;
    minesweeper.value = new Minesweeper(props.width, props.height, props.mines);
    resetTimer();
  }

  function endGame(isWin: boolean) {
    gameActive = false;
    startTimerOnNextClick = true;
    let timeValue = time.value;
    stopTimer();

    if (!isWin) return;

    bestTimesRef.value?.newTimeEntry(timeValue);
  }

  function revealTile(x: number, y: number) {
    if (!minesweeper || !gameActive) return;

    if (startTimerOnNextClick) {
      startTimer();
      startTimerOnNextClick = false;
    }

    // End game if tile has a bomb or all tiles are cleared.
    if (minesweeper.value!.clickTile(x, y, true)) {
      endGame(false);
    } else if (minesweeper.value!.clearedTiles == props.width * props.height - props.mines) {
      endGame(true);
    }
  }

  function flagTile(x: number, y: number) {
    if (!minesweeper || !gameActive) return;

    minesweeper.value!.flagTile(x, y);
  }

  // Handle key presses
  function handleKeydown(event: KeyboardEvent) {
    if (!minesweeper) return;

    event.preventDefault();

    switch (event.key) {
      case 'r':
        if (gameActive) {
          endGame(false);
        }
        startGame();
        break;
      case 'ArrowUp':
      case 'k':
        cursor.value.y = Math.max(0, cursor.value.y - 1);
        break;
      case 'ArrowDown':
      case 'j':
        cursor.value.y = Math.min(props.height - 1, cursor.value.y + 1);
        break;
      case 'ArrowLeft':
      case 'h':
        cursor.value.x = Math.max(0, cursor.value.x - 1);
        break;
      case 'ArrowRight':
      case 'l':
        cursor.value.x = Math.min(props.width - 1, cursor.value.x + 1);
        break;
      case 'f':
        if (gameActive) {
          flagTile(cursor.value.x, cursor.value.y);
        }
        break;
      case ' ':
        if (gameActive) {
          revealTile(cursor.value.x, cursor.value.y);
        } else {
          startGame();
        }
        break;
    }
  }
</script>

<style scoped>
  :root {
    --cols: 1;
    --rows: 1;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 1px;
    aspect-ratio: calc(var(--cols) / var(--rows));
    width: min(80vw, calc(60vh * (var(--cols) / var(--rows))));
  }
  .tile {
    aspect-ratio: 1/1;
    background-color: #fcfbf8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow:
      1px 1px 0 1px #d8d7d5 inset,
      -1px -1px 0 1px #b6b6b6 inset;
    border-radius: 2px;
    font-size: calc(33vh / var(--rows) * 0.8);
  }

  .tile.cursor {
    box-shadow: 0 0 0 2px orange inset !important;
    background-color: #e7e4cf !important;
  }

  .tile.revealed {
    background-color: #ebe8e8;
    box-shadow: 0 0 0 2px #bdbcbb inset;
  }

  .tile img {
    width: 50%;
    height: 50%;
    object-fit: contain;
  }

  .timer {
    font-size: 2rem;
    font-weight: bold;
    color: black;
    padding: 10px 20px;
    margin-top: 10px;
    text-align: center;
    min-width: 100px;
  }
</style>
