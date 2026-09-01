import {
  LayoutDashboard,
  FileText,
  Inbox,
  BadgeCheck,
  CalendarRange,
  Coins,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '../types';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Shown as the page subtitle in the top bar. */
  description: string;
}

/**
 * Sidebar sections per role. The admin entries deliberately mirror the
 * activeTab values that used to live inside AdminPanel, so its internal tab
 * bar could be deleted and driven from the shell instead.
 */
export const NAV_SECTIONS: Record<UserRole, NavItem[]> = {
  applicant: [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Your licence status at a glance',
    },
    {
      id: 'applications',
      label: 'My applications',
      icon: FileText,
      description: 'Every application you have filed, with live progress',
    },
  ],
  officer: [
    {
      id: 'queue',
      label: 'Review queue',
      icon: Inbox,
      description: 'Verify business records and decide on incoming applications',
    },
    {
      id: 'issued',
      label: 'Issued licences',
      icon: BadgeCheck,
      description: 'Trading licences you have approved and sealed',
    },
  ],
  admin: [
    {
      id: 'metrics',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Throughput, approval rate and the full application register',
    },
    // {
    //   id: 'spmWaterfall',
    //   label: 'Waterfall schedule',
    //   icon: CalendarRange,
    //   description: 'Five-week predictive SDLC phases and sign-offs',
    // },
    // {
    //   id: 'budget',
    //   label: 'Budget',
    //   icon: Coins,
    //   description: 'Planned against actual expenditure, 45,100 Birr',
    // },
    {
      id: 'users',
      label: 'Users & access',
      icon: Users,
      description: 'Accounts, roles and directorate badges',
    },
  ],
};

export const DEFAULT_SECTION: Record<UserRole, string> = {
  applicant: 'overview',
  officer: 'queue',
  admin: 'metrics',
};

export const ROLE_LABEL: Record<UserRole, string> = {
  applicant: 'Citizen applicant',
  officer: 'Review officer',
  admin: 'Administrator',
};

export function findNavItem(role: UserRole, id: string): NavItem {
  const items = NAV_SECTIONS[role];
  return items.find((item) => item.id === id) ?? items[0];
}
