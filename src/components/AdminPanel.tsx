import React, { useState } from 'react';
import { WorkPermitApplication, User, SPMPhase, BudgetCategory } from '../types';
import { SPM_PROJECT_INFO } from '../data/initialData';
import { Building2, Users, FileCheck, CheckCircle2, AlertCircle, Clock, ShieldCheck, Download, Award, Calendar, Coins, TrendingUp, BarChart2 } from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  applications: WorkPermitApplication[];
  users: User[];
  onOpenPermit: (app: WorkPermitApplication) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  applications,
  users,
  onOpenPermit,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'spmWaterfall' | 'budget' | 'users'>('metrics');
  const [exportSuccess, setExportSuccess] = useState(false);

  const totalApps = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const submittedCount = applications.filter((a) => a.status === 'Submitted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const approvalRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;

  const handleExportCSV = () => {
    const headers = 'ReferenceNumber,ApplicantName,Email,Employer,JobTitle,Status,SubmittedAt,PermitNumber\n';
    const rows = applications
      .map(
        (a) =>
          `"${a.referenceNumber}","${a.fullName}","${a.email}","${a.employerName}","${a.jobTitle}","${a.status}","${a.submittedAt}","${a.permitNumber || 'N/A'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SPM_WorkPermit_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Executive Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded">
              Administrator & SPM Ops
            </span>
            <span className="text-xs text-slate-500">
              Lead: <strong className="text-slate-900">{currentUser.name}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Administration & SPM Project Controls
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Executive oversight, Waterfall SDLC stage completion status, 45,100 Birr budget tracking, user role assignments, and real-time permit lifecycle throughput.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{exportSuccess ? 'Report Downloaded!' : 'Export SPM Summary CSV'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border border-slate-200 bg-white rounded-xl p-1 text-xs font-semibold overflow-x-auto space-x-1 shadow-xs">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center space-x-2 ${
            activeTab === 'metrics'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Operational Metrics & Throughput</span>
        </button>

        <button
          onClick={() => setActiveTab('spmWaterfall')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center space-x-2 ${
            activeTab === 'spmWaterfall'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Waterfall 5-Week SDLC Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center space-x-2 ${
            activeTab === 'budget'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Budget & Variance (45,100 Birr)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User & Officer Role Access</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONAL METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs text-slate-600 font-medium">Total Received Applications</span>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalApps}</div>
              <span className="text-[10px] text-slate-500">Across all sectors</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs text-slate-600 font-medium">Approval Rate</span>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">{approvalRate}%</div>
              <span className="text-[10px] text-emerald-700">{approvedCount} official permits issued</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs text-slate-600 font-medium">Average Processing Time</span>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">2.1 Days</div>
              <span className="text-[10px] text-slate-500">Target was ≤ 5 days</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs text-slate-600 font-medium">SPM Test Pass Rate</span>
              <div className="text-2xl font-bold text-blue-600 font-mono mt-1">{SPM_PROJECT_INFO.testCasePassRate}</div>
              <span className="text-[10px] text-blue-700">UAT Criterion &ge;95% passed</span>
            </div>
          </div>

          {/* Applications Master Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>All System Work Permit Applications</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Active Records: {applications.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Reference No.</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Employer</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assigned Officer</th>
                    <th className="px-4 py-3 text-right">Permit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">
                        {app.referenceNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {app.fullName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {app.employerName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {app.jobTitle}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            app.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {app.assignedOfficerName || 'Pending Assignment'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {app.status === 'Approved' ? (
                          <button
                            onClick={() => onOpenPermit(app)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition cursor-pointer"
                          >
                            View Permit
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WATERFALL SDLC TRACKING */}
      {activeTab === 'spmWaterfall' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>SPM Waterfall SDLC 5-Week Predictive Schedule</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Formal phased progression with sequential milestones, stakeholder sign-offs, and quality gate reviews (July 20 – August 21, 2026):
            </p>

            <div className="space-y-3">
              {SPM_PROJECT_INFO.phases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                        {phase.duration}
                      </span>
                      <span className="text-xs text-slate-500">
                        {phase.startDate} – {phase.endDate}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {phase.name}
                    </h4>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-2">
                      {phase.deliverables.map((d, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] border border-slate-200 text-slate-700">
                          • {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs border border-emerald-200 flex items-center space-x-1 w-fit md:ml-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{phase.status}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Sign-off: {phase.signOffBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET BREAKDOWN */}
      {activeTab === 'budget' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span>SPM Project Budget Tracking (45,100 Birr Planned)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cost breakdown aligned with Waterfall development milestones
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Net Variance</span>
                <div className="text-sm font-bold text-emerald-700 font-mono">+750 ETB Savings (Under Budget)</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Planned (ETB)</th>
                    <th className="px-4 py-3 text-right">Actual (ETB)</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SPM_PROJECT_INFO.budgetCategories.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">{b.category}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700 font-bold">{b.plannedAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-700 font-bold">{b.actualAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">{b.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & ACCESS */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>System Accounts & Role Permissions</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Manage Citizen Applicants, Directorate Officers, and System Administrators:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Email & Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Department / Badge</th>
                    <th className="px-4 py-3 text-right">Access Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{u.email}</div>
                        <div className="text-[10px] text-slate-500">{u.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            u.role === 'applicant'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : u.role === 'officer'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {u.department || 'Citizen Applicant Portal'}
                        {u.badgeNumber && <span className="font-mono text-blue-700 block font-bold">{u.badgeNumber}</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
