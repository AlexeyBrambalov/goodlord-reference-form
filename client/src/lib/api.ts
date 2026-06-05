import axios from 'axios'
import type { ReferenceFormValues, Relationship } from './schema'

const baseURL = import.meta.env?.VITE_API_URL ?? 'https://ref-api.goodlord.co'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

/** Wire format expected by POST /reference/new. */
export interface ReferencePayload {
  personal: {
    first_name: string
    last_name: string
    current_address: string
  }
  employer: Array<{
    name: string
    start_date: string
    end_date: string
  }>
  guarantor: {
    name: string
    address: string
    relation: Relationship
  }
}

export interface CreateReferenceResponse {
  ok: boolean
  id?: string
}

/** `2018-03-01` (from <input type="date">) -> `20180301` (API format). */
const toApiDate = (isoDate: string): string => isoDate.replace(/-/g, '')

export function toReferencePayload(form: ReferenceFormValues): ReferencePayload {
  return {
    personal: form.personal,
    employer: [
      {
        name: form.employer.name,
        start_date: toApiDate(form.employer.start_date),
        end_date: toApiDate(form.employer.end_date),
      },
    ],
    guarantor: form.guarantor,
  }
}

export async function createReference(
  form: ReferenceFormValues,
): Promise<CreateReferenceResponse> {
  const response = await apiClient.post<CreateReferenceResponse>(
    '/reference/new',
    toReferencePayload(form),
  )
  return response.data
}
