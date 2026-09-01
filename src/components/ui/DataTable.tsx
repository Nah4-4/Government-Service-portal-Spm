import React from 'react';

/**
 * Table chrome shared by the officer queue, the three admin tables and the
 * two charter tables. Keeps cell padding, header treatment and row dividers
 * from drifting apart across six call sites.
 */
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div className="overflow-x-auto">
    <table className={`w-full text-left text-sm ${className}`} {...rest}>
      {children}
    </table>
  </div>
);

export const THead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <thead
    className={`border-b border-slate-200 bg-slate-50/80 ${className}`}
    {...rest}
  >
    {children}
  </thead>
);

export const TBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <tbody className={`divide-y divide-slate-100 ${className}`} {...rest}>
    {children}
  </tbody>
);

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right';
}

export const Th: React.FC<ThProps> = ({
  align = 'left',
  className = '',
  children,
  ...rest
}) => (
  <th
    scope="col"
    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
      align === 'right' ? 'text-right' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </th>
);

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right';
}

export const Td: React.FC<TdProps> = ({
  align = 'left',
  className = '',
  children,
  ...rest
}) => (
  <td
    className={`px-5 py-4 align-middle text-slate-700 ${
      align === 'right' ? 'text-right' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </td>
);

export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <tr className={`transition-colors hover:bg-navy-50/40 ${className}`} {...rest}>
    {children}
  </tr>
);

/** Full-width message row for an empty result set. */
export const TableEmpty: React.FC<{ colSpan: number; children: React.ReactNode }> = ({
  colSpan,
  children,
}) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-14 text-center text-sm text-slate-500">
      {children}
    </td>
  </tr>
);
