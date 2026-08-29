<script setup lang="ts">
import { useI18n } from '@/i18n/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="disclaimer">
    <p>
      <small>{{ t('intro.disclaimer') }}</small>
    </p>
  </div>
</template>

<style lang="css">
.disclaimer {
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
}

@media (min-width: 641px) {
  .disclaimer {
    grid-column: span 2;
  }
}
</style>
