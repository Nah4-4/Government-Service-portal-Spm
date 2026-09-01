import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  ShieldCheck,
  Download,
  Building2,
  UserCircle,
  Inbox,
  BadgeCheck,
  FileCheck2,
  Store,
} from 'lucide-react';
import { TradingLicenseApplication, User, ApplicationStatus } from '../types';
import { STATUS_ORDER } from '../config/status';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader, CardTitle, SectionHeading } from './ui/Card';
import { Badge, DataPoint, Eyebrow } from './ui/Badge';
import { StatusBadge } from './ui/StatusBadge';
import { Field, SearchInput, Textarea } from './ui/Field';
import { Modal } from './ui/Modal';
import { StatCard } from './ui/StatCard';
import { EmptyState } from './ui/EmptyState';
import { Table, THead, TBody, Th, Td, Tr, TableEmpty } from './ui/DataTable';

interface OfficerDashboardProps {
  currentUser: User;
  applications: TradingLicenseApplication[];
  section: string;
  onUpdateStatus: (
    appId: string,
    status: 'Under Review' | 'Approved' | 'Rejected',
    comments: string,
    officerName: string
  ) => void;
  onOpenLicense: (app: TradingLicenseApplication) => void;
}

type StatusFilter = 'ALL' | ApplicationStatus;

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  currentUser,
  applications,
  section,
  onUpdateStatus,
  onOpenLicense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedApp, setSelectedApp] = useState<TradingLicenseApplication | null>(null);
  const [officerComments, setOfficerComments] = useState('');
  const [activeDocPreview, setActiveDocPreview] = useState<string | null>(null);

  const matchesSearch = (app: TradingLicenseApplication) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return [app.fullName, app.referenceNumber, app.tradeName, app.businessSector, app.tinNumber]
      .join(' ')
      .toLowerCase()
      .includes(term);
  };

  const queueApps = applications.filter(
    (app) => matchesSearch(app) && (statusFilter === 'ALL' || app.status === statusFilter)
  );

  const issuedApps = applications.filter(
    (app) => app.status === 'Approved' && matchesSearch(app)
  );

  const countOf = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status).length;

  const handleOpenReview = (app: TradingLicenseApplication) => {
    setSelectedApp(app);
    setOfficerComments(
      app.officerComments ||
        'Trade name, TIN registration, and premises documents verified against the commercial register.'
    );
    setActiveDocPreview(null);
  };

  const decide = (status: 'Under Review' | 'Approved' | 'Rejected', fallback: string) => {
    if (!selectedApp) return;

    onUpdateStatus(
      selectedApp.id,
      status,
      officerComments || fallback,
      currentUser.name || 'Officer Dawit Haile'
    );
    setSelectedApp(null);
  };

  return (
    <div className="space-y-8">
      {section === 'queue' && (
        <>
          {/* Heading */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Trade Registration &amp; Business Licensing</Eyebrow>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Review queue
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                Inspect registration records, record your findings, and either issue a sealed
                trading licence or return the application with feedback.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
              <Eyebrow>Reviewing officer</Eyebrow>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="numeric mt-0.5 font-mono text-xs text-navy-700">
                {currentUser.badgeNumber || 'OFF-8842-ETH'}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Pending review"
              value={countOf('Submitted')}
              hint="Awaiting first inspection"
              icon={<FileText className="h-4 w-4" />}
              tone="navy"
            />
            <StatCard
              label="Under review"
              value={countOf('Under Review')}
              hint="Registry checks in progress"
              icon={<Clock className="h-4 w-4" />}
              tone="review"
            />
            <StatCard
              label="Approved"
              value={countOf('Approved')}
              hint="Licences dispatched"
              icon={<CheckCircle2 className="h-4 w-4" />}
              tone="approved"
            />
            <StatCard
              label="Rejected"
              value={countOf('Rejected')}
              hint="Feedback returned to applicant"
              icon={<XCircle className="h-4 w-4" />}
              tone="rejected"
            />
          </div>

          {/* Toolbar + table */}
          <Card>
            <CardHeader className="gap-4">
              <SearchInput
                icon={<Search className="h-4 w-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference, owner, trade name…"
                aria-label="Search applications"
                className="w-full sm:w-80"
              />

              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label="Filter by status"
              >
                {(['ALL', ...STATUS_ORDER] as StatusFilter[]).map((status) => {
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setStatusFilter(status)}
                      className={`h-8 rounded-lg border px-3 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'border-navy-700 bg-navy-700 text-white'
                          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {status === 'ALL' ? 'All' : status}
                    </button>
                  );
                })}
              </div>
            </CardHeader>

            <Table>
              <THead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Owner</Th>
                  <Th>Business &amp; sector</Th>
                  <Th>Submitted</Th>
                  <Th>Status</Th>
                  <Th align="right">Action</Th>
                </tr>
              </THead>
              <TBody>
                {queueApps.length === 0 ? (
                  <TableEmpty colSpan={6}>
                    No applications match this search or filter.
                  </TableEmpty>
                ) : (
                  queueApps.map((app) => (
                    <Tr key={app.id}>
                      <Td className="numeric font-mono font-semibold text-navy-700">
                        {app.referenceNumber}
                      </Td>
                      <Td>
                        <div className="font-semibold text-slate-900">{app.fullName}</div>
                        <div className="numeric mt-0.5 font-mono text-xs text-slate-500">
                          {app.idType}: {app.idNumber}
                        </div>
                      </Td>
                      <Td>
                        <div className="font-medium text-slate-900">{app.tradeName}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{app.businessSector}</div>
                      </Td>
                      <Td className="whitespace-nowrap text-slate-600">{app.submittedAt}</Td>
                      <Td>
                        <StatusBadge status={app.status} size="sm" />
                      </Td>
                      <Td align="right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Eye className="h-3.5 w-3.5" />}
                            onClick={() => handleOpenReview(app)}
                          >
                            Review
                          </Button>
                          {app.status === 'Approved' && (
                            <Button
                              size="sm"
                              icon={<Download className="h-3.5 w-3.5" />}
                              onClick={() => onOpenLicense(app)}
                            >
                              Licence
                            </Button>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </TBody>
            </Table>

            {queueApps.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/60 px-6 py-3 text-sm text-slate-500">
                <span>
                  Showing{' '}
                  <span className="numeric font-semibold text-slate-900">
                    {queueApps.length}
                  </span>{' '}
                  of {applications.length}
                </span>
                <span>
                  Average turnaround{' '}
                  <span className="font-semibold text-approved-text">2.4 days</span>
                </span>
              </div>
            )}
          </Card>
        </>
      )}

      {section === 'issued' && (
        <>
          <SectionHeading
            title={`Issued licences (${issuedApps.length})`}
            hint="Trading licences approved and sealed by the directorate"
            actions={
              <SearchInput
                icon={<Search className="h-4 w-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issued licences…"
                aria-label="Search issued licences"
                className="w-full sm:w-72"
              />
            }
          />

          {issuedApps.length === 0 ? (
            <EmptyState
              icon={<BadgeCheck className="h-6 w-6" />}
              title="No licences issued yet"
              description="Approve an application from the review queue and the sealed trading licence will be listed here."
            />
          ) : (
            <Card>
              <Table>
                <THead>
                  <tr>
                    <Th>Licence number</Th>
                    <Th>Owner</Th>
                    <Th>Trade name</Th>
                    <Th>Renewal due</Th>
                    <Th align="right">Certificate</Th>
                  </tr>
                </THead>
                <TBody>
                  {issuedApps.map((app) => (
                    <Tr key={app.id}>
                      <Td className="numeric font-mono font-semibold text-navy-700">
                        {app.licenseNumber ?? '—'}
                      </Td>
                      <Td>
                        <div className="font-semibold text-slate-900">{app.fullName}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{app.businessSector}</div>
                      </Td>
                      <Td className="text-slate-600">{app.tradeName}</Td>
                      <Td className="numeric whitespace-nowrap font-medium text-approved-text">
                        {app.expiryDate ?? '—'}
                      </Td>
                      <Td align="right">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Download className="h-3.5 w-3.5" />}
                          onClick={() => onOpenLicense(app)}
                        >
                          Open
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>
          )}
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Verification dossier                                             */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        size="lg"
        eyebrow={
          selectedApp && (
            <>
              <Badge tone="navy" shape="tag" mono>
                {selectedApp.referenceNumber}
              </Badge>
              <StatusBadge status={selectedApp.status} size="sm" />
            </>
          )
        }
        title={selectedApp ? `Verification dossier — ${selectedApp.fullName}` : ''}
        subtitle="Confirm the record, then record your decision below."
        footer={
          <>
            <Button
              variant="danger"
              icon={<XCircle className="h-4 w-4" />}
              onClick={() =>
                decide(
                  'Rejected',
                  'Application rejected due to incomplete registration documents or an unverified TIN or premises record.'
                )
              }
            >
              Reject
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() =>
                  decide(
                    'Under Review',
                    'Application under active verification with the commercial register and Ministry of Revenues.'
                  )
                }
              >
                Mark under review
              </Button>
              <Button
                variant="primary"
                icon={<ShieldCheck className="h-4 w-4" />}
                onClick={() =>
                  decide(
                    'Approved',
                    'Approved following complete trade name, TIN and premises verification.'
                  )
                }
              >
                Approve &amp; issue licence
              </Button>
            </div>
          </>
        }
      >
        {selectedApp && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: the record */}
            <div className="space-y-5">
              <Card tone="inset">
                <CardHeader className="border-slate-200 px-5 py-3">
                  <CardTitle
                    as="h3"
                    icon={<UserCircle className="h-4 w-4 text-navy-600" />}
                  >
                    Owner identification
                  </CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-5 px-5 py-4">
                  <DataPoint label="Full name" value={selectedApp.fullName} />
                  <DataPoint label="Nationality" value={selectedApp.nationality} />
                  <DataPoint
                    label="Date of birth"
                    value={`${selectedApp.dateOfBirth} (${selectedApp.gender})`}
                  />
                  <DataPoint label={selectedApp.idType} value={selectedApp.idNumber} mono />
                  <DataPoint label="Phone" value={selectedApp.phone} />
                  <DataPoint label="Email" value={selectedApp.email} />
                  <DataPoint
                    label="Residential address"
                    value={selectedApp.address}
                    className="col-span-2"
                  />
                </CardBody>
              </Card>

              <Card tone="inset">
                <CardHeader className="border-slate-200 px-5 py-3">
                  <CardTitle as="h3" icon={<Store className="h-4 w-4 text-navy-600" />}>
                    Business registration
                  </CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-5 px-5 py-4">
                  <DataPoint label="Trade name" value={selectedApp.tradeName} />
                  <DataPoint
                    label="Registration no."
                    value={selectedApp.tradeNameRegistrationNo}
                    mono
                  />
                  <DataPoint label="Business type" value={selectedApp.businessType} />
                  <DataPoint label="TIN" value={selectedApp.tinNumber} mono />
                  <DataPoint label="Sector" value={selectedApp.businessSector} />
                  <DataPoint label="Sub-sector" value={selectedApp.businessSubSector} />
                  <DataPoint
                    label="Registered capital"
                    value={`${selectedApp.capital.toLocaleString()} ${selectedApp.capitalCurrency}`}
                    mono
                  />
                  <DataPoint label="Employees" value={selectedApp.employeeCount} mono />
                  <div className="col-span-2">
                    <Eyebrow>Trade activity</Eyebrow>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {selectedApp.businessActivity}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card tone="inset">
                <CardHeader className="border-slate-200 px-5 py-3">
                  <CardTitle as="h3" icon={<Building2 className="h-4 w-4 text-navy-600" />}>
                    Trading premises
                  </CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-5 px-5 py-4">
                  <DataPoint label="Region" value={selectedApp.region} />
                  <DataPoint label="Sub-city / town" value={selectedApp.subCity} />
                  <DataPoint label="Woreda" value={selectedApp.woreda} mono />
                  <DataPoint label="House number" value={selectedApp.houseNumber || '—'} mono />
                  <DataPoint label="Tenure" value={selectedApp.premisesType} />
                  <DataPoint
                    label="Licence term"
                    value={`${selectedApp.licenseTermYears} year(s)`}
                  />
                </CardBody>
              </Card>
            </div>

            {/* Right: documents + decision */}
            <div className="space-y-5">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
                  <FileCheck2 className="h-4 w-4 text-navy-600" aria-hidden="true" />
                  Documents ({selectedApp.documents.length})
                </h3>

                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                  {selectedApp.documents.map((doc, index) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between gap-3 bg-white px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="numeric flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-navy-50 text-xs font-semibold text-navy-700">
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900">
                            {doc.title}
                          </span>
                          <span className="block truncate font-mono text-xs text-slate-500">
                            {doc.fileName}
                          </span>
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveDocPreview(doc.title)}
                      >
                        Inspect
                      </Button>
                    </li>
                  ))}
                </ul>

                {activeDocPreview && (
                  <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-navy-200 bg-navy-50 p-3.5">
                    <p className="text-sm leading-relaxed text-navy-900">
                      Inspecting <strong className="font-semibold">{activeDocPreview}</strong>.
                      Checksum verified against the national repository.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveDocPreview(null)}
                      className="shrink-0 text-sm font-semibold text-navy-700 underline underline-offset-2 hover:text-navy-900 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <Field
                  label="Evaluation remarks"
                  required
                  hint="Archived permanently and delivered to the applicant by email."
                >
                  {(p) => (
                    <Textarea
                      {...p}
                      rows={5}
                      value={officerComments}
                      onChange={(e) => setOfficerComments(e.target.value)}
                      placeholder="Record verification results, or the reason the application cannot proceed."
                    />
                  )}
                </Field>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Queue is empty overall (not just filtered) */}
      {section === 'queue' && applications.length === 0 && (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="The queue is clear"
          description="No applications are waiting for review."
        />
      )}
    </div>
  );
};
