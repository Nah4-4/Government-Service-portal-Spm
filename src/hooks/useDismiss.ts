import { useEffect, RefObject } from 'react';

/** Calls `handler` when Escape is pressed, while `active` is true. */
export function useOnEscape(active: boolean, handler: () => void) {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        handler();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, handler]);
}

/**
 * Calls `handler` on a pointer press outside `ref`, while `active` is true.
 * Uses pointerdown so a menu closes before the click lands elsewhere.
 */
export function useClickOutside(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    if (!active) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [active, ref, handler]);
}

/** Prevents the page behind an overlay from scrolling while it is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/**
 * Typed as `string` rather than left as a literal so TypeScript resolves the
 * general `querySelectorAll<E>` overload instead of the tag-name-map one.
 */
const FOCUSABLE: string =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Moves focus into `ref` when it opens and restores it to whatever was
 * focused beforehand on close.
 */
export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;

    // Prefer the first genuinely interactive element, else the dialog itself.
    const focusable = node?.querySelector<HTMLElement>(FOCUSABLE);
    (focusable ?? node)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !node) return;

      // Visible, focusable children in document order.
      const items: HTMLElement[] = [];
      node.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((el) => {
        if (el.offsetParent !== null) items.push(el);
      });

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus({ preventScroll: true });
    };
  }, [active, ref]);
}

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
