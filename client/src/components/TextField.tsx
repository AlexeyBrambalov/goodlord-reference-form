import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, className, ...props }, ref) {
    const inputId = id ?? props.name

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={[
            'rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition',
            'focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-400 focus:ring-red-300'
              : 'border-slate-400 focus:border-slate-500 focus:ring-slate-200',
            className ?? '',
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)
