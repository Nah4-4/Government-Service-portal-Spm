import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Paperclip,
  PlusCircle,
  ArrowRight,
  Clock,
  Wand2,
  Info,
  Store,
} from 'lucide-react';
import { TradingLicenseApplication, User, UploadedDoc, BusinessType, PremisesType } from '../types';
import { STATUS_META } from '../config/status';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader, CardTitle, SectionHeading } from './ui/Card';
import { Badge, DataPoint, Eyebrow } from './ui/Badge';
import { StatusBadge, StatusDot } from './ui/StatusBadge';
import { Field, Input, Select, Textarea, Checkbox } from './ui/Field';
import { Modal } from './ui/Modal';
import { Stepper, StepDef } from './ui/Stepper';
import { StatCard } from './ui/StatCard';
import { EmptyState } from './ui/EmptyState';

interface ApplicantViewProps {
  currentUser: User;
  applications: TradingLicenseApplication[];
  section: string;
  isWizardOpen: boolean;
  onOpenWizard: () => void;
  onCloseWizard: () => void;
  onSubmitApplication: (
    newApp: Omit<TradingLicenseApplication, 'id' | 'referenceNumber' | 'status' | 'submittedAt' | 'updatedAt'>
  ) => void;
  onOpenLicense: (app: TradingLicenseApplication) => void;
  onNavigate: (section: string) => void;
}

const WIZARD_STEPS: StepDef[] = [
  { id: 1, label: 'Owner' },
  { id: 2, label: 'Business' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review' },
];

const BUSINESS_TYPES: BusinessType[] = [
  'Sole Proprietorship',
  'Private Limited Company (PLC)',
  'Share Company (S.C.)',
  'General Partnership',
  'Cooperative Society',
  'Branch of Foreign Company',
];

const PREMISES_TYPES: PremisesType[] = [
  'Owned',
  'Rented / Leased',
  'Shared',
  'Home-based / Virtual',
];

const BUSINESS_SECTORS = [
  'Wholesale & Retail Trade',
  'Import & Export Trade',
  'Construction & Building Materials',
  'Agriculture & Agro-Processing',
  'Food, Beverage & Hospitality',
  'Manufacturing & Light Industry',
  'Transport & Logistics',
  'Information Technology & Digital Services',
  'Financial & Business Consultancy',
  'Health, Pharmacy & Medical Supplies',
];

const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Oromia',
  'Amhara',
  'Tigray',
  'Sidama',
  'Central Ethiopia',
  'South Ethiopia',
  'Somali',
  'Afar',
  'Benishangul-Gumuz',
  'Gambela',
  'Harari',
  'Dire Dawa',
];

