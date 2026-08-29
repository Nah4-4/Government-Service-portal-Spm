export type UserRole = 'applicant' | 'officer' | 'admin';

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  badgeNumber?: string;
}

export interface UploadedDoc {
  id: string;
  type: 'photo' | 'passport' | 'offer_letter' | 'medical_cert' | 'qualification';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  previewUrl?: string;
}

export interface WorkPermitApplication {
  id: string;
  referenceNumber: string; // e.g. WP-2026-84920
  applicantId: string;
  
  // 1. Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  address: string;
  phone: string;
  email: string;
  
  // 2. Identification
  idType: 'National ID' | 'Passport';
  idNumber: string;
  idExpiryDate: string;
  issuingCountry: string;

  // 3. Employment Details
  employerName: string;
  employerRegistrationNo: string;
  jobTitle: string;
  jobCategory: string;
  jobDescription: string;
  workLocation: string;
  contractDurationMonths: number;
  monthlySalary: number;
  salaryCurrency: string;
  startDate: string;

  // 4. Documents
  documents: UploadedDoc[];
  declarationAccepted: boolean;

  // 5. Workflow & Status
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  assignedOfficerName?: string;
  officerComments?: string;
  rejectionReason?: string;
  
  // 6. Approved Permit Details
  permitNumber?: string; // e.g. ETH-WP-2026-09214
  issueDate?: string;
  expiryDate?: string;
  verificationCode?: string;
  digitalSealHash?: string;
}

export interface SystemNotification {
  id: string;
  recipientEmail: string;
  recipientPhone: string;
  type: 'EMAIL' | 'SMS';
  title: string;
  message: string;
  timestamp: string;
  relatedRef: string;
  isRead: boolean;
}

export interface SPMPhase {
  phaseNumber: number;
  name: string;
  duration: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  deliverables: string[];
  signOffBy: string;
}

export interface BudgetCategory {
  category: string;
  plannedAmount: number;
  actualAmount: number;
  notes: string;
}
