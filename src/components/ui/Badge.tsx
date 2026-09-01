import React from 'react';

export type BadgeTone =
  | 'neutral'
  | 'navy'
  | 'gold'
  | 'approved'
  | 'review'
  | 'rejected';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 border-slate-200 text-slate-700',
  navy: 'bg-navy-50 border-navy-200 text-navy-800',
  gold: 'bg-gold-100 border-gold-300 text-gold-700',
  approved: 'bg-approved-chip border-approved-border text-approved-text',
  review: 'bg-review-chip border-review-border text-review-text',
  rejected: 'bg-rejected-chip border-rejected-border text-rejected-text',
};

interface BadgeProps {
  tone?: BadgeTone;
  /** `pill` for status, `tag` for square-ish metadata like reference numbers. */
  shape?: 'pill' | 'tag';
  icon?: React.ReactNode;
  mono?: boolean;
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  shape = 'pill',
  icon,
  mono = false,
  uppercase = false,
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold ${
      shape === 'pill' ? 'rounded-full' : 'rounded-md'
    } ${TONES[tone]} ${mono ? 'font-mono tracking-tight' : ''} ${
      uppercase ? 'uppercase tracking-wider' : ''
    } ${className}`}
  >
    {icon}
    {children}
  </span>
);

/** Small all-caps label used above a value or a section title. */
export const Eyebrow: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <span
    className={`block text-xs font-semibold uppercase tracking-wider text-slate-500 ${className}`}
  >
    {children}
  </span>
);

interface DataPointProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}

/** Label-over-value pair, the app's most repeated micro-layout. */
export const DataPoint: React.FC<DataPointProps> = ({
  label,
  value,
  mono = false,
  className = '',
}) => (
  <div className={`min-w-0 ${className}`}>
    <Eyebrow>{label}</Eyebrow>
    <div
      className={`mt-1 truncate text-sm font-medium text-slate-900 ${
        mono ? 'font-mono numeric' : ''
      }`}
    >
      {value}
    </div>
  </div>
);
