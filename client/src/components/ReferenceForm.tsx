import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { effectTsResolver } from '@hookform/resolvers/effect-ts'
import { createReference } from '../lib/api'
import { defaultReferenceValues, ReferenceForm as ReferenceSchema } from '../lib/schema'
import type { ReferenceFormValues } from '../lib/schema'
import { PersonalSection } from './PersonalSection'
import { EmployerSection } from './EmployerSection'
import { GuarantorSection } from './GuarantorSection'

type SubmitStatus =
  | { state: 'idle' }
  | { state: 'success' }
  | { state: 'error'; message: string }

export function ReferenceForm() {
  const [status, setStatus] = useState<SubmitStatus>({ state: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReferenceFormValues>({
    resolver: effectTsResolver(ReferenceSchema),
    defaultValues: defaultReferenceValues,
  })

  const onSubmit = handleSubmit(async (data) => {
    setStatus({ state: 'idle' })
    try {
      await createReference(data)
      reset(defaultReferenceValues)
      setStatus({ state: 'success' })
    } catch {
      setStatus({
        state: 'error',
        message: 'Something went wrong while submitting. Please try again.',
      })
    }
  })

  const onCancel = () => {
    reset(defaultReferenceValues)
    setStatus({ state: 'idle' })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <PersonalSection register={register} errors={errors.personal} />
      <EmployerSection register={register} errors={errors.employer} />
      <GuarantorSection register={register} errors={errors.guarantor} />

      {status.state === 'success' && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Reference submitted successfully.
        </p>
      )}
      {status.state === 'error' && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.message}
        </p>
      )}

      <div className="flex items-center justify-end gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-slate-800 bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
