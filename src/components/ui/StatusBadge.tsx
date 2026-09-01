import React from 'react';
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { ApplicationStatus } from '../../types';
import { STATUS_META } from '../../config/status';

const ICONS: Record<ApplicationStatus, React.ElementType> = {
  Submitted: FileText,
  'Under Review': Clock,
  Approved: CheckCircle2,
  Rejected: XCircle,
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  /** Hide the icon when the badge sits in a dense table cell. */
  showIcon?: boolean;
  className?: string;
}

/**
 * Status presentation, in one place. Previously the same four-branch colour
 * ternary was duplicated in ApplicantView, OfficerDashboard and AdminPanel.
 *
 * Status is never conveyed by colour alone — the icon and label always ride
 * along with it.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const meta = STATUS_META[status];
  const Icon = ICONS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
        meta.chip
      } ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${className}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      {meta.label}
    </span>
  );
};

interface StatusDotProps {
  status: ApplicationStatus;
  /** Gently pulses, for states that are actively in motion. */
  pulse?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, pulse = false }) => (
  <span
    className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_META[status].dot} ${
      pulse ? 'animate-pulse-dot' : ''
    }`}
    aria-hidden="true"
  />
);
