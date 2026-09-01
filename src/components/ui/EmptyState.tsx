import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  /** Primary call to action. */
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center ${className}`}
  >
    <span
      className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400"
      aria-hidden="true"
    >
      {icon}
    </span>
    <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{title}</h3>
    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
