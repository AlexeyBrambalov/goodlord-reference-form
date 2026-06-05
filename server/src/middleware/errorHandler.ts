import type { NextFunction, Request, Response } from 'express'
import { env } from '../env'

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ ok: false, error: 'Not found' })
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // `next` is required for Express to recognise this as an error handler.
  _next: NextFunction,
): void {
  console.error(err)
  res.status(500).json({
    ok: false,
    error: 'Internal server error',
    ...(env.nodeEnv === 'development' && err instanceof Error
      ? { detail: err.message }
      : {}),
  })
}
