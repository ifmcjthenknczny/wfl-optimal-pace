import { RIEGEL_EXPONENTS, type RunnerBaseValues } from '../riegel'
import calculateOptimalRunParams from '../form/optimize'
import { type ChartDataPoint } from './types'

export const MAX_DELAY_TIME_MINUTES = 20
const DATA_ACCURACY_MINUTES = 0.25

export const gatherStartDelayChartData = (
  runnerBaseValues: RunnerBaseValues,
  exponent: number = RIEGEL_EXPONENTS.default,
) => {
  const points: ChartDataPoint[] = []

  for (
    let delayTimeMinutes = 0;
    delayTimeMinutes <= MAX_DELAY_TIME_MINUTES;
    delayTimeMinutes += DATA_ACCURACY_MINUTES
  ) {
    points.push({
      x: delayTimeMinutes,
      y:
        calculateOptimalRunParams(
          runnerBaseValues.timeSeconds,
          runnerBaseValues.distanceKms,
          delayTimeMinutes,
          exponent,
        )?.distanceKms || 0,
    })
  }

  return { points }
}
