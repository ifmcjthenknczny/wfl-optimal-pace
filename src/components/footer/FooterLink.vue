<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  href: string
  label: string
  position: 'left' | 'right'
}>()

const linkContainerClass = computed(() => {
  return `link-container link-container__${props.position}`
})
</script>

<template>
  <div :class="`link-container ${linkContainerClass}`">
    <a class="footer-link" :href="href">
      {{ label }}
    </a>
  </div>
</template>

<style scoped>
.link-container__right {
  right: 0;
  margin-right: 8px;
}

.link-container {
  position: absolute;
  top: 0;
}

.link-container__left {
  left: 0;
  margin-left: 8px;
}

.footer-link {
  font-size: 0.5rem;
}

a {
  color: white;
}
</style>
