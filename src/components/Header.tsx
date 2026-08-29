import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Bell, GraduationCap, Building2, UserCircle, Briefcase, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenCharter: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenCharter,
  onOpenNotifications,
  unreadCount,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Subtle Royal Blue Accent Strip */}
      <div className="h-0.5 bg-blue-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-700 flex items-center justify-center shadow-xs text-white">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  FDRE • Ministry of Labour & Skills
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase bg-blue-50 text-blue-700 rounded border border-blue-200">
                  SPM Release
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 uppercase">
                Government Service Portal <span className="text-slate-500 font-normal text-xs sm:text-sm capitalize tracking-normal">| Online Work Permit System</span>
              </h1>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* SPM Class Presentation Banner Button */}
            <button
              id="spm-charter-button"
              onClick={onOpenCharter}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
              title="View SPM Project Charter & Waterfall Schedule"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">SPM Project Charter</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-blue-600 text-white rounded-full font-bold">
                SPM
              </span>
            </button>

            {/* Notifications Bell */}
            <button
              id="notifications-toggle-button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
              title="SMS & Email Alerts"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition">
                <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden text-xs font-semibold text-slate-700">
                  {currentUser.role === 'applicant' && <UserCircle className="w-4 h-4 text-blue-600" />}
                  {currentUser.role === 'officer' && <Briefcase className="w-4 h-4 text-slate-700" />}
                  {currentUser.role === 'admin' && <Building2 className="w-4 h-4 text-slate-700" />}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">
                    {currentUser.role === 'applicant' ? 'Citizen Applicant' : currentUser.role === 'officer' ? 'Review Officer' : 'Administrator'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Switch Role Menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 hidden group-hover:block hover:block z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                  Switch Demo Account
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSelectUser(u)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition cursor-pointer ${
                      currentUser.id === u.id
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{u.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {u.role === 'applicant' && 'Citizen Applicant'}
                        {u.role === 'officer' && 'Government Review Officer'}
                        {u.role === 'admin' && 'System Admin (PM Lead)'}
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                      u.role === 'applicant' ? 'bg-blue-100 text-blue-700' :
                      u.role === 'officer' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Secondary Role Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-100 pt-1 pb-2 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectUser(allUsers.find((u) => u.role === 'applicant') || currentUser)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              currentUser.role === 'applicant'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span>Applicant Portal (Citizen)</span>
          </button>

          <button
            onClick={() => onSelectUser(allUsers.find((u) => u.role === 'officer') || currentUser)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              currentUser.role === 'officer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Officer Dashboard (Review & Approvals)</span>
          </button>

          <button
            onClick={() => onSelectUser(allUsers.find((u) => u.role === 'admin') || currentUser)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Administrator Panel & SPM Reports</span>
          </button>
        </div>

      </div>
    </header>
  );
};
