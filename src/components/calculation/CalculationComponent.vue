<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import calculateOptimalRunParams from './optimize'
import { formatTime, formatPace } from './helpers'

// const selectedExponent = ref(MIN_RIEGEL_EXPONENT)

const MIN_REASONABLE_DISTANCE_KMS = 1.5
const MIN_REASONABLE_TIME_SECONDS = 3.5 * 60

const formSchema = z
  .object({
    referenceDistanceKms: z
      .number('Wpisz dystans jako liczbę')
      .positive('Dystans musi być większy niż 0 km'),

    referenceTimeHours: z.number('Wpisz godziny jako liczbę').min(0, 'Godziny nie mogą być ujemne'),

    referenceTimeMinutes: z
      .number('Wpisz minuty jako liczbę')
      .int('Minuty muszą być liczbą całkowitą')
      .min(0, 'Minuty nie mogą być ujemne')
      .max(59, 'Minuty muszą być w zakresie 0-59'),

    referenceTimeSeconds: z
      .number('Wpisz sekundy jako liczbę')
      .int('Sekundy muszą być liczbą całkowitą')
      .min(0, 'Sekundy nie mogą być ujemne')
      .max(59, 'Sekundy muszą być w zakresie 0-59'),

    runnerStartDelayMinutes: z
      .number('Wpisz opóźnienie jako liczbę')
      .min(0, 'Opóźnienie nie może być ujemne'),
  })
  .refine(
    (values) =>
      values.referenceTimeHours * 3600 +
        values.referenceTimeMinutes * 60 +
        values.referenceTimeSeconds >
      MIN_REASONABLE_TIME_SECONDS,
    {
      message: `Czas referencyjny musi być większy od najniższego mającego sens w obliczeniach - ${formatTime(MIN_REASONABLE_TIME_SECONDS)}.`,
    },
  )
  .refine((values) => values.referenceDistanceKms > MIN_REASONABLE_DISTANCE_KMS, {
    message: `Dystans referencyjny musi być większy od najniższego mającego sens w obliczeniach - ${MIN_REASONABLE_DISTANCE_KMS} minuty.`,
  })

type FormState = z.infer<typeof formSchema>

const formState = reactive<FormState>({
  referenceDistanceKms: 10,
  referenceTimeHours: 0,
  referenceTimeMinutes: 50,
  referenceTimeSeconds: 0,
  runnerStartDelayMinutes: 0,
})

const hasAttemptedCalculation = ref(false)
const result = ref<ReturnType<typeof calculateOptimalRunParams>>(null)

const referenceTimeTotalSeconds = computed(
  () =>
    formState.referenceTimeHours * 3600 +
    formState.referenceTimeMinutes * 60 +
    formState.referenceTimeSeconds,
)

const validationResult = computed(() => formSchema.safeParse(formState))

const formIsValid = computed(() => validationResult.value.success)
const validationMessage = computed(() =>
  validationResult.value.success
    ? ''
    : (validationResult.value.error.issues[0]?.message ?? 'Uzupełnij poprawnie wszystkie pola.'),
)

const calculate = () => {
  hasAttemptedCalculation.value = true

  if (!formIsValid.value) {
    result.value = null
    return
  }

  result.value = calculateOptimalRunParams(
    referenceTimeTotalSeconds.value,
    formState.referenceDistanceKms,
    formState.runnerStartDelayMinutes,
    // selectedExponent.value,
  )
}
</script>

<template>
  <section class="calculator-card">
    <div class="form-grid">
      <label>
        Dystans zawodów [km]
        <input v-model.number="formState.referenceDistanceKms" type="number" min="0.1" step="0.1" />
      </label>

      <fieldset>
        <legend>Wynik na zawodach (czas netto)</legend>
        <div class="time-grid">
          <label>
            [h]
            <input v-model.number="formState.referenceTimeHours" type="number" min="0" step="1" />
          </label>
          <label>
            [min]
            <input
              v-model.number="formState.referenceTimeMinutes"
              type="number"
              min="0"
              max="59"
              step="1"
            />
          </label>
          <label>
            [s]
            <input
              v-model.number="formState.referenceTimeSeconds"
              type="number"
              min="0"
              max="59"
              step="1"
            />
          </label>
        </div>
      </fieldset>

      <label>
        Opóźnienie startu biegacza na Wings For Life [min]
        <input v-model.number="formState.runnerStartDelayMinutes" type="number" min="0" step="1" />
      </label>

      <!-- <label>
        Doświadczenie biegacza na dystansach 10+ km
        <select v-model.number="selectedExponent">
          <option :value="1.06">Doświadczony (1.06)</option>
          <option :value="1.08">Średnio doświadczony (1.08)</option>
          <option :value="1.1">Niedoświadczony (1.1)</option>
        </select>
      </label> -->

      <button class="calculate-button" type="button" @click="calculate">Oblicz</button>
    </div>

    <p v-if="hasAttemptedCalculation && !formIsValid" class="error">{{ validationMessage }}</p>

    <div v-if="hasAttemptedCalculation && result" class="results">
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
  </section>
</template>

<style scoped>
.calculator-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
}

.subtitle {
  margin-top: 0.25rem;
  color: var(--color-text);
  opacity: 0.85;
}

.form-grid {
  display: grid;
  gap: 0.9rem;
  margin-top: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
}

input,
select {
  width: 100%;
  min-width: 0;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

input[type='number'] {
  appearance: auto;
  -moz-appearance: auto;
}

fieldset {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.75rem;
}

legend {
  padding: 0 0.35rem;
  font-weight: 700;
}

.time-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 0.6rem;
  text-align: right;
}

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

.calculate-button {
  margin-top: 0.25rem;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.65rem 0.95rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  background: #2f8f6b;
  cursor: pointer;
}

.calculate-button:hover,
.calculate-button:focus {
  background: #2a7d5f;
}

.error {
  margin-top: 1rem;
  color: #b42318;
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

  .time-grid {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
  }
}
</style>
