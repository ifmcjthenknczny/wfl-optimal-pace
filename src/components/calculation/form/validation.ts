import z from 'zod'
import { RIEGEL_EXPONENTS } from '../riegel'
import { formatTime, calculatePace } from '../helpers'
import type { Time } from './types'

const MIN_REASONABLE_DISTANCE_KMS = 1.5
const MIN_REASONABLE_TIME_SECONDS = 3.5 * 60
const MIN_REASONABLE_PACE = 2.25

const toMinutes = ({ hours = 0, minutes = 0, seconds = 0 }: Partial<Time>) => {
  return hours * 60 + minutes + seconds / 60
}

const WORLD_RECORDS = {
  1.5: toMinutes({ minutes: 3, seconds: 26 }),
  5: toMinutes({ minutes: 12, seconds: 35 }),
  10: toMinutes({ minutes: 26, seconds: 11 }),
  21.097: toMinutes({ minutes: 57, seconds: 20 }),
  42.195: toMinutes({ hours: 1, minutes: 59, seconds: 30 }),
} as const

const ULTRA_HUMAN_COEFFICIENT = 1.03

type WorldRecordDistance = keyof typeof WORLD_RECORDS

// TODO: form errors mapper to separate file, i18n errors
export const formSchema = z
  .object({
    referenceDistanceKms: z
      .number('Wpisz dystans jako liczbę')
      .positive('Dystans musi być większy niż 0 km'),
    referenceTimeHours: z.number().int().min(0, 'Godziny nie mogą być ujemne'),
    referenceTimeMinutes: z.number().int().min(0).max(59),
    referenceTimeSeconds: z.number().int().min(0).max(59),
    runnerStartDelayMinutes: z.number().min(0, 'Opóźnienie nie może być ujemne'),
    riegelExponent: z
      .number()
      .min(Math.min(...Object.values(RIEGEL_EXPONENTS)))
      .max(Math.max(...Object.values(RIEGEL_EXPONENTS)))
      .default(RIEGEL_EXPONENTS.default),
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
