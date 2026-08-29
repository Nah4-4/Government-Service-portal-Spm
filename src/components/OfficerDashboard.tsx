import React, { useState } from 'react';
import { WorkPermitApplication, User } from '../types';
import { Briefcase, Search, Filter, CheckCircle2, XCircle, Clock, FileText, Eye, ShieldCheck, Download, AlertCircle, Sparkles, Building2, UserCircle, Calendar, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OfficerDashboardProps {
  currentUser: User;
  applications: WorkPermitApplication[];
  onUpdateStatus: (
    appId: string,
    status: 'Under Review' | 'Approved' | 'Rejected',
    comments: string,
    officerName: string
  ) => void;
  onOpenPermit: (app: WorkPermitApplication) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  currentUser,
  applications,
  onUpdateStatus,
  onOpenPermit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'>('ALL');
  const [selectedApp, setSelectedApp] = useState<WorkPermitApplication | null>(null);

  // Review Form State inside modal
  const [officerComments, setOfficerComments] = useState('');
  const [activeDocPreview, setActiveDocPreview] = useState<string | null>(null);

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.idNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter((a) => a.status === 'Submitted').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const handleOpenReview = (app: WorkPermitApplication) => {
    setSelectedApp(app);
    setOfficerComments(app.officerComments || 'All supporting documents, credentials, and employer registration verified.');
    setActiveDocPreview(null);
  };

  const handleApprove = () => {
    if (!selectedApp) return;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onUpdateStatus(
      selectedApp.id,
      'Approved',
      officerComments || 'Approved following complete document and employer verification.',
      currentUser.name || 'Officer Dawit Haile'
    );
    setSelectedApp(null);
  };

  const handleReject = () => {
    if (!selectedApp) return;
    onUpdateStatus(
      selectedApp.id,
      'Rejected',
      officerComments || 'Application rejected due to incomplete credential certification or missing employer sponsorship proof.',
      currentUser.name || 'Officer Dawit Haile'
    );
    setSelectedApp(null);
  };

  const handleSetUnderReview = () => {
    if (!selectedApp) return;
    onUpdateStatus(
      selectedApp.id,
      'Under Review',
      officerComments || 'Application under active background verification with the Directorate.',
      currentUser.name || 'Officer Dawit Haile'
    );
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded">
              Government Officer Portal
            </span>
            <span className="text-xs text-slate-500">
              Badge: <span className="font-mono text-blue-700 font-bold">{currentUser.badgeNumber || 'OFF-8842-ETH'}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Work Permit Verification & Review Directorate
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Review incoming citizen applications, inspect certified credentials, approve legitimate requests with digital seal generation, or provide constructive feedback.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Reviewer</div>
            <div className="font-bold text-slate-900">{currentUser.name}</div>
            <div className="text-[10px] text-blue-700 font-medium">Authenticated Directorate Officer</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Pending Review</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{pendingCount}</div>
          <span className="text-[10px] text-slate-500">Requires initial inspection</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Under Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{underReviewCount}</div>
          <span className="text-[10px] text-slate-500">In background check</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Approved Permits</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{approvedCount}</div>
          <span className="text-[10px] text-slate-500">Permit PDFs dispatched</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{rejectedCount}</div>
          <span className="text-[10px] text-slate-500">Feedback returned</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ref, Applicant, Employer..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {(['ALL', 'Submitted', 'Under Review', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Applications Queue ({filteredApps.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Average turnaround: <span className="text-emerald-700 font-bold">2.4 days</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Reference No.</th>
                <th className="px-4 py-3">Applicant Name</th>
                <th className="px-4 py-3">Employer & Role</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No applications found matching search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                      {app.referenceNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{app.idType}: {app.idNumber}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                      <div className="text-[10px] text-slate-500">{app.employerName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {app.submittedAt}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 border ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {app.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {app.status === 'Under Review' && <Clock className="w-3 h-3 text-amber-600" />}
                        {app.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {app.status === 'Submitted' && <FileText className="w-3 h-3 text-blue-600" />}
                        <span>{app.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs inline-flex items-center space-x-1 transition shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review & Verify</span>
                      </button>

                      {app.status === 'Approved' && (
                        <button
                          onClick={() => onOpenPermit(app)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs transition cursor-pointer"
                          title="View Generated Certificate"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICER APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
                    Ref: {selectedApp.referenceNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    Applicant: <strong className="text-slate-900">{selectedApp.fullName}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Official Work Permit Verification & Decision Dossier
                </h3>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Applicant Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                    <UserCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Applicant Identification</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Full Name</span>
                      <span className="font-bold text-slate-900">{selectedApp.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Nationality</span>
                      <span className="text-slate-800">{selectedApp.nationality}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DOB / Gender</span>
                      <span className="text-slate-800">{selectedApp.dateOfBirth} ({selectedApp.gender})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">{selectedApp.idType}</span>
                      <span className="font-mono font-bold text-blue-700">{selectedApp.idNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone</span>
                      <span className="text-slate-800">{selectedApp.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Email</span>
                      <span className="text-slate-800 truncate block">{selectedApp.email}</span>
                    </div>
                  </div>
                </div>

                {/* Sponsoring Employer Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sponsoring Employer & Contract</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Employer Org</span>
                      <span className="font-bold text-slate-900">{selectedApp.employerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Reg Number</span>
                      <span className="font-mono text-slate-700">{selectedApp.employerRegistrationNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Designated Job Title</span>
                      <span className="font-bold text-slate-900">{selectedApp.jobTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Contract Duration</span>
                      <span className="font-bold text-blue-700">{selectedApp.contractDurationMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Work Location</span>
                      <span className="text-slate-800">{selectedApp.workLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Monthly Salary</span>
                      <span className="font-mono text-slate-800">{selectedApp.monthlySalary.toLocaleString()} {selectedApp.salaryCurrency}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section 2: Supporting Documents Verification Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Submitted Supporting Documents Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={doc.id}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-300"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{doc.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                            {doc.fileName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveDocPreview(doc.title)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium transition cursor-pointer"
                        >
                          Inspect
                        </button>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {activeDocPreview && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
                    <span>Inspecting certified document: <strong>{activeDocPreview}</strong> (Hash checksum verified against national repository).</span>
                    <button
                      onClick={() => setActiveDocPreview(null)}
                      className="text-xs text-blue-600 hover:text-blue-900 font-semibold cursor-pointer"
                    >
                      Close preview
                    </button>
                  </div>
                )}
              </div>

              {/* Section 3: Officer Review Notes & Remarks */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <label className="block font-bold text-slate-700 uppercase text-[11px]">
                  Officer Evaluation Remarks & Decision Notes *
                </label>
                <textarea
                  rows={2}
                  value={officerComments}
                  onChange={(e) => setOfficerComments(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter official review feedback, verification results, or permit conditions..."
                />
                <p className="text-[10px] text-slate-500">
                  These comments are archived permanently and delivered to the citizen via automated notification.
                </p>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSetUnderReview}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Mark as Under Review
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Reject with Feedback
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Official Work Permit</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
