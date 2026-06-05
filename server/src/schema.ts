import { Schema } from 'effect'

/**
 * Schema for the POST /reference/new payload. Mirrors the client's submitted
 * shape: snake_case keys, an array of employers, and dates as `YYYYMMDD`.
 */
export const relationshipOptions = [
  'Parent',
  'Sibling',
  'Employer',
  'Other',
] as const

const NonEmpty = Schema.String.pipe(Schema.minLength(1))
const ApiDate = Schema.String.pipe(Schema.pattern(/^\d{8}$/))

export const ReferenceApi = Schema.Struct({
  personal: Schema.Struct({
    first_name: NonEmpty,
    last_name: NonEmpty,
    current_address: NonEmpty,
  }),
  employer: Schema.Array(
    Schema.Struct({
      name: NonEmpty,
      start_date: ApiDate,
      end_date: ApiDate,
    }),
  ).pipe(Schema.minItems(1)),
  guarantor: Schema.Struct({
    name: NonEmpty,
    address: NonEmpty,
    relation: Schema.Literal(...relationshipOptions),
  }),
})

export type Reference = Schema.Schema.Type<typeof ReferenceApi>
