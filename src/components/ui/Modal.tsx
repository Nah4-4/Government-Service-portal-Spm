import React, { useCallback, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap, useOnEscape, useScrollLock } from '../../hooks/useDismiss';
import { IconButton } from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Small all-caps line above the title. */
  eyebrow?: React.ReactNode;
  /** Line below the title. */
  subtitle?: React.ReactNode;
  /** Extra controls in the header, left of the close button. */
  headerActions?: React.ReactNode;
  /** Sticky footer content. */
  footer?: React.ReactNode;
  size?: ModalSize;
  /** `center` for dialogs, `right` for the notifications drawer. */
  side?: 'center' | 'right';
  /** Removes the default padding when the body draws its own surface. */
  flushBody?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Every overlay in the app. Supplies the conventions none of the four
 * hand-rolled overlays previously had: Escape to close, backdrop click to
 * close, role="dialog" + aria-modal + aria-labelledby, a locked background,
 * and focus moved in on open and restored to the trigger on close.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  eyebrow,
  subtitle,
  headerActions,
  footer,
  size = 'md',
  side = 'center',
  flushBody = false,
  className = '',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = useCallback(() => onClose(), [onClose]);

  useOnEscape(open, close);
  useScrollLock(open);
  useFocusTrap(open, panelRef);

  if (!open) return null;

  const isDrawer = side === 'right';

  return (
    <div
      data-overlay
      className={`fixed inset-0 z-50 flex animate-fade-in bg-navy-950/45 backdrop-blur-[2px] ${
        isDrawer ? 'justify-end' : 'items-center justify-center overflow-y-auto p-3 sm:p-6'
      }`}
      // Backdrop press closes. The panel stops propagation so presses inside
      // it never reach here.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={`flex flex-col bg-white shadow-overlay outline-none ${
          isDrawer
            ? 'h-full w-full max-w-md animate-slide-in-right border-l border-slate-200'
            : `max-h-[92vh] w-full animate-slide-up rounded-2xl border border-slate-200 ${SIZES[size]}`
        } ${className}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-1 flex flex-wrap items-center gap-2">{eyebrow}</div>
            )}
            <h2
              id={titleId}
              className="truncate text-lg font-semibold tracking-tight text-slate-900"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            <IconButton label="Close" onClick={close}>
              <X className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {/* Body */}
        <div className={`min-h-0 flex-1 overflow-y-auto ${flushBody ? '' : 'px-6 py-6'}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
