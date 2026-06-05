import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReferenceForm } from './ReferenceForm'
import { SUBMIT_ERROR_MESSAGE } from '../hooks/useReferenceForm'

jest.mock('../lib/api', () => ({ createReference: jest.fn() }))
import { createReference } from '../lib/api'

const mockCreate = createReference as jest.MockedFunction<typeof createReference>

const setField = (label: string | RegExp, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

const fillValidForm = () => {
  setField('First name', 'Ada')
  setField('Last name', 'Lovelace')
  setField('Address', '1 Analytical St')
  setField('Employer name', 'Babbage Ltd')
  setField('Employment start date', '2018-03-01')
  setField('Employment end date', '2019-08-15')
  setField('Guarantor name', 'Mary Somerville')
  setField('Guarantor address', '2 Science Rd')
  // Relationship defaults to "Parent".
}

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

describe('<ReferenceForm />', () => {
  it('submits the collected values and shows a success message', async () => {
    mockCreate.mockResolvedValue({ ok: true })
    render(<ReferenceForm />)

    fillValidForm()
    submit()

    await screen.findByText('Reference submitted successfully.')
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        personal: expect.objectContaining({ first_name: 'Ada' }),
        employer: expect.objectContaining({ start_date: '2018-03-01' }),
        guarantor: expect.objectContaining({ relation: 'Parent' }),
      }),
    )
  })

  it('blocks submission and surfaces validation errors when empty', async () => {
    render(<ReferenceForm />)

    submit()

    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('shows an error message when the request fails', async () => {
    mockCreate.mockRejectedValue(new Error('network'))
    render(<ReferenceForm />)

    fillValidForm()
    submit()

    expect(await screen.findByText(SUBMIT_ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('clears the form when cancelled', async () => {
    render(<ReferenceForm />)

    setField('First name', 'Ada')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() =>
      expect(screen.getByLabelText('First name')).toHaveValue(''),
    )
  })
})