export const ApplicantView: React.FC<ApplicantViewProps> = ({
  currentUser,
  applications,
  section,
  isWizardOpen,
  onOpenWizard,
  onCloseWizard,
  onSubmitApplication,
  onOpenLicense,
  onNavigate,
}) => {
  const latest = applications[0];
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState(currentUser.name || latest?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(latest?.dateOfBirth || '1994-06-20');
  const [gender, setGender] = useState<'Male' | 'Female'>(latest?.gender || 'Male');
  const [nationality, setNationality] = useState(latest?.nationality || 'Ethiopian');
  const [address, setAddress] = useState(latest?.address || 'Bole Subcity, Woreda 04, Addis Ababa');
  const [phone, setPhone] = useState(currentUser.phone || latest?.phone || '+251 91 123 4567');
  const [email, setEmail] = useState(currentUser.email || latest?.email || '');

  const [idType, setIdType] = useState<'Fayda National ID' | 'Kebele ID' | 'Passport'>(
    (latest?.idType as 'Fayda National ID' | 'Kebele ID' | 'Passport') || 'Fayda National ID'
  );
  const [idNumber, setIdNumber] = useState(latest?.idNumber || 'FYD-9402-1948-2210');
  const [idExpiryDate, setIdExpiryDate] = useState(latest?.idExpiryDate || '2032-05-15');
  const [issuingAuthority, setIssuingAuthority] = useState(
    latest?.issuingAuthority || 'Addis Ababa City Administration'
  );

  const [tradeName, setTradeName] = useState('Nile Star General Trading');
  const [tradeNameRegistrationNo, setTradeNameRegistrationNo] = useState('TN/AA/2026/09941');
  const [businessType, setBusinessType] = useState<BusinessType>(BUSINESS_TYPES[0]);
  const [tinNumber, setTinNumber] = useState('0049217338');
  const [businessSector, setBusinessSector] = useState(BUSINESS_SECTORS[0]);
  const [businessSubSector, setBusinessSubSector] = useState(
    'Retail sale of electronics and household appliances'
  );
  const [businessActivity, setBusinessActivity] = useState(
    'Retail sale of consumer electronics, home appliances and accessories, including after-sales warranty servicing at the registered premises.'
  );

  const [region, setRegion] = useState('Addis Ababa');
  const [subCity, setSubCity] = useState('Bole');
  const [woreda, setWoreda] = useState('04');
  const [houseNumber, setHouseNumber] = useState('B-1140');
  const [premisesType, setPremisesType] = useState<PremisesType>('Rented / Leased');

  const [capital, setCapital] = useState<number>(1500000);
  const [capitalCurrency] = useState('ETB');
  const [employeeCount, setEmployeeCount] = useState<number>(8);
  const [commencementDate, setCommencementDate] = useState('2026-09-01');
  const [licenseTermYears, setLicenseTermYears] = useState<number>(1);

  const [declarationAccepted, setDeclarationAccepted] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [uploadedDocs] = useState<UploadedDoc[]>([
    {
      id: 'doc-photo',
      type: 'owner_photo',
      title: 'Owner Passport Size Photograph',
      fileName: 'owner_photo_biometric.jpg',
      fileSize: '480 KB',
      uploadedAt: 'Just now',
      status: 'Pending',
      previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-id',
      type: 'owner_id',
      title: 'Owner Fayda / Kebele ID or Passport Scan',
      fileName: 'owner_identification_scan.pdf',
      fileSize: '1.9 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-trade-name',
      type: 'trade_name_certificate',
      title: 'Trade Name Registration Certificate',
      fileName: 'trade_name_registration_certificate.pdf',
      fileSize: '2.5 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-tin',
      type: 'tin_certificate',
      title: 'TIN Registration Certificate',
      fileName: 'tin_registration_certificate.pdf',
      fileSize: '950 KB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
    {
      id: 'doc-lease',
      type: 'lease_agreement',
      title: 'Premises Lease Agreement / Title Deed',
      fileName: 'premises_lease_agreement_stamped.pdf',
      fileSize: '3.4 MB',
      uploadedAt: 'Just now',
      status: 'Pending',
    },
  ]);

  // Demo auto-fill helpers for class presentations
  const handleAutoFillRetail = () => {
    setFullName('Henok Tadesse');
    setDateOfBirth('1993-08-14');
    setGender('Male');
    setNationality('Ethiopian');
    setAddress('Kirkos Subcity, House 502, Addis Ababa');
    setPhone('+251 92 888 1234');
    setEmail('henok.tadesse@nilestar.et');
    setIdType('Fayda National ID');
    setIdNumber('FYD-7749-1027-4415');
    setIdExpiryDate('2031-11-20');
    setIssuingAuthority('Addis Ababa City Administration');
    setTradeName('Sheger Building Materials Wholesale');
    setTradeNameRegistrationNo('TN/AA/2026/08821');
    setBusinessType('Private Limited Company (PLC)');
    setTinNumber('0038829174');
    setBusinessSector(BUSINESS_SECTORS[2]);
    setBusinessSubSector('Wholesale of cement, steel and finishing materials');
    setBusinessActivity(
      'Bulk supply of cement, reinforcement steel and finishing materials to licensed contractors, with warehousing and delivery logistics.'
    );
    setRegion('Addis Ababa');
    setSubCity('Kirkos');
    setWoreda('05');
    setHouseNumber('K-502');
    setPremisesType('Rented / Leased');
    setCapital(3200000);
    setEmployeeCount(22);
    setCommencementDate('2026-09-15');
    setLicenseTermYears(1);
    setDeclarationAccepted(true);
    setErrors({});
  };

  const handleAutoFillImportExport = () => {
    setFullName('Meseret Alemu');
    setDateOfBirth('1985-04-12');
    setGender('Female');
    setNationality('Ethiopian');
    setAddress('Kazanchis, House 104, Addis Ababa');
    setPhone('+251 94 555 8901');
    setEmail('meseret.alemu@abyssiniatrade.et');
    setIdType('Kebele ID');
    setIdNumber('KEB-AA-8920148');
    setIdExpiryDate('2030-08-10');
    setIssuingAuthority('Addis Ababa City Administration');
    setTradeName('Abyssinia Coffee Export Trading PLC');
    setTradeNameRegistrationNo('TN/AA/2026/04491');
    setBusinessType('Private Limited Company (PLC)');
    setTinNumber('0044918820');
    setBusinessSector(BUSINESS_SECTORS[1]);
    setBusinessSubSector('Export of green coffee and oilseeds');
    setBusinessActivity(
      'Sourcing, grading and export of washed and natural green coffee and oilseeds to international buyers through ECX-registered channels.'
    );
    setRegion('Addis Ababa');
    setSubCity('Kirkos');
    setWoreda('08');
    setHouseNumber('KZ-104');
    setPremisesType('Owned');
    setCapital(8500000);
    setEmployeeCount(41);
    setCommencementDate('2026-10-01');
    setLicenseTermYears(1);
    setDeclarationAccepted(true);
    setErrors({});
  };

  /** Validates a single wizard step, so Continue cannot skip a broken step. */
  const validateStep = (step: number) => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!fullName.trim()) errs.fullName = 'Enter your full legal name';
      if (!nationality.trim()) errs.nationality = 'Enter your nationality';
      if (!email.trim() || !email.includes('@')) errs.email = 'Enter a valid email address';
      if (!phone.trim()) errs.phone = 'Enter a contact phone number';
      if (!address.trim()) errs.address = 'Enter your residential address';
      if (!idNumber.trim()) errs.idNumber = `Enter your ${idType.toLowerCase()} number`;
    }

    if (step === 2) {
      if (!tradeName.trim()) errs.tradeName = 'Enter the registered trade name';
      if (!/^\d{10}$/.test(tinNumber.trim())) errs.tinNumber = 'Enter the 10-digit TIN';
      if (!businessSubSector.trim()) errs.businessSubSector = 'Enter the trade sub-sector';
      if (!subCity.trim()) errs.subCity = 'Enter the sub-city or town';
      if (!woreda.trim()) errs.woreda = 'Enter the woreda';
      if (!capital || capital <= 0) errs.capital = 'Enter the registered capital';
      if (!businessActivity.trim()) errs.businessActivity = 'Describe the trade activity';
    }

    if (step === 4) {
      if (!declarationAccepted) errs.declaration = 'You must accept the legal declaration';
    }

    return errs;
  };

  const goToStep = (step: 1 | 2 | 3 | 4) => {
    setErrors({});
    setFormStep(step);
  };

  const handleContinue = () => {
    const errs = validateStep(formStep);
    setErrors(errs);
    if (Object.keys(errs).length === 0 && formStep < 4) {
      setFormStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const submit = () => {
    // Validate every step, not just the last, then jump to the first problem.
    for (const step of [1, 2, 4]) {
      const errs = validateStep(step);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        setFormStep(step as 1 | 2 | 4);
        return;
      }
    }

    setErrors({});

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
      issuingAuthority,
      tradeName,
      tradeNameRegistrationNo,
      businessType,
      tinNumber,
      businessSector,
      businessSubSector,
      businessActivity,
      region,
      subCity,
      woreda,
      houseNumber,
      premisesType,
      capital: Number(capital),
      capitalCurrency,
      employeeCount: Number(employeeCount),
      commencementDate,
      licenseTermYears: Number(licenseTermYears),
      documents: uploadedDocs,
      declarationAccepted,
    });

    setFormStep(1);
    onCloseWizard();
  };

  /**
   * Enter inside any field used to submit the whole application from step 1,
   * because a single form wrapped all four steps. Advance instead, and only
   * actually submit from the final step.
   */
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formStep < 4) {
      handleContinue();
    } else {
      submit();
    }
  };

  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const inProgressCount = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Under Review'
  ).length;

  return (
    <div className="space-y-8">
      {section === 'overview' && (
        <>
          {/* Greeting */}
          <div>
            <Eyebrow>Citizen portal</Eyebrow>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Welcome, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              Apply for a business trading licence online, upload your certified documents once,
              follow the review as it happens, and download your sealed licence the moment it is
              approved.
            </p>
          </div>

          {/* At a glance */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total applications"
              value={applications.length}
              hint="Filed under your account"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard
              label="In progress"
              value={inProgressCount}
              tone="review"
              hint="Awaiting a directorate decision"
              icon={<Clock className="h-4 w-4" />}
            />
            <StatCard
              label="Licences issued"
              value={approvedCount}
              tone="approved"
              hint="Ready to download as PDF"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>

          {/* Next step */}
          {latest ? (
            <Card>
              <CardHeader>
                <CardTitle hint="Your most recent application">Where things stand</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  onClick={() => onNavigate('applications')}
                >
                  View all
                </Button>
              </CardHeader>
              <CardBody className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={latest.status} />
                  <Badge tone="navy" shape="tag" mono>
                    {latest.referenceNumber}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {STATUS_META[latest.status].hint}
                  </span>
                </div>

                <p className="text-[15px] font-semibold text-slate-900">{latest.tradeName}</p>

                {latest.status === 'Approved' && (
                  <Button
                    variant="primary"
                    icon={<Download className="h-4 w-4" />}
                    onClick={() => onOpenLicense(latest)}
                  >
                    View your trading licence
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="No applications yet"
              description="Start a new trading licence application. It takes four short steps and you can review everything before submitting."
              action={
                <Button
                  variant="primary"
                  icon={<PlusCircle className="h-4 w-4" />}
                  onClick={onOpenWizard}
                >
                  Start an application
                </Button>
              }
            />
          )}
        </>
      )}

      {section === 'applications' && (
        <>
          <SectionHeading
            title={`My applications (${applications.length})`}
            hint="Live status tracking and automated licence issuance"
            actions={
              <Button
                variant="primary"
                icon={<PlusCircle className="h-4 w-4" />}
                onClick={onOpenWizard}
              >
                New application
              </Button>
            }
          />

          {applications.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="No applications submitted yet"
              description="Once you submit an application it will appear here with a reference number and live progress."
              action={
                <Button
                  variant="primary"
                  icon={<PlusCircle className="h-4 w-4" />}
                  onClick={onOpenWizard}
                >
                  Start an application
                </Button>
              }
            />
          ) : (
            <div className="space-y-5">
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} onOpenLicense={onOpenLicense} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Application wizard                                               */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={isWizardOpen}
        onClose={onCloseWizard}
        size="md"
        eyebrow={
          <Badge tone="navy" shape="tag" uppercase>
            Government application form
          </Badge>
        }
        title="Business trading licence application"
        subtitle="Four steps. Nothing is submitted until you confirm on the last one."
        flushBody
        footer={
          <>
            {formStep > 1 ? (
              <Button onClick={() => goToStep((formStep - 1) as 1 | 2 | 3)}>Back</Button>
            ) : (
              <Button variant="ghost" onClick={onCloseWizard}>
                Cancel
              </Button>
            )}

            {formStep < 4 ? (
              <Button
                variant="primary"
                trailingIcon={<ArrowRight className="h-4 w-4" />}
                onClick={handleContinue}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                icon={<ShieldCheck className="h-4 w-4" />}
                onClick={submit}
              >
                Submit application
              </Button>
            )}
          </>
        }
      >
        {/* Progress */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
          <Stepper steps={WIZARD_STEPS} current={formStep} onStepClick={(id) => goToStep(id as 1 | 2 | 3 | 4)} />
        </div>

        <form onSubmit={handleFormSubmit} className="px-6 py-6">
          {/* STEP 1 — IDENTITY */}
          {formStep === 1 && (
            <div className="animate-fade-in space-y-6">
              {/* Demo prefill, kept quiet and only where it is useful */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Wand2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="text-sm text-slate-500">Prefill with sample data:</span>
                <Button variant="ghost" size="sm" onClick={handleAutoFillRetail}>
                  Building materials
                </Button>
                <Button variant="ghost" size="sm" onClick={handleAutoFillImportExport}>
                  Coffee exporter
                </Button>
              </div>

              <FormSection icon={<ShieldCheck className="h-4 w-4" />} title="Owner information">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full legal name" required error={errors.fullName}>
                    {(p) => (
                      <Input
                        {...p}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={currentUser.name ? `e.g. ${currentUser.name}` : 'e.g. Eyob Derebay'}
                      />
                    )}
                  </Field>

                  <Field label="Nationality" required error={errors.nationality}>
                    {(p) => (
                      <Input
                        {...p}
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="e.g. Ethiopian"
                      />
                    )}
                  </Field>

                  <Field label="Date of birth" required>
                    {(p) => (
                      <Input
                        {...p}
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Gender" required>
                    {(p) => (
                      <Select
                        {...p}
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    )}
                  </Field>

                  <Field label="Email address" required error={errors.email} hint="Decisions are sent here">
                    {(p) => (
                      <Input
                        {...p}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="applicant@example.com"
                      />
                    )}
                  </Field>

                  <Field label="Phone number" required error={errors.phone} hint="Used for SMS alerts">
                    {(p) => (
                      <Input
                        {...p}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 91 123 4567"
                      />
                    )}
                  </Field>

                  <Field
                    label="Residential address"
                    required
                    error={errors.address}
                    className="sm:col-span-2"
                  >
                    {(p) => (
                      <Input
                        {...p}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Subcity, Woreda, House number, City"
                      />
                    )}
                  </Field>
                </div>
              </FormSection>

              <FormSection icon={<FileText className="h-4 w-4" />} title="Identification document">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Document type" required>
                    {(p) => (
                      <Select
                        {...p}
                        value={idType}
                        onChange={(e) =>
                          setIdType(e.target.value as 'Fayda National ID' | 'Kebele ID' | 'Passport')
                        }
                      >
                        <option value="Fayda National ID">Fayda National ID</option>
                        <option value="Kebele ID">Kebele ID card</option>
                        <option value="Passport">Passport</option>
                      </Select>
                    )}
                  </Field>

                  <Field label="Document number" required error={errors.idNumber}>
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="FYD-9402-1948-2210"
                      />
                    )}
                  </Field>

                  <Field label="Expiry date" required>
                    {(p) => (
                      <Input
                        {...p}
                        type="date"
                        value={idExpiryDate}
                        onChange={(e) => setIdExpiryDate(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Issuing authority" required>
                    {(p) => (
                      <Input
                        {...p}
                        value={issuingAuthority}
                        onChange={(e) => setIssuingAuthority(e.target.value)}
                        placeholder="e.g. Addis Ababa City Administration"
                      />
                    )}
                  </Field>
                </div>
              </FormSection>
            </div>
          )}

          {/* STEP 2 — BUSINESS */}
          {formStep === 2 && (
            <div className="animate-fade-in space-y-6">
              <FormSection
                icon={<Store className="h-4 w-4" />}
                title="Business registration details"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Registered trade name" required error={errors.tradeName}>
                    {(p) => (
                      <Input
                        {...p}
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="e.g. Nile Star General Trading"
                      />
                    )}
                  </Field>

                  <Field label="Trade name registration no." hint="Optional">
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        required={false}
                        value={tradeNameRegistrationNo}
                        onChange={(e) => setTradeNameRegistrationNo(e.target.value)}
                        placeholder="TN/AA/2026/09941"
                      />
                    )}
                  </Field>

                  <Field label="Legal business type" required>
                    {(p) => (
                      <Select
                        {...p}
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  <Field
                    label="TIN (Taxpayer ID)"
                    required
                    error={errors.tinNumber}
                    hint="10 digits from the Ministry of Revenues"
                  >
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        inputMode="numeric"
                        maxLength={10}
                        value={tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        placeholder="0049217338"
                      />
                    )}
                  </Field>

                  <Field label="Business sector" required>
                    {(p) => (
                      <Select
                        {...p}
                        value={businessSector}
                        onChange={(e) => setBusinessSector(e.target.value)}
                      >
                        {BUSINESS_SECTORS.map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  <Field label="Trade sub-sector" required error={errors.businessSubSector}>
                    {(p) => (
                      <Input
                        {...p}
                        value={businessSubSector}
                        onChange={(e) => setBusinessSubSector(e.target.value)}
                        placeholder="e.g. Retail sale of electronics"
                      />
                    )}
                  </Field>

                  <Field
                    label="Approved trade activity"
                    required
                    error={errors.businessActivity}
                    className="sm:col-span-2"
                  >
                    {(p) => (
                      <Textarea
                        {...p}
                        rows={4}
                        value={businessActivity}
                        onChange={(e) => setBusinessActivity(e.target.value)}
                        placeholder="Describe the goods traded or services offered, and how the business operates from the registered premises."
                      />
                    )}
                  </Field>
                </div>
              </FormSection>

              <FormSection icon={<MapPin className="h-4 w-4" />} title="Trading premises">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Region / city administration" required>
                    {(p) => (
                      <Select {...p} value={region} onChange={(e) => setRegion(e.target.value)}>
                        {ETHIOPIAN_REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  <Field label="Sub-city / town" required error={errors.subCity}>
                    {(p) => (
                      <Input
                        {...p}
                        value={subCity}
                        onChange={(e) => setSubCity(e.target.value)}
                        placeholder="e.g. Bole"
                      />
                    )}
                  </Field>

                  <Field label="Woreda" required error={errors.woreda}>
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        value={woreda}
                        onChange={(e) => setWoreda(e.target.value)}
                        placeholder="04"
                      />
                    )}
                  </Field>

                  <Field label="House / premises number" hint="Optional">
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        required={false}
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="B-1140"
                      />
                    )}
                  </Field>

                  <Field label="Premises tenure" required>
                    {(p) => (
                      <Select
                        {...p}
                        value={premisesType}
                        onChange={(e) => setPremisesType(e.target.value as PremisesType)}
                      >
                        {PREMISES_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
              </FormSection>

              <FormSection icon={<Building2 className="h-4 w-4" />} title="Capital and operations">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Registered capital (ETB)" required error={errors.capital}>
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        type="number"
                        min={0}
                        value={capital}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        placeholder="1500000"
                      />
                    )}
                  </Field>

                  <Field label="Number of employees" required>
                    {(p) => (
                      <Input
                        {...p}
                        mono
                        type="number"
                        min={0}
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(Number(e.target.value))}
                        placeholder="8"
                      />
                    )}
                  </Field>

                  <Field label="Planned commencement date" required>
                    {(p) => (
                      <Input
                        {...p}
                        type="date"
                        value={commencementDate}
                        onChange={(e) => setCommencementDate(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Licence term" required hint="Renewable annually">
                    {(p) => (
                      <Select
                        {...p}
                        value={licenseTermYears}
                        onChange={(e) => setLicenseTermYears(Number(e.target.value))}
                      >
                        <option value={1}>1 year (standard renewal)</option>
                        <option value={2}>2 years</option>
                        <option value={3}>3 years</option>
                      </Select>
                    )}
                  </Field>
                </div>
              </FormSection>
            </div>
          )}

          {/* STEP 3 — DOCUMENTS */}
          {formStep === 3 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900">
                    Supporting documents
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Regulations require these five certified documents.
                  </p>
                </div>
                <Badge tone="approved" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                  {uploadedDocs.length} of {uploadedDocs.length} attached
                </Badge>
              </div>

              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                {uploadedDocs.map((doc, index) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-4 bg-white px-4 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="numeric flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-sm font-semibold text-navy-700">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {doc.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <Paperclip className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="truncate font-mono">{doc.fileName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="shrink-0">{doc.fileSize}</span>
                        </span>
                      </span>
                    </div>

                    <Badge tone="approved" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                      Attached
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 4 — REVIEW */}
          {formStep === 4 && (
            <div className="animate-fade-in space-y-6">
              <FormSection
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Check your answers"
              >
                <dl className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2">
                  <DataPoint label="Owner" value={fullName} />
                  <DataPoint label={idType} value={idNumber} mono />
                  <DataPoint label="Trade name" value={tradeName} />
                  <DataPoint label="Business type" value={businessType} />
                  <DataPoint label="TIN" value={tinNumber} mono />
                  <DataPoint label="Sector" value={businessSector} />
                  <DataPoint
                    label="Premises"
                    value={`${subCity}, Woreda ${woreda}${houseNumber ? `, ${houseNumber}` : ''} · ${region}`}
                  />
                  <DataPoint
                    label="Capital & term"
                    value={`${Number(capital).toLocaleString()} ${capitalCurrency} · ${licenseTermYears} year licence`}
                  />
                </dl>

                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 underline decoration-navy-300 underline-offset-2 transition-colors hover:text-navy-900 cursor-pointer"
                >
                  Something wrong? Go back and edit
                </button>
              </FormSection>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <Checkbox
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  error={errors.declaration}
                >
                  <strong className="font-semibold text-slate-900">
                    Applicant declaration and consent.
                  </strong>{' '}
                  I certify that the information in this application and all accompanying
                  documents is true, complete and authentic. I authorize the Trade Registration
                  &amp; Business Licensing Directorate to verify these records with the Ministry of
                  Revenues, the commercial register and the relevant regional trade bureau.
                </Checkbox>
              </div>
            </div>
          )}

          {/* Submits via the footer button; present so Enter is handled correctly. */}
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const FormSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <fieldset>
    <legend className="mb-4 flex w-full items-center gap-2 border-b border-slate-200 pb-2.5 text-sm font-semibold uppercase tracking-wider text-slate-700">
      <span className="text-navy-600" aria-hidden="true">
        {icon}
      </span>
      {title}
    </legend>
    {children}
  </fieldset>
);

/* -------------------------------------------------------------------------- */

interface ApplicationCardProps {
  app: TradingLicenseApplication;
  onOpenLicense: (app: TradingLicenseApplication) => void;
}

/** Maps a status onto the three-stage lifecycle track. */
function lifecycleProgress(app: TradingLicenseApplication) {
  const steps: StepDef[] = [
    { id: 1, label: 'Submitted', meta: app.submittedAt.split(' ')[0] },
    {
      id: 2,
      label: 'Officer review',
      meta: app.assignedOfficerName ?? 'Awaiting assignment',
    },
    {
      id: 3,
      label: 'Decision',
      meta:
        app.status === 'Approved'
          ? 'Approved and issued'
          : app.status === 'Rejected'
            ? 'Not approved'
            : 'Pending',
    },
  ];

  if (app.status === 'Approved') return { steps, current: 4, failedAt: undefined };
  if (app.status === 'Rejected') return { steps, current: 3, failedAt: 3 };
  return { steps, current: 2, failedAt: undefined };
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onOpenLicense }) => {
  const { steps, current, failedAt } = lifecycleProgress(app);

  return (
    <Card>
      {/* Identity row */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="navy" shape="tag" mono>
              {app.referenceNumber}
            </Badge>
            <span className="text-sm text-slate-500">Submitted {app.submittedAt}</span>
          </div>

          <h3 className="mt-2.5 text-lg font-semibold tracking-tight text-slate-900">
            {app.tradeName}
          </h3>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            {app.businessSector}
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            {app.subCity}, Woreda {app.woreda}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <StatusBadge status={app.status} />
          {app.status === 'Approved' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => onOpenLicense(app)}
            >
              View licence
            </Button>
          )}
        </div>
      </div>

      {/* Lifecycle */}
      <div className="px-6 py-6">
        <Eyebrow className="mb-5">Progress</Eyebrow>
        <Stepper steps={steps} current={current} failedAt={failedAt} />
      </div>

      {/* Officer remarks */}
      {app.officerComments && (
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex gap-3 rounded-lg bg-slate-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Remarks from {app.assignedOfficerName ?? 'the directorate'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {app.officerComments}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live status hint */}
      {(app.status === 'Under Review' || app.status === 'Submitted') && (
        <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-3 text-sm text-slate-500">
          <StatusDot status={app.status} pulse />
          {STATUS_META[app.status].hint}
        </div>
      )}
    </Card>
  );
};
