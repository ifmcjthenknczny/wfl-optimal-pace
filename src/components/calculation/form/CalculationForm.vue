<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import calculateOptimalRunParams from './optimize'
import { gatherOptimalRunChartData } from '../chart/optimalRunChartData'
import { RIEGEL_EXPONENTS } from '../riegel'
import { gatherStartDelayChartData } from '../chart/startDelayChartData'
import ButtonComponent from '@/components/utils/ButtonComponent.vue'
import DistanceInput from './input/DistanceInput.vue'
import { type Time } from './types.ts'
import { formSchema } from './validation.ts'
import { env } from '@/config/env.ts'
import { useI18n } from '@/i18n/useI18n.ts'

const { t, tc } = useI18n()

// TODO: show user validation error even when they enters comma in hours/minutes/seconds

const emit = defineEmits<{
  (e: 'calculated', result: ReturnType<typeof calculateOptimalRunParams> | null): void
  (e: 'gathered', data: ReturnType<typeof gatherOptimalRunChartData> | null): void
  (e: 'gatheredStartDelay', data: ReturnType<typeof gatherStartDelayChartData> | null): void
}>()

const replaceCommaByDot = (num: number): number => {
  return +num.toString().replace(',', '.')
}

const extractFullHours = (minutes: number): Time => {
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60, seconds: 0 }
}

const toSeconds = ({ hours, minutes, seconds = 0 }: Time) => {
  return hours * 3600 + minutes * 60 + seconds
}

type RunnerLevel = Exclude<keyof typeof RIEGEL_EXPONENTS, 'default'>

const RIEGEL_LABELS = computed<Record<RunnerLevel, string>>(() => ({
  pro: `40 ${t('form.atLeast')} km`,
  semipro: '30 - 39 km',
  advanced: '20 - 29 km',
  regular: '10 - 19 km',
  casual: '5 - 9 km',
  beginner: `${tc('form.atMost')} 5 km`,
}))

const RIEGEL_OPTIONS = Object.entries(RIEGEL_EXPONENTS).map(([key, value]) => ({
  key,
  value,
  label: RIEGEL_LABELS.value[key as RunnerLevel],
}))

type FormState = z.infer<typeof formSchema>

const DEFAULT_FORM_STATE: FormState = {
  referenceDistanceKms: 10,
  referenceTimeHours: 0,
  referenceTimeMinutes: 60,
  referenceTimeSeconds: 0,
  runnerStartDelayMinutes: 5,
  riegelExponent: RIEGEL_EXPONENTS.default,
}

const formState = reactive<FormState>(DEFAULT_FORM_STATE)

const hasAttemptedCalculation = ref(false)
const isFormValid = ref(false)
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
    referenceTimeHours: replaceCommaByDot(
      shouldExtractFullHoursFromMinutes
        ? referenceTimeFullHoursWithMinutes.hours
        : formState.referenceTimeHours,
    ),
    referenceTimeMinutes: replaceCommaByDot(
      shouldExtractFullHoursFromMinutes
        ? referenceTimeFullHoursWithMinutes.minutes
        : formState.referenceTimeMinutes,
    ),
    referenceTimeSeconds: replaceCommaByDot(formState.referenceTimeSeconds),
    referenceDistanceKms: replaceCommaByDot(formState.referenceDistanceKms),
    runnerStartDelayMinutes: replaceCommaByDot(formState.runnerStartDelayMinutes),
  }
}

const calculate = () => {
  hasAttemptedCalculation.value = true
  const mappedFormState = mapFormData(formState)
  const validationResult = formSchema.safeParse(mappedFormState)
  isFormValid.value = validationResult.success

  if (!validationResult.success) {
    validationError.value = validationResult.error.issues[0]?.message ?? 'Błąd danych.'
    return
  }

  const totalSeconds = toSeconds({
    hours: mappedFormState.referenceTimeHours,
    minutes: mappedFormState.referenceTimeMinutes,
    seconds: mappedFormState.referenceTimeSeconds,
  })

  const optimizedResult = calculateOptimalRunParams(
    totalSeconds,
    mappedFormState.referenceDistanceKms,
    mappedFormState.runnerStartDelayMinutes,
    formState.riegelExponent,
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
      formState.riegelExponent,
    )
    emit('gathered', optimalRunChartData)

    const startDelayChartData = gatherStartDelayChartData(
      {
        timeSeconds: totalSeconds,
        distanceKms: mappedFormState.referenceDistanceKms,
      },
      formState.riegelExponent,
    )
    emit('gatheredStartDelay', startDelayChartData)
  }
}

const onPresetSelected = (time?: Time) => {
  if (!time) {
    return
  }
  formState.referenceTimeHours = time.hours
  formState.referenceTimeMinutes = time.minutes
  formState.referenceTimeSeconds = time.seconds ?? 0
}

const legend = computed(() => `${tc('form.result')} (${tc('common.netTime')})`)
const riegelLabel = computed(() => tc('form.canRun'))
const delayLabel = computed(() => tc('form.delay'))
const buttonText = computed(() => tc('form.calculate'))

const formattedValidationError = computed(() => {
  const rawError = validationError.value ?? 'validation.default_error'
  const colonIndex = rawError.indexOf(':')

  if (colonIndex !== -1) {
    const key = rawError.slice(0, colonIndex)
    const val = rawError.slice(colonIndex + 1)
    return t(`form.${key}`, { val })
  }

  return t(`form.${rawError}`)
})
</script>

<template>
  <div class="form-grid">
    <DistanceInput v-model="formState.referenceDistanceKms" @preset-selected="onPresetSelected" />

    <fieldset>
      <legend>{{ legend }}</legend>
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

    <label class="label full-width" v-if="env.VITE_USE_RIEGEL_EXPONENTS">
      {{ riegelLabel }}:
      <select v-model.number="formState.riegelExponent">
        <option v-for="option in RIEGEL_OPTIONS" :key="option.key" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="label">
      {{ delayLabel }} [min]
      <input v-model="formState.runnerStartDelayMinutes" type="text" min="0" />
    </label>

    <ButtonComponent
      color="success"
      size="lg"
      type="button"
      class="form-calculate-button"
      @click="calculate"
    >
      {{ buttonText }}
    </ButtonComponent>
    <p v-if="hasAttemptedCalculation && !isFormValid" class="form-error">
      {{ formattedValidationError }}
    </p>
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
