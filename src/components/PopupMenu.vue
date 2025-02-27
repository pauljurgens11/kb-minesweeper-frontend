<template>
  <div v-if="isOpen" @click.self="close">
    <div>
      <h2>Select an Option</h2>

      <!-- Render dynamic buttons based on the passed options prop -->
      <button v-for="option in options" :key="option.label" @click="handleClick(option.action)">
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface PopupOption {
  label: string
  action: string
}

defineProps<{
  isOpen: boolean
  options: PopupOption[]
}>()

const emit = defineEmits<{
  (e: 'select', action: string): void
  (e: 'close'): void
}>()

function handleClick(action: string) {
  emit('select', action)
}

function close() {
  emit('close')
}
</script>
