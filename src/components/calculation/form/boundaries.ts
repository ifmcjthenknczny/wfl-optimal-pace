export const MIN_REASONABLE_DISTANCE_KMS = 1.5
export const MIN_REASONABLE_TIME_SECONDS = 3.5 * 60
export const MIN_REASONABLE_PACE = 2.25

export const WORLD_RECORDS = {
  1.5: 3 + 26 / 60,
  5: 12 + 35 / 60,
  10: 26 + 11 / 60,
  21.097: 57 + 20 / 60,
  42.195: 1 * 60 + 59 + 30 / 60,
} as const

export const ULTRA_HUMAN_COEFFICIENT = 1.03

export type WorldRecordDistance = keyof typeof WORLD_RECORDS
