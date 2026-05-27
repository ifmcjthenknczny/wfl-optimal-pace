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
import { gatherOptimalRunChartData } from '../chart/optimalRunChartData'
import { DEFAULT_RIEGEL_EXPONENT } from '../riegel'
import { gatherStartDelayChartData } from '../chart/startDelayChartData'
import ButtonComponent from '@/components/utils/ButtonComponent.vue'
import DistanceInput from './input/DistanceInput.vue'

const emit = defineEmits<{
  (e: 'calculated', result: ReturnType<typeof calculateOptimalRunParams> | null): void
  (e: 'gathered', data: ReturnType<typeof gatherOptimalRunChartData> | null): void
  (e: 'gatheredStartDelay', data: ReturnType<typeof gatherStartDelayChartData> | null): void
}>()

const replaceCommaByDot = (num: number): number => {
  return +num.toString().replace(',', '.')
}

const extractFullHours = (minutes: number): { hours: number; minutes: number } => {
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60 }
}

// TODO: form errors mapper to separate file, polish errors

const formSchema = z
  .object({
    referenceDistanceKms: z
      .number('Wpisz dystans jako liczbę')
      .positive('Dystans musi być większy niż 0 km'),
    referenceTimeHours: z.number().int().min(0, 'Godziny nie mogą być ujemne'),
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
      if (userPace < MIN_REASONABLE_PACE) {
        return false
      }

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

const DEFAULT_FORM_STATE: FormState = {
  referenceDistanceKms: 10,
  referenceTimeHours: 0,
  referenceTimeMinutes: 60,
  referenceTimeSeconds: 0,
  runnerStartDelayMinutes: 5,
}

const formState = reactive<FormState>(DEFAULT_FORM_STATE)

const hasAttemptedCalculation = ref(false)
const formIsValid = ref(false)
const validationError = ref<string | null>(null)

watch(
  formState,
  () => {
    hasAttemptedCalculation.value = false
    emit('calculated', null)
    emit('gathered', null)
    emit('gatheredStartDelay', null)
  },
  { deep: true },
)

const mapFormData = (formState: FormState): FormState => {
  const shouldExtractFullHoursFromMinutes = formState.referenceTimeHours === 0
  const referenceTimeFullHoursWithMinutes = extractFullHours(formState.referenceTimeMinutes)

  return {
    ...formState,
    referenceTimeHours: shouldExtractFullHoursFromMinutes
      ? referenceTimeFullHoursWithMinutes.hours
      : formState.referenceTimeHours,
    referenceTimeMinutes: shouldExtractFullHoursFromMinutes
      ? referenceTimeFullHoursWithMinutes.minutes
      : formState.referenceTimeMinutes,
    referenceDistanceKms: replaceCommaByDot(formState.referenceDistanceKms),
    runnerStartDelayMinutes: replaceCommaByDot(formState.runnerStartDelayMinutes),
  }
}

const calculate = () => {
  hasAttemptedCalculation.value = true
  const mappedFormState = mapFormData(formState)
  const validationResult = formSchema.safeParse(mappedFormState)
  formIsValid.value = validationResult.success

  if (!validationResult.success) {
    validationError.value = validationResult.error.issues[0]?.message ?? 'Błąd danych.'
    return
  }

  const totalSeconds =
    mappedFormState.referenceTimeHours * 3600 +
    mappedFormState.referenceTimeMinutes * 60 +
    mappedFormState.referenceTimeSeconds

  const optimizedResult = calculateOptimalRunParams(
    totalSeconds,
    mappedFormState.referenceDistanceKms,
    mappedFormState.runnerStartDelayMinutes,
    DEFAULT_RIEGEL_EXPONENT,
  )
  emit('calculated', optimizedResult)

  if (optimizedResult) {
    const optimalRunChartData = gatherOptimalRunChartData(
      {
        timeSeconds: totalSeconds,
        distanceKms: mappedFormState.referenceDistanceKms,
        startDelayMinutes: mappedFormState.runnerStartDelayMinutes,
      },
      optimizedResult.distanceKms,
      DEFAULT_RIEGEL_EXPONENT,
    )
    emit('gathered', optimalRunChartData)

    const startDelayChartData = gatherStartDelayChartData(
      {
        timeSeconds: totalSeconds,
        distanceKms: mappedFormState.referenceDistanceKms,
      },
      DEFAULT_RIEGEL_EXPONENT,
    )
    emit('gatheredStartDelay', startDelayChartData)
  }
}
</script>

<template>
  <div class="form-grid">
    <DistanceInput v-model="formState.referenceDistanceKms" />

    <fieldset>
      <legend>Wynik na zawodach (czas netto)</legend>
      <div class="form-time-grid">
        <label class="unit-label"
          >[h] <input v-model.number="formState.referenceTimeHours" type="number" min="0"
        /></label>
        <label class="unit-label"
          >[min]
          <input v-model.number="formState.referenceTimeMinutes" type="number" min="0" max="59"
        /></label>
        <label class="unit-label"
          >[s]
          <input v-model.number="formState.referenceTimeSeconds" type="number" min="0" max="59"
        /></label>
      </div>
    </fieldset>

    <label class="label">
      Opóźnienie startu na Wings For Life [min]
      <input v-model="formState.runnerStartDelayMinutes" type="text" min="0" />
    </label>

    <ButtonComponent
      color="success"
      size="lg"
      type="button"
      class="form-calculate-button"
      @click="calculate"
    >
      Oblicz
    </ButtonComponent>
    <p v-if="hasAttemptedCalculation && !formIsValid" class="form-error">{{ validationError }}</p>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  gap: 0.9rem;
}

label {
  display: flex;
  gap: 0.35rem;
  font-weight: 600;
}

.label {
  flex-direction: column;
}

.unit-label {
  flex-direction: row-reverse;
  align-items: center;
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
