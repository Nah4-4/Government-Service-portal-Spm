import React from 'react';
import { Eyebrow } from './Badge';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Small line under the figure. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  /** Tints the figure. `default` keeps it near-black, which suits most cards. */
  tone?: 'default' | 'approved' | 'review' | 'rejected' | 'navy';
  className?: string;
}

const VALUE_TONES = {
  default: 'text-slate-900',
  approved: 'text-approved-text',
  review: 'text-review-text',
  rejected: 'text-rejected-text',
  navy: 'text-navy-700',
};

const ICON_TONES = {
  default: 'bg-slate-100 text-slate-500',
  approved: 'bg-approved-chip text-approved-dot',
  review: 'bg-review-chip text-review-dot',
  rejected: 'bg-rejected-chip text-rejected-dot',
  navy: 'bg-navy-50 text-navy-600',
};

/** Metric tile. Replaces the eight bespoke stat blocks across the dashboards. */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  icon,
  tone = 'default',
  className = '',
}) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white p-5 shadow-card ${className}`}
  >
    <div className="flex items-start justify-between gap-3">
      <Eyebrow>{label}</Eyebrow>
      {icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ICON_TONES[tone]}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </div>

    <div
      className={`numeric mt-3 text-[32px] font-semibold leading-none ${VALUE_TONES[tone]}`}
    >
      {value}
    </div>

    {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
  </div>
);

interface MeterProps {
  label: string;
  value: number;
  max: number;
  /** Right-aligned readout; defaults to `value`. */
  readout?: React.ReactNode;
  tone?: 'navy' | 'approved' | 'review' | 'rejected';
}

const BAR_TONES = {
  navy: 'bg-navy-600',
  approved: 'bg-approved-dot',
  review: 'bg-review-dot',
  rejected: 'bg-rejected-dot',
};

/**
 * Horizontal proportion bar, used for status distribution and
 * planned-vs-actual budget. Deliberately plain — no chart library.
 */
export const Meter: React.FC<MeterProps> = ({
  label,
  value,
  max,
  readout,
  tone = 'navy',
}) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="numeric font-semibold text-slate-900">{readout ?? value}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={`${label}: ${value} of ${max}`}
      >
        <div
          className={`h-full origin-left animate-grow-bar rounded-full ${BAR_TONES[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
