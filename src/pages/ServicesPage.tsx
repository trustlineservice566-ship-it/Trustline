import React, { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { PageId, SERVICES } from '../data/companyData';

interface ServicesPageProps {
  initialServiceTitle?: string;
  onNavigate: (page: PageId, options?: { serviceTitle?: string }) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  initialServiceTitle,
  onNavigate,
}) => {
  const matched = SERVICES.find((s) => s.title === initialServiceTitle);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    matched?.id ?? SERVICES[0].id
  );

  useEffect(() => {
    if (initialServiceTitle) {
      const found = SERVICES.find((s) => s.title === initialServiceTitle);
      if (found) {
        setSelectedServiceId(found.id);
      }
    }
  }, [initialServiceTitle]);

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0];

  return (
    <div className="bg-white">
      {/* Header Band */}
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Our Services
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            End-to-End Debt Collection &amp; Financial Recovery Services
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            Modular recovery operations covering early-bucket telecalling, authorized field
            collection, lender-approved settlements, NPA management, and transparent MIS reporting.
          </p>
        </div>
      </section>

      {/* Interactive Service Explorer */}
      <section className="border-b border-slate-200 bg-[#F4F6F9] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Service Selector List */}
            <div className="lg:col-span-4">
              <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                Select a Service Line
              </p>
              <div role="tablist" aria-label="Service Lines" className="space-y-2">
                {SERVICES.map((service) => {
                  const isSelected = service.id === activeService.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors ${
                        isSelected
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                          : 'border-slate-200 bg-white text-[#0B1F3A] hover:border-[#C6973F]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            isSelected ? 'text-[#D9B05B]' : 'text-[#A67C2E]'
                          }`}
                        >
                          {service.number}
                        </span>
                        <span className="text-sm font-medium">{service.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Service Specification Panel */}
            <div className="lg:col-span-8">
              <div
                role="tabpanel"
                aria-label={activeService.title}
                className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <span className="font-mono text-xs font-semibold text-[#A67C2E] tabular-nums">
                      Service {activeService.number}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {activeService.outcomeMetric}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold text-[#0B1F3A]">
                    {activeService.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {activeService.fullDescription}
                  </p>

                  <h3 className="mt-7 text-sm font-semibold text-[#0B1F3A] uppercase tracking-wider">
                    Key Operational Deliverables
                  </h3>
                  <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeService.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 rounded-md border border-slate-100 bg-[#F8FAFC] p-3 text-sm text-slate-700"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#C6973F]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                  <p className="text-xs text-slate-500">
                    Tailored SLA and bucket allocation available for institutional partners.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', { serviceTitle: activeService.title })}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
                  >
                    <span>Discuss This Service</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete 5-Service Summary Directory */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A]">
            Complete Service Portfolio Overview
          </h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-12 lg:gap-8"
              >
                <div className="flex items-baseline gap-3 lg:col-span-4">
                  <span className="font-mono text-sm font-semibold text-[#A67C2E] tabular-nums">
                    {service.number}.
                  </span>
                  <h3 className="text-base font-semibold text-[#0B1F3A]">{service.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 lg:col-span-5">
                  {service.shortDescription}
                </p>
                <div className="lg:col-span-3 lg:text-right">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', { serviceTitle: service.title })}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#0B1F3A] transition-colors hover:text-[#A67C2E]"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
