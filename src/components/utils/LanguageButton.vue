<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { SUPPORTED_LOCALES } from '@/i18n/i18n'

const { locale } = useI18n()

const findNextLocale = () => {
  const currentIndex = SUPPORTED_LOCALES.findIndex((l) => l === locale.value)
  const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
  return SUPPORTED_LOCALES[nextIndex]!
}

const nextLocale = ref(findNextLocale())

const toggleLanguage = () => {
  locale.value = nextLocale.value
  nextLocale.value = findNextLocale()
}

const currentLabel = computed(() => {
  return nextLocale.value.toUpperCase()
})
</script>

<template>
  <button @click="toggleLanguage" class="lang-btn" type="button">🌐 {{ currentLabel }}</button>
</template>

<style scoped>
.lang-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  background-color: #e2e2e2;
}
</style>
