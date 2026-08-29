import jsPDF from 'jspdf';
import { WorkPermitApplication } from '../types';

export function generateWorkPermitPDF(app: WorkPermitApplication) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const permitNo = app.permitNumber || `ETH-WP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const issueDate = app.issueDate || new Date().toISOString().split('T')[0];
  const expiryDate = app.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * (app.contractDurationMonths ? app.contractDurationMonths / 12 : 2)).toISOString().split('T')[0];
  const verCode = app.verificationCode || `VRF-${app.referenceNumber.slice(-4)}-OK99-GOV`;

  // Draw Page Border & Decorative double frame
  doc.setDrawColor(24, 76, 120); // Deep Government Navy
  doc.setLineWidth(1.2);
  doc.rect(10, 10, 190, 277);
  doc.setDrawColor(200, 160, 60); // Gold Accent
  doc.setLineWidth(0.4);
  doc.rect(12, 12, 186, 273);

  // Top Government Header Banner
  doc.setFillColor(24, 76, 120);
  doc.rect(14, 14, 182, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', 105, 22, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTRY OF LABOUR AND SKILLS | IMMIGRATION DIRECTORATE', 105, 29, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text('OFFICIAL ELECTRONIC WORK PERMIT CERTIFICATE', 105, 36, { align: 'center' });

  // Reset text color
  doc.setTextColor(30, 41, 59);

  // Permit Badge Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(16, 46, 178, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`PERMIT NUMBER: ${permitNo}`, 22, 54);
  doc.text(`STATUS: OFFICIALLY APPROVED & VALID`, 22, 60);

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`REF ID: ${app.referenceNumber}`, 130, 54);
  doc.text(`ISSUE DATE: ${issueDate}`, 130, 60);

  // Section 1: Applicant Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 76, 120);
  doc.text('1. APPLICANT IDENTIFICATION', 16, 72);
  doc.setDrawColor(24, 76, 120);
  doc.setLineWidth(0.5);
  doc.line(16, 74, 194, 74);

  // Details box
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  
  const col1X = 20;
  const col2X = 105;
  let y = 82;

  doc.setFont('helvetica', 'bold');
  doc.text('Full Name:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.fullName || 'N/A', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Nationality:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.nationality || 'N/A', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Birth:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.dateOfBirth || 'N/A', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Gender:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.gender || 'N/A', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('ID / Passport:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${app.idType} - ${app.idNumber}`, col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('ID Expiry:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.idExpiryDate || '2030-01-01', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Email Address:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.email || 'N/A', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.phone || 'N/A', col2X + 28, y);

  // Section 2: Approved Employment Record
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 76, 120);
  doc.text('2. AUTHORIZED EMPLOYMENT & POSITION', 16, y);
  doc.line(16, y + 2, 194, y + 2);

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.setFont('helvetica', 'bold');
  doc.text('Employer Org:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.employerName || 'N/A', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Reg Number:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.employerRegistrationNo || 'REG-2026-ETH', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Job Title:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.jobTitle || 'N/A', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Category:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.jobCategory || 'General Skilled Labour', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Work Location:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(app.workLocation || 'Addis Ababa', col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Contract Term:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${app.contractDurationMonths || 12} Months`, col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Scope of Work:', col1X, y);
  doc.setFont('helvetica', 'normal');
  const splitDesc = doc.splitTextToSize(app.jobDescription || 'Approved professional duties as declared in sponsor contract.', 138);
  doc.text(splitDesc, col1X + 28, y);

  y += Math.max(splitDesc.length * 5, 8);

  // Section 3: Permit Validity & Legal Conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 76, 120);
  doc.text('3. PERMIT VALIDITY & COMPLIANCE CLAUSES', 16, y);
  doc.line(16, y + 2, 194, y + 2);

  y += 9;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  const terms = [
    `• Valid from ${issueDate} until ${expiryDate}. Employment outside the designated employer constitutes a violation.`,
    '• Holder must carry this certified digital permit or physical copy at all times during duty hours.',
    '• This permit was electronically verified through the Government Service Portal (Waterfall SDLC Release 1.0).',
  ];
  terms.forEach((t) => {
    doc.text(t, 20, y);
    y += 5.5;
  });

  // Section 4: Security Stamp, Verification & Signatures
  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(16, y, 178, 48, 2, 2, 'FD');

  // Simulated QR Box
  doc.setFillColor(24, 76, 120);
  doc.rect(22, y + 6, 26, 26, 'F');
  doc.setFillColor(255, 255, 255);
  // Grid pattern inside QR
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r + c) % 2 === 0) {
        doc.rect(24 + c * 4.4, y + 8 + r * 4.4, 3.2, 3.2, 'F');
      }
    }
  }
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SCAN TO VERIFY', 24, y + 36);

  // Digital Hash & Code
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(`Digital Verification Code: ${verCode}`, 56, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`SHA-256 Security Hash: ${app.digitalSealHash || 'SHA256:8f2a9b3c4d5e6f7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a'}`, 56, y + 18);
  doc.text(`Reviewing Officer: ${app.assignedOfficerName || 'Officer Dawit Haile (Directorate)'}`, 56, y + 24);
  doc.text(`Digital Signature Timestamp: ${app.updatedAt || issueDate}`, 56, y + 30);

  // Official Stamp Graphics (Circle)
  doc.setDrawColor(185, 28, 28); // Red government seal ink
  doc.setLineWidth(0.8);
  doc.circle(165, y + 24, 14);
  doc.setLineWidth(0.3);
  doc.circle(165, y + 24, 12.5);
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF ETHIOPIA', 165, y + 18, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('APPROVED', 165, y + 24, { align: 'center' });
  doc.setFontSize(6);
  doc.text('WORK PERMITS', 165, y + 29, { align: 'center' });

  // Footer Note
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('SPM Demo Portal | Waterfall SDLC 5-Week Cycle | Document ID: ' + permitNo, 105, 280, { align: 'center' });

  // Save the PDF
  doc.save(`Work_Permit_${permitNo}.pdf`);
}
