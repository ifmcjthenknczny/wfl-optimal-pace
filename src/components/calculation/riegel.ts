export const MIN_RIEGEL_EXPONENT = 1.06
export const DEFAULT_RIEGEL_EXPONENT = 1.06
export const MAX_RIEGEL_EXPONENT = 1.1

export type RunnerBaseValues = {
  timeSeconds: number
  distanceKms: number
}

const calculateRunnerTime = (
  { timeSeconds, distanceKms }: RunnerBaseValues,
  targetDistanceKms: number,
  exponent: number = DEFAULT_RIEGEL_EXPONENT,
) => {
  const runnerTimeMinutes = (timeSeconds * Math.pow(targetDistanceKms / distanceKms, exponent)) / 60
  return runnerTimeMinutes
}

export default calculateRunnerTime
