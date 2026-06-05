const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT, 4000),
  /** Comma-separated list of allowed origins, or "*" for any. */
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
} as const
