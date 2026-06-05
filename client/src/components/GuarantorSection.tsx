import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { relationshipOptions } from '../lib/schema'
import type { ReferenceFormValues } from '../lib/schema'
import { Fieldset } from './Fieldset'
import { TextField } from './TextField'
import { SelectField } from './SelectField'

interface GuarantorSectionProps {
  register: UseFormRegister<ReferenceFormValues>
  errors: FieldErrors<ReferenceFormValues>['guarantor']
}

export function GuarantorSection({ register, errors }: GuarantorSectionProps) {
  return (
    <Fieldset legend="Guarantor">
      <TextField
        label="Guarantor name"
        {...register('guarantor.name')}
        error={errors?.name?.message}
      />
      <TextField
        label="Guarantor address"
        {...register('guarantor.address')}
        error={errors?.address?.message}
      />
      <SelectField
        label="Relationship to guarantor"
        options={relationshipOptions}
        {...register('guarantor.relation')}
        error={errors?.relation?.message}
      />
    </Fieldset>
  )
}
