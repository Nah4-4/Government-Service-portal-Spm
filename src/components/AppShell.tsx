import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Menu,
  X,
  ChevronsUpDown,
  GraduationCap,
  Check,
  UserCircle,
  Briefcase,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { NAV_SECTIONS, ROLE_LABEL, findNavItem } from '../config/navigation';
import { useClickOutside, useOnEscape } from '../hooks/useDismiss';
import { Button, IconButton } from './ui/Button';

const ROLE_ICON: Record<UserRole, LucideIcon> = {
  applicant: UserCircle,
  officer: Briefcase,
  admin: Building2,
};

interface AppShellProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  activeSection: string;
  onSelectSection: (id: string) => void;
  onOpenCharter: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  /** Pinned call to action above the nav list, e.g. "New application". */
  primaryAction?: { label: string; icon: React.ReactNode; onClick: () => void };
  children: React.ReactNode;
}

/**
 * Sidebar + top bar application frame. Replaces the old Header, which stacked
 * a role-switcher dropdown on top of a second row of role tabs — the same
 * action offered twice, with the dropdown reachable only by pointer.
 */
export const AppShell: React.FC<AppShellProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeSection,
  onSelectSection,
  onOpenCharter,
  onOpenNotifications,
  unreadCount,
  primaryAction,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const active = findNavItem(currentUser.role, activeSection);

  // Close the mobile drawer whenever the destination changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeSection, currentUser.id]);

  useOnEscape(mobileNavOpen, () => setMobileNavOpen(false));

  const sidebar = (
    <SidebarContent
      currentUser={currentUser}
      allUsers={allUsers}
      onSelectUser={onSelectUser}
      activeSection={activeSection}
      onSelectSection={onSelectSection}
      onOpenCharter={onOpenCharter}
      primaryAction={primaryAction}
    />
  );

  return (
    <div className="min-h-screen">
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in bg-navy-950/45 backdrop-blur-[2px] lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMobileNavOpen(false);
          }}
        >
          <div
            className="flex h-full w-72 animate-slide-in-right flex-col border-r border-slate-200 bg-white shadow-overlay"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-end px-3 pt-3">
              <IconButton label="Close navigation" onClick={() => setMobileNavOpen(false)}>
                <X className="h-5 w-5" />
              </IconButton>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      {/* Content column */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <IconButton
              label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </IconButton>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[15px] font-semibold text-slate-900">
                {active.label}
              </h1>
              <p className="hidden truncate text-sm text-slate-500 sm:block">
                {active.description}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-card transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <Bell className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadCount > 0 && (
                <span className="numeric inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-navy-700 px-1.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : 'No unread notifications'}
              </span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
              Federal Democratic Republic of Ethiopia · Trade Registration &amp; Business Licensing
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */

type SidebarProps = Pick<
  AppShellProps,
  | 'currentUser'
  | 'allUsers'
  | 'onSelectUser'
  | 'activeSection'
  | 'onSelectSection'
  | 'onOpenCharter'
  | 'primaryAction'
>;

const SidebarContent: React.FC<SidebarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeSection,
  onSelectSection,
  onOpenCharter,
  primaryAction,
}) => (
  <>
    {/* Brand */}
    <div className="flex items-center gap-3 px-5 py-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          FDRE · Trade &amp; Regional Integration
        </span>
        <span className="block truncate text-[15px] font-semibold leading-tight text-slate-900">
          Trading Licence Portal
        </span>
      </span>
    </div>

    {primaryAction && (
      <div className="px-4 pb-4">
        <Button
          variant="primary"
          block
          icon={primaryAction.icon}
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </Button>
      </div>
    )}

    {/* Sections */}
    <nav aria-label="Sections" className="min-h-0 flex-1 overflow-y-auto px-3">
      <ul className="space-y-1">
        {NAV_SECTIONS[currentUser.role].map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeSection;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-navy-50 font-semibold text-navy-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-navy-700' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>

    {/* Footer — SPM charter kept reachable but visually quiet */}
    <div className="shrink-0 border-t border-slate-200 p-3">
      {/* <button
        type="button"
        onClick={onOpenCharter}
        className="mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
      >
        <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        Project charter
      </button> */}

      <AccountSwitcher
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={onSelectUser}
      />
    </div>
  </>
);

/* -------------------------------------------------------------------------- */

interface AccountSwitcherProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
}

/**
 * A real menu button. The control it replaces was a `div` revealed by
 * `group-hover:block`, so it could not be opened or operated from the
 * keyboard at all.
 */
const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useOnEscape(open, () => {
    setOpen(false);
    triggerRef.current?.focus();
  });
  useClickOutside(open, containerRef, () => setOpen(false));

  // Focus the current account when the menu opens.
  useEffect(() => {
    if (!open) return;
    const index = allUsers.findIndex((u) => u.id === currentUser.id);
    itemRefs.current[index < 0 ? 0 : index]?.focus();
  }, [open, allUsers, currentUser.id]);

  const moveFocus = (from: number, delta: number) => {
    const next = (from + delta + allUsers.length) % allUsers.length;
    itemRefs.current[next]?.focus();
  };

  const CurrentIcon = ROLE_ICON[currentUser.role];

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-slate-50 cursor-pointer"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700"
          aria-hidden="true"
        >
          <CurrentIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900">
            {currentUser.name}
          </span>
          <span className="block truncate text-xs text-slate-500">
            {ROLE_LABEL[currentUser.role]}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Switch account"
          className="absolute bottom-full left-0 z-40 mb-2 w-full min-w-64 animate-slide-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-overlay"
        >
          <p className="border-b border-slate-100 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Switch demo account
          </p>

          <ul className="py-1">
            {allUsers.map((user, index) => {
              const Icon = ROLE_ICON[user.role];
              const isCurrent = user.id === currentUser.id;

              return (
                <li key={user.id}>
                  <button
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelectUser(user);
                      setOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        moveFocus(index, 1);
                      } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        moveFocus(index, -1);
                      }
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      isCurrent ? 'bg-navy-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isCurrent ? 'text-navy-700' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {ROLE_LABEL[user.role]}
                      </span>
                    </span>
                    {isCurrent && (
                      <Check
                        className="h-4 w-4 shrink-0 text-navy-700"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
