import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, UserCheck } from 'lucide-react';
import { COMPANY_INFO, INDUSTRIES, SERVICES } from '../data/companyData';
import {
  ConsultationFormInput,
  FormErrors,
  buildWhatsAppUrl,
  validateConsultationForm,
} from '../utils/validation';
import { createConsultationEnquiry } from '../services/leadsService';
import { submitToNetlifyForm } from '../utils/netlifyForms';

export interface SubmittedEnquiry {
  referenceId: string;
  fullName: string;
  companyName: string;
  industry: string;
  service: string;
  submittedAt: string;
}

interface ContactPageProps {
  preselectedService?: string;
  preselectedIndustry?: string;
  submittedEnquiries: SubmittedEnquiry[];
  onEnquirySubmitted: (enquiry: SubmittedEnquiry) => void;
  onTrackReference?: (referenceId?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedService = '',
  preselectedIndustry = '',
  submittedEnquiries,
  onEnquirySubmitted,
  onTrackReference,
}) => {
  const [formState, setFormState] = useState<ConsultationFormInput>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    industry: preselectedIndustry,
    service: preselectedService,
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors<ConsultationFormInput>>({});
  const [confirmation, setConfirmation] = useState<SubmittedEnquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      industry: preselectedIndustry || prev.industry,
      service: preselectedService || prev.service,
    }));
  }, [preselectedIndustry, preselectedService]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');
    const validationErrors = validateConsultationForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { referenceId } = await createConsultationEnquiry(formState);

      const record: SubmittedEnquiry = {
        referenceId,
        fullName: formState.fullName.trim(),
        companyName: formState.companyName.trim(),
        industry: formState.industry,
        service: formState.service,
        submittedAt: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      void submitToNetlifyForm('business-consultation', {
        referenceId,
        fullName: formState.fullName.trim(),
        companyName: formState.companyName.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        industry: formState.industry,
        service: formState.service,
        message: formState.message.trim(),
      });

      onEnquirySubmitted(record);
      setConfirmation(record);
      setErrors({});
      setFormState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        industry: '',
        service: '',
        message: '',
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? 'Could not save your enquiry right now. Please try again or reach us directly on WhatsApp.'
          : 'Submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Contact Us
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Request a Business Consultation
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            Connect with our Bengaluru B2B coordination desk to discuss overdue portfolio
            management, SLA onboarding, and structured recovery reporting.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Contact Info Column */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-[#0B1F3A]">
                  Corporate Office &amp; Direct Desk
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {COMPANY_INFO.name} · {COMPANY_INFO.businessType}
                </p>

                <dl className="mt-6 space-y-5 border-t border-slate-100 pt-6 text-sm">
                  <div className="flex items-start gap-3">
                    <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase">
                        {COMPANY_INFO.ownerRole}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-[#0B1F3A]">
                        {COMPANY_INFO.ownerName}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase">
                        Headquarters
                      </dt>
                      <dd className="mt-0.5 text-[#0B1F3A]">{COMPANY_INFO.headquarters}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase">
                        Direct &amp; Office Phone
                      </dt>
                      <dd className="mt-0.5 flex flex-col gap-1">
                        <a
                          href={`tel:${COMPANY_INFO.ownerPhone.replace(/\s+/g, '')}`}
                          className="font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                        >
                          {COMPANY_INFO.ownerPhone} ({COMPANY_INFO.ownerName})
                        </a>
                        <a
                          href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                          className="font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                        >
                          {COMPANY_INFO.phone} (Office Desk)
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase">Email</dt>
                      <dd className="mt-0.5">
                        <a
                          href={`mailto:${COMPANY_INFO.email}`}
                          className="font-medium text-[#0B1F3A] hover:text-[#A67C2E]"
                        >
                          {COMPANY_INFO.email}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold text-slate-500 uppercase">
                        Working Hours
                      </dt>
                      <dd className="mt-0.5 text-[#0B1F3A]">{COMPANY_INFO.workingHours}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <a
                    href={buildWhatsAppUrl(
                      COMPANY_INFO.ownerPhone,
                      COMPANY_INFO.ownerWhatsappMessage
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#132D52]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#D9B05B]" aria-hidden="true" />
                    <span>Chat on WhatsApp ({COMPANY_INFO.ownerPhone})</span>
                  </a>
                </div>
              </div>

              {submittedEnquiries.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <h3 className="text-sm font-semibold text-[#0B1F3A]">
                    Your Submitted Enquiries ({submittedEnquiries.length})
                  </h3>
                  <ul className="mt-3 divide-y divide-slate-100 text-xs">
                    {submittedEnquiries.map((item) => (
                      <li key={item.referenceId} className="flex items-start justify-between gap-3 py-2.5">
                        <div>
                          <p className="font-mono font-semibold text-[#A67C2E]">
                            {item.referenceId}
                          </p>
                          <p className="mt-0.5 font-medium text-[#0B1F3A]">
                            {item.companyName} · {item.service}
                          </p>
                          <p className="text-slate-500">
                            {item.industry} · Logged at {item.submittedAt}
                          </p>
                        </div>
                        {onTrackReference && (
                          <button
                            type="button"
                            onClick={() => onTrackReference(item.referenceId)}
                            className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-[#0B1F3A] hover:border-[#C6973F] hover:bg-slate-50 whitespace-nowrap shrink-0"
                          >
                            Track
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
                {confirmation ? (
                  <div role="status" className="py-6">
                    <div className="flex items-center gap-3 text-emerald-700">
                      <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                      <h2 className="text-xl font-semibold text-[#0B1F3A]">
                        Consultation Request Received
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      Thank you, <strong className="text-[#0B1F3A]">{confirmation.fullName}</strong>{' '}
                      ({confirmation.companyName}). Our institutional recovery team has logged your
                      enquiry for{' '}
                      <strong className="text-[#0B1F3A]">{confirmation.service}</strong>.
                    </p>
                    <div className="mt-5 rounded-md border border-slate-200 bg-[#F4F6F9] p-4 text-xs">
                      <p className="text-slate-500 uppercase">Enquiry Reference ID</p>
                      <p className="mt-1 font-mono text-base font-semibold text-[#0B1F3A]">
                        {confirmation.referenceId}
                      </p>
                      <p className="mt-2 text-slate-600">
                        We respond to B2B enquiries during {COMPANY_INFO.workingHours} via{' '}
                        {COMPANY_INFO.email} or {COMPANY_INFO.phone}.
                      </p>
                    </div>
                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <p className="font-semibold text-[#0B1F3A]">What happens next:</p>
                      <p>1. Dedicated account manager reviews your {confirmation.industry} scope.</p>
                      <p>2. Discovery call scheduled to align on DPD buckets, SLAs, and MIS format.</p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {onTrackReference && (
                        <button
                          type="button"
                          onClick={() => onTrackReference(confirmation.referenceId)}
                          className="cursor-pointer rounded-md bg-[#0B1F3A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#132D52]"
                        >
                          Track Enquiry Status
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmation(null)}
                        className="cursor-pointer rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-[#0B1F3A] transition-colors hover:bg-slate-50"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="text-xl font-semibold text-[#0B1F3A]">
                          Institutional Enquiry Form
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Fields marked with * are required for B2B consultation scheduling.
                        </p>
                      </div>
                      {onTrackReference && (
                        <button
                          type="button"
                          onClick={() => onTrackReference()}
                          className="cursor-pointer self-start rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1F3A] transition-colors hover:border-[#C6973F] hover:bg-slate-50 sm:self-center whitespace-nowrap shrink-0"
                        >
                          Track Existing Enquiry
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={formState.fullName}
                          onChange={(e) =>
                            setFormState({ ...formState, fullName: e.target.value })
                          }
                          aria-invalid={Boolean(errors.fullName)}
                          aria-describedby={errors.fullName ? 'contact-name-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                          placeholder="e.g. Rajesh Kulkarni"
                        />
                        {errors.fullName && (
                          <p id="contact-name-err" className="mt-1 text-xs text-red-700">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-company"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Institution / Company Name *
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={formState.companyName}
                          onChange={(e) =>
                            setFormState({ ...formState, companyName: e.target.value })
                          }
                          aria-invalid={Boolean(errors.companyName)}
                          aria-describedby={errors.companyName ? 'contact-company-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                          placeholder="Bank, NBFC, or Lending Company"
                        />
                        {errors.companyName && (
                          <p id="contact-company-err" className="mt-1 text-xs text-red-700">
                            {errors.companyName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Work Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'contact-email-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                          placeholder="name@institution.in"
                        />
                        {errors.email && (
                          <p id="contact-email-err" className="mt-1 text-xs text-red-700">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'contact-phone-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                          placeholder="+91 98XXXXXXXX"
                        />
                        {errors.phone && (
                          <p id="contact-phone-err" className="mt-1 text-xs text-red-700">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-industry"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Industry Sector *
                        </label>
                        <select
                          id="contact-industry"
                          value={formState.industry}
                          onChange={(e) =>
                            setFormState({ ...formState, industry: e.target.value })
                          }
                          aria-invalid={Boolean(errors.industry)}
                          aria-describedby={errors.industry ? 'contact-industry-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                        >
                          <option value="">Select industry</option>
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.id} value={ind.name}>
                              {ind.name}
                            </option>
                          ))}
                        </select>
                        {errors.industry && (
                          <p id="contact-industry-err" className="mt-1 text-xs text-red-700">
                            {errors.industry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-service"
                          className="block text-xs font-semibold text-[#0B1F3A]"
                        >
                          Required Service *
                        </label>
                        <select
                          id="contact-service"
                          value={formState.service}
                          onChange={(e) =>
                            setFormState({ ...formState, service: e.target.value })
                          }
                          aria-invalid={Boolean(errors.service)}
                          aria-describedby={errors.service ? 'contact-service-err' : undefined}
                          className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                        >
                          <option value="">Select primary service</option>
                          {SERVICES.map((srv) => (
                            <option key={srv.id} value={srv.title}>
                              {srv.title}
                            </option>
                          ))}
                        </select>
                        {errors.service && (
                          <p id="contact-service-err" className="mt-1 text-xs text-red-700">
                            {errors.service}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-[#0B1F3A]"
                      >
                        Portfolio Overview / Requirements *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-err' : undefined}
                        className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                        placeholder="Share approximate account volume, DPD buckets, and preferred geography..."
                      />
                      {errors.message && (
                        <p id="contact-message-err" className="mt-1 text-xs text-red-700">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                        {submitError}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full cursor-pointer rounded-md bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#132D52] disabled:opacity-60 sm:w-auto"
                      >
                        {submitting ? 'Submitting Request...' : 'Submit Consultation Request'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
