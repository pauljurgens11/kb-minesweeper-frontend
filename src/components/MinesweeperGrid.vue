<template>
  <div v-if="minesweeper" class="grid">
    <div v-for="row in minesweeper.grid" :key="row[0].y" class="row">
      <div
        v-for="tile in row"
        :key="tile.x"
        class="tile"
        :class="{
          cursor: cursor.x === tile.x && cursor.y === tile.y,
          revealed: tile.state === TileState.Revealed /* Add revealed class */,
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
  </div>

  <div class="timer">{{ formattedTime }}</div>

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
  import { Minesweeper } from '@/composables/minesweeper';
  import { useTimer } from '@/composables/timer';
  import { TileState, type Tile } from '@/types/tileTypes';
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

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

  const minesweeper = ref<Minesweeper | null>(null);
  const { time, formattedTime, startTimer, stopTimer, resetTimer } = useTimer();

  let gameActive = true;
  let startTimerOnNextClick = true;
  const cursor = ref({ x: 0, y: 0 });
  const bestTimes = ref<number[]>([]);
  // Last value that got added to the best times list
  const newBestTime = ref<number | null>(null);

  onMounted(() => {
    try {
      startGame();
      loadBestTimes();
      window.addEventListener('keydown', handleKeydown);
    } catch (error) {
      console.error('Error initializing Minesweeper:', error);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    stopTimer();
  });

  const numberIcons = import.meta.glob('@/assets/tile_numbers/*.png', { eager: true });

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

    let bestTimes: number[] = JSON.parse(
      localStorage.getItem(`bestTimes-${props.width}-${props.height}-${props.mines}`) || '[]'
    );

    bestTimes.push(timeValue);
    bestTimes.sort((a, b) => a - b);

    bestTimes = bestTimes.slice(0, 10);

    localStorage.setItem(
      `bestTimes-${props.width}-${props.height}-${props.mines}`,
      JSON.stringify(bestTimes)
    );

    loadBestTimes();
    newBestTime.value = timeValue;
  }

  function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  }

  function loadBestTimes() {
    bestTimes.value = JSON.parse(
      localStorage.getItem(`bestTimes-${props.width}-${props.height}-${props.mines}`) || '[]'
    );
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
  .grid {
    display: grid;
    gap: 1px;
  }
  .row {
    display: flex;
    gap: 1px;
  }
  .tile {
    width: 36px;
    height: 36px;
    background-color: #fcfbf8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow:
      1px 1px 0 1px #d8d7d5 inset,
      -1px -1px 0 1px #b6b6b6 inset;
    border-radius: 2px;
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
    text-align: center;
    min-width: 100px;
  }

  #best-times-container {
    position: absolute;
    height: 400px;
    right: 100px;
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
    font-size: 2rem;
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
    font-size: 20px;
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
