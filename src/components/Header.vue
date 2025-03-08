<template>
  <header class="header">
    <RouterLink to="/" class="home-button">
      <div class="header-left">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <span class="app-name">keyboard-minesweeper</span>
      </div>
    </RouterLink>

    <div class="header-right">
      <RouterLink
        to="/tutorial"
        class="nav-button"
        :class="{ 'no-hover': isActive('/tutorial').value }"
      >
        Tutorial
      </RouterLink>

      <RouterLink
        to="/leaderboards"
        class="nav-button"
        :class="{ 'no-hover': isActive('/leaderboards').value }"
      >
        Leaderboards
      </RouterLink>

      <RouterLink
        to="/about"
        class="nav-button"
        :class="{ 'no-hover': isActive('/about').value }"
      >
        About
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isActive = (path: string) => {
  console.log("Current route:", route.path);
  return computed(() => route.path === path)
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.home-button {
  text-decoration: none;
  color: inherit;
  position: relative;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.home-button:hover {
  transform: scale(1.02);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 60px;
  height: auto;
  margin-right: 10px;
}

.app-name {
  font-size: 2.8rem;
  font-weight: bold;
}

.header-right {
  display: flex;
}

.nav-button {
  margin-left: 15px;
  padding: 0.5rem 1rem;
  color: #a5aab4;
  font-size: 2rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.nav-button::after {
  content: ''; /* Create an empty pseudo-element */
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background-color: #8a8e97;
  transform: scaleY(0); /* Initially scale the underline to 0 */
  transform-origin: bottom center;
  transition: transform 0.3s ease; /* Animate the scaling */
}

.nav-button:hover {
  color: #8a8e97;
  transform: scale(1.05);
}

.nav-button:hover::after {
  transform: scaleY(1);
  font-size: 2.1rem;
  transform-origin: bottom center;
}

.header-right .router-link-active {
  color: #f19e38;
  text-decoration: underline;
  text-underline-offset: 12px;
  text-decoration-thickness: 4px;
}

.no-hover {
  pointer-events: none; /* Prevent hover interactions */
}

.no-hover:hover {
  color: inherit !important;
  transform: none !important;
  text-decoration: none !important;
  cursor: pointer;
}
</style>
