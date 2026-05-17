import calculateWflCarCatchTime from '../car'
import { calculatePace } from '../helpers'
import calculateRunnerTime, { DEFAULT_RIEGEL_EXPONENT } from '../riegel'
import {
  REFINEMENT_STEPS,
  MIN_DISTANCE_IN_KMS,
  MAX_DISTANCE_IN_KMS,
  REFINEMENT_EXPONENTS,
} from '../../../config'

type OptimalRunParams = {
  distanceKms: number
  diffMinutes: number
  netRunnerTimeMinutes: number
  grossRunnerTimeMinutes: number
  runnerStartDelayMinutes: number
  avgPace: number
}

type CalculationContext = {
  baseValues: { timeSeconds: number; distanceKms: number }
  runnerStartDelayMinutes: number
  exponent: number
}

const roundDistance = (distanceKms: number) =>
  Number(distanceKms.toFixed(Math.abs(REFINEMENT_EXPONENTS.at(-1)!)))
const clampDistance = (distanceKms: number) =>
  Math.min(MAX_DISTANCE_IN_KMS, Math.max(MIN_DISTANCE_IN_KMS, distanceKms))

const scanRange = (
  params: {
    startDistanceKms: number
    endDistanceKms: number
    stepKms: number
    currentBest: OptimalRunParams | null
  },
  context: CalculationContext,
): OptimalRunParams | null => {
  const { startDistanceKms, endDistanceKms, stepKms, currentBest } = params
  const { baseValues, runnerStartDelayMinutes } = context
  let bestResult = currentBest
  const stepCount = Math.floor((endDistanceKms - startDistanceKms) / stepKms)

  for (let step = 0; step <= stepCount; step += 1) {
    const targetDistanceKms = roundDistance(startDistanceKms + step * stepKms)
    if (targetDistanceKms <= 0) {
      continue
    }

    const runnerTimeMinutes = calculateRunnerTime(baseValues, targetDistanceKms, context.exponent)
    const catchTimeMinutes = calculateWflCarCatchTime(targetDistanceKms)

    if (catchTimeMinutes === null || !isFinite(runnerTimeMinutes) || !isFinite(catchTimeMinutes)) {
      continue
    }

    const diffMinutes = Math.abs(runnerTimeMinutes + runnerStartDelayMinutes - catchTimeMinutes)
    if (!isFinite(diffMinutes)) {
      continue
    }

    if (bestResult === null || diffMinutes < bestResult.diffMinutes) {
      bestResult = {
        distanceKms: targetDistanceKms,
        diffMinutes,
        netRunnerTimeMinutes: runnerTimeMinutes,
        grossRunnerTimeMinutes: catchTimeMinutes,
        avgPace: calculatePace(runnerTimeMinutes, targetDistanceKms),
        runnerStartDelayMinutes,
      }
    }
  }

  return bestResult
}

const calculateOptimalRunParams = (
  refTimeSeconds: number,
  refDistanceKms: number,
  runnerStartDelayMinutes: number,
  exponent: number = DEFAULT_RIEGEL_EXPONENT,
): OptimalRunParams | null => {
  if (refTimeSeconds <= 0 || refDistanceKms <= 0) {
    return null
  }

  const context: CalculationContext = {
    baseValues: { timeSeconds: refTimeSeconds, distanceKms: refDistanceKms },
    runnerStartDelayMinutes: runnerStartDelayMinutes,
    exponent,
  }
  let bestResult: OptimalRunParams | null = null

  for (let index = 0; index < REFINEMENT_STEPS.length; index += 1) {
    const stepKms = REFINEMENT_STEPS[index]!
    const previousStepKms = index > 0 ? REFINEMENT_STEPS[index - 1]! : MAX_DISTANCE_IN_KMS
    const centerDistanceKms =
      bestResult === null ? (MIN_DISTANCE_IN_KMS + MAX_DISTANCE_IN_KMS) / 2 : bestResult.distanceKms
    const rangeHalfWidthKms = bestResult === null ? MAX_DISTANCE_IN_KMS : previousStepKms
    const rangeStartKms = clampDistance(centerDistanceKms - rangeHalfWidthKms)
    const rangeEndKms = clampDistance(centerDistanceKms + rangeHalfWidthKms)

    bestResult = scanRange(
      {
        startDistanceKms: rangeStartKms,
        endDistanceKms: rangeEndKms,
        stepKms,
        currentBest: bestResult,
      },
      context,
    )

    if (bestResult === null) {
      return null
    }
  }

  return bestResult
}

export default calculateOptimalRunParams
