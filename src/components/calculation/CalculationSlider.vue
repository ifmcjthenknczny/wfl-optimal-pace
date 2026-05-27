<template>
  <div class="calculator-slider">
    <div class="slider-navigation">
      <ButtonComponent
        color="default"
        size="sm"
        @click="prev"
        :disabled="currentIndex === 0"
      >&larr;</ButtonComponent>
      <ButtonComponent
        color="default"
        size="sm"
        @click="next"
        :disabled="currentIndex === totalSlides - 1"
      >&rarr;</ButtonComponent>
    </div>
    <div class="slider-content">
      <slot />
    </div>
    <div class="slider-footer">
      <ButtonComponent color="danger" size="lg" @click="$emit('clear')">
        Wróć do formularza
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import ButtonComponent from '../utils/ButtonComponent.vue'

const currentIndex = ref(0)
const totalSlides = ref(0)
const registerSlide = () => {
  const index = totalSlides.value
  totalSlides.value++
  return {
    index,
    isActive: computed(() => currentIndex.value === index),
    unregister: () => {
      totalSlides.value = totalSlides.value - 1
      if (currentIndex.value >= totalSlides.value) {
        currentIndex.value = Math.max(0, totalSlides.value - 1)
      }
    },
  }
}
provide('registerSlide', registerSlide)
const next = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    currentIndex.value = currentIndex.value + 1
  }
}
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value = currentIndex.value - 1
  }
}
</script>

<style scoped>
.slider-navigation {
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  color: black;
}

.slider-navigation > * {
  pointer-events: all;
}

.slider-footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>