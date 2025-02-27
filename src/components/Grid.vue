<template>
  <div class="grid">
    <div v-for="row in grid" :key="row[0].y" class="row">
      <div v-for="tile in row" :key="tile.x" class="tile" @click="revealTile(tile)">
        {{ tile.state === TileState.Revealed ? tile.adjacentMines || '💣' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minesweeper } from '@/minesweeper'
import { TileState, type Tile } from '@/types/tileTypes'
import { ref, onMounted } from 'vue'

let grid = ref<Tile[][]>([])

onMounted(() => {
  try {
    const minesweeper = new Minesweeper(10, 10, 15)
    grid.value = minesweeper.grid.value
    console.log('Minesweeper initialized successfully')
    console.log('grid value: ', grid.value[0][0])
  } catch (error) {
    console.error('Error initializing Minesweeper:', error)
  }
})

function revealTile(tile: Tile) {
  if (tile.state === TileState.Hidden) {
    tile.state = TileState.Revealed
  }
}
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
