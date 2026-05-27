export const RIEGEL_EXPONENTS = {
  pro: 1.02,
  semipro: 1.04,
  advanced: 1.06,
  regular: 1.08,
  casual: 1.1,
  beginner: 1.15,

  default: 1.08,
} as const

export type RunnerBaseValues = {
  timeSeconds: number
  distanceKms: number
}

const calculateRunnerTime = (
  { timeSeconds, distanceKms }: RunnerBaseValues,
  targetDistanceKms: number,
  exponent: number = RIEGEL_EXPONENTS.default,
) => {
  const runnerTimeMinutes = (timeSeconds * Math.pow(targetDistanceKms / distanceKms, exponent)) / 60
  return runnerTimeMinutes
}

export default calculateRunnerTime
