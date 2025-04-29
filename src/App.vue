<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <RouterView />
</template>

<style>
  body {
    font-family: 'Lato', serif;
    background-color: #f0eeeb;
  }
</style>
