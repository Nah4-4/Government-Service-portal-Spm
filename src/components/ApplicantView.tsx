import React, { useState } from 'react';
import { WorkPermitApplication, User, UploadedDoc } from '../types';
import { PlusCircle, FileText, Download, CheckCircle2, Clock, XCircle, Eye, Sparkles, Upload, ShieldCheck, AlertCircle, Calendar, Building2, MapPin, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicantViewProps {
  currentUser: User;
  applications: WorkPermitApplication[];
  onSubmitApplication: (newApp: Omit<WorkPermitApplication, 'id' | 'referenceNumber' | 'status' | 'submittedAt' | 'updatedAt'>) => void;
  onOpenPermit: (app: WorkPermitApplication) => void;
}

export const ApplicantView: React.FC<ApplicantViewProps> = ({
  currentUser,
  applications,
  onSubmitApplication,
  onOpenPermit,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState(currentUser.name || 'Abebe Kebede');
  const [dateOfBirth, setDateOfBirth] = useState('1994-06-20');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [nationality, setNationality] = useState('Ethiopian');
  const [address, setAddress] = useState('Bole Subcity, Woreda 04, Addis Ababa');
  const [phone, setPhone] = useState(currentUser.phone || '+251 91 123 4567');
  const [email, setEmail] = useState(currentUser.email || 'abebe.kebede@example.com');

  const [idType, setIdType] = useState<'National ID' | 'Passport'>('Passport');
  const [idNumber, setIdNumber] = useState('EP9402194');
  const [idExpiryDate, setIdExpiryDate] = useState('2032-05-15');
  const [issuingCountry, setIssuingCountry] = useState('Ethiopia');

  const [employerName, setEmployerName] = useState('Safaricom Telecommunications Ethiopia PLC');
  const [employerRegistrationNo, setEmployerRegistrationNo] = useState('PLC-TEL-9941');
  const [jobTitle, setJobTitle] = useState('Senior Network & Cybersecurity Engineer');
  const [jobCategory, setJobCategory] = useState('Information & Communications Technology (ICT)');
  const [jobDescription, setJobDescription] = useState('Implementation of national optical transport networks, SOC incident response, and ISO 27001 compliance standards.');
  const [workLocation, setWorkLocation] = useState('Addis Ababa Regional Office');
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(24);
  const [monthlySalary, setMonthlySalary] = useState<number>(95000);
  const [salaryCurrency, setSalaryCurrency] = useState('ETB');
  const [startDate, setStartDate] = useState('2026-09-01');

  const [declarationAccepted, setDeclarationAccepted] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Document states
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([
    {
      id: 'doc-photo',
      type: 'photo',
      title: 'Passport Size Photograph (Biometric)',
      fileName: 'applicant_photo_biometric.jpg',
      fileSize: '480 KB',
      uploadedAt: 'Just now',
      status: 'Pending',
      previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-passport',
      type: 'passport',
      title: 'Passport / National ID Scan',
      fileName: 'passport_identification_scan.pdf',
      fileSize: '1.9 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-offer',
      type: 'offer_letter',
      title: 'Official Employer Appointment / Offer Letter',
      fileName: 'safaricom_employment_offer_contract.pdf',
      fileSize: '2.5 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-med',
      type: 'medical_cert',
      title: 'Medical Fitness Certificate',
      fileName: 'medical_examination_clean_report.pdf',
      fileSize: '950 KB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-deg',
      type: 'qualification',
      title: 'Educational Degree & Certifications',
      fileName: 'bsc_electrical_computer_engineering.pdf',
      fileSize: '3.4 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
  ]);

  // Demo auto-fill helpers for instant class presentations
  const handleAutoFillTech = () => {
    setFullName('Henok Tadesse');
    setDateOfBirth('1993-08-14');
    setGender('Male');
    setNationality('Ethiopian');
    setAddress('Kirkos Subcity, House 502, Addis Ababa');
    setPhone('+251 92 888 1234');
    setEmail('henok.tadesse@fintech.et');
    setIdType('Passport');
    setIdNumber('EP7749102');
    setIdExpiryDate('2031-11-20');
    setIssuingCountry('Ethiopia');
    setEmployerName('Chapa Financial Technologies');
    setEmployerRegistrationNo('FIN-ET-2023-882');
    setJobTitle('Lead Software Engineer & Platform Architect');
    setJobCategory('FinTech & Software Engineering');
    setJobDescription('Architecting microservices payment gateways, national switch integrations, and high-frequency transaction security.');
    setWorkLocation('Bole Medhanialem, Addis Ababa');
    setContractDurationMonths(24);
    setMonthlySalary(120000);
    setStartDate('2026-09-15');
    setDeclarationAccepted(true);
    setErrors({});
  };

  const handleAutoFillHealth = () => {
    setFullName('Dr. Elena Rostova');
    setDateOfBirth('1985-04-12');
    setGender('Female');
    setNationality('German');
    setAddress('Kazanchis, House 104, Addis Ababa');
    setPhone('+251 94 555 8901');
    setEmail('e.rostova@who.org');
    setIdType('Passport');
    setIdNumber('DE89201488');
    setIdExpiryDate('2030-08-10');
    setIssuingCountry('Germany');
    setEmployerName('WHO & Ministry of Health Joint Initiative');
    setEmployerRegistrationNo('NGO-INT-4491');
    setJobTitle('Senior Epidemiologist & Clinical Researcher');
    setJobCategory('Healthcare & Public Health');
    setJobDescription('Directing national immunization data surveillance, epidemiological modeling, and specialist clinic capacity building.');
    setWorkLocation('Black Lion Hospital & MOH HQ');
    setContractDurationMonths(18);
    setMonthlySalary(135000);
    setStartDate('2026-10-01');
    setDeclarationAccepted(true);
    setErrors({});
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!idNumber.trim()) errs.idNumber = 'ID / Passport number is required';
    if (!employerName.trim()) errs.employerName = 'Employer organization is required';
    if (!jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!jobDescription.trim()) errs.jobDescription = 'Job description is required';
    if (!declarationAccepted) errs.declaration = 'You must accept the legal declaration';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onSubmitApplication({
      applicantId: currentUser.id,
      fullName,
      dateOfBirth,
      gender,
      nationality,
      address,
      phone,
      email,
      idType,
      idNumber,
      idExpiryDate,
      issuingCountry,
      employerName,
      employerRegistrationNo,
      jobTitle,
      jobCategory,
      jobDescription,
      workLocation,
      contractDurationMonths: Number(contractDurationMonths),
      monthlySalary: Number(monthlySalary),
      salaryCurrency,
      startDate,
      documents: uploadedDocs,
      declarationAccepted,
    });

    setIsApplying(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded">
              Citizen Portal
            </span>
            <span className="text-xs text-slate-500">
              National Directorate of Labour & Employment
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Submit your official work permit application online, upload certified documentation, track live review progress, and download your approved digital permit certificate.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="new-application-button"
            onClick={() => {
              setIsApplying(true);
              setFormStep(1);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center space-x-2 transition cursor-pointer text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for New Work Permit</span>
          </button>
        </div>
      </div>

      {/* NEW APPLICATION MODAL / WIZARD */}
      {isApplying && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Government Application Form
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Online Work Permit Application Form
                </h3>
              </div>

              {/* 1-Click Auto Fill Demo Tools for Class Presentation */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">1-Click SPM Demo:</span>
                <button
                  type="button"
                  onClick={handleAutoFillTech}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                  title="Auto fill sample Tech Engineer application"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Fill ICT Lead</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoFillHealth}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                  title="Auto fill sample Healthcare Doctor application"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Fill Medical Specialist</span>
                </button>
                <button
                  onClick={() => setIsApplying(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Step Stepper Header */}
            <div className="bg-slate-50/50 px-6 py-2.5 border-b border-slate-200 flex justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className={`flex items-center space-x-1.5 cursor-pointer ${
                  formStep === 1 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  formStep === 1 ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-500'
                }`}>1</span>
                <span>1. Personal & ID</span>
              </button>

              <button
                type="button"
                onClick={() => setFormStep(2)}
                className={`flex items-center space-x-1.5 cursor-pointer ${
                  formStep === 2 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  formStep === 2 ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-500'
                }`}>2</span>
                <span>2. Employment Info</span>
              </button>

              <button
                type="button"
                onClick={() => setFormStep(3)}
                className={`flex items-center space-x-1.5 cursor-pointer ${
                  formStep === 3 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  formStep === 3 ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-500'
                }`}>3</span>
                <span>3. Supporting Docs</span>
              </button>

              <button
                type="button"
                onClick={() => setFormStep(4)}
                className={`flex items-center space-x-1.5 cursor-pointer ${
                  formStep === 4 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  formStep === 4 ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-500'
                }`}>4</span>
                <span>4. Review & Submit</span>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* STEP 1: PERSONAL & IDENTIFICATION */}
              {formStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Personal Information & Identity</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Abebe Kebede"
                        required
                      />
                      {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Nationality *</label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Ethiopian / Foreign"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="applicant@example.com"
                        required
                      />
                      {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="+251 91 123 4567"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Residential Address *</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Subcity, Woreda, House Number, City"
                        required
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2 pt-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Identification Document</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">ID Type *</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="Passport">Passport</option>
                        <option value="National ID">National ID Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">ID / Passport Number *</label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="EP8492019"
                        required
                      />
                      {errors.idNumber && <p className="text-rose-600 text-[11px] mt-1">{errors.idNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">ID Expiry Date *</label>
                      <input
                        type="date"
                        value={idExpiryDate}
                        onChange={(e) => setIdExpiryDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EMPLOYMENT DETAILS */}
              {formStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Sponsoring Employer & Contract Details</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Employer / Sponsoring Organization *</label>
                      <input
                        type="text"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Ethio Telecom / NGO / PLC"
                        required
                      />
                      {errors.employerName && <p className="text-rose-600 text-[11px] mt-1">{errors.employerName}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Employer Registration / Tax ID</label>
                      <input
                        type="text"
                        value={employerRegistrationNo}
                        onChange={(e) => setEmployerRegistrationNo(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="ET-REG-2024-991"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Senior Systems Architect"
                        required
                      />
                      {errors.jobTitle && <p className="text-rose-600 text-[11px] mt-1">{errors.jobTitle}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Industry / Category *</label>
                      <select
                        value={jobCategory}
                        onChange={(e) => setJobCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="Information & Communications Technology (ICT)">Information & Communications Technology (ICT)</option>
                        <option value="Healthcare & Specialized Medicine">Healthcare & Specialized Medicine</option>
                        <option value="Engineering & Infrastructure Construction">Engineering & Infrastructure Construction</option>
                        <option value="Agriculture & Food Processing">Agriculture & Food Processing</option>
                        <option value="Finance & Banking Operations">Finance & Banking Operations</option>
                        <option value="Education & Academic Research">Education & Academic Research</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Work Location *</label>
                      <input
                        type="text"
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Addis Ababa HQ"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Contract Duration (Months) *</label>
                      <select
                        value={contractDurationMonths}
                        onChange={(e) => setContractDurationMonths(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value={6}>6 Months (Short Term)</option>
                        <option value={12}>12 Months (1 Year)</option>
                        <option value={24}>24 Months (2 Years)</option>
                        <option value={36}>36 Months (3 Years)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Monthly Salary (ETB) *</label>
                      <input
                        type="number"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="85000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Proposed Start Date *</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Detailed Job Duties & Responsibilities *</label>
                      <textarea
                        rows={3}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Describe key duties, specialized skills required, and department role..."
                        required
                      />
                      {errors.jobDescription && <p className="text-rose-600 text-[11px] mt-1">{errors.jobDescription}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DOCUMENT UPLOADS */}
              {formStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Required Supporting Documents</span>
                    </h4>
                    <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                      5 of 5 Documents Attached
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Government regulations require the following 5 certified documents for work permit approval:
                  </p>

                  <div className="space-y-2.5">
                    {uploadedDocs.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-slate-300 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{doc.title}</div>
                            <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                              <span className="font-mono">{doc.fileName}</span>
                              <span>•</span>
                              <span>{doc.fileSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Attached</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & DECLARATION */}
              {formStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Application Summary & Legal Declaration</span>
                  </h4>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Applicant</span>
                      <span className="font-bold text-slate-900">{fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">ID / Passport</span>
                      <span className="font-mono text-blue-700 font-bold">{idNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Employer</span>
                      <span className="font-bold text-slate-900">{employerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Position</span>
                      <span className="text-slate-800 font-medium">{jobTitle}</span>
                    </div>
                  </div>

                  {/* Declaration Box */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <input
                        type="checkbox"
                        id="declaration-checkbox"
                        checked={declarationAccepted}
                        onChange={(e) => setDeclarationAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="declaration-checkbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                        <strong className="text-slate-900">Applicant Legal Declaration & Consent:</strong> I hereby certify that the information provided in this work permit application and all accompanying supporting documents are true, complete, and authentic. I authorize the Directorate of Foreign Employment to verify these records with my employer and relevant educational/medical authorities.
                      </label>
                    </div>
                    {errors.declaration && <p className="text-rose-600 text-xs font-semibold">{errors.declaration}</p>}
                  </div>
                </div>
              )}

            </form>

            {/* Modal Bottom Controls */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              {formStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setFormStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {formStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setFormStep((prev) => (prev + 1) as any)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Continue to Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Application to Government</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ACTIVE & RECENT APPLICATIONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>My Work Permit Applications ({applications.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Real-time Status Tracking & Automated Permit Issuance
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-semibold text-slate-800">No applications submitted yet.</p>
            <p className="text-xs mt-1 text-slate-500">Click "Apply for New Work Permit" above to start your digital application.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                
                {/* Application Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
                        {app.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        Submitted on: {app.submittedAt}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {app.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.employerName}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.workLocation}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {app.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {app.status === 'Under Review' && <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                      {app.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {app.status === 'Submitted' && <FileText className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{app.status}</span>
                    </span>

                    {app.status === 'Approved' && (
                      <button
                        onClick={() => onOpenPermit(app)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View / Download Permit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Stepper (Waterfall Lifecycle) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Application Lifecycle Progress
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    
                    {/* Stage 1: Submitted */}
                    <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">1. Submitted</div>
                        <div className="text-[10px] text-slate-500">{app.submittedAt.split(' ')[0]}</div>
                      </div>
                    </div>

                    {/* Stage 2: Under Review */}
                    <div
                      className={`flex items-center space-x-2 p-2 rounded-lg border ${
                        app.status === 'Under Review' || app.status === 'Approved'
                          ? 'bg-white border-amber-200 text-amber-800 shadow-xs'
                          : 'bg-white/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          app.status === 'Under Review' || app.status === 'Approved'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {app.status === 'Approved' ? '✓' : '2'}
                      </div>
                      <div>
                        <div className="font-bold text-[11px]">2. Officer Review</div>
                        <div className="text-[10px] text-slate-500">
                          {app.assignedOfficerName || 'Assigned to Officer'}
                        </div>
                      </div>
                    </div>

                    {/* Stage 3: Official Decision */}
                    <div
                      className={`flex items-center space-x-2 p-2 rounded-lg border ${
                        app.status === 'Approved'
                          ? 'bg-white border-emerald-200 text-emerald-800 shadow-xs'
                          : app.status === 'Rejected'
                          ? 'bg-white border-rose-200 text-rose-800 shadow-xs'
                          : 'bg-white/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          app.status === 'Approved'
                            ? 'bg-emerald-600 text-white'
                            : app.status === 'Rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {app.status === 'Approved' ? '✓' : app.status === 'Rejected' ? '✕' : '3'}
                      </div>
                      <div>
                        <div className="font-bold text-[11px]">3. Decision</div>
                        <div className="text-[10px] text-slate-500">
                          {app.status === 'Approved' ? 'Approved & Issued' : app.status === 'Rejected' ? 'Application Rejected' : 'Pending'}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Officer Remarks Banner (If Available) */}
                {app.officerComments && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 text-[11px] block mb-0.5">
                      Reviewing Officer Remarks ({app.assignedOfficerName || 'Directorate'}):
                    </span>
                    <p className="text-slate-600">{app.officerComments}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
