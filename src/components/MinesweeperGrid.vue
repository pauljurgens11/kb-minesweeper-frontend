<template>
  <p v-if="!gameActive" class="top-center">Press 'r' to restart the game.</p>

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

  <div>{{ formattedTime }}</div>
</template>

<script setup lang="ts">
import { Minesweeper } from '@/composables/minesweeper'
import { useTimer } from '@/composables/timer'
import { TileState, type Tile } from '@/types/tileTypes'
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
})

const minesweeper = ref<Minesweeper | null>(null)
const { formattedTime, startTimer, stopTimer, resetTimer } = useTimer()

let gameActive = true
let startTimerOnNextClick = true
const cursor = ref({ x: 0, y: 0 })

onMounted(() => {
  try {
    startGame()
    window.addEventListener('keydown', handleKeydown)
  } catch (error) {
    console.error('Error initializing Minesweeper:', error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopTimer()
})

const numberIcons = import.meta.glob('@/assets/tile_numbers/*.png', { eager: true })

const getNumberIcon = (adjacentMines: number): string => {
  return numberIcons[`/src/assets/tile_numbers/${adjacentMines}.png`]?.default || ''
}

function startGame() {
  gameActive = true
  minesweeper.value = new Minesweeper(props.width, props.height, props.mines)
  resetTimer()
}

function endGame() {
  gameActive = false
  startTimerOnNextClick = true
  stopTimer()
}

function revealTile(x: number, y: number) {
  if (!minesweeper || !gameActive) return

  if (startTimerOnNextClick) {
    startTimer()
    startTimerOnNextClick = false
  }

  // End game if tile has a bomb or all tiles are cleared.
  if (
    minesweeper.value!.clickTile(x, y, true) ||
    minesweeper.value!.clearedTiles == props.width * props.height - props.mines
  ) {
    endGame()
  }
}

function flagTile(x: number, y: number) {
  if (!minesweeper || !gameActive) return

  minesweeper.value!.flagTile(x, y)
}

// Handle cursor movement with arrow keys
function handleKeydown(event: KeyboardEvent) {
  if (!minesweeper) return

  event.preventDefault()

  switch (event.key) {
    case 'r':
      startGame()
    case 'ArrowUp':
    case 'k':
      cursor.value.y = Math.max(0, cursor.value.y - 1)
      break
    case 'ArrowDown':
    case 'j':
      cursor.value.y = Math.min(props.height - 1, cursor.value.y + 1)
      break
    case 'ArrowLeft':
    case 'h':
      cursor.value.x = Math.max(0, cursor.value.x - 1)
      break
    case 'ArrowRight':
    case 'l':
      cursor.value.x = Math.min(props.width - 1, cursor.value.x + 1)
      break
    case 'f':
      if (gameActive) {
        flagTile(cursor.value.x, cursor.value.y)
      }
      break
    case ' ':
      if (gameActive) {
        revealTile(cursor.value.x, cursor.value.y)
      } else {
        startGame()
      }
      break
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

.top-center {
  position: fixed;
  top: 12vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
</style>
