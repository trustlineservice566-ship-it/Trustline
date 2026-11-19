import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { PageId, PROCESS_STAGES } from '../data/companyData';

interface ProcessPageProps {
  onNavigate: (page: PageId) => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Our Process
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            From Account Allocation to Transparent Reporting
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            A five-stage operational framework built for auditability, ethical borrower
            engagement, and measurable bucket resolution.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-5">
            {PROCESS_STAGES.map((stage) => (
              <article
                key={stage.step}
                className="grid grid-cols-1 gap-6 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-12 lg:items-start"
              >
                <div className="lg:col-span-4">
                  <p className="font-mono text-sm font-semibold text-[#A67C2E] tabular-nums">
                    Stage {stage.step}
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold text-[#0B1F3A]">{stage.title}</h2>
                  <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    {stage.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 lg:col-span-3 lg:border-t-0 lg:border-l lg:border-slate-200 lg:pt-0 lg:pl-6">
                  <p className="text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider">
                    Governance Controls
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {stage.controls.map((control) => (
                      <li key={control} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C6973F]"
                          aria-hidden="true"
                        />
                        <span>{control}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-lg border border-slate-200 bg-[#0B1F3A] p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Need Custom SLA &amp; MIS Integration?</h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Our operations leads tailor reporting cadences and escalation workflows to your
                lending policy.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#C6973F] px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#D9B05B] whitespace-nowrap shrink-0"
            >
              <span>Request a Business Consultation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
