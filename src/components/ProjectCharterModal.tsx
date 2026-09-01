import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Calendar,
  Coins,
  ShieldCheck,
  FileText,
  ArrowRight,
  Play,
  Clock,
} from 'lucide-react';
import { SPM_PROJECT_INFO } from '../data/initialData';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge, Eyebrow } from './ui/Badge';
import { Card, CardBody } from './ui/Card';
import { Table, THead, TBody, Th, Td, Tr } from './ui/DataTable';

interface ProjectCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleDemo: (role: 'applicant' | 'officer' | 'admin') => void;
}

type Tab = 'charter' | 'waterfall' | 'budget' | 'demoGuide';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'charter', label: 'Charter', icon: FileText },
  { id: 'waterfall', label: 'Schedule', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: Coins },
  { id: 'demoGuide', label: 'Demo walkthrough', icon: Play },
];

const OBJECTIVES = [
  'Allow business owners to apply for a trading licence online without visiting government offices.',
  'Capture owner, business and premises details with the required supporting documents and robust form validation.',
  'Enable authorized officers to inspect, review, and approve or reject applications.',
  'Automatically generate an official PDF trading licence with QR code and digital verification seal.',
  'Send automated real-time SMS and email notifications on every status change.',
  'Deliver strictly within the 5-week schedule and 45,100 Birr budget using Waterfall SDLC.',
];

const DEMO_STEPS: {
  step: string;
  tone: 'navy' | 'review' | 'approved' | 'neutral';
  title: string;
  body: React.ReactNode;
  cta: string;
  role: 'applicant' | 'officer' | 'admin';
}[] = [
  {
    step: 'Step 1 · Citizen',
    tone: 'navy',
    title: 'Business owner submits an application',
    body: (
      <>
        Switch to the citizen account, choose <strong>New application</strong>, use a prefill
        button on step 1, then submit. A unique reference{' '}
        <code className="font-mono text-navy-700">TL-2026-ETH-####</code> is generated.
      </>
    ),
    cta: 'Open citizen portal',
    role: 'applicant',
  },
  {
    step: 'Step 2 · Officer',
    tone: 'review',
    title: 'Officer reviews and approves',
    body: (
      <>
        Switch to the officer account and open the review queue. Inspect the documents, record
        your evaluation remarks, then <strong>Approve &amp; issue licence</strong>.
      </>
    ),
    cta: 'Open review queue',
    role: 'officer',
  },
  {
    step: 'Step 3 · Licence',
    tone: 'approved',
    title: 'Download the sealed licence',
    body: (
      <>
        View the generated certificate with its QR verification block and digital seal, download
        the formatted PDF, and check the dispatched email and SMS alerts.
      </>
    ),
    cta: 'View issued licences',
    role: 'applicant',
  },
  {
    step: 'Step 4 · Admin',
    tone: 'neutral',
    title: 'Administrator reporting',
    body: (
      <>
        Inspect throughput, approval rate, the {SPM_PROJECT_INFO.testCasePassRate.split(' ')[0]}{' '}
        test pass rate, Waterfall phase completion, and budget variance.
      </>
    ),
    cta: 'Open admin overview',
    role: 'admin',
  },
];

