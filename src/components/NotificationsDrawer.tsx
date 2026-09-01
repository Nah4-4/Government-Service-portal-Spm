import React, { useState } from 'react';
import { Mail, Smartphone, Bell, CheckCheck, Trash2, ShieldCheck } from 'lucide-react';
import { SystemNotification } from '../types';
import { Modal } from './ui/Modal';
import { IconButton } from './ui/Button';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

type Filter = 'ALL' | 'EMAIL' | 'SMS';

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<Filter>('ALL');

  const emailCount = notifications.filter((n) => n.type === 'EMAIL').length;
  const smsCount = notifications.filter((n) => n.type === 'SMS').length;

  const visible = notifications.filter((n) => filter === 'ALL' || n.type === filter);

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: notifications.length },
    { id: 'EMAIL', label: 'Email', count: emailCount },
    { id: 'SMS', label: 'SMS', count: smsCount },
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      side="right"
      title="Notifications"
      subtitle="Automated email and SMS dispatch log"
      flushBody
      headerActions={
        <>
          <IconButton label="Mark all as read" onClick={onMarkAllAsRead}>
            <CheckCheck className="h-4 w-4" />
          </IconButton>
          <IconButton label="Clear all notifications" onClick={onClearAll}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </>
      }
    >
      {/* Channel filter */}
      <div
        className="sticky top-0 z-10 flex items-center gap-1.5 border-b border-slate-200 bg-white px-6 py-3"
        role="group"
        aria-label="Filter by channel"
      >
        {FILTERS.map(({ id, label, count }) => {
          const isActive = filter === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(id)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'border-navy-700 bg-navy-700 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {id === 'EMAIL' && <Mail className="h-3.5 w-3.5" aria-hidden="true" />}
              {id === 'SMS' && <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />}
              {label}
              <span className="numeric opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3 bg-canvas px-6 py-5">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-6 w-6" />}
            title="Nothing here"
            description={
              filter === 'ALL'
                ? 'Alerts appear here as applications move through review.'
                : `No ${filter.toLowerCase()} alerts have been dispatched.`
            }
            className="border-slate-200 bg-white"
          />
        ) : (
          visible.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border bg-white p-4 shadow-card ${
                notification.isRead
                  ? 'border-slate-200'
                  : 'border-slate-200 border-l-4 border-l-navy-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Channel is conveyed by icon + text, not colour alone */}
                  <Badge
                    tone={notification.type === 'EMAIL' ? 'navy' : 'review'}
                    shape="tag"
                    icon={
                      notification.type === 'EMAIL' ? (
                        <Mail className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Smartphone className="h-3 w-3" aria-hidden="true" />
                      )
                    }
                  >
                    {notification.type}
                  </Badge>
                  <Badge tone="neutral" shape="tag" mono>
                    {notification.relatedRef}
                  </Badge>
                </div>

                <time className="numeric text-xs text-slate-500">
                  {notification.timestamp}
                </time>
              </div>

              <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-900">
                {notification.title}
                {!notification.isRead && <span className="sr-only"> (unread)</span>}
              </h3>

              <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                {notification.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-500">
                  To{' '}
                  {notification.type === 'EMAIL'
                    ? notification.recipientEmail
                    : notification.recipientPhone}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-semibold text-approved-text">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Delivered
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </Modal>
  );
};
