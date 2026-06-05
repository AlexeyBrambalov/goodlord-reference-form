import { act, renderHook } from '@testing-library/react'
import { useReferenceForm } from './useReferenceForm'

jest.mock('../lib/api', () => ({ createReference: jest.fn() }))

describe('useReferenceForm', () => {
  it('starts idle and not submitting', () => {
    const { result } = renderHook(() => useReferenceForm())

    expect(result.current.status).toEqual({ state: 'idle' })
    expect(result.current.isSubmitting).toBe(false)
    expect(typeof result.current.onSubmit).toBe('function')
    expect(typeof result.current.onCancel).toBe('function')
  })

  it('keeps the status idle after cancelling', () => {
    const { result } = renderHook(() => useReferenceForm())

    act(() => result.current.onCancel())

    expect(result.current.status).toEqual({ state: 'idle' })
  })
})
