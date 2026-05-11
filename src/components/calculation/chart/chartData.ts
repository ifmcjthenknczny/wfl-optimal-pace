import calculateWflCarCatchTime from '../car'
import { MAX_DISTANCE_IN_KMS } from '../const'
import calculateRunnerTime, { DEFAULT_RIEGEL_EXPONENT, type RunnerBaseValues } from '../riegel'

const CHART_ACCURACY_KM = 0.1

export interface ChartDataPoint {
  x: number // time in minutes
  y: number // distance in kms
}

export const gatherChartData = (
  runnerBaseValues: RunnerBaseValues & { startDelayMinutes: number },
  maxDistanceKms: number = MAX_DISTANCE_IN_KMS,
  exponent: number = DEFAULT_RIEGEL_EXPONENT,
) => {
  const carPoints: ChartDataPoint[] = [
    {
      x: 0,
      y: 0,
    },
  ]

  const runnerPoints: ChartDataPoint[] = [
    {
      x: 0,
      y: 0,
    },
  ]

  for (
    let distanceKms = CHART_ACCURACY_KM;
    distanceKms <= maxDistanceKms;
    distanceKms += CHART_ACCURACY_KM
  ) {
    const carTime = calculateWflCarCatchTime(distanceKms)
    const runnerTime = calculateRunnerTime(runnerBaseValues, distanceKms, exponent)

    if (carTime !== null) {
      carPoints.push({ x: carTime, y: distanceKms })
    }
    runnerPoints.push({ x: runnerTime + runnerBaseValues.startDelayMinutes, y: distanceKms })
  }

  return { carPoints, runnerPoints }
}
