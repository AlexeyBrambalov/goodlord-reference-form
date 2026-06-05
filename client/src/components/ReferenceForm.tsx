import { useReferenceForm } from '../hooks/useReferenceForm'
import { PersonalSection } from './PersonalSection'
import { EmployerSection } from './EmployerSection'
import { GuarantorSection } from './GuarantorSection'

export function ReferenceForm() {
  const { register, errors, isSubmitting, status, onSubmit, onCancel } =
    useReferenceForm()

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <PersonalSection register={register} errors={errors.personal} />
      <EmployerSection register={register} errors={errors.employer} />
      <GuarantorSection register={register} errors={errors.guarantor} />

      {status.state === 'success' && (
        <p
          role="status"
          className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          Reference submitted successfully.
        </p>
      )}
      {status.state === 'error' && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
        >
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
