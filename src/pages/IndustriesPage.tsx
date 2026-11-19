import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { INDUSTRIES, PageId } from '../data/companyData';

interface IndustriesPageProps {
  initialIndustryName?: string;
  onNavigate: (page: PageId, options?: { industryName?: string }) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  initialIndustryName,
  onNavigate,
}) => {
  const matched = INDUSTRIES.find((i) => i.name === initialIndustryName);
  const [selectedId, setSelectedId] = useState<string>(matched?.id ?? INDUSTRIES[0].id);

  useEffect(() => {
    if (initialIndustryName) {
      const found = INDUSTRIES.find((i) => i.name === initialIndustryName);
      if (found) {
        setSelectedId(found.id);
      }
    }
  }, [initialIndustryName]);

  const activeIndustry = INDUSTRIES.find((i) => i.id === selectedId) ?? INDUSTRIES[0];

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Industries We Serve
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Specialized Recovery Solutions for Financial Institutions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            We partner exclusively with regulated lenders—adapting our outreach scripts, field
            protocols, and MIS formats to each financial product category.
          </p>
        </div>
      </section>

      {/* Interactive Industry Matrix */}
      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Industry Tabs */}
            <div className="lg:col-span-5">
              <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                Select Lending Vertical
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {INDUSTRIES.map((industry) => {
                  const isActive = industry.id === activeIndustry.id;
                  return (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => setSelectedId(industry.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                          : 'border-slate-200 bg-white text-[#0B1F3A] hover:border-[#C6973F]'
                      }`}
                    >
                      <span className="text-sm font-medium">{industry.name}</span>
                      <span
                        className={`text-xs ${
                          isActive ? 'text-[#D9B05B]' : 'text-slate-400'
                        }`}
                      >
                        {industry.typicalBuckets.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Industry Details */}
            <div className="lg:col-span-7">
              <div className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-2.5 text-[#A67C2E]">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      Sector Recovery Profile
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold text-[#0B1F3A]">
                    {activeIndustry.name}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {activeIndustry.summary}
                  </p>

                  <div className="mt-7 space-y-4 border-t border-slate-200 pt-6">
                    <div>
                      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Primary Recovery Focus
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#0B1F3A]">
                        {activeIndustry.recoveryFocus}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Compliance &amp; Brand Safety
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#0B1F3A]">
                        {activeIndustry.complianceApproach}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Typical Buckets Handled
                      </h3>
                      <p className="mt-1 font-mono text-sm font-semibold text-[#A67C2E] tabular-nums">
                        {activeIndustry.typicalBuckets}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', { industryName: activeIndustry.name })}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
                  >
                    <span>Request Proposal for {activeIndustry.name}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
