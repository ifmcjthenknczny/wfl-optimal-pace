<template>
  <div v-show="slideContext?.isActive.value">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject, onUnmounted } from 'vue'

const registerSlide = inject<any>('registerSlide')
const slideContext = registerSlide ? registerSlide() : null

onUnmounted(() => {
  if (slideContext) {
    slideContext.unregister()
  }
})
</script>
