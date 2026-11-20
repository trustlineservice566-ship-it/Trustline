import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import {
  COMPANY_INFO,
  HERO_ASSETS,
  INDUSTRIES,
  PageId,
  SAMPLE_STATS,
  SERVICES,
  WHY_CHOOSE_US,
} from '../data/companyData';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { buildWhatsAppUrl } from '../utils/validation';

interface HomePageProps {
  onNavigate: (page: PageId, options?: { serviceTitle?: string; industryName?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Hero Copy */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#D9B05B] uppercase">
                  Trustline Collection Services · Bengaluru, India
                </p>

                <h1
                  className="mt-4 font-semibold tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.5rem)', lineHeight: 1.12 }}
                >
                  Smart Recovery. Stronger Financial Relationships.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                  Professional debt collection and recovery management solutions designed for
                  India&apos;s financial institutions.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#C6973F] px-6 py-3.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#D9B05B] whitespace-nowrap shrink-0"
                  >
                    <span>Request a Business Consultation</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/25 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    <span>Explore Services</span>
                  </button>
                </div>
              </div>

              <div className="mt-10 border-t border-white/15 pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium tracking-wide text-slate-300 sm:text-sm">
                  <span className="whitespace-nowrap">Ethical Communication</span>
                  <span className="text-[#C6973F]" aria-hidden="true">
                    |
                  </span>
                  <span className="whitespace-nowrap">Transparent Processes</span>
                  <span className="hidden text-[#C6973F] sm:inline" aria-hidden="true">
                    |
                  </span>
                  <span className="whitespace-nowrap">Professional Service</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5">
              <div className="h-72 overflow-hidden rounded-lg border border-white/15 bg-[#132D52] sm:h-96 lg:h-full">
                <ImageWithFallback
                  src={HERO_ASSETS.heroImage}
                  alt="Trustline Collection Services corporate financial headquarters in Bengaluru"
                  className="h-full w-full object-cover"
                  fallbackTitle="Trustline Corporate Headquarters · Bengaluru"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Statistics Strip */}
      <section aria-label="Company Key Figures" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {SAMPLE_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`${
                  index > 0 ? 'lg:border-l lg:border-slate-200 lg:pl-8' : ''
                }`}
              >
                <p className="font-mono text-3xl font-semibold tracking-tight text-[#0B1F3A] tabular-nums sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#0B1F3A]">{stat.label}</p>
                <p className="mt-0.5 text-xs text-slate-600">{stat.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            * Illustrative figures presented as sample corporate metrics for website design.
          </p>
        </div>
      </section>

      {/* Core Services Section (Asymmetric Bento Grid) */}
      <section className="bg-[#F4F6F9] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#A67C2E] uppercase">
                Our Services
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Structured Recovery Across Every Delinquency Stage
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:text-[#A67C2E] whitespace-nowrap shrink-0"
            >
              <span>View all service specifications</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
            {SERVICES.map((service, idx) => {
              const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
              return (
                <div
                  key={service.id}
                  className={`flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-[#C6973F] ${spanClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-xs font-semibold text-[#A67C2E] tabular-nums">
                        {service.number}
                      </span>
                      <span className="text-xs text-slate-500">{service.outcomeMetric}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#0B1F3A]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => onNavigate('services', { serviceTitle: service.title })}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#0B1F3A] transition-colors hover:text-[#A67C2E]"
                    >
                      <span>Explore scope</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About & Why Choose Us Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="h-72 overflow-hidden rounded-lg border border-slate-200 bg-[#F4F6F9] sm:h-96 lg:h-full">
                <ImageWithFallback
                  src={HERO_ASSETS.aboutImage}
                  alt="Trustline Collection Services executive advisory meeting in Bengaluru"
                  className="h-full w-full object-cover"
                  fallbackTitle="Institutional Recovery Advisory"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#A67C2E] uppercase">
                  About Trustline · Why Choose Us
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
                  Ethical Recovery Backed by Institutional Discipline
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {COMPANY_INFO.aboutSummary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  <strong className="font-semibold text-[#0B1F3A]">Our Mission:</strong>{' '}
                  {COMPANY_INFO.mission}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                {WHY_CHOOSE_US.map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#C6973F]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#0B1F3A]">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Band */}
      <section className="border-t border-slate-200 bg-[#F4F6F9] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#A67C2E] uppercase">
                Industries We Serve
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Built for India&apos;s Regulated Lending Institutions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('industries')}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:text-[#A67C2E] whitespace-nowrap shrink-0"
            >
              <span>View sector capabilities</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.id}
                type="button"
                aria-label={`Explore ${industry.name} recovery capabilities`}
                onClick={() => onNavigate('industries', { industryName: industry.name })}
                className="flex cursor-pointer flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 text-left transition-colors hover:border-[#C6973F]"
              >
                <div>
                  <h3 className="text-base font-semibold text-[#0B1F3A]">{industry.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{industry.summary}</p>
                </div>
                <p className="mt-4 text-xs font-medium text-[#A67C2E]">{industry.typicalBuckets}</p>
              </button>
            ))}

            <button
              type="button"
              onClick={() => onNavigate('process')}
              className="flex cursor-pointer flex-col justify-between rounded-lg border border-[#0B1F3A] bg-[#0B1F3A] p-5 text-left text-white transition-colors hover:bg-[#132D52]"
            >
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#D9B05B] uppercase">
                  5-Stage Workflow
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  From Allocation to Reconciliation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Review our structured operational governance and reporting lifecycle.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9B05B]">
                <span>Inspect Our Process</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Consultation Call to Action */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-lg border border-slate-200 bg-[#0B1F3A] p-8 text-white sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#D9B05B] uppercase">
                Partner With Trustline
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready to Improve Recovery Performance Without Compromising Trust?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Speak directly with {COMPANY_INFO.ownerName} ({COMPANY_INFO.ownerRole}) and our
                Bengaluru leadership team to align on your overdue buckets, SLAs, and reporting
                requirements.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#C6973F] px-6 py-3.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#D9B05B] whitespace-nowrap shrink-0"
              >
                <span>Request a Business Consultation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <a
                href={buildWhatsAppUrl(
                  COMPANY_INFO.ownerPhone,
                  COMPANY_INFO.ownerWhatsappMessage
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4 text-[#D9B05B]" aria-hidden="true" />
                <span>WhatsApp {COMPANY_INFO.ownerPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
