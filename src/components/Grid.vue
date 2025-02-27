<template>
  <PopupMenu
    :isOpen=!gameActive
    :options="[{ label: 'New Game', action: 'select1' }]"
    @select="resetGame()"
  />

  <div v-if="minesweeper" class="grid">
    <div v-for="row in minesweeper.grid" :key="row[0].y" class="row">
      <div v-for="tile in row" :key="tile.x" class="tile" @click="revealTile(tile)">
        {{ tile.state === TileState.Revealed ? (tile.hasMine ? '💣' : tile.adjacentMines) : ' ' }}
      </div>
    </div>
  </div>

  <div>{{ formattedTime }}</div>
</template>

<script setup lang="ts">
import PopupMenu from './PopupMenu.vue'
import { Minesweeper } from '@/minesweeper'
import { TileState, type Tile } from '@/types/tileTypes'
import { ref, onMounted, computed } from 'vue'

const minesweeper = ref<Minesweeper | null>(null)
let gameActive = true

const time = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  stopTimer()
  time.value = 0
  timerInterval = setInterval(() => {
    time.value += 10
  }, 10)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onMounted(() => {
  try {
    resetGame()
  } catch (error) {
    console.error('Error initializing Minesweeper:', error)
  }
})

function resetGame() {
  gameActive = true
  minesweeper.value = new Minesweeper(10, 10, 3)
  startTimer()
}

function revealTile(tile: Tile) {
  if (minesweeper && gameActive) {
    if (tile.hasMine) {
      minesweeper.value!.revealMine(tile)
      gameActive = false
      stopTimer()
    }
    minesweeper.value!.revealTileRecursive(tile)

    if (minesweeper.value!.clearedTiles == 97) {
      gameActive = false
      stopTimer()
    }
  }
}

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60000).toString().padStart(2, '0')
  const seconds = Math.floor((time.value % 60000) / 1000).toString().padStart(2, '0')
  const milliseconds = (time.value % 1000).toString().padStart(3, '0')
  return `${minutes}:${seconds}:${milliseconds}`
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: 2px;
}
.row {
  display: flex;
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
</style>
