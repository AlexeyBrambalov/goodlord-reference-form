import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: readonly string[]
  error?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, options, error, id, className, ...props }, ref) {
    const selectId = id ?? props.name

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-sm text-slate-700">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={[
            'w-full max-w-xs rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition',
            'focus:ring-2 focus:ring-slate-200',
            error ? 'border-red-400' : 'border-slate-400 focus:border-slate-500',
            className ?? '',
          ].join(' ')}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)
