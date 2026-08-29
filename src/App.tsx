import React, { useState, useEffect } from 'react';
import { User, WorkPermitApplication, SystemNotification } from './types';
import { INITIAL_USERS, INITIAL_APPLICATIONS, INITIAL_NOTIFICATIONS } from './data/initialData';
import { Header } from './components/Header';
import { ApplicantView } from './components/ApplicantView';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ProjectCharterModal } from './components/ProjectCharterModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { WorkPermitModal } from './components/WorkPermitModal';
import { ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';

export default function App() {
  // Users state
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('gov_spm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Citizen Abebe Kebede
  });

  // Applications state
  const [applications, setApplications] = useState<WorkPermitApplication[]>(() => {
    const saved = localStorage.getItem('gov_spm_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('gov_spm_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modal States
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePermitApp, setActivePermitApp] = useState<WorkPermitApplication | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gov_spm_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gov_spm_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('gov_spm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handler: Switch User Role
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
  };

  // Handler: Role Selection Demo from Charter Guide
  const handleSelectRoleDemo = (role: 'applicant' | 'officer' | 'admin') => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  // Handler: Submit New Application
  const handleSubmitApplication = (
    newAppData: Omit<WorkPermitApplication, 'id' | 'referenceNumber' | 'status' | 'submittedAt' | 'updatedAt'>
  ) => {
    const refNumber = `WP-2026-ETH-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newApp: WorkPermitApplication = {
      ...newAppData,
      id: `app-${Date.now()}`,
      referenceNumber: refNumber,
      status: 'Submitted',
      submittedAt: formattedDate,
      updatedAt: formattedDate,
      assignedOfficerName: 'Officer Dawit Haile',
    };

    // Prepend to applications
    setApplications((prev) => [newApp, ...prev]);

    // Dispatch automated Email & SMS notifications
    const newEmailNotif: SystemNotification = {
      id: `notif-${Date.now()}-email`,
      recipientEmail: newApp.email,
      recipientPhone: newApp.phone,
      type: 'EMAIL',
      title: `Application Received (Ref: ${refNumber})`,
      message: `Your online work permit application for "${newApp.jobTitle}" at "${newApp.employerName}" has been successfully submitted with Reference Code: ${refNumber}. It is now in the review queue.`,
      timestamp: formattedDate,
      relatedRef: refNumber,
      isRead: false,
    };

    const newSMSNotif: SystemNotification = {
      id: `notif-${Date.now()}-sms`,
      recipientEmail: newApp.email,
      recipientPhone: newApp.phone,
      type: 'SMS',
      title: 'GovPortal: Application Received',
      message: `GovPortal: Application ${refNumber} received. Directorate review underway. Tracking available at portal.gov.et`,
      timestamp: formattedDate,
      relatedRef: refNumber,
      isRead: false,
    };

    setNotifications((prev) => [newEmailNotif, newSMSNotif, ...prev]);
  };

  // Handler: Officer Review & Status Update
  const handleUpdateStatus = (
    appId: string,
    status: 'Under Review' | 'Approved' | 'Rejected',
    comments: string,
    officerName: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updated: WorkPermitApplication = {
          ...app,
          status,
          officerComments: comments,
          assignedOfficerName: officerName,
          updatedAt: formattedDate,
        };

        if (status === 'Approved') {
          const permitSerial = `ETH-WP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
          const issueDate = now.toISOString().split('T')[0];
          const expiryDate = new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000 * (app.contractDurationMonths ? app.contractDurationMonths / 12 : 2)
          )
            .toISOString()
            .split('T')[0];

          updated.permitNumber = permitSerial;
          updated.issueDate = issueDate;
          updated.expiryDate = expiryDate;
          updated.verificationCode = `VRF-${app.referenceNumber.slice(-4)}-OK${Math.floor(10 + Math.random() * 89)}-GOV`;
          updated.digitalSealHash = `SHA256:${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

          // Dispatch Approval Alerts
          const approvalEmail: SystemNotification = {
            id: `notif-${Date.now()}-email`,
            recipientEmail: app.email,
            recipientPhone: app.phone,
            type: 'EMAIL',
            title: `Work Permit APPROVED (Ref: ${app.referenceNumber})`,
            message: `Congratulations! Your Work Permit Application (${app.referenceNumber}) has been APPROVED by ${officerName}. Official Permit Number: ${permitSerial}. Download your certified PDF from the portal.`,
            timestamp: formattedDate,
            relatedRef: app.referenceNumber,
            isRead: false,
          };

          const approvalSMS: SystemNotification = {
            id: `notif-${Date.now()}-sms`,
            recipientEmail: app.email,
            recipientPhone: app.phone,
            type: 'SMS',
            title: 'GovPortal: Permit Approved',
            message: `GovPortal: Work Permit ${permitSerial} APPROVED. Official electronic certificate is ready for download.`,
            timestamp: formattedDate,
            relatedRef: app.referenceNumber,
            isRead: false,
          };

          setNotifications((nPrev) => [approvalEmail, approvalSMS, ...nPrev]);
        } else if (status === 'Rejected') {
          const rejectEmail: SystemNotification = {
            id: `notif-${Date.now()}-email`,
            recipientEmail: app.email,
            recipientPhone: app.phone,
            type: 'EMAIL',
            title: `Application Decision Update (Ref: ${app.referenceNumber})`,
            message: `Your work permit application (${app.referenceNumber}) was reviewed by ${officerName} and could not be approved at this time. Reason: "${comments}".`,
            timestamp: formattedDate,
            relatedRef: app.referenceNumber,
            isRead: false,
          };

          setNotifications((nPrev) => [rejectEmail, ...nPrev]);
        } else if (status === 'Under Review') {
          const reviewEmail: SystemNotification = {
            id: `notif-${Date.now()}-email`,
            recipientEmail: app.email,
            recipientPhone: app.phone,
            type: 'EMAIL',
            title: `Status: Under Active Review (Ref: ${app.referenceNumber})`,
            message: `Your application (${app.referenceNumber}) has been moved to Under Review status. ${officerName} is actively verifying your credentials.`,
            timestamp: formattedDate,
            relatedRef: app.referenceNumber,
            isRead: false,
          };

          setNotifications((nPrev) => [reviewEmail, ...nPrev]);
        }

        return updated;
      })
    );
  };

  // Handler: Send Email Copy of Permit
  const handleSendEmailCopy = (email: string) => {
    const notif: SystemNotification = {
      id: `notif-${Date.now()}-email`,
      recipientEmail: email,
      recipientPhone: currentUser.phone,
      type: 'EMAIL',
      title: 'Official Work Permit Certificate PDF Copy',
      message: `A digital copy of your official approved work permit certificate has been dispatched to ${email}.`,
      timestamp: 'Just now',
      relatedRef: activePermitApp?.referenceNumber || 'WP-2026',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Main Navigation */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick SPM Class Presentation Banner */}
        <div className="mb-6 bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-700 font-bold uppercase tracking-wide text-[11px]">SPM Class Demo Mode:</span>
            <span className="text-slate-600 font-medium">
              Waterfall SDLC (5 Weeks) • 45,100 Birr Budget • Target &ge;95% UAT Sign-off
            </span>
          </div>
          <button
            onClick={() => setIsCharterOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 underline cursor-pointer"
          >
            <span>Open SPM Project Charter & Demo Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic View based on Active Role */}
        {currentUser.role === 'applicant' && (
          <ApplicantView
            currentUser={currentUser}
            applications={applications.filter(
              (a) => a.applicantId === currentUser.id || currentUser.id === 'user-applicant-1' || currentUser.id === 'user-applicant-2'
            )}
            onSubmitApplication={handleSubmitApplication}
            onOpenPermit={(app) => setActivePermitApp(app)}
          />
        )}

        {currentUser.role === 'officer' && (
          <OfficerDashboard
            currentUser={currentUser}
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onOpenPermit={(app) => setActivePermitApp(app)}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            applications={applications}
            users={users}
            onOpenPermit={(app) => setActivePermitApp(app)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Federal Democratic Republic of Ethiopia • Directorate of Foreign Employment</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCharterOpen(true)}
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium hover:underline"
            >
              SPM Project Charter (Waterfall SDLC)
            </button>
            <span>•</span>
            <span className="text-slate-400">Release 1.0 (5-Week Lifecycle)</span>
          </div>
        </div>
      </footer>

      {/* SPM Project Charter Modal */}
      <ProjectCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
        onSelectRoleDemo={handleSelectRoleDemo}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        }
        onClearAll={() => setNotifications([])}
      />

      {/* Official Approved Work Permit Certificate Modal */}
      <WorkPermitModal
        application={activePermitApp}
        isOpen={!!activePermitApp}
        onClose={() => setActivePermitApp(null)}
        onSendEmailCopy={handleSendEmailCopy}
      />

    </div>
  );
}
