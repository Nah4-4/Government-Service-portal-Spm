export type UserRole = 'applicant' | 'officer' | 'admin';

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

/** Legal forms recognised by the Ethiopian Commercial Code for business registration. */
export type BusinessType =
  | 'Sole Proprietorship'
  | 'Private Limited Company (PLC)'
  | 'Share Company (S.C.)'
  | 'General Partnership'
  | 'Cooperative Society'
  | 'Branch of Foreign Company';

/** How the applicant holds the trading premises declared on the licence. */
export type PremisesType = 'Owned' | 'Rented / Leased' | 'Shared' | 'Home-based / Virtual';

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
  type:
    | 'owner_photo'
    | 'owner_id'
    | 'trade_name_certificate'
    | 'tin_certificate'
    | 'lease_agreement'
    | 'competency_certificate';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  previewUrl?: string;
}

export interface TradingLicenseApplication {
  id: string;
  referenceNumber: string; // e.g. TL-2026-ETH-9481
  applicantId: string;

  // 1. Owner / Applicant Information
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' ;
  nationality: string;
  address: string;
  phone: string;
  email: string;

  // 2. Identification
  idType: 'Fayda National ID' | 'Kebele ID' | 'Passport';
  idNumber: string;
  idExpiryDate: string;
  issuingAuthority: string; // issuing region, or country for passports

  // 3. Business Details
  tradeName: string;
  tradeNameRegistrationNo: string;
  businessType: BusinessType;
  tinNumber: string; // 10-digit Taxpayer Identification Number
  businessSector: string;
  businessSubSector: string;
  businessActivity: string; // narrative scope of trade

  // 4. Trading Premises
  region: string;
  subCity: string;
  woreda: string;
  houseNumber: string;
  premisesType: PremisesType;

  // 5. Capital & Operations
  capital: number; // registered capital
  capitalCurrency: string; // ETB
  employeeCount: number;
  commencementDate: string;
  licenseTermYears: number; // renewal cycle, usually one Ethiopian fiscal year

  // 6. Documents
  documents: UploadedDoc[];
  declarationAccepted: boolean;

  // 7. Workflow & Status
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  assignedOfficerName?: string;
  officerComments?: string;
  rejectionReason?: string;

  // 8. Issued Licence Details
  licenseNumber?: string; // e.g. ET/AA/TL/2026/09214
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
