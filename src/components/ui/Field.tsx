import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

/** Shared control chrome, so inputs/selects/textareas can never drift apart. */
const CONTROL_BASE =
  'w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 disabled:bg-slate-50 disabled:text-slate-500';
const CONTROL_OK =
  'border-slate-300 hover:border-slate-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20';
const CONTROL_BAD =
  'border-rejected-border bg-rejected-chip/40 focus:border-rejected-dot focus:outline-none focus:ring-2 focus:ring-rejected-dot/20';

function controlClass(invalid: boolean, mono: boolean, extra: string) {
  return `${CONTROL_BASE} ${invalid ? CONTROL_BAD : CONTROL_OK} ${
    mono ? 'font-mono numeric' : ''
  } ${extra}`;
}

interface FieldProps {
  label: string;
  /** Marks the label and sets `required` on the control. */
  required?: boolean;
  /** Helper text below the control; hidden while an error is showing. */
  hint?: string;
  error?: string;
  className?: string;
  /** Receives the generated id, aria-invalid and aria-describedby. */
  children: (props: {
    id: string;
    invalid: boolean;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    required: boolean;
  }) => React.ReactNode;
}

/**
 * Label + control + hint/error, correctly wired for screen readers.
 * Replaces ~25 copies of the same six-class input string in ApplicantView,
 * none of which associated their label with the control.
 */
export const Field: React.FC<FieldProps> = ({
  label,
  required = false,
  hint,
  error,
  className = '',
  children,
}) => {
  const id = useId();
  const messageId = `${id}-message`;
  const invalid = Boolean(error);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-rejected-dot" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({
        id,
        invalid,
        'aria-invalid': invalid,
        'aria-describedby': error || hint ? messageId : undefined,
        required,
      })}

      {error ? (
        <p
          id={messageId}
          className="mt-1.5 flex items-center gap-1 text-sm font-medium text-rejected-text"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mono?: boolean;
}

export const Input: React.FC<InputProps> = ({
  invalid = false,
  mono = false,
  className = '',
  ...rest
}) => <input className={controlClass(invalid, mono, `h-10 ${className}`)} {...rest} />;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  invalid = false,
  className = '',
  children,
  ...rest
}) => (
  <select
    className={controlClass(invalid, false, `h-10 cursor-pointer pr-8 ${className}`)}
    {...rest}
  >
    {children}
  </select>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  invalid = false,
  className = '',
  ...rest
}) => (
  <textarea
    className={controlClass(invalid, false, `resize-y py-2.5 leading-relaxed ${className}`)}
    {...rest}
  />
);

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  error,
  className = '',
  ...rest
}) => {
  const id = useId();

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-400 text-navy-700 accent-navy-700"
          {...rest}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-slate-700">
          {children}
        </label>
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-rejected-text">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

/** Search box with a leading icon, used by the officer queue toolbar. */
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  icon,
  className = '',
  ...rest
}) => (
  <div className={`relative ${className}`}>
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input type="search" className={controlClass(false, false, 'h-10 pl-9')} {...rest} />
  </div>
);
