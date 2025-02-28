<template>
  <PopupMenu
    :isOpen="!gameActive"
    :options="[{ label: 'New Game', action: 'select' }]"
    @select="startGame()"
  />

  <div v-if="minesweeper" class="grid">
    <div v-for="row in minesweeper.grid" :key="row[0].y" class="row">
      <div v-for="tile in row"
        :key="tile.x"
        class="tile" 
        :class="{ 'cursor': cursor.x === tile.x && cursor.y === tile.y }"
        @click="revealTile(tile.x, tile.y)">
        {{ tile.state === TileState.Revealed ? (tile.hasMine ? '💣' : tile.adjacentMines) : ' ' }}
      </div>
    </div>
  </div>

  <div>{{ formattedTime }}</div>
</template>

<script setup lang="ts">
import PopupMenu from './PopupMenu.vue'
import { Minesweeper } from '@/composables/minesweeper'
import { useTimer } from '@/composables/timer'
import { TileState, type Tile } from '@/types/tileTypes'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const minesweeper = ref<Minesweeper | null>(null)
const { formattedTime, startTimer, stopTimer, resetTimer } = useTimer()

let gameActive = true
let startTimerOnNextClick = true
const cursor = ref({x: 0, y: 0})

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


function startGame() {
  gameActive = true
  minesweeper.value = new Minesweeper(10, 10, 15) // TODO:
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
  if (minesweeper.value!.revealTileAndCheckForMine(x, y) || minesweeper.value!.clearedTiles == 85) { // TODO:
    endGame()
  }
}

// Handle cursor movement with arrow keys
function handleKeydown(event: KeyboardEvent) {
  if (!minesweeper) return

  event.preventDefault()

  switch (event.key) {
    case 'r':
      startGame()
  }

  if (!gameActive) return

  switch (event.key) {
    case 'ArrowUp':
    case 'k':
      cursor.value.y = Math.max(0, cursor.value.y - 1)
      break
    case 'ArrowDown':
    case 'j':
      cursor.value.y = Math.min(10 - 1, cursor.value.y + 1) // 10 is heigh TODO:
      break
    case 'ArrowLeft':
    case 'h':
      cursor.value.x = Math.max(0, cursor.value.x - 1)
      break
    case 'ArrowRight':
    case 'l':
      cursor.value.x = Math.min(10 - 1, cursor.value.x + 1) // 10 is width TODO:
      break
    case ' ':
      revealTile(cursor.value.x, cursor.value.y)
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
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.tile.cursor {
  border: 1px solid red;
  background-color: rgba(255, 0, 0, 0.1);
}
</style>
