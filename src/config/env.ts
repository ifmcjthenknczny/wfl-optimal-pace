import { z } from 'zod'

const envSchema = z.object({
  VITE_USE_RIEGEL_EXPONENTS: z.coerce.boolean().default(false),
})

const safeEnv = envSchema.safeParse(import.meta.env)

if (!safeEnv.success) {
  console.error('Invalid environment variables:', safeEnv.error.message)
  throw new Error('Application could not be started due to invalid environment variables')
}

export const env = safeEnv.data
