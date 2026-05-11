<script setup lang="ts">
import { formatTime, formatPace } from '../helpers'
import calculateOptimalRunParams from '../form/optimize'

defineProps<{
  result: ReturnType<typeof calculateOptimalRunParams>
}>()
</script>

<template>
  <div class="results" v-if="result">
    <div class="results-header">
      <h3>Wynik obliczeń:</h3>
    </div>

    <div class="results-grid">
      <div class="result-item result-item--primary">
        <span class="result-label">Średnie tempo</span>
        <strong class="result-value">{{ formatPace(result.avgPace) }}</strong>
      </div>

      <div class="result-item result-item--secondary">
        <span class="result-label">Dystans</span>
        <strong class="result-value">{{ result.distanceKms.toFixed(3) }} km</strong>
      </div>

      <div class="result-group">
        <div class="result-item-inner">
          <span class="result-label">Czas netto</span>
          <strong class="result-value">{{ formatTime(result.netRunnerTimeMinutes) }}</strong>
        </div>
        <div class="result-divider"></div>
        <div class="result-item-inner">
          <span class="result-label">Czas brutto</span>
          <strong class="result-value">{{ formatTime(result.grossRunnerTimeMinutes) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-background-mute) 78%, transparent);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.results-header h3 {
  font-weight: 700;
}

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
