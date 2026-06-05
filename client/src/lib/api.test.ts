import { toReferencePayload } from './api'
import type { ReferenceFormValues } from './schema'

const form: ReferenceFormValues = {
  personal: {
    first_name: 'First name',
    last_name: 'Last name',
    current_address: 'Address 1, Address 2',
  },
  employer: {
    name: 'Employer',
    start_date: '2018-03-01',
    end_date: '2019-08-15',
  },
  guarantor: {
    name: 'Guarantor',
    address: 'Address1, Address2',
    relation: 'Parent',
  },
}

describe('toReferencePayload', () => {
  it('wraps the single employer into an array', () => {
    const payload = toReferencePayload(form)
    expect(Array.isArray(payload.employer)).toBe(true)
    expect(payload.employer).toHaveLength(1)
    expect(payload.employer[0]?.name).toBe('Employer')
  })

  it('reformats dates from YYYY-MM-DD to YYYYMMDD', () => {
    const payload = toReferencePayload(form)
    expect(payload.employer[0]?.start_date).toBe('20180301')
    expect(payload.employer[0]?.end_date).toBe('20190815')
  })

  it('passes personal and guarantor details through unchanged', () => {
    const payload = toReferencePayload(form)
    expect(payload.personal).toEqual(form.personal)
    expect(payload.guarantor).toEqual(form.guarantor)
  })
})
