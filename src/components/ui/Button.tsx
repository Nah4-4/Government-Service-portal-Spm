import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-navy-700 text-white border border-navy-700 hover:bg-navy-800 hover:border-navy-800 active:bg-navy-900 shadow-card',
  secondary:
    'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-card',
  ghost:
    'bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-white text-rejected-text border border-rejected-border hover:bg-rejected-chip active:bg-rejected-chip shadow-card',
  success:
    'bg-approved-dot text-white border border-approved-dot hover:brightness-95 active:brightness-90 shadow-card',
  quiet:
    'bg-navy-50 text-navy-800 border border-navy-100 hover:bg-navy-100 hover:border-navy-200',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders before the label. */
  icon?: React.ReactNode;
  /** Renders after the label. */
  trailingIcon?: React.ReactNode;
  /** Stretches to the container width. */
  block?: boolean;
}

/**
 * The single button surface for the app. Replaces roughly thirty hand-rolled
 * class strings that each re-derived padding, radius and hover state.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      trailingIcon,
      block = false,
      className = '',
      type = 'button',
      children,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
      {trailingIcon}
    </button>
  )
);

Button.displayName = 'Button';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — this button has no visible text. */
  label: string;
  variant?: Extract<ButtonVariant, 'secondary' | 'ghost'>;
}

/** Square icon-only button. `label` becomes both the tooltip and the a11y name. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, variant = 'ghost', className = '', children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
);

IconButton.displayName = 'IconButton';
