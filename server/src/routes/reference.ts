import { Router } from 'express'
import { validateBody } from '../middleware/validate'
import { ReferenceApi } from '../schema'

export const referenceRouter = Router()

referenceRouter.post('/new', validateBody(ReferenceApi), (req, res) => {
  const reference = req.body

  // In a real app this is where the reference would be persisted.
  console.log('Received reference:', JSON.stringify(reference, null, 2))

  res.status(201).json({ ok: true })
})
