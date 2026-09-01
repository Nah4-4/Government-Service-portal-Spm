import React, { useState } from 'react';
import {
  Users,
  FileCheck,
  CheckCircle2,
  Download,
  CalendarRange,
  Coins,
  Gauge,
  Timer,
  TrendingDown,
} from 'lucide-react';
import { TradingLicenseApplication, User } from '../types';
import { SPM_PROJECT_INFO } from '../data/initialData';
import { STATUS_META, STATUS_ORDER } from '../config/status';
import { ROLE_LABEL } from '../config/navigation';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader, CardTitle, SectionHeading } from './ui/Card';
import { Badge, Eyebrow } from './ui/Badge';
import { StatusBadge } from './ui/StatusBadge';
import { StatCard, Meter } from './ui/StatCard';
import { Table, THead, TBody, Th, Td, Tr, TableEmpty } from './ui/DataTable';

interface AdminPanelProps {
  applications: TradingLicenseApplication[];
  users: User[];
  section: string;
  onOpenLicense: (app: TradingLicenseApplication) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applications,
  users,
  section,
  onOpenLicense,
}) => {
  const [exportSuccess, setExportSuccess] = useState(false);

  const totalApps = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const approvalRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;

  const plannedTotal = SPM_PROJECT_INFO.budgetCategories.reduce(
    (sum, b) => sum + b.plannedAmount,
    0
  );
  const actualTotal = SPM_PROJECT_INFO.budgetCategories.reduce(
    (sum, b) => sum + b.actualAmount,
    0
  );
  const variance = plannedTotal - actualTotal;
  const maxBudgetRow = Math.max(
    ...SPM_PROJECT_INFO.budgetCategories.map((b) => Math.max(b.plannedAmount, b.actualAmount))
  );

  const handleExportCSV = () => {
    const headers =
      'ReferenceNumber,OwnerName,Email,TradeName,TIN,BusinessType,Sector,Region,SubCity,Capital,Status,SubmittedAt,LicenseNumber\n';
    const rows = applications
      .map(
        (a) =>
          `"${a.referenceNumber}","${a.fullName}","${a.email}","${a.tradeName}","${a.tinNumber}","${a.businessType}","${a.businessSector}","${a.region}","${a.subCity}","${a.capital}","${a.status}","${a.submittedAt}","${a.licenseNumber || 'N/A'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `SPM_TradingLicence_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* Overview                                                         */}
      {/* ---------------------------------------------------------------- */}
      {section === 'metrics' && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Administration &amp; operations</Eyebrow>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Operational overview
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                Licence throughput, decision mix and the full application register across every
                sector.
              </p>
            </div>

            <Button
              variant="primary"
              icon={<Download className="h-4 w-4" />}
              onClick={handleExportCSV}
            >
              {exportSuccess ? 'Report downloaded' : 'Export summary CSV'}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Applications received"
              value={totalApps}
              hint="Across all sectors"
              icon={<FileCheck className="h-4 w-4" />}
              tone="navy"
            />
            <StatCard
              label="Approval rate"
              value={`${approvalRate}%`}
              tone="approved"
              hint={`${approvedCount} licences issued`}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <StatCard
              label="Average processing"
              value="2.1"
              hint="Days — target was 5 or fewer"
              icon={<Timer className="h-4 w-4" />}
            />
            <StatCard
              label="Test pass rate"
              value={SPM_PROJECT_INFO.testCasePassRate.split(' ')[0]}
              tone="navy"
              hint="UAT criterion was 95% or above"
              icon={<Gauge className="h-4 w-4" />}
            />
          </div>

          {/* Decision mix */}
          <Card>
            <CardHeader>
              <CardTitle hint="How the current caseload is distributed">Decision mix</CardTitle>
            </CardHeader>
            <CardBody className="grid gap-5 sm:grid-cols-2">
              {STATUS_ORDER.map((status) => {
                const count = applications.filter((a) => a.status === status).length;
                return (
                  <Meter
                    key={status}
                    label={STATUS_META[status].label}
                    value={count}
                    max={totalApps || 1}
                    readout={`${count} · ${
                      totalApps > 0 ? Math.round((count / totalApps) * 100) : 0
                    }%`}
                    tone={
                      status === 'Approved'
                        ? 'approved'
                        : status === 'Under Review'
                          ? 'review'
                          : status === 'Rejected'
                            ? 'rejected'
                            : 'navy'
                    }
                  />
                );
              })}
            </CardBody>
          </Card>

          {/* Register */}
          <Card>
            <CardHeader>
              <CardTitle hint="Every trading licence application on record">
                Application register
              </CardTitle>
              <span className="numeric text-sm text-slate-500">{totalApps} records</span>
            </CardHeader>

            <Table>
              <THead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Owner</Th>
                  <Th>Trade name</Th>
                  <Th>Sector</Th>
                  <Th>Status</Th>
                  <Th>Assigned officer</Th>
                  <Th align="right">Licence</Th>
                </tr>
              </THead>
              <TBody>
                {applications.length === 0 ? (
                  <TableEmpty colSpan={7}>No applications on record yet.</TableEmpty>
                ) : (
                  applications.map((app) => (
                    <Tr key={app.id}>
                      <Td className="numeric font-mono font-semibold text-navy-700">
                        {app.referenceNumber}
                      </Td>
                      <Td className="font-semibold text-slate-900">{app.fullName}</Td>
                      <Td className="text-slate-600">{app.tradeName}</Td>
                      <Td className="text-slate-600">{app.businessSector}</Td>
                      <Td>
                        <StatusBadge status={app.status} size="sm" />
                      </Td>
                      <Td className="text-slate-500">
                        {app.assignedOfficerName || 'Pending assignment'}
                      </Td>
                      <Td align="right">
                        {app.status === 'Approved' ? (
                          <Button size="sm" onClick={() => onOpenLicense(app)}>
                            View
                          </Button>
                        ) : (
                          <span className="text-slate-400" aria-hidden="true">
                            —
                          </span>
                        )}
                      </Td>
                    </Tr>
                  ))
                )}
              </TBody>
            </Table>
          </Card>
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Waterfall schedule                                               */}
      {/* ---------------------------------------------------------------- */}
      {section === 'spmWaterfall' && (
        <>
          <SectionHeading
            title="Waterfall SDLC schedule"
            hint="Sequential phases with quality gates and formal sign-off, 20 July – 21 August 2026 (25 working days)"
          />

          <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-3.75 before:top-8 before:w-0.5 before:bg-slate-200 before:content-['']">
            {SPM_PROJECT_INFO.phases.map((phase) => (
              <li key={phase.phaseNumber} className="relative flex gap-5">
                {/* Spine marker */}
                <span
                  className="relative z-10 mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-navy-700 bg-navy-700 text-sm font-semibold text-white"
                  aria-hidden="true"
                >
                  {phase.phaseNumber}
                </span>

                <Card className="flex-1">
                  <CardBody className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="navy" shape="tag">
                            {phase.duration}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {phase.startDate} – {phase.endDate}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[15px] font-semibold text-slate-900">
                          {phase.name}
                        </h3>
                      </div>

                      <Badge
                        tone="approved"
                        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        className="shrink-0"
                      >
                        {phase.status}
                      </Badge>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
                      <div>
                        <Eyebrow>Deliverables</Eyebrow>
                        <ul className="mt-2 space-y-1.5">
                          {phase.deliverables.map((deliverable, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <span
                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600"
                                aria-hidden="true"
                              />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="sm:text-right">
                        <Eyebrow>Sign-off</Eyebrow>
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {phase.signOffBy}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ol>
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Budget                                                           */}
      {/* ---------------------------------------------------------------- */}
      {section === 'budget' && (
        <>
          <SectionHeading
            title="Budget & variance"
            hint="Cost breakdown aligned with the Waterfall development milestones"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Planned budget"
              value={plannedTotal.toLocaleString()}
              hint="ETB approved at charter sign-off"
              icon={<Coins className="h-4 w-4" />}
            />
            <StatCard
              label="Actual expenditure"
              value={actualTotal.toLocaleString()}
              hint="ETB spent across all categories"
              icon={<Coins className="h-4 w-4" />}
              tone="navy"
            />
            <StatCard
              label="Variance"
              value={`+${variance.toLocaleString()}`}
              tone="approved"
              hint={`ETB under budget · ${((variance / plannedTotal) * 100).toFixed(1)}%`}
              icon={<TrendingDown className="h-4 w-4" />}
            />
          </div>

          {/* Planned vs actual */}
          <Card>
            <CardHeader>
              <CardTitle hint="Planned against actual, by category">Spend by category</CardTitle>
            </CardHeader>
            <CardBody className="space-y-6">
              {SPM_PROJECT_INFO.budgetCategories.map((category) => (
                <div key={category.category} className="space-y-2.5">
                  <p className="text-sm font-semibold text-slate-900">{category.category}</p>
                  <Meter
                    label="Planned"
                    value={category.plannedAmount}
                    max={maxBudgetRow}
                    readout={`${category.plannedAmount.toLocaleString()} ETB`}
                    tone="navy"
                  />
                  <Meter
                    label="Actual"
                    value={category.actualAmount}
                    max={maxBudgetRow}
                    readout={`${category.actualAmount.toLocaleString()} ETB`}
                    tone="approved"
                  />
                  <p className="text-sm text-slate-500">{category.notes}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Ledger */}
          <Card>
            <CardHeader>
              <CardTitle icon={<CalendarRange className="h-4 w-4 text-navy-600" />}>
                Budget ledger
              </CardTitle>
            </CardHeader>
            <Table>
              <THead>
                <tr>
                  <Th>Category</Th>
                  <Th align="right">Planned (ETB)</Th>
                  <Th align="right">Actual (ETB)</Th>
                  <Th align="right">Variance</Th>
                </tr>
              </THead>
              <TBody>
                {SPM_PROJECT_INFO.budgetCategories.map((category) => (
                  <Tr key={category.category}>
                    <Td className="font-medium text-slate-900">{category.category}</Td>
                    <Td align="right" className="numeric font-mono">
                      {category.plannedAmount.toLocaleString()}
                    </Td>
                    <Td align="right" className="numeric font-mono">
                      {category.actualAmount.toLocaleString()}
                    </Td>
                    <Td align="right" className="numeric font-mono font-semibold text-approved-text">
                      +{(category.plannedAmount - category.actualAmount).toLocaleString()}
                    </Td>
                  </Tr>
                ))}
                <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                  <Td className="font-semibold text-slate-900">Total</Td>
                  <Td align="right" className="numeric font-mono font-semibold text-slate-900">
                    {plannedTotal.toLocaleString()}
                  </Td>
                  <Td align="right" className="numeric font-mono font-semibold text-slate-900">
                    {actualTotal.toLocaleString()}
                  </Td>
                  <Td align="right" className="numeric font-mono font-semibold text-approved-text">
                    +{variance.toLocaleString()}
                  </Td>
                </tr>
              </TBody>
            </Table>
          </Card>
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Users                                                            */}
      {/* ---------------------------------------------------------------- */}
      {section === 'users' && (
        <>
          <SectionHeading
            title={`Users & access (${users.length})`}
            hint="Citizen applicants, directorate officers and system administrators"
          />

          <Card>
            <CardHeader>
              <CardTitle icon={<Users className="h-4 w-4 text-navy-600" />}>
                System accounts
              </CardTitle>
            </CardHeader>
            <Table>
              <THead>
                <tr>
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  <Th>Role</Th>
                  <Th>Department / badge</Th>
                  <Th align="right">Access</Th>
                </tr>
              </THead>
              <TBody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td className="font-semibold text-slate-900">{user.name}</Td>
                    <Td>
                      <div className="text-slate-700">{user.email}</div>
                      <div className="numeric mt-0.5 text-xs text-slate-500">{user.phone}</div>
                    </Td>
                    <Td>
                      <Badge
                        tone={
                          user.role === 'applicant'
                            ? 'navy'
                            : user.role === 'officer'
                              ? 'review'
                              : 'approved'
                        }
                      >
                        {ROLE_LABEL[user.role]}
                      </Badge>
                    </Td>
                    <Td className="text-slate-600">
                      {user.department || 'Citizen applicant portal'}
                      {user.badgeNumber && (
                        <span className="numeric mt-0.5 block font-mono text-xs font-semibold text-navy-700">
                          {user.badgeNumber}
                        </span>
                      )}
                    </Td>
                    <Td align="right">
                      <Badge tone="approved" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                        Active
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
