import React, { useState } from 'react';
import { WorkPermitApplication } from '../types';
import { generateWorkPermitPDF } from '../utils/pdfGenerator';
import { X, Download, Printer, ShieldCheck, QrCode, CheckCircle2, Building, Mail, Award, Calendar, Hash } from 'lucide-react';

interface WorkPermitModalProps {
  application: WorkPermitApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmailCopy?: (email: string) => void;
}

export const WorkPermitModal: React.FC<WorkPermitModalProps> = ({
  application,
  isOpen,
  onClose,
  onSendEmailCopy,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen || !application) return null;

  const handleDownloadPDF = () => {
    generateWorkPermitPDF(application);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailCopy = () => {
    if (onSendEmailCopy) {
      onSendEmailCopy(application.email);
    }
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const permitNo = application.permitNumber || 'ETH-WP-2026-09214';
  const issueDate = application.issueDate || '2026-08-14';
  const expiryDate = application.expiryDate || '2028-08-14';
  const photoDoc = application.documents.find((d) => d.type === 'photo');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden text-slate-900">
        
        {/* Top Control Bar */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Official Approved Work Permit Certificate
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleEmailCopy}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Deliver copy via email"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{emailSent ? 'Sent to Email!' : 'Send Email Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs transition cursor-pointer shadow-xs"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xs border border-slate-200 relative overflow-hidden">
            
            {/* Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-slate-900" />
            </div>

            {/* Official Header */}
            <div className="border-b-2 border-slate-800 pb-4 text-center relative">
              <div className="inline-block px-3 py-0.5 bg-blue-900 text-white text-[10px] font-bold tracking-widest uppercase rounded mb-2">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                MINISTRY OF LABOUR AND SKILLS
              </h2>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                Directorate of Foreign Employment & Work Permits
              </p>
              <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ELECTRONIC WORK PERMIT CERTIFICATE</span>
              </div>
            </div>

            {/* Permit Key Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Permit Serial No.</span>
                <span className="font-mono font-bold text-blue-900 text-sm">{permitNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Application Ref</span>
                <span className="font-mono font-semibold text-slate-800">{application.referenceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Issue Date</span>
                <span className="font-semibold text-slate-800">{issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Expiry Date</span>
                <span className="font-semibold text-emerald-700">{expiryDate}</span>
              </div>
            </div>

            {/* Section 1: Biometric & Personal */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start border-b border-slate-200 pb-4">
              
              {/* Photo */}
              <div className="sm:col-span-1 flex flex-col items-center">
                <div className="w-28 h-36 bg-slate-100 border-2 border-slate-300 rounded-md overflow-hidden shadow-inner flex items-center justify-center">
                  {photoDoc?.previewUrl ? (
                    <img
                      src={photoDoc.previewUrl}
                      alt={application.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400 text-xs">
                      [Biometric Photo Verified]
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 font-bold">
                  VERIFIED BIOMETRIC
                </span>
              </div>

              {/* Personal Details */}
              <div className="sm:col-span-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{application.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Nationality</span>
                  <span className="font-semibold text-slate-800">{application.nationality}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth / Gender</span>
                  <span className="text-slate-800">{application.dateOfBirth} ({application.gender})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{application.idType} Number</span>
                  <span className="font-mono font-bold text-slate-900">{application.idNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact Phone</span>
                  <span className="text-slate-800">{application.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-slate-800 truncate block">{application.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered Residential Address</span>
                  <span className="text-slate-800">{application.address}</span>
                </div>
              </div>

            </div>

            {/* Section 2: Authorized Employment */}
            <div className="my-4 text-xs space-y-2">
              <h4 className="font-bold text-blue-900 uppercase tracking-wide flex items-center space-x-1.5 text-[11px]">
                <Building className="w-3.5 h-3.5" />
                <span>Authorized Employer & Scope of Work</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Employer Organization</span>
                  <span className="font-bold text-slate-900">{application.employerName}</span>
                  <span className="text-[10px] text-slate-500 block">Reg: {application.employerRegistrationNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Job Title</span>
                  <span className="font-bold text-blue-950">{application.jobTitle}</span>
                  <span className="text-[10px] text-slate-500 block">{application.jobCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Location & Duration</span>
                  <span className="font-semibold text-slate-800">{application.workLocation}</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">{application.contractDurationMonths} Months Contract</span>
                </div>
              </div>
            </div>

            {/* Verification Stamp & QR Code */}
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              
              {/* QR Block */}
              <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded">
                  <QrCode className="w-8 h-8 text-amber-300" />
                </div>
                <div className="text-[9px] text-slate-600 leading-tight">
                  <span className="font-bold text-slate-900 block">PORTAL QR VERIFY</span>
                  <span>Code: {application.verificationCode || 'VRF-9481-OK89-GOV'}</span>
                </div>
              </div>

              {/* Digital Hash */}
              <div className="text-[9px] text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-700 block">Digital Security Stamp:</span>
                <p className="font-mono truncate">{application.digitalSealHash || 'SHA256:7f83b1657ff1fc53b92dc18148a1'}</p>
                <p className="text-slate-600">Reviewing Officer: {application.assignedOfficerName || 'Officer Dawit Haile'}</p>
              </div>

              {/* Red Government Seal Graphic */}
              <div className="flex justify-end">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-600 flex flex-col items-center justify-center text-red-600 font-bold rotate-[-8deg] p-1 text-center bg-red-50/30">
                  <span className="text-[7px] uppercase tracking-tighter">FDRE GOVT</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold border-y border-red-600 my-0.5 px-1">APPROVED</span>
                  <span className="text-[6px]">LABOUR PERMITS</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Permit is digitally sealed & valid nationwide</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition font-medium cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
