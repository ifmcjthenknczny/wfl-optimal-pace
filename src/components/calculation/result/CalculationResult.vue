<script setup lang="ts">
import { formatTime, formatPace } from '../helpers'
import calculateOptimalRunParams from '../form/optimize'
import ContentWrapper from '@/components/slide/ContentWrapper.vue'
import { useI18n } from '@/i18n/i18n'
import { computed } from 'vue'

// TODO: remove start delay input from form and add here a slider component for possibility to dynamically change start delay time (30 sec intervals from 0 up to 15 minutes). optimal values are calculated immediately, debounced values are calculated for chart
// TODO: fix result-item visually

defineProps<{
  result: ReturnType<typeof calculateOptimalRunParams>
}>()

const { tc } = useI18n()

const header = computed(() => `${tc('result.header')}:`)
</script>

<template>
  <ContentWrapper :header="header" v-if="result">
    <div class="results-wrapper">
      <div class="results-grid">
        <div class="result-item result-item--primary">
          <span class="result-label">{{ tc('result.avgPace') }}</span>
          <strong class="result-value">{{ formatPace(result.avgPace) }}</strong>
        </div>

        <div class="result-item result-item--secondary">
          <span class="result-label">{{ tc('common.distance') }}</span>
          <strong class="result-value">{{ result.distanceKms.toFixed(3) }} km</strong>
        </div>

        <div class="result-group">
          <div class="result-item-inner">
            <span class="result-label">{{ tc('common.netTime') }}</span>
            <strong class="result-value">{{ formatTime(result.netRunnerTimeMinutes) }}</strong>
          </div>
          <div class="result-divider"></div>
          <div class="result-item-inner">
            <span class="result-label">{{ tc('common.grossTime') }}</span>
            <strong class="result-value">{{ formatTime(result.grossRunnerTimeMinutes) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </ContentWrapper>
</template>

<style scoped>
.results-badge {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #d9f4ea;
  background: #1f6f54;
}

.results-grid {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 1fr;
}

.result-item {
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
}

.result-item--primary {
  border-color: #2f8f6b;
  background: color-mix(in srgb, #2f8f6b 16%, var(--color-background));
}

.result-item--secondary {
  border-color: #3b82f6;
  background: color-mix(in srgb, #3b82f6 14%, var(--color-background));
}

.result-label {
  display: block;
  font-size: 0.82rem;
  opacity: 0.85;
}

.result-value {
  display: block;
  margin-top: 0.1rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.result-group {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  align-items: stretch;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
  overflow: hidden;
}

.result-item-inner {
  flex: 1;
  padding: 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
}

.result-divider {
  width: auto;
  height: 1px;
  margin: 0 0.8rem;
  background-color: var(--color-border);
}

@media (min-width: 641px) {
  .results-grid {
    grid-template-columns: 1fr 1fr;
  }

  .results-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .result-group {
    display: contents;
  }

  .result-item-inner {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: color-mix(in srgb, var(--color-background) 92%, transparent);
  }

  .result-divider {
    display: none;
  }
}
</style>
