import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `plain` drops the border for nested/inset panels. */
  tone?: 'default' | 'inset' | 'navy';
}

const TONES = {
  default: 'bg-white border border-slate-200 shadow-card',
  inset: 'bg-slate-50/70 border border-slate-200',
  navy: 'bg-navy-800 border border-navy-700 text-white',
};

/**
 * The app's one card surface. Replaces ~40 repetitions of
 * `bg-white border border-slate-200 rounded-xl shadow-xs`.
 */
export const Card: React.FC<CardProps> = ({
  tone = 'default',
  className = '',
  children,
  ...rest
}) => (
  <div className={`rounded-xl ${TONES[tone]} ${className}`} {...rest}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  icon?: React.ReactNode;
  /** Small line underneath the title. */
  hint?: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  icon,
  hint,
  as: Tag = 'h3',
  className = '',
  children,
  ...rest
}) => (
  <div className="min-w-0">
    <Tag
      className={`flex items-center gap-2 text-[15px] font-semibold text-slate-900 ${className}`}
      {...rest}
    >
      {icon}
      <span className="truncate">{children}</span>
    </Tag>
    {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className={`px-6 py-5 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

interface SectionHeadingProps {
  title: string;
  hint?: string;
  /** Right-aligned controls. */
  actions?: React.ReactNode;
}

/** Standalone heading above a group of cards. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  hint,
  actions,
}) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
    {actions}
  </div>
);