export const ProjectCharterModal: React.FC<ProjectCharterModalProps> = ({
  isOpen,
  onClose,
  onSelectRoleDemo,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('charter');

  const plannedTotal = SPM_PROJECT_INFO.budgetCategories.reduce(
    (sum, b) => sum + b.plannedAmount,
    0
  );
  const actualTotal = SPM_PROJECT_INFO.budgetCategories.reduce(
    (sum, b) => sum + b.actualAmount,
    0
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      eyebrow={
        <>
          <Badge tone="navy" shape="tag" icon={<GraduationCap className="h-3.5 w-3.5" />}>
            Software Project Management
          </Badge>
          <Badge tone="approved" shape="tag">
            Waterfall SDLC
          </Badge>
        </>
      }
      title="Project charter"
      subtitle={SPM_PROJECT_INFO.title}
      flushBody
    >
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Charter sections"
        className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-6"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'border-navy-700 font-semibold text-navy-800'
                  : 'border-transparent font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="px-6 py-6">
        {/* ------------------------------------------------------------ */}
        {/* Charter                                                      */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'charter' && (
          <div className="animate-fade-in space-y-6">
            <Card>
              <Table>
                <TBody>
                  {[
                    ['Project title', SPM_PROJECT_INFO.title],
                    [
                      'Course',
                      `${SPM_PROJECT_INFO.course} · ${SPM_PROJECT_INFO.courseCode}`,
                    ],
                    ['Approach', SPM_PROJECT_INFO.sdlcApproach],
                    [
                      'Timeline',
                      `${SPM_PROJECT_INFO.startDate} → ${SPM_PROJECT_INFO.finishDate}`,
                    ],
                    ['Total budget', SPM_PROJECT_INFO.totalBudget],
                    ['Test pass rate', SPM_PROJECT_INFO.testCasePassRate],
                    ['UAT status', SPM_PROJECT_INFO.uatSignOffStatus],
                  ].map(([field, value]) => (
                    <Tr key={field}>
                      <Td className="w-1/3 bg-slate-50/70 align-top text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {field}
                      </Td>
                      <Td className="font-medium text-slate-900">{value}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
                <ShieldCheck className="h-4 w-4 text-navy-600" aria-hidden="true" />
                Project objectives
              </h3>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {OBJECTIVES.map((objective) => (
                  <li
                    key={objective}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-approved-dot"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-slate-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-navy-200 bg-navy-50 p-5">
              <Eyebrow className="text-navy-700">Summary &amp; justification</Eyebrow>
              <p className="mt-2 text-sm leading-relaxed text-navy-900">
                Eliminates long queues, delays, lost paperwork and manual data-entry errors by
                providing an end-to-end digital lifecycle: owner registration → online submission
                with a unique reference → officer verification → automated PDF trading licence
                issuance and email delivery → administrator reporting.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Schedule                                                     */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'waterfall' && (
          <div className="animate-fade-in space-y-4">
            <p className="text-sm text-slate-600">
              Predictive Waterfall lifecycle, 20 July – 21 August 2026 (5 weeks / 25 working
              days).
            </p>

            {SPM_PROJECT_INFO.phases.map((phase) => (
              <Card key={phase.phaseNumber}>
                <CardBody className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="navy" shape="tag">
                          {phase.duration}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
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
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Budget                                                       */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'budget' && (
          <div className="animate-fade-in space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <Eyebrow>Approved budget</Eyebrow>
                <p className="numeric mt-2 text-[32px] font-semibold leading-none text-slate-900">
                  {plannedTotal.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-500">ETB / Birr</p>
              </div>

              <div className="rounded-xl border border-approved-border bg-approved-chip p-5">
                <Eyebrow className="text-approved-text">Actual expenditure</Eyebrow>
                <p className="numeric mt-2 text-[32px] font-semibold leading-none text-approved-text">
                  {actualTotal.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-approved-text">
                  Under budget by {(plannedTotal - actualTotal).toLocaleString()} Birr (
                  {(((plannedTotal - actualTotal) / plannedTotal) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>

            <Card>
              <Table>
                <THead>
                  <tr>
                    <Th>Cost category</Th>
                    <Th align="right">Planned</Th>
                    <Th align="right">Actual</Th>
                    <Th>Scope</Th>
                  </tr>
                </THead>
                <TBody>
                  {SPM_PROJECT_INFO.budgetCategories.map((category) => (
                    <Tr key={category.category}>
                      <Td className="font-medium text-slate-900">{category.category}</Td>
                      <Td align="right" className="numeric font-mono">
                        {category.plannedAmount.toLocaleString()}
                      </Td>
                      <Td
                        align="right"
                        className="numeric font-mono font-semibold text-approved-text"
                      >
                        {category.actualAmount.toLocaleString()}
                      </Td>
                      <Td className="text-slate-500">{category.notes}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Demo walkthrough                                             */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'demoGuide' && (
          <div className="animate-fade-in space-y-5">
            <div className="rounded-xl border border-navy-200 bg-navy-50 p-5">
              <h3 className="text-[15px] font-semibold text-navy-900">
                Four-step presentation flow
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-800">
                Run these in order to demonstrate that every charter requirement is met. Each
                button switches account and jumps to the right screen.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {DEMO_STEPS.map((demo) => (
                <Card key={demo.step} className="flex flex-col">
                  <CardBody className="flex flex-1 flex-col gap-3">
                    <Badge tone={demo.tone} shape="tag" className="w-fit">
                      {demo.step}
                    </Badge>

                    <div className="flex-1">
                      <h4 className="text-[15px] font-semibold text-slate-900">{demo.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {demo.body}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      block
                      trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      onClick={() => {
                        onSelectRoleDemo(demo.role);
                        onClose();
                      }}
                    >
                      {demo.cta}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
