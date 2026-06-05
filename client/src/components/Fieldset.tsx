import type { ReactNode } from 'react'

interface FieldsetProps {
  legend: string
  children: ReactNode
}

export function Fieldset({ legend, children }: FieldsetProps) {
  return (
    <fieldset className="rounded-md border border-slate-400 px-4 pb-5 pt-2">
      <legend className="px-1 text-sm font-medium text-slate-700">
        {legend}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}
