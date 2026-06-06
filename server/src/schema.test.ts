import { Either, Schema } from 'effect'
import { ReferenceApi } from './schema'

const decode = Schema.decodeUnknownEither(ReferenceApi)

const validPayload = {
  personal: {
    first_name: 'First name',
    last_name: 'Last name',
    current_address: 'Address 1, Address 2',
  },
  employer: [
    { name: 'Employer', start_date: '20180301', end_date: '20190815' },
    { name: 'Employer', start_date: '20180901', end_date: '20190131' },
  ],
  guarantor: { name: 'Guarantor', address: 'Address', relation: 'Parent' },
}

describe('ReferenceApi schema', () => {
  it('accepts the documented payload shape', () => {
    expect(Either.isRight(decode(validPayload))).toBe(true)
  })

  it('rejects dates that are not YYYYMMDD', () => {
    const result = decode({
      ...validPayload,
      employer: [{ name: 'E', start_date: '2018-03-01', end_date: '20190815' }],
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects an empty employer array', () => {
    const result = decode({ ...validPayload, employer: [] })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects an unknown guarantor relation', () => {
    const result = decode({
      ...validPayload,
      guarantor: { ...validPayload.guarantor, relation: 'Cousin' },
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects text longer than its max length', () => {
    const result = decode({
      ...validPayload,
      personal: { ...validPayload.personal, first_name: 'a'.repeat(101) },
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects a date earlier than 1970', () => {
    const result = decode({
      ...validPayload,
      employer: [{ name: 'E', start_date: '19691231', end_date: '20190815' }],
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects a date later than 2100', () => {
    const result = decode({
      ...validPayload,
      employer: [{ name: 'E', start_date: '20180301', end_date: '21010101' }],
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects an end date earlier than the start date', () => {
    const result = decode({
      ...validPayload,
      employer: [{ name: 'E', start_date: '20190815', end_date: '20180301' }],
    })
    expect(Either.isLeft(result)).toBe(true)
  })

  it('rejects an end date equal to the start date', () => {
    const result = decode({
      ...validPayload,
      employer: [{ name: 'E', start_date: '20180301', end_date: '20180301' }],
    })
    expect(Either.isLeft(result)).toBe(true)
  })
})
