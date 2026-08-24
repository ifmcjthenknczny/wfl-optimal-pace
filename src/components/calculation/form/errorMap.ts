import { z } from 'zod'

export const errorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined') {
        return 'validation.required'
      }
      if (issue.expected === 'number') {
        return 'validation.invalid_number'
      }
      return 'validation.invalid_type'

    case 'too_small':
      if (issue.type === 'number') {
        return `validation.too_small_number:${issue.minimum}`
      }
      return `validation.too_small:${issue.minimum}`

    case 'too_big':
      if (issue.type === 'number') {
        return `validation.too_big_number:${issue.maximum}`
      }
      return `validation.too_big:${issue.maximum}`

    case 'custom':
      return issue.message || 'validation.default_error'

    default:
      if (issue.message && issue.message !== 'Required') {
        return issue.message
      }
      return 'validation.default_error'
  }
}
