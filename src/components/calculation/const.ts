export const REFINEMENT_EXPONENTS = [0, -1, -2, -3]
export const REFINEMENT_STEPS = REFINEMENT_EXPONENTS.map((exponent) => 10 ** exponent)

export const MIN_DISTANCE_IN_KMS = REFINEMENT_STEPS.at(-1)!
export const MAX_DISTANCE_IN_KMS = 150
export const MOBILE_BREAKPOINT_PX = 641
