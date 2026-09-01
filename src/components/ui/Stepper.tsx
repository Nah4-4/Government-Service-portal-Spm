import React from 'react';
import { Check } from 'lucide-react';

export interface StepDef {
  id: number;
  label: string;
  /** Second line, e.g. a date or an assignee. */
  meta?: string;
}

export type StepState = 'complete' | 'current' | 'upcoming' | 'failed';

interface StepperProps {
  steps: StepDef[];
  /** 1-based index of the active step. */
  current: number;
  /** Makes steps clickable, for the application wizard. */
  onStepClick?: (id: number) => void;
  /** Marks the final step as failed instead of complete. */
  failedAt?: number;
}

function stateOf(id: number, current: number, failedAt?: number): StepState {
  if (failedAt === id) return 'failed';
  if (id < current) return 'complete';
  if (id === current) return 'current';
  return 'upcoming';
}

const MARKERS: Record<StepState, string> = {
  complete: 'bg-navy-700 border-navy-700 text-white',
  current: 'bg-white border-navy-700 text-navy-700 ring-4 ring-navy-100',
  upcoming: 'bg-white border-slate-300 text-slate-400',
  failed: 'bg-rejected-dot border-rejected-dot text-white',
};

const LABELS: Record<StepState, string> = {
  complete: 'text-slate-700',
  current: 'text-navy-800 font-semibold',
  upcoming: 'text-slate-400',
  failed: 'text-rejected-text font-semibold',
};

/**
 * Connected horizontal progress track. Serves both the four-step application
 * wizard and the three-stage licence lifecycle, which were previously two
 * unrelated hand-built layouts.
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  current,
  onStepClick,
  failedAt,
}) => (
  <ol className="flex items-start">
    {steps.map((step, index) => {
      const state = stateOf(step.id, current, failedAt);
      const isLast = index === steps.length - 1;
      // The connector shows progress *out of* this step.
      const connectorDone = step.id < current && failedAt === undefined;

      const marker = (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${MARKERS[state]}`}
        >
          {state === 'complete' ? (
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          ) : state === 'failed' ? (
            '×'
          ) : (
            step.id
          )}
        </span>
      );

      const body = (
        <>
          {marker}
          <span className="mt-2 block px-1 text-center">
            <span className={`block text-sm leading-tight ${LABELS[state]}`}>
              {step.label}
            </span>
            {step.meta && (
              <span className="mt-0.5 block text-xs text-slate-500">{step.meta}</span>
            )}
          </span>
        </>
      );

      return (
        <li key={step.id} className="flex flex-1 items-start last:flex-none">
          <div className="flex flex-col items-center">
            {onStepClick ? (
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                aria-current={state === 'current' ? 'step' : undefined}
                className="flex cursor-pointer flex-col items-center rounded-lg transition-opacity hover:opacity-80"
              >
                {body}
              </button>
            ) : (
              <div
                className="flex flex-col items-center"
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {body}
              </div>
            )}
          </div>

          {!isLast && (
            <div className="mt-4 h-0.5 flex-1 rounded-full bg-slate-200" aria-hidden="true">
              <div
                className={`h-full origin-left rounded-full transition-transform duration-500 ${
                  connectorDone ? 'scale-x-100 bg-navy-700' : 'scale-x-0'
                }`}
              />
            </div>
          )}
        </li>
      );
    })}
  </ol>
);
