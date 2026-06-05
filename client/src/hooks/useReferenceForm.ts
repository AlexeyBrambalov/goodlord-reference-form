import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { effectTsResolver } from '@hookform/resolvers/effect-ts'
import { createReference } from '../lib/api'
import { defaultReferenceValues, ReferenceForm } from '../lib/schema'
import type { ReferenceFormValues } from '../lib/schema'

export type SubmitStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success' }
  | { state: 'error'; message: string }

export const SUBMIT_ERROR_MESSAGE =
  'Something went wrong while submitting. Please try again.'

export interface UseReferenceFormResult {
  register: UseFormRegister<ReferenceFormValues>
  errors: FieldErrors<ReferenceFormValues>
  isSubmitting: boolean
  status: SubmitStatus
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
}

/**
 * Owns all reference-form behaviour: validation wiring, submit/cancel
 * handlers, and the network submit status. Components consume this hook and
 * stay purely presentational.
 */
export function useReferenceForm(): UseReferenceFormResult {
  const [status, setStatus] = useState<SubmitStatus>({ state: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReferenceFormValues>({
    resolver: effectTsResolver(ReferenceForm),
    defaultValues: defaultReferenceValues,
  })

  const onSubmit = handleSubmit(async (data) => {
    setStatus({ state: 'submitting' })
    try {
      await createReference(data)
      reset(defaultReferenceValues)
      setStatus({ state: 'success' })
    } catch {
      setStatus({ state: 'error', message: SUBMIT_ERROR_MESSAGE })
    }
  })

  const onCancel = () => {
    reset(defaultReferenceValues)
    setStatus({ state: 'idle' })
  }

  return { register, errors, isSubmitting, status, onSubmit, onCancel }
}
