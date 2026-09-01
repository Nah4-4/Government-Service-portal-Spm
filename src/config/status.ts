import { ApplicationStatus } from '../types';

export interface StatusMeta {
  /** Human label as shown to citizens and officers. */
  label: string;
  /** Chip background + border + text, for badges. */
  chip: string;
  /** Solid dot colour, for timelines and list markers. */
  dot: string;
  /** Text colour on a white surface. */
  text: string;
  /** Short description of what this state means for the applicant. */
  hint: string;
}

/**
 * Single source of truth for status presentation. Before this map the same
 * four-branch colour ternary was written out separately in ApplicantView,
 * OfficerDashboard and AdminPanel.
 */
export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  Submitted: {
    label: 'Submitted',
    chip: 'bg-submitted-chip border-submitted-border text-submitted-text',
    dot: 'bg-submitted-dot',
    text: 'text-submitted-text',
    hint: 'Received and queued for an officer',
  },
  'Under Review': {
    label: 'Under review',
    chip: 'bg-review-chip border-review-border text-review-text',
    dot: 'bg-review-dot',
    text: 'text-review-text',
    hint: 'An officer is verifying your business records',
  },
  Approved: {
    label: 'Approved',
    chip: 'bg-approved-chip border-approved-border text-approved-text',
    dot: 'bg-approved-dot',
    text: 'text-approved-text',
    hint: 'Licence issued and ready to download',
  },
  Rejected: {
    label: 'Rejected',
    chip: 'bg-rejected-chip border-rejected-border text-rejected-text',
    dot: 'bg-rejected-dot',
    text: 'text-rejected-text',
    hint: 'Not approved — see the officer remarks',
  },
};

/** Order used by filter pills and status-distribution bars. */
export const STATUS_ORDER: ApplicationStatus[] = [
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
];
