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

/** Field-length limits, mirrored from the client form schema. */
export const NAME_MAX_LENGTH = 100
export const ADDRESS_MAX_LENGTH = 200

/** Inclusive year range accepted for any date field. */
export const MIN_YEAR = 1970
export const MAX_YEAR = 2100

const BoundedText = (maxLength: number) =>
  Schema.String.pipe(Schema.minLength(1), Schema.maxLength(maxLength))

const Name = BoundedText(NAME_MAX_LENGTH)
const Address = BoundedText(ADDRESS_MAX_LENGTH)

/** `YYYYMMDD`, restricted to the same year range as the client form. */
const ApiDate = Schema.String.pipe(
  Schema.pattern(/^\d{8}$/),
  Schema.filter((value) => {
    const year = Number(value.slice(0, 4))
    return year >= MIN_YEAR && year <= MAX_YEAR
  }, { message: () => `date must be between ${MIN_YEAR} and ${MAX_YEAR}` }),
)

export const ReferenceApi = Schema.Struct({
  personal: Schema.Struct({
    first_name: Name,
    last_name: Name,
    current_address: Address,
  }),
  employer: Schema.Array(
    Schema.Struct({
      name: Name,
      start_date: ApiDate,
      end_date: ApiDate,
    }).pipe(
      // `YYYYMMDD` sorts lexicographically, so a string compare is chronological.
      Schema.filter((employer) =>
        employer.start_date < employer.end_date
          ? undefined
          : {
              path: ['end_date'],
              message: 'end_date must be after start_date',
            },
      ),
    ),
  ).pipe(Schema.minItems(1)),
  guarantor: Schema.Struct({
    name: Name,
    address: Address,
    relation: Schema.Literal(...relationshipOptions),
  }),
})

export type Reference = Schema.Schema.Type<typeof ReferenceApi>
