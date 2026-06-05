import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

const validPayload = {
  personal: {
    first_name: 'First name',
    last_name: 'Last name',
    current_address: 'Address 1, Address 2',
  },
  employer: [{ name: 'Employer', start_date: '20180301', end_date: '20190815' }],
  guarantor: { name: 'Guarantor', address: 'Address', relation: 'Parent' },
}

describe('POST /reference/new', () => {
  // Silence the route's request logging during tests.
  let logSpy: jest.SpyInstance

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterAll(() => {
    logSpy.mockRestore()
  })

  it('accepts a valid payload with 201', async () => {
    const res = await request(app).post('/reference/new').send(validPayload)
    expect(res.status).toBe(201)
    expect(res.body).toEqual({ ok: true })
  })

  it('rejects an invalid payload with 400 and issues', async () => {
    const res = await request(app)
      .post('/reference/new')
      .send({ ...validPayload, employer: [] })

    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
    expect(Array.isArray(res.body.issues)).toBe(true)
    expect(res.body.issues.length).toBeGreaterThan(0)
  })

  it('rejects a malformed date with 400', async () => {
    const res = await request(app)
      .post('/reference/new')
      .send({
        ...validPayload,
        employer: [
          { name: 'E', start_date: '2018-03-01', end_date: '20190815' },
        ],
      })
    expect(res.status).toBe(400)
  })
})

describe('app routing', () => {
  it('responds to the health check', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist')
    expect(res.status).toBe(404)
  })
})
