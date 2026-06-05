import { Schema } from 'effect'

export const relationshipOptions = [
  'Parent',
  'Sibling',
  'Employer',
  'Other',
] as const

export type Relationship = (typeof relationshipOptions)[number]

const RequiredText = (label: string) =>
  Schema.String.pipe(
    Schema.minLength(1, { message: () => `${label} is required` }),
  )

/**
 * Schema for the values held in the form. Field names match the API contract
 * (snake_case); dates are the `YYYY-MM-DD` strings produced by `<input
 * type="date">` and are reformatted to `YYYYMMDD` when building the payload.
 */
export const ReferenceForm = Schema.Struct({
  personal: Schema.Struct({
    first_name: RequiredText('First name'),
    last_name: RequiredText('Last name'),
    current_address: RequiredText('Address'),
  }),
  employer: Schema.Struct({
    name: RequiredText('Employer name'),
    start_date: RequiredText('Start date'),
    end_date: RequiredText('End date'),
  }),
  guarantor: Schema.Struct({
    name: RequiredText('Guarantor name'),
    address: RequiredText('Guarantor address'),
    relation: Schema.Literal(...relationshipOptions),
  }),
})

export type ReferenceFormValues = Schema.Schema.Type<typeof ReferenceForm>

export const defaultReferenceValues: ReferenceFormValues = {
  personal: { first_name: '', last_name: '', current_address: '' },
  employer: { name: '', start_date: '', end_date: '' },
  guarantor: { name: '', address: '', relation: 'Parent' },
}
