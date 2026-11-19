import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO, HERO_ASSETS, PageId, WHY_CHOOSE_US } from '../data/companyData';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            About Us · Founded {COMPANY_INFO.founded}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Recover Smart. Build Trust.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            {COMPANY_INFO.aboutSummary}
          </p>
        </div>
      </section>

      {/* Story & Operations Image */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#A67C2E] uppercase">
                Our Story &amp; Philosophy
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
                A Modern B2B Recovery Partner Headquartered in Bengaluru
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Founded in {COMPANY_INFO.founded} and operating out of Madavara, Madanayakanahalli
                in Bengaluru, {COMPANY_INFO.name} was established to bridge a critical gap in
                India&apos;s lending ecosystem: recovering overdue portfolios effectively while
                preserving the dignity of borrowers and the brand integrity of lenders.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {COMPANY_INFO.approachSummary} Every executive on our floor and in the field is
                trained in structured resolution dialogue, regulatory compliance, and transparent
                documentation.
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-slate-500 uppercase">Business Model</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                    {COMPANY_INFO.businessType}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500 uppercase">Headquarters</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                    Madavara, Bengaluru 562162
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 overflow-hidden rounded-lg border border-slate-200 bg-[#F4F6F9] sm:h-96 lg:h-full">
                <ImageWithFallback
                  src={HERO_ASSETS.operationsImage}
                  alt="Trustline Collection Services Bengaluru structured operations center"
                  className="h-full w-full object-cover"
                  fallbackTitle="Trustline Operations Center · Bengaluru"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-y border-slate-200 bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-2.5 text-[#A67C2E]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                <p className="text-xs font-semibold tracking-[0.14em] uppercase">Our Mission</p>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">
                Customer-Focused Financial Recovery
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {COMPANY_INFO.mission}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-2.5 text-[#A67C2E]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                <p className="text-xs font-semibold tracking-[0.14em] uppercase">Our Vision</p>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">
                Setting the Benchmark for Ethical Collections
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {COMPANY_INFO.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#A67C2E] uppercase">
              Institutional Advantages
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Why Lending Institutions Choose Trustline
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <CheckCircle2 className="h-5 w-5 text-[#C6973F]" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-[#F4F6F9] p-6 sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-[#0B1F3A]">
                Discuss a Pilot Portfolio With Our Bengaluru Team
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Learn how our dedicated account managers structure SLA-driven recovery workflows.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
