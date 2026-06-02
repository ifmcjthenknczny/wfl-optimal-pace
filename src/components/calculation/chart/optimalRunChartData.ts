import calculateWflCarCatchTime from '../car'
import { MAX_DISTANCE_IN_KMS } from '../../../config/calculation'
import calculateRunnerTime, { RIEGEL_EXPONENTS, type RunnerBaseValues } from '../riegel'
import { type ChartDataPoint } from './types'

const DATA_ACCURACY_KM = 0.1

const addChartEntry = (
  points: { carPoints: ChartDataPoint[]; runnerPoints: ChartDataPoint[] },
  runnerBaseValues: RunnerBaseValues & { startDelayMinutes: number },
  distanceKms: number,
  exponent: number = RIEGEL_EXPONENTS.default,
) => {
  const carTime = calculateWflCarCatchTime(distanceKms)
  const runnerTime = calculateRunnerTime(runnerBaseValues, distanceKms, exponent)

  if (carTime !== null) {
    points.carPoints.push({ x: carTime, y: distanceKms })
  }
  points.runnerPoints.push({ x: runnerTime + runnerBaseValues.startDelayMinutes, y: distanceKms })
}

export const gatherOptimalRunChartData = (
  runnerBaseValues: RunnerBaseValues & { startDelayMinutes: number },
  optimalDistance: number,
  exponent: number = RIEGEL_EXPONENTS.default,
) => {
  const potentialMaxDistanceKms = optimalDistance * 1.8
  const maxDistanceKms =
    potentialMaxDistanceKms > MAX_DISTANCE_IN_KMS ? MAX_DISTANCE_IN_KMS : potentialMaxDistanceKms
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
    let distanceKms = DATA_ACCURACY_KM;
    distanceKms <= maxDistanceKms;
    distanceKms += DATA_ACCURACY_KM
  ) {
    const shouldAddOptimalResultThisIteration =
      optimalDistance > distanceKms - DATA_ACCURACY_KM &&
      optimalDistance < distanceKms &&
      Math.abs(optimalDistance - distanceKms) > 1e-6
    if (shouldAddOptimalResultThisIteration) {
      addChartEntry({ carPoints, runnerPoints }, runnerBaseValues, optimalDistance, exponent)
    }
    addChartEntry({ carPoints, runnerPoints }, runnerBaseValues, distanceKms, exponent)
  }

  return { carPoints, runnerPoints }
}
