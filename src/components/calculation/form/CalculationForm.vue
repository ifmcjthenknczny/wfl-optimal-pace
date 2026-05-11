<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { z } from 'zod'
import calculateOptimalRunParams from './optimize'
import { formatTime, calculatePace } from '../helpers'
import {
  WORLD_RECORDS,
  type WorldRecordDistance,
  MIN_REASONABLE_DISTANCE_KMS,
  MIN_REASONABLE_PACE,
  MIN_REASONABLE_TIME_SECONDS,
  ULTRA_HUMAN_COEFFICIENT,
} from './boundaries'
import { gatherChartData } from '../chart/chartData'
import { DEFAULT_RIEGEL_EXPONENT } from '../riegel'

const emit = defineEmits<{
  (e: 'calculated', result: ReturnType<typeof calculateOptimalRunParams> | null): void
  (e: 'gathered', data: ReturnType<typeof gatherChartData> | null): void
}>()

const formSchema = z
  .object({
    referenceDistanceKms: z
      .number('Wpisz dystans jako liczbę')
      .positive('Dystans musi być większy niż 0 km'),
    referenceTimeHours: z.number().min(0, 'Godziny nie mogą być ujemne'),
    referenceTimeMinutes: z.number().int().min(0).max(59),
    referenceTimeSeconds: z.number().int().min(0).max(59),
    runnerStartDelayMinutes: z.number().min(0, 'Opóźnienie nie może być ujemne'),
  })
  .refine(
    (values) =>
      values.referenceTimeHours * 3600 +
        values.referenceTimeMinutes * 60 +
        values.referenceTimeSeconds >=
      MIN_REASONABLE_TIME_SECONDS,
    {
      message: `Czas referencyjny musi być większy od ${formatTime(MIN_REASONABLE_TIME_SECONDS)}.`,
    },
  )
  .refine((values) => values.referenceDistanceKms >= MIN_REASONABLE_DISTANCE_KMS, {
    message: `Dystans musi być większy niż ${MIN_REASONABLE_DISTANCE_KMS} km.`,
  })
  .refine(
    (values) => {
      const totalMinutes =
        values.referenceTimeHours * 60 +
        values.referenceTimeMinutes +
        values.referenceTimeSeconds / 60
      const userPace = calculatePace(totalMinutes, values.referenceDistanceKms)
      if (userPace < MIN_REASONABLE_PACE) return false

      const distances = Object.keys(WORLD_RECORDS)
        .map(Number)
        .sort((a, b) => b - a)
      const matchedDistance = distances.find((d) => values.referenceDistanceKms >= d)

      if (matchedDistance) {
        const wrTime = WORLD_RECORDS[matchedDistance as WorldRecordDistance]
        const wrPace = wrTime / matchedDistance
        if (userPace < wrPace / ULTRA_HUMAN_COEFFICIENT) {
          return false
        }
      }
      return true
    },
    { message: 'Nie ściemniaj XD' },
  )

type FormState = z.infer<typeof formSchema>

const formState = reactive<FormState>({
  referenceDistanceKms: 10,
  referenceTimeHours: 0,
  referenceTimeMinutes: 50,
  referenceTimeSeconds: 0,
  runnerStartDelayMinutes: 0,
})

const hasAttemptedCalculation = ref(false)
const formIsValid = ref(false)
const validationError = ref<string | null>(null)

watch(
  formState,
  () => {
    hasAttemptedCalculation.value = false
    emit('calculated', null)
    emit('gathered', null)
  },
  { deep: true },
)

const calculate = () => {
  hasAttemptedCalculation.value = true
  const validationResult = formSchema.safeParse(formState)
  formIsValid.value = validationResult.success

  if (!validationResult.success) {
    validationError.value = validationResult.error.issues[0]?.message ?? 'Błąd danych.'
    return
  }

  const totalSeconds =
    formState.referenceTimeHours * 3600 +
    formState.referenceTimeMinutes * 60 +
    formState.referenceTimeSeconds

  const optimizedResult = calculateOptimalRunParams(
    totalSeconds,
    formState.referenceDistanceKms,
    formState.runnerStartDelayMinutes,
    DEFAULT_RIEGEL_EXPONENT,
  )
  emit('calculated', optimizedResult)

  if (optimizedResult) {
    const maxDistance = optimizedResult.distanceKms * 1.8
    const chartData = gatherChartData(
      {
        timeSeconds: totalSeconds,
        distanceKms: formState.referenceDistanceKms,
        startDelayMinutes: formState.runnerStartDelayMinutes,
      },
      maxDistance,
      DEFAULT_RIEGEL_EXPONENT,
    )
    emit('gathered', chartData)
  }
}
</script>

<template>
  <div class="form-grid">
    <label>
      Dystans zawodów [km]
      <input v-model.number="formState.referenceDistanceKms" type="number" min="0.1" step="0.1" />
    </label>

    <fieldset>
      <legend>Wynik na zawodach (czas netto)</legend>
      <div class="form-time-grid">
        <label
          >[h] <input v-model.number="formState.referenceTimeHours" type="number" min="0"
        /></label>
        <label
          >[min]
          <input v-model.number="formState.referenceTimeMinutes" type="number" min="0" max="59"
        /></label>
        <label
          >[s]
          <input v-model.number="formState.referenceTimeSeconds" type="number" min="0" max="59"
        /></label>
      </div>
    </fieldset>

    <label>
      Opóźnienie startu na Wings For Life [min]
      <input v-model.number="formState.runnerStartDelayMinutes" type="number" min="0" />
    </label>

    <button class="form-calculate-button" type="button" @click="calculate">Oblicz</button>
    <p v-if="hasAttemptedCalculation && !formIsValid" class="form-error">{{ validationError }}</p>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  gap: 0.9rem;
  margin-top: 1rem;
}

label {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
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

.form-time-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 0.6rem;
  text-align: right;
}

.form-calculate-button {
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

.form-calculate-button:hover,
.form-calculate-button:focus {
  background: #2a7d5f;
}

.form-error {
  margin-top: 1rem;
  color: #b42318;
}

@media (min-width: 641px) {
  .form-time-grid {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
  }

  label {
    display: grid;
  }
}
</style>
