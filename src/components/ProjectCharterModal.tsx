import React, { useState } from 'react';
import { SPM_PROJECT_INFO } from '../data/initialData';
import { X, GraduationCap, CheckCircle2, Calendar, Coins, ShieldCheck, FileText, ArrowRight, Play, Award, Clock } from 'lucide-react';

interface ProjectCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleDemo: (role: 'applicant' | 'officer' | 'admin') => void;
}

export const ProjectCharterModal: React.FC<ProjectCharterModalProps> = ({
  isOpen,
  onClose,
  onSelectRoleDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'charter' | 'waterfall' | 'budget' | 'demoGuide'>('charter');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Course: SPM (Software Project Management)
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Waterfall SDLC Demo
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Project Charter & Presentation Suite
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('charter')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'charter'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Project Charter Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('waterfall')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'waterfall'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1.3 Waterfall SDLC 5-Week Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'budget'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Estimated Budget (45,100 Birr)</span>
          </button>

          <button
            onClick={() => setActiveTab('demoGuide')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'demoGuide'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Class Demo Walkthrough</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 bg-white">
          
          {/* TAB 1: CHARTER DETAILS */}
          {activeTab === 'charter' && (
            <div className="space-y-6">
              
              {/* Summary Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-200 w-1/3">Charter Field</th>
                      <th className="px-4 py-3">Project Specifics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Project Title</td>
                      <td className="px-4 py-2.5 text-slate-900 font-medium">{SPM_PROJECT_INFO.title}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Course & Code</td>
                      <td className="px-4 py-2.5">{SPM_PROJECT_INFO.course} | Code: <span className="font-mono text-blue-700 font-bold">{SPM_PROJECT_INFO.courseCode}</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Project Management Approach</td>
                      <td className="px-4 py-2.5 text-blue-700 font-medium">{SPM_PROJECT_INFO.sdlcApproach}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Project Timeline</td>
                      <td className="px-4 py-2.5">Start: <span className="text-slate-900 font-medium">{SPM_PROJECT_INFO.startDate}</span> → Finish: <span className="text-slate-900 font-medium">{SPM_PROJECT_INFO.finishDate}</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Total Estimated Budget</td>
                      <td className="px-4 py-2.5 font-mono text-slate-900 font-bold">{SPM_PROJECT_INFO.totalBudget}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-slate-900 bg-slate-50/50 border-r border-slate-200">Primary Success Criterion</td>
                      <td className="px-4 py-2.5 text-slate-600">
                        Deliver a functional portal within 5 weeks, &ge;95% test cases passing ({SPM_PROJECT_INFO.testCasePassRate}), and official UAT sign-off obtained.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 1.1 Project Objectives */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>1.1 Project Objectives</span>
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Allow citizens to apply for a work permit online without visiting government offices.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Capture applicant details and required supporting documents with robust form validation.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Enable authorized officers to inspect, review, and approve or reject applications.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Automatically generate official PDF work permit with QR code & digital verification seal.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Send automated real-time SMS and Email notifications on every status change.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Deliver project strictly within the 5-week schedule and 45,100 Birr budget using Waterfall SDLC.</span>
                  </li>
                </ul>
              </div>

              {/* 2.1 Justification & Problem Solved */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs leading-relaxed text-slate-700">
                <h4 className="font-bold mb-1.5 uppercase text-[11px] tracking-wider text-blue-900">
                  2.1 Project Summary & Justification
                </h4>
                <p>
                  Eliminates long queues, delays, lost physical paperwork, and manual data-entry errors by providing an end-to-end digital lifecycle: Citizen Registration → Online Application Submission (with unique reference ID) → Officer Verification Dashboard → Automated PDF Work Permit Issuance & Email Delivery → Administrator Reporting.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: WATERFALL SDLC PHASES */}
          {activeTab === 'waterfall' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 mb-2">
                Predictive Waterfall Software Development Life Cycle (July 20 – August 21, 2026 | 5 Weeks / 25 Working Days):
              </div>

              <div className="space-y-3">
                {SPM_PROJECT_INFO.phases.map((phase) => (
                  <div
                    key={phase.phaseNumber}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition hover:border-slate-300 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold mr-2 border border-blue-200">
                          {phase.duration}
                        </span>
                        <h4 className="inline text-sm font-bold text-slate-900">
                          {phase.name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{phase.startDate} – {phase.endDate}</span>
                        </span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] flex items-center space-x-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{phase.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-600 block mb-1">Key Deliverables:</span>
                        <ul className="space-y-1 text-slate-700">
                          {phase.deliverables.map((del, i) => (
                            <li key={i} className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-end text-[11px] text-slate-500 pt-2 md:pt-0">
                        <span className="font-semibold text-slate-700">Phase Formal Sign-off:</span>
                        <span className="text-emerald-700 font-medium">{phase.signOffBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET BREAKDOWN */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <span className="text-xs text-slate-500">Total Approved Project Budget</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">45,100 ETB / Birr</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Actual Expenditure</span>
                  <div className="text-xl font-bold text-emerald-700 font-mono">44,350 ETB / Birr</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Under budget by 750 Birr (1.6% variance)</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Cost Category</th>
                      <th className="px-4 py-3 text-right">Planned (Birr)</th>
                      <th className="px-4 py-3 text-right">Actual (Birr)</th>
                      <th className="px-4 py-3">Scope Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SPM_PROJECT_INFO.budgetCategories.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-semibold text-slate-900">{b.category}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-700 font-bold">{b.plannedAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-700 font-bold">{b.actualAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{b.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CLASS DEMO GUIDE */}
          {activeTab === 'demoGuide' && (
            <div className="space-y-4">
              <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-blue-900 text-sm flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Interactive 4-Step SPM Presentation Flow</span>
                </h4>
                <p className="text-slate-600">
                  Follow these 4 sequential steps to demonstrate full fulfillment of the Project Charter requirements to your instructor and classmates:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* Step 1 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        Step 1: Citizen
                      </span>
                      <span className="text-slate-500 font-mono">1.1 Form & Uploads</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Citizen Submits Application</h5>
                    <p className="text-slate-600 text-xs">
                      Switch to Citizen view. Click "Apply for New Work Permit", click the 1-click sample auto-fill button, and submit. Watch unique reference <code className="text-blue-700 font-semibold">WP-2026-ETH-XXXX</code> generated.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRoleDemo('applicant');
                      onClose();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer mt-2 shadow-xs"
                  >
                    <span>Try Citizen Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        Step 2: Officer
                      </span>
                      <span className="text-slate-500 font-mono">1.2 Verification</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Officer Reviews & Approves</h5>
                    <p className="text-slate-600 text-xs">
                      Switch to Officer Dashboard. Open the submitted application, inspect documents (photo, passport, diploma), add officer remarks, and click "Approve Application".
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRoleDemo('officer');
                      onClose();
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer mt-2 shadow-xs"
                  >
                    <span>Try Officer Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        Step 3: Permit & PDF
                      </span>
                      <span className="text-slate-500 font-mono">1.3 Auto Generation</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Download Work Permit PDF</h5>
                    <p className="text-slate-600 text-xs">
                      View the generated official Work Permit with QR code, verification seal, and download the actual formatted PDF directly to your device. Check SMS & Email notification logs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRoleDemo('applicant');
                      onClose();
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer mt-2 shadow-xs"
                  >
                    <span>View Approved Permits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                        Step 4: Admin
                      </span>
                      <span className="text-slate-500 font-mono">1.4 Project Metrics</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Admin & SPM Reports</h5>
                    <p className="text-slate-600 text-xs">
                      Inspect the administrator dashboard for application throughput stats, turnaround metrics, 96.8% test case pass rate, and Waterfall phase completion indicators.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRoleDemo('admin');
                      onClose();
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer mt-2 shadow-xs"
                  >
                    <span>View Admin Metrics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SPM Waterfall SDLC Project Demo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition font-medium cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
