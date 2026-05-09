<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import calculateOptimalRunParams from './optimize'
import { MIN_RIEGEL_EXPONENT } from './riegel'

const referenceDistanceKms = ref(10)
const referenceTimeHours = ref(0)
const referenceTimeMinutes = ref(50)
const referenceTimeSeconds = ref(0)
const runnerStartDelayMinutes = ref(0)
const selectedExponent = ref(MIN_RIEGEL_EXPONENT)

const formSchema = z
  .object({
    referenceDistanceKms: z.number().positive(),
    referenceTimeHours: z.number().min(0),
    referenceTimeMinutes: z.number().int().min(0).max(59),
    referenceTimeSeconds: z.number().int().min(0).max(59),
    runnerStartDelayMinutes: z.number().min(0),
  })
  .refine(
    (values) =>
      values.referenceTimeHours * 3600 +
        values.referenceTimeMinutes * 60 +
        values.referenceTimeSeconds >
      0,
    { message: 'Czas referencyjny musi być większy od zera.' },
  )

const toTwoDigits = (value: number) => (value < 10 ? `0${value}` : `${value}`)

const formatMinutesToClock = (timeMinutes: number) => {
  const totalSeconds = Math.max(0, Math.round(timeMinutes * 60))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${toTwoDigits(hours)}:${toTwoDigits(minutes)}:${toTwoDigits(seconds)}`
}

const formatPace = (paceMinutesPerKm: number) => {
  const totalSeconds = Math.max(0, Math.round(paceMinutesPerKm * 60))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${toTwoDigits(seconds)} min/km`
}

const referenceTimeTotalSeconds = computed(
  () =>
    referenceTimeHours.value * 3600 + referenceTimeMinutes.value * 60 + referenceTimeSeconds.value,
)

const hasAttemptedCalculation = ref(false)
const result = ref<ReturnType<typeof calculateOptimalRunParams>>(null)

const validationResult = computed(() =>
  formSchema.safeParse({
    referenceDistanceKms: referenceDistanceKms.value,
    referenceTimeHours: referenceTimeHours.value,
    referenceTimeMinutes: referenceTimeMinutes.value,
    referenceTimeSeconds: referenceTimeSeconds.value,
    runnerStartDelayMinutes: runnerStartDelayMinutes.value,
  }),
)

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
    referenceDistanceKms.value,
    runnerStartDelayMinutes.value,
    selectedExponent.value,
  )
}
</script>

<template>
  <section class="calculator-card">
    <p class="subtitle">
      Podaj swój wynik referencyjny i profil biegacza, a wyliczymy optymalny cel.
    </p>

    <div class="form-grid">
      <label>
        Dystans referencyjny (km)
        <input v-model.number="referenceDistanceKms" type="number" min="0.1" step="0.1" />
      </label>

      <label>
        Opóźnienie startu (min)
        <input v-model.number="runnerStartDelayMinutes" type="number" min="0" step="1" />
      </label>

      <fieldset>
        <legend>Czas referencyjny</legend>
        <div class="time-grid">
          <label>
            h
            <input v-model.number="referenceTimeHours" type="number" min="0" step="1" />
          </label>
          <label>
            min
            <input v-model.number="referenceTimeMinutes" type="number" min="0" max="59" step="1" />
          </label>
          <label>
            s
            <input v-model.number="referenceTimeSeconds" type="number" min="0" max="59" step="1" />
          </label>
        </div>
      </fieldset>

      <label>
        Doświadczenie biegacza
        <select v-model.number="selectedExponent">
          <option :value="1.06">Doświadczony (1.06)</option>
          <option :value="1.08">Średnio doświadczony (1.08)</option>
          <option :value="1.1">Niedoświadczony (1.1)</option>
        </select>
      </label>

      <button class="calculate-button" type="button" @click="calculate">Oblicz</button>
    </div>

    <p v-if="hasAttemptedCalculation && !formIsValid" class="error">{{ validationMessage }}</p>

    <div v-if="hasAttemptedCalculation && formIsValid && result" class="results">
      <h3>Wynik</h3>
      <p><strong>Optymalny dystans:</strong> {{ result.distanceKms.toFixed(2) }} km</p>
      <p>
        <strong>Czas biegu netto:</strong> {{ formatMinutesToClock(result.netRunnerTimeMinutes) }}
      </p>
      <p>
        <strong>Czas biegu brutto:</strong>
        {{ formatMinutesToClock(result.grossRunnerTimeMinutes) }}
      </p>
      <p><strong>Średnie tempo:</strong> {{ formatPace(result.avgPace) }}</p>
      <p><strong>Różnica runner-car:</strong> {{ result.diffMinutes.toFixed(2) }} min</p>
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
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--color-background-mute);
  color: var(--color-text);
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
  grid-template-columns: repeat(3, minmax(90px, 1fr));
  gap: 0.6rem;
}

.results {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-background-mute) 82%, transparent);
  border: 1px solid var(--color-border);
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

.calculate-button:hover {
  background: #2a7d5f;
}

.error {
  margin-top: 1rem;
  color: #b42318;
}
</style>
