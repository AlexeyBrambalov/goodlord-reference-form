import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ReferenceFormValues } from '../lib/schema'
import { Fieldset } from './Fieldset'
import { TextField } from './TextField'

interface PersonalSectionProps {
  register: UseFormRegister<ReferenceFormValues>
  errors: FieldErrors<ReferenceFormValues>['personal']
}

export function PersonalSection({ register, errors }: PersonalSectionProps) {
  return (
    <Fieldset legend="Personal">
      <TextField
        label="First name"
        autoComplete="given-name"
        {...register('personal.first_name')}
        error={errors?.first_name?.message}
      />
      <TextField
        label="Last name"
        autoComplete="family-name"
        {...register('personal.last_name')}
        error={errors?.last_name?.message}
      />
      <TextField
        label="Address"
        autoComplete="street-address"
        {...register('personal.current_address')}
        error={errors?.current_address?.message}
      />
    </Fieldset>
  )
}
