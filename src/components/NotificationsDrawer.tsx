import React, { useState } from 'react';
import { SystemNotification } from '../types';
import { X, Mail, Smartphone, Bell, CheckCheck, Trash2, Clock, ShieldCheck } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'EMAIL' | 'SMS'>('ALL');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'EMAIL') return n.type === 'EMAIL';
    if (filter === 'SMS') return n.type === 'SMS';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-xl text-slate-800 animate-slide-in-right">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Notification Center</h3>
              <p className="text-[11px] text-slate-500">Automated SMS & Email Dispatcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Actions */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('EMAIL')}
              className={`px-2.5 py-1 rounded-md transition font-medium flex items-center space-x-1 cursor-pointer ${
                filter === 'EMAIL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setFilter('SMS')}
              className={`px-2.5 py-1 rounded-md transition font-medium flex items-center space-x-1 cursor-pointer ${
                filter === 'SMS'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>SMS</span>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onMarkAllAsRead}
              title="Mark all as read"
              className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              title="Clear all alerts"
              className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-50" />
              No notifications found for this filter.
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition ${
                  notif.isRead
                    ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
                    : 'bg-white border-blue-300 shadow-xs text-slate-900 ring-1 ring-blue-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase flex items-center space-x-1 ${
                        notif.type === 'EMAIL'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {notif.type === 'EMAIL' ? <Mail className="w-2.5 h-2.5" /> : <Smartphone className="w-2.5 h-2.5" />}
                      <span>{notif.type}</span>
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-bold">
                      {notif.relatedRef}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{notif.timestamp}</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {notif.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans">
                  {notif.message}
                </p>

                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>To: {notif.type === 'EMAIL' ? notif.recipientEmail : notif.recipientPhone}</span>
                  <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          Automated multi-channel applicant dispatch engine
        </div>

      </div>
    </div>
  );
};
