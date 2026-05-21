<template>
  <div class="calculator-slider">
    <button @click="$emit('clear')" class="clear-btn">Wróć do formularza</button>
    <div class="slider-navigation">
      <button @click="prev" :disabled="currentIndex === 0" class="nav-btn">&larr;</button>
      <button @click="next" :disabled="currentIndex === totalSlides - 1" class="nav-btn">
        &rarr;
      </button>
    </div>
    <div class="slider-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'

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
.calculator-slider {
  position: relative;
  margin-top: 20px;
  padding-top: 40px;
}
.slider-navigation {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
}
.nav-btn {
  background: #eee;
  border: 1px solid #ccc;
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 4px;
}
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 4px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #dc3545;
  color: #fff;
}

.clear-btn:active {
  transform: scale(0.98);
}
</style>
