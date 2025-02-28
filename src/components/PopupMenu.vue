<template>
  <div v-if="isOpen">
    <div>
      <h2>Select an Option</h2>

      <!-- Render dynamic buttons based on the passed options prop -->
      <button v-for="option in options" :key="option.label" @click="handleClick()">
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface PopupOption {
  label: string
}

defineProps<{
  isOpen: boolean
  options: PopupOption[]
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'close'): void
}>()

function handleClick() {
  emit('select')
}

function close() {
  emit('close')
}
</script>
