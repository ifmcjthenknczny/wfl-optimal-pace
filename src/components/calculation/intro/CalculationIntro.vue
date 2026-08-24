<script lang="ts" setup>
import { useI18n } from '@/i18n/useI18n'

const { t } = useI18n()
</script>

<template>
  <div class="intro">
    <a href="https://www.wingsforlifeworldrun.com/pl" target="_blank"
      ><img alt="Wings for Life logo" class="logo" src="@/assets/logo.png"
    /></a>
    <h1>{{ t('intro.title') }}</h1>
    <p>
      {{ t('intro.instruction') }}
    </p>
    <p>
      {{ t('intro.explanation') }}
    </p>
  </div>
</template>

<style scoped>
.intro {
  text-align: center;
}

.logo {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto 0.9rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--color-heading);
}

p {
  max-width: 720px;
  margin: 8px 0;
  color: var(--color-text);
  opacity: 0.9;
}
</style>
