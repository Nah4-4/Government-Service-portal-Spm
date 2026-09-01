import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { User, TradingLicenseApplication, SystemNotification } from './types';
import { INITIAL_USERS, INITIAL_APPLICATIONS, INITIAL_NOTIFICATIONS } from './data/initialData';
import { DEFAULT_SECTION } from './config/navigation';
import { AppShell } from './components/AppShell';
import { ApplicantView } from './components/ApplicantView';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ProjectCharterModal } from './components/ProjectCharterModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { TradingLicenseModal } from './components/TradingLicenseModal';

export default function App() {
  // Users state
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('gov_tl_current_user_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Eyob Derebay Yemer
  });

  // Applications state
  const [applications, setApplications] = useState<TradingLicenseApplication[]>(() => {
    const saved = localStorage.getItem('gov_tl_applications_v4');
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
    const saved = localStorage.getItem('gov_tl_notifications_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Active sidebar section for the current role
  const [activeSection, setActiveSection] = useState<string>(
    () => DEFAULT_SECTION[currentUser.role]
  );

  // Modal States
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeLicenseApp, setActiveLicenseApp] = useState<TradingLicenseApplication | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gov_tl_current_user_v4', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gov_tl_applications_v4', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('gov_tl_notifications_v4', JSON.stringify(notifications));
  }, [notifications]);

  // Handler: Switch User Role — sections are per-role, so reset to the default
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setActiveSection(DEFAULT_SECTION[user.role]);
    setIsWizardOpen(false);
  };

  // Handler: Role Selection Demo from Charter Guide
  const handleSelectRoleDemo = (role: 'applicant' | 'officer' | 'admin') => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      handleSelectUser(targetUser);
    }
  };

  // Handler: Submit New Application
  const handleSubmitApplication = (
    newAppData: Omit<TradingLicenseApplication, 'id' | 'referenceNumber' | 'status' | 'submittedAt' | 'updatedAt'>
  ) => {
    const refNumber = `TL-2026-ETH-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newApp: TradingLicenseApplication = {
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
      message: `Your online trading licence application for "${newApp.tradeName}" (${newApp.businessSector}) has been successfully submitted with Reference Code: ${refNumber}. It is now in the review queue.`,
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
      message: `GovPortal: Application ${refNumber} received. Trade directorate review underway. Tracking available at portal.gov.et`,
      timestamp: formattedDate,
      relatedRef: refNumber,
      isRead: false,
    };

    setNotifications((prev) => [newEmailNotif, newSMSNotif, ...prev]);

    // Land the citizen on the list so the new record is visible
    setActiveSection('applications');
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

        const updated: TradingLicenseApplication = {
          ...app,
          status,
          officerComments: comments,
          assignedOfficerName: officerName,
          updatedAt: formattedDate,
        };

        if (status === 'Approved') {
          const licenseSerial = `ET/AA/TL/2026/${Math.floor(10000 + Math.random() * 90000)}`;
          const issueDate = now.toISOString().split('T')[0];
          const expiryDate = new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000 * (app.licenseTermYears || 1)
          )
            .toISOString()
            .split('T')[0];

          updated.licenseNumber = licenseSerial;
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
            title: `Trading Licence APPROVED (Ref: ${app.referenceNumber})`,
            message: `Congratulations! Your Trading Licence application (${app.referenceNumber}) has been APPROVED by ${officerName}. Official Licence Number: ${licenseSerial}. Download your certified PDF from the portal.`,
            timestamp: formattedDate,
            relatedRef: app.referenceNumber,
            isRead: false,
          };

          const approvalSMS: SystemNotification = {
            id: `notif-${Date.now()}-sms`,
            recipientEmail: app.email,
            recipientPhone: app.phone,
            type: 'SMS',
            title: 'GovPortal: Licence Approved',
            message: `GovPortal: Trading Licence ${licenseSerial} APPROVED. Official electronic certificate is ready for download.`,
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
            message: `Your trading licence application (${app.referenceNumber}) was reviewed by ${officerName} and could not be approved at this time. Reason: "${comments}".`,
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
            message: `Your application (${app.referenceNumber}) has been moved to Under Review status. ${officerName} is actively verifying your trade name, TIN and premises records.`,
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

  // Handler: Send Email Copy of Licence
  const handleSendEmailCopy = (email: string) => {
    const notif: SystemNotification = {
      id: `notif-${Date.now()}-email`,
      recipientEmail: email,
      recipientPhone: currentUser.phone,
      type: 'EMAIL',
      title: 'Official Business Trading Licence PDF Copy',
      message: `A digital copy of your official approved business trading licence has been dispatched to ${email}.`,
      timestamp: 'Just now',
      relatedRef: activeLicenseApp?.referenceNumber || 'TL-2026',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Applications visible to the signed-in citizen (strictly their own applications)
  const applicantApplications = applications.filter(
    (a) => a.applicantId === currentUser.id
  );

  // Notifications visible to the current user (citizens only see their own notices; officers/admins see system logs)
  const userNotifications =
    currentUser.role === 'applicant'
      ? notifications.filter(
          (n) =>
            n.recipientEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
            (currentUser.phone && n.recipientPhone === currentUser.phone) ||
            applicantApplications.some((app) => app.referenceNumber === n.relatedRef)
        )
      : notifications;

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <>
      <AppShell
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        primaryAction={
          currentUser.role === 'applicant'
            ? {
                label: 'New application',
                icon: <PlusCircle className="h-4 w-4" aria-hidden="true" />,
                onClick: () => setIsWizardOpen(true),
              }
            : undefined
        }
      >
        {currentUser.role === 'applicant' && (
          <ApplicantView
            key={currentUser.id}
            currentUser={currentUser}
            applications={applicantApplications}
            section={activeSection}
            isWizardOpen={isWizardOpen}
            onOpenWizard={() => setIsWizardOpen(true)}
            onCloseWizard={() => setIsWizardOpen(false)}
            onSubmitApplication={handleSubmitApplication}
            onOpenLicense={(app) => setActiveLicenseApp(app)}
            onNavigate={setActiveSection}
          />
        )}

        {currentUser.role === 'officer' && (
          <OfficerDashboard
            key={currentUser.id}
            currentUser={currentUser}
            applications={applications}
            section={activeSection}
            onUpdateStatus={handleUpdateStatus}
            onOpenLicense={(app) => setActiveLicenseApp(app)}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminPanel
            key={currentUser.id}
            applications={applications}
            users={users}
            section={activeSection}
            onOpenLicense={(app) => setActiveLicenseApp(app)}
          />
        )}
      </AppShell>

      {/* SPM Project Charter */}
      <ProjectCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
        onSelectRoleDemo={handleSelectRoleDemo}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={userNotifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) =>
            prev.map((n) =>
              userNotifications.some((un) => un.id === n.id)
                ? { ...n, isRead: true }
                : n
            )
          )
        }
        onClearAll={() =>
          setNotifications((prev) =>
            prev.filter((n) => !userNotifications.some((un) => un.id === n.id))
          )
        }
      />

      {/* Official Approved Business Trading Licence */}
      <TradingLicenseModal
        application={activeLicenseApp}
        isOpen={!!activeLicenseApp}
        onClose={() => setActiveLicenseApp(null)}
        onSendEmailCopy={handleSendEmailCopy}
      />
    </>
  );
}
