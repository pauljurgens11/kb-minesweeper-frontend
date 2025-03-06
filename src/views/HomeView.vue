<template>
  <div>
    <div v-if="showMenu">
      <button @click="startGame('small')">Small</button>
      <button @click="startGame('medium')">Medium</button>
      <button @click="startGame('large')">Large</button>
    </div>

    <div v-if="!showMenu" class="center">
      <Grid :width="gridSize.width" :height="gridSize.height" :mines="gridSize.mines" />
      <button @click="goBackToMenu">Back to Menu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Grid from '@/components/MinesweeperGrid.vue'

let showMenu = ref(true)

const gridSizes = {
  small: { width: 8, height: 8, mines: 10 },
  medium: { width: 16, height: 16, mines: 40 },
  large: { width: 30, height: 16, mines: 99 },
}

const gridSize = ref(gridSizes.medium)

const startGame = (size: 'small' | 'medium' | 'large') => {
  gridSize.value = gridSizes[size]
  showMenu.value = false
}

const goBackToMenu = () => {
  showMenu.value = true
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
</style>
