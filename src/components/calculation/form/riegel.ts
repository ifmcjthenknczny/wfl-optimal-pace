export const MIN_RIEGEL_EXPONENT = 1.06
export const MAX_RIEGEL_EXPONENT = 1.1

type BaseValues = {
  timeSeconds: number
  distanceKms: number
}

const calculateRunnerTime = (
  { timeSeconds, distanceKms }: BaseValues,
  targetDistanceKms: number,
  exponent: number = MIN_RIEGEL_EXPONENT,
) => {
  const runnerTimeMinutes = (timeSeconds * Math.pow(targetDistanceKms / distanceKms, exponent)) / 60
  return runnerTimeMinutes
}

export default calculateRunnerTime
