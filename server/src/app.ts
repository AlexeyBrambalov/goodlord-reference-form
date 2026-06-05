import express from 'express'
import cors from 'cors'
import { env } from './env'
import { referenceRouter } from './routes/reference'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
    }),
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/reference', referenceRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
