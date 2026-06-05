import type { NextFunction, Request, Response } from 'express'
import { Either, Schema } from 'effect'
import { ArrayFormatter } from 'effect/ParseResult'

/**
 * Validates `req.body` against an Effect Schema. On success the parsed (and
 * typed) value replaces `req.body`; on failure it responds with 400 and the
 * formatted issues.
 */
export const validateBody =
  <A, I>(schema: Schema.Schema<A, I>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = Schema.decodeUnknownEither(schema, {
      errors: 'all',
      onExcessProperty: 'ignore',
    })(req.body)

    if (Either.isLeft(result)) {
      res.status(400).json({
        ok: false,
        error: 'Validation failed',
        issues: ArrayFormatter.formatErrorSync(result.left).map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
      return
    }

    req.body = result.right
    next()
  }
