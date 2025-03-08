<template>
  <div>
    <div v-if="showMenu">
      <div class="grid-container">
        <div class="grid">
          <button class="btn" :class="{ cursor: menuCursor.x === 0 && menuCursor.y === 0 }">
            small
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 1 && menuCursor.y === 0 }">
            medium
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 0 && menuCursor.y === 1 }">
            large
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 1 && menuCursor.y === 1 }">
            custom
          </button>
        </div>
      </div>
    </div>

    <div v-if="!showMenu" class="center">
      <Grid :width="gridSize.width" :height="gridSize.height" :mines="gridSize.mines" />
      <button class="back-button" @click="goBackToMenu">
        <span class="icon">←</span>
        <!-- Simple Left Arrow Icon -->
        Menu
      </button>
    </div>
  </div>
  <p class="center">
    ❗ Use keyboard to move between tiles. Check the tutorial page for more info. ❗
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Grid from '@/components/MinesweeperGrid.vue'

let showMenu = ref(true)
const menuCursor = ref({ x: 0, y: 0 })
let gridHeight = 2
let gridWidth = 2

const gridSizes = {
  small: { width: 8, height: 8, mines: 10 },
  medium: { width: 16, height: 16, mines: 40 },
  large: { width: 30, height: 16, mines: 99 },
}

const gridSize = ref(gridSizes.medium)

onMounted(() => {
  try {
    window.addEventListener('keydown', handleKeydown)
  } catch (error) {
    console.error('Error initializing main menu:', error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function startGame() {
  switch (true) {
    case menuCursor.value.x === 0 && menuCursor.value.y === 0:
      gridSize.value = gridSizes['small']
      showMenu.value = false
      break
    case menuCursor.value.x === 1 && menuCursor.value.y === 0:
      gridSize.value = gridSizes['medium']
      showMenu.value = false
      break
    case menuCursor.value.x === 0 && menuCursor.value.y === 1:
      gridSize.value = gridSizes['large']
      showMenu.value = false
      break
    default:
      break
  }
}

const goBackToMenu = () => {
  showMenu.value = true
}

function handleKeydown(event: KeyboardEvent) {
  if (!showMenu.value) return

  switch (event.key) {
    case 'ArrowUp':
    case 'k':
      menuCursor.value.y = Math.max(0, menuCursor.value.y - 1)
      break
    case 'ArrowDown':
    case 'j':
      menuCursor.value.y = Math.min(gridHeight - 1, menuCursor.value.y + 1)
      break
    case 'ArrowLeft':
    case 'h':
      menuCursor.value.x = Math.max(0, menuCursor.value.x - 1)
      break
    case 'ArrowRight':
    case 'l':
      menuCursor.value.x = Math.min(gridWidth - 1, menuCursor.value.x + 1)
      break
    case ' ':
      startGame()
      break
  }
}
</script>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10vh;
}

.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.btn {
  width: 240px;
  height: 240px;
  font-size: 18px;
  background-color: #fcfbf8;
  color: black;
  border: 1px solid #d1d1d1;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 2px 2px 14px rgba(0, 0, 0, 0.2);
}

.btn.cursor {
  border: 4px solid orange;
  background-color: #fbf6ee;
}
</style>
