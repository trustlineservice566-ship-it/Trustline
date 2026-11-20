import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
} from 'lucide-react';
import { COMPANY_INFO, PageId } from '../data/companyData';
import { fetchTrackingStatusByReferenceId } from '../services/leadsService';
import {
  TrackingRecord,
  getDefaultStatusGuidance,
  getTrackingTimelineSteps,
  isValidTrackingReferenceId,
  normalizeTrackingReferenceId,
} from '../utils/leadsHelpers';
import { buildWhatsAppUrl } from '../utils/validation';

interface RecentReference {
  referenceId: string;
  label: string;
}

interface TrackEnquiryPageProps {
  initialReferenceId?: string;
  recentReferences?: RecentReference[];
  onNavigate: (page: PageId) => void;
}

export const TrackEnquiryPage: React.FC<TrackEnquiryPageProps> = ({
  initialReferenceId = '',
  recentReferences = [],
  onNavigate,
}) => {
  const [referenceInput, setReferenceInput] = useState(initialReferenceId);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchedRef, setSearchedRef] = useState('');
  const [trackingRecord, setTrackingRecord] = useState<TrackingRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const performLookup = useCallback(async (rawRef: string) => {
    const normalized = normalizeTrackingReferenceId(rawRef);
    setReferenceInput(normalized);
    setValidationError('');
    setFetchError('');
    setNotFound(false);

    if (!normalized) {
      setValidationError('Enter your Reference ID to check enquiry progress.');
      setTrackingRecord(null);
      setSearchedRef('');
      return;
    }

    if (!isValidTrackingReferenceId(normalized)) {
      setValidationError(
        'Enter a valid Reference ID such as TCS-2026-123456 or JOB-2026-123456.'
      );
      setTrackingRecord(null);
      setSearchedRef('');
      return;
    }

    setLoading(true);
    setSearchedRef(normalized);

    if (typeof window !== 'undefined') {
      const targetUrl = `/track?ref=${encodeURIComponent(normalized)}`;
      if (`${window.location.pathname}${window.location.search}` !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
      }
    }

    try {
      const result = await fetchTrackingStatusByReferenceId(normalized);
      if (!result) {
        setTrackingRecord(null);
        setNotFound(true);
      } else {
        setTrackingRecord(result);
        setNotFound(false);
      }
    } catch (err) {
      setTrackingRecord(null);
      setFetchError(
        err instanceof Error
          ? 'Unable to verify enquiry status right now. Please try again or reach our Bengaluru desk on WhatsApp.'
          : 'Lookup failed.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialReferenceId && isValidTrackingReferenceId(initialReferenceId)) {
      void performLookup(initialReferenceId);
    }
  }, [initialReferenceId, performLookup]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void performLookup(referenceInput);
  };

  const timelineSteps = trackingRecord
    ? getTrackingTimelineSteps(trackingRecord.recordType, trackingRecord.status)
    : [];

  const statusGuidance = trackingRecord
    ? trackingRecord.publicUpdate?.trim() ||
      getDefaultStatusGuidance(trackingRecord.recordType, trackingRecord.status)
    : '';

  const whatsappFollowUpHref = buildWhatsAppUrl(
    COMPANY_INFO.ownerPhone,
    searchedRef
      ? `Hello ${COMPANY_INFO.ownerName}, I am checking the status of my Trustline enquiry (Ref: ${searchedRef}).`
      : COMPANY_INFO.ownerWhatsappMessage
  );

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Enquiry &amp; Application Tracking
          </p>
          <h1
            className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Track Your Enquiry Status
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            Enter the Reference ID issued when you submitted a business consultation request or
            career application to view live progress from our Bengaluru operations desk.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 8 Columns: Lookup & Live Result */}
            <div className="space-y-6 lg:col-span-8">
              <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
                <form onSubmit={handleSubmit} noValidate>
                  <label
                    htmlFor="track-ref-input"
                    className="block text-sm font-semibold text-[#0B1F3A]"
                  >
                    Enquiry or Application Reference ID
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Format:{' '}
                    <span className="font-mono font-medium text-[#0B1F3A]">TCS-2026-XXXXXX</span>{' '}
                    for business consultations or{' '}
                    <span className="font-mono font-medium text-[#0B1F3A]">JOB-2026-XXXXXX</span>{' '}
                    for careers.
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        id="track-ref-input"
                        type="text"
                        value={referenceInput}
                        onChange={(e) => setReferenceInput(e.target.value)}
                        aria-invalid={Boolean(validationError)}
                        aria-describedby={validationError ? 'track-ref-err' : undefined}
                        placeholder="e.g. TCS-2026-991754"
                        className="w-full rounded-md border border-slate-300 bg-white py-3 pr-4 pl-10 font-mono text-sm uppercase text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#132D52] disabled:opacity-60 whitespace-nowrap shrink-0"
                    >
                      <span>{loading ? 'Checking Status...' : 'Track Status'}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  {validationError && (
                    <p id="track-ref-err" className="mt-2 text-xs font-medium text-red-700">
                      {validationError}
                    </p>
                  )}
                </form>

                {recentReferences.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium text-slate-500">
                      Submitted in this browser session:
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {recentReferences.map((item) => (
                        <button
                          key={item.referenceId}
                          type="button"
                          onClick={() => void performLookup(item.referenceId)}
                          className="inline-flex max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-left text-xs font-medium text-[#0B1F3A] transition-colors hover:border-[#C6973F] hover:bg-white"
                        >
                          <span className="shrink-0 font-mono font-semibold text-[#A67C2E]">
                            {item.referenceId}
                          </span>
                          <span className="min-w-0 truncate text-slate-500">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Area */}
              <div aria-live="polite" className="space-y-6">
                {loading && (
                  <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                    Fetching live status for{' '}
                    <span className="font-mono font-semibold text-[#0B1F3A]">{searchedRef}</span>...
                  </div>
                )}

                {!loading && fetchError && (
                  <div className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-800">
                    <p className="font-semibold">Status Lookup Interrupted</p>
                    <p className="mt-1 text-xs leading-relaxed text-red-700">{fetchError}</p>
                  </div>
                )}

                {!loading && notFound && (
                  <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <h2 className="text-lg font-semibold text-[#0B1F3A]">
                      No Record Found for {searchedRef}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Please double-check the digits on your confirmation screen. If your enquiry
                      was submitted prior to live tracking activation or you need an immediate
                      update, reach {COMPANY_INFO.ownerName} directly via WhatsApp or submit a
                      follow-up request.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={whatsappFollowUpHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-[#0B1F3A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
                      >
                        <MessageCircle className="h-4 w-4 text-[#D9B05B]" aria-hidden="true" />
                        <span>Verify on WhatsApp ({COMPANY_INFO.ownerPhone})</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onNavigate('contact')}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1F3A] hover:bg-slate-50 whitespace-nowrap shrink-0"
                      >
                        <span>Submit New Enquiry</span>
                      </button>
                    </div>
                  </div>
                )}

                {!loading && trackingRecord && (
                  <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-semibold text-[#A67C2E]">
                            {trackingRecord.referenceId}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {trackingRecord.recordType === 'application'
                              ? 'Career Application'
                              : 'B2B Consultation Enquiry'}
                          </span>
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                          Current Status: {trackingRecord.status}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {trackingRecord.categoryLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void performLookup(trackingRecord.referenceId)}
                        className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                        <span>Refresh Status</span>
                      </button>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-4 rounded-md border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium text-slate-500 uppercase">
                          Submitted On
                        </dt>
                        <dd className="mt-1 font-mono text-sm font-medium text-[#0B1F3A] tabular-nums">
                          {new Date(trackingRecord.createdAtMs).toLocaleString('en-IN')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-slate-500 uppercase">
                          Last Updated
                        </dt>
                        <dd className="mt-1 font-mono text-sm font-medium text-[#0B1F3A] tabular-nums">
                          {new Date(trackingRecord.updatedAtMs).toLocaleString('en-IN')}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold text-[#A67C2E] uppercase tracking-wider">
                        Latest Operations Desk Note
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#0B1F3A]">
                        {statusGuidance}
                      </p>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-[#0B1F3A]">Progress Stages</h3>
                      <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {timelineSteps.map((step, index) => {
                          const isDone = step.state === 'completed';
                          const isCurrent = step.state === 'current';
                          return (
                            <li
                              key={step.key}
                              className={`rounded-md border p-4 ${
                                isCurrent
                                  ? 'border-[#C6973F] bg-[#FFFDF8]'
                                  : isDone
                                    ? 'border-slate-200 bg-[#F8FAFC]'
                                    : 'border-slate-200 bg-white opacity-70'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                                  0{index + 1}
                                </span>
                                {isDone || isCurrent ? (
                                  <CheckCircle2
                                    className={`h-4 w-4 ${
                                      isCurrent ? 'text-[#A67C2E]' : 'text-emerald-700'
                                    }`}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                )}
                              </div>
                              <p className="mt-2 text-sm font-semibold text-[#0B1F3A]">
                                {step.label}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                {step.description}
                              </p>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Columns: Guidance & Direct Desk */}
            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-base font-semibold text-[#0B1F3A]">
                  How Reference Tracking Works
                </h2>
                <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
                  <li>
                    <strong className="font-semibold text-[#0B1F3A]">1. Instant Issue:</strong>{' '}
                    Every business enquiry (<span className="font-mono">TCS-2026-...</span>) or
                    job application (<span className="font-mono">JOB-2026-...</span>) receives a
                    unique Reference ID upon submission.
                  </li>
                  <li>
                    <strong className="font-semibold text-[#0B1F3A]">2. Real-Time Sync:</strong>{' '}
                    As our Bengaluru coordination desk reviews your scope or schedules an interview,
                    stages update automatically here.
                  </li>
                  <li>
                    <strong className="font-semibold text-[#0B1F3A]">3. Privacy Protected:</strong>{' '}
                    Only workflow status and service category are displayed publicly—contact emails,
                    phone numbers, and portfolio notes remain private.
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-base font-semibold text-[#0B1F3A]">Direct Assistance</h2>
                <p className="mt-1 text-xs text-slate-600">
                  {COMPANY_INFO.ownerName} · {COMPANY_INFO.ownerRole}
                </p>
                <div className="mt-4 space-y-2.5 text-xs">
                  <a
                    href={`tel:${COMPANY_INFO.ownerPhone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                    <span>{COMPANY_INFO.ownerPhone} (Direct)</span>
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                    <span>{COMPANY_INFO.phone} (Office Desk)</span>
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="flex items-center gap-2 font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                    <span>{COMPANY_INFO.email}</span>
                  </a>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <a
                    href={whatsappFollowUpHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0B1F3A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#132D52]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#D9B05B]" aria-hidden="true" />
                    <span>Chat on WhatsApp ({COMPANY_INFO.ownerPhone})</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
