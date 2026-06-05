import { Either, Schema } from 'effect'
import { ReferenceForm } from './schema'

const decode = Schema.decodeUnknownEither(ReferenceForm)

const validForm = {
  personal: {
    first_name: 'First name',
    last_name: 'Last name',
    current_address: 'Address',
  },
  employer: { name: 'Employer', start_date: '2018-03-01', end_date: '2019-08-15' },
  guarantor: { name: 'Guarantor', address: 'Address', relation: 'Parent' },
}

describe('ReferenceForm schema', () => {
  it('accepts a fully populated, valid form', () => {
    expect(Either.isRight(decode(validForm))).toBe(true)
  })

  it('rejects an empty required field', () => {
    const result = decode({
      ...validForm,
      personal: { ...validForm.personal, first_name: '' },
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects an unknown guarantor relation', () => {
    const result = decode({
      ...validForm,
      guarantor: { ...validForm.guarantor, relation: 'Cousin' },
    })
    expect(Either.isLeft(result)).toBe(true)
  })
})
