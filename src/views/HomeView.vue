<template>
  <div>
    <div v-if="showMenu">
      <div class="grid-container">
        <div class="grid">
          <button class="btn" :class="{ cursor: menuCursor.x === 0 && menuCursor.y === 0 }">
            <div class="main-text">small</div>
            <div class="sub-text">8x8</div>
            <div class="sub-text">10 mines</div>
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 1 && menuCursor.y === 0 }">
            <div class="main-text">medium</div>
            <div class="sub-text">16x16</div>
            <div class="sub-text">40 mines</div>
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 0 && menuCursor.y === 1 }">
            <div class="main-text">large</div>
            <div class="sub-text">30x16</div>
            <div class="sub-text">99 mines</div>
          </button>
          <button class="btn" :class="{ cursor: menuCursor.x === 1 && menuCursor.y === 1 }">
            <div class="main-text">custom</div>
            <div class="sub-text">coming soon</div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="!showMenu" class="center">
      <Grid :width="gridSize.width" :height="gridSize.height" :mines="gridSize.mines" />
      <button class="back-button" @click="goBackToMenu">
        <span class="icon">‹</span>
        back to main menu
      </button>
    </div>
    <div v-if="showMenu">
      <p class="bottom-center">
        ❗ Use keyboard to move between tiles. Check the tutorial page for more info. ❗
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import Grid from '@/components/MinesweeperGrid.vue';

  let showMenu = ref(true);
  const menuCursor = ref({ x: 0, y: 0 });
  let gridHeight = 2;
  let gridWidth = 2;

  const gridSizes = {
    small: { width: 8, height: 8, mines: 10 },
    medium: { width: 16, height: 16, mines: 40 },
    large: { width: 30, height: 16, mines: 99 },
  };

  const gridSize = ref(gridSizes.medium);

  onMounted(() => {
    try {
      window.addEventListener('keydown', handleKeydown);
    } catch (error) {
      console.error('Error initializing main menu:', error);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  function startGame() {
    switch (true) {
      case menuCursor.value.x === 0 && menuCursor.value.y === 0:
        gridSize.value = gridSizes['small'];
        showMenu.value = false;
        break;
      case menuCursor.value.x === 1 && menuCursor.value.y === 0:
        gridSize.value = gridSizes['medium'];
        showMenu.value = false;
        break;
      case menuCursor.value.x === 0 && menuCursor.value.y === 1:
        gridSize.value = gridSizes['large'];
        showMenu.value = false;
        break;
      default:
        break;
    }
  }

  const goBackToMenu = () => {
    showMenu.value = true;
  };

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        goBackToMenu();
        break;
    }

    if (!showMenu.value) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'k':
        menuCursor.value.y = Math.max(0, menuCursor.value.y - 1);
        break;
      case 'ArrowDown':
      case 'j':
        menuCursor.value.y = Math.min(gridHeight - 1, menuCursor.value.y + 1);
        break;
      case 'ArrowLeft':
      case 'h':
        menuCursor.value.x = Math.max(0, menuCursor.value.x - 1);
        break;
      case 'ArrowRight':
      case 'l':
        menuCursor.value.x = Math.min(gridWidth - 1, menuCursor.value.x + 1);
        break;
      case ' ':
        startGame();
        break;
    }
  }
</script>

<style scoped>
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }

  .bottom-center {
    position: fixed;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .grid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 14vh;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .btn {
    width: 200px;
    height: 200px;
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

  .main-text {
    color: black;
    font-size: 22px;
    text-align: left;
    padding-left: 36px;
  }

  .sub-text {
    color: #949494;
    text-align: left;
    padding-left: 36px;
  }

  .back-button {
    position: absolute;
    left: 110px;
    top: 128px;

    font-family: inherit;
    font-size: 24px;
    color: #726f6f;
    background: none;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .back-button:hover {
    background-color: rgba(0, 0, 0, 0.05); /* light subtle background */
  }

  .back-button:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
