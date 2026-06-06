import { Schema } from 'effect'

export const relationshipOptions = [
  'Parent',
  'Sibling',
  'Employer',
  'Other',
] as const

export type Relationship = (typeof relationshipOptions)[number]

/** Field-length limits, shared across name- and address-style fields. */
export const NAME_MAX_LENGTH = 100
export const ADDRESS_MAX_LENGTH = 200

/** Inclusive year range accepted for any date field. */
export const MIN_YEAR = 1970
export const MAX_YEAR = 2100

const RequiredText = (label: string, maxLength = NAME_MAX_LENGTH) =>
  Schema.String.pipe(
    Schema.minLength(1, { message: () => `${label} is required` }),
    Schema.maxLength(maxLength, {
      message: () => `${label} must be ${maxLength} characters or fewer`,
    }),
  )

/**
 * A `<input type="date">` value: `YYYY-MM-DD`, restricted to a sane year range.
 */
const FormDate = (label: string) =>
  Schema.String.pipe(
    Schema.minLength(1, { message: () => `${label} is required` }),
    Schema.pattern(/^\d{4}-\d{2}-\d{2}$/, {
      message: () => `${label} must be a valid date (YYYY-MM-DD)`,
    }),
    Schema.filter((value) => Number(value.slice(0, 4)) >= MIN_YEAR, {
      message: () => `${label} cannot be earlier than ${MIN_YEAR}`,
    }),
    Schema.filter((value) => Number(value.slice(0, 4)) <= MAX_YEAR, {
      message: () => `${label} cannot be later than ${MAX_YEAR}`,
    }),
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
    current_address: RequiredText('Address', ADDRESS_MAX_LENGTH),
  }),
  employer: Schema.Struct({
    name: RequiredText('Employer name'),
    start_date: FormDate('Start date'),
    end_date: FormDate('End date'),
  }).pipe(
    // `YYYY-MM-DD` sorts lexicographically, so a string compare is chronological.
    Schema.filter((employer) =>
      employer.start_date < employer.end_date
        ? undefined
        : {
            path: ['end_date'],
            message: 'End date must be after the start date',
          },
    ),
  ),
  guarantor: Schema.Struct({
    name: RequiredText('Guarantor name'),
    address: RequiredText('Guarantor address', ADDRESS_MAX_LENGTH),
    relation: Schema.Literal(...relationshipOptions),
  }),
})

export type ReferenceFormValues = Schema.Schema.Type<typeof ReferenceForm>

export const defaultReferenceValues: ReferenceFormValues = {
  personal: { first_name: '', last_name: '', current_address: '' },
  employer: { name: '', start_date: '', end_date: '' },
  guarantor: { name: '', address: '', relation: 'Parent' },
}
