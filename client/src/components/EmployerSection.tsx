import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ReferenceFormValues } from '../lib/schema'
import { Fieldset } from './Fieldset'
import { TextField } from './TextField'

interface EmployerSectionProps {
  register: UseFormRegister<ReferenceFormValues>
  errors: FieldErrors<ReferenceFormValues>['employer']
}

export function EmployerSection({ register, errors }: EmployerSectionProps) {
  return (
    <Fieldset legend="Employer">
      <TextField
        label="Employer name"
        {...register('employer.name')}
        error={errors?.name?.message}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Employment start date"
          type="date"
          {...register('employer.start_date')}
          error={errors?.start_date?.message}
        />
        <TextField
          label="Employment end date"
          type="date"
          {...register('employer.end_date')}
          error={errors?.end_date?.message}
        />
      </div>
    </Fieldset>
  )
}
