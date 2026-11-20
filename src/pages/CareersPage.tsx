import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin, X } from 'lucide-react';
import { COMPANY_INFO, JOB_OPENINGS, JobOpening } from '../data/companyData';
import {
  CareerApplicationInput,
  FormErrors,
  filterJobOpenings,
  validateCareerApplication,
} from '../utils/validation';
import { createCareerApplication } from '../services/leadsService';
import { submitToNetlifyForm } from '../utils/netlifyForms';

export interface SubmittedJobApplication {
  jobId: string;
  jobTitle: string;
  referenceId: string;
  applicantName: string;
}

interface CareersPageProps {
  submittedApplications: SubmittedJobApplication[];
  onApplicationSubmitted: (application: SubmittedJobApplication) => void;
  onTrackReference?: (referenceId?: string) => void;
}

const DEPARTMENTS = ['All', 'Voice Operations', 'Field Recovery', 'Analytics & MIS'] as const;

const INITIAL_FORM: CareerApplicationInput = {
  fullName: '',
  email: '',
  phone: '',
  experienceYears: '',
  preferredLanguage: '',
  coverNote: '',
};

export const CareersPage: React.FC<CareersPageProps> = ({
  submittedApplications,
  onApplicationSubmitted,
  onTrackReference,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [applyingJob, setApplyingJob] = useState<JobOpening | null>(null);
  const [formState, setFormState] = useState<CareerApplicationInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors<CareerApplicationInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [latestConfirmation, setLatestConfirmation] =
    useState<SubmittedJobApplication | null>(null);

  const visibleJobs = filterJobOpenings(JOB_OPENINGS, selectedDepartment);

  const openApplicationForm = (job: JobOpening) => {
    setApplyingJob(job);
    setFormState(INITIAL_FORM);
    setErrors({});
    setSubmitError('');
    setLatestConfirmation(null);
  };

  const closeApplicationForm = () => {
    setApplyingJob(null);
    setErrors({});
    setSubmitError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!applyingJob) return;
    setSubmitError('');

    const validationErrors = validateCareerApplication(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { referenceId } = await createCareerApplication(
        formState,
        applyingJob.id,
        applyingJob.title
      );
      const record: SubmittedJobApplication = {
        jobId: applyingJob.id,
        jobTitle: applyingJob.title,
        referenceId,
        applicantName: formState.fullName.trim(),
      };

      void submitToNetlifyForm('career-application', {
        referenceId,
        jobTitle: applyingJob.title,
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        experienceYears: formState.experienceYears,
        preferredLanguage: formState.preferredLanguage.trim(),
        coverNote: formState.coverNote.trim(),
      });

      onApplicationSubmitted(record);
      setLatestConfirmation(record);
      setApplyingJob(null);
      setFormState(INITIAL_FORM);
      setErrors({});
    } catch {
      setSubmitError('Could not submit application right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Careers at Trustline
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build a Disciplined Career in Financial Operations
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
            Join our Bengaluru headquarters in Madavara, Madanayakanahalli. We value clear
            communication, ethical conduct, and structured execution.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Confirmation Banner */}
          {latestConfirmation && (
            <div
              role="status"
              className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-950">
                    Application Submitted for {latestConfirmation.jobTitle}
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-900">
                    Thank you, {latestConfirmation.applicantName}. Reference ID:{' '}
                    <span className="font-mono font-semibold">
                      {latestConfirmation.referenceId}
                    </span>
                    . Our HR team will review your profile during working hours (
                    {COMPANY_INFO.workingHours}).
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
                {onTrackReference && (
                  <button
                    type="button"
                    onClick={() => onTrackReference(latestConfirmation.referenceId)}
                    className="cursor-pointer rounded-md bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 whitespace-nowrap shrink-0"
                  >
                    Track Status
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLatestConfirmation(null)}
                  className="cursor-pointer text-xs font-medium text-emerald-900 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[#0B1F3A]">
                Open Positions ({visibleJobs.length})
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Hub Location: {COMPANY_INFO.headquarters}
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter openings by department"
              className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1"
            >
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDepartment === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#0B1F3A] text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B1F3A]'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {visibleJobs.map((job) => {
              const existingApplication = submittedApplications.find(
                (item) => item.jobId === job.id
              );
              return (
                <article
                  key={job.id}
                  className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#A67C2E]">{job.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.employmentType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.experience}</span>
                    </div>

                    <h3 className="mt-2 text-xl font-semibold text-[#0B1F3A]">{job.title}</h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                      <span>{job.location}</span>
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{job.summary}</p>

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider">
                          Responsibilities
                        </p>
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                          {job.responsibilities.map((r) => (
                            <li key={r}>• {r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider">
                          Requirements
                        </p>
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                          {job.requirements.map((req) => (
                            <li key={req}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    {existingApplication ? (
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>
                          Application Submitted ({existingApplication.referenceId})
                        </span>
                        {onTrackReference && (
                          <button
                            type="button"
                            onClick={() => onTrackReference(existingApplication.referenceId)}
                            className="cursor-pointer font-semibold text-[#0B1F3A] underline hover:text-[#A67C2E]"
                          >
                            Track
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Immediate joining preferred</span>
                    )}

                    <button
                      type="button"
                      onClick={() => openApplicationForm(job)}
                      aria-label={`Apply Now for ${job.title}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
                    >
                      <span>{existingApplication ? 'Apply Again' : 'Apply Now'}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Modal / Dialog */}
      {applyingJob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="career-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071426]/65 p-4"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold text-[#A67C2E] uppercase tracking-wider">
                  Candidate Application
                </p>
                <h2 id="career-modal-title" className="mt-1 text-xl font-semibold text-[#0B1F3A]">
                  {applyingJob.title}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">{applyingJob.location}</p>
              </div>

              <button
                type="button"
                onClick={closeApplicationForm}
                aria-label="Close application form"
                className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#0B1F3A]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="career-name" className="block text-xs font-semibold text-[#0B1F3A]">
                  Full Name *
                </label>
                <input
                  id="career-name"
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  aria-invalid={Boolean(errors.fullName)}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="career-email"
                    className="block text-xs font-semibold text-[#0B1F3A]"
                  >
                    Email Address *
                  </label>
                  <input
                    id="career-email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
                </div>

                <div>
                  <label
                    htmlFor="career-phone"
                    className="block text-xs font-semibold text-[#0B1F3A]"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="career-phone"
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                    placeholder="+91 98XXXXXXXX"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="career-exp"
                    className="block text-xs font-semibold text-[#0B1F3A]"
                  >
                    Relevant Experience *
                  </label>
                  <select
                    id="career-exp"
                    value={formState.experienceYears}
                    onChange={(e) =>
                      setFormState({ ...formState, experienceYears: e.target.value })
                    }
                    aria-invalid={Boolean(errors.experienceYears)}
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                  >
                    <option value="">Select experience</option>
                    <option value="Fresher (0–1 Year)">Fresher (0–1 Year)</option>
                    <option value="1–3 Years">1–3 Years</option>
                    <option value="3–5 Years">3–5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                  {errors.experienceYears && (
                    <p className="mt-1 text-xs text-red-700">{errors.experienceYears}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="career-lang"
                    className="block text-xs font-semibold text-[#0B1F3A]"
                  >
                    Languages Spoken *
                  </label>
                  <input
                    id="career-lang"
                    type="text"
                    value={formState.preferredLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, preferredLanguage: e.target.value })
                    }
                    aria-invalid={Boolean(errors.preferredLanguage)}
                    className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                    placeholder="e.g. English, Kannada, Hindi"
                  />
                  {errors.preferredLanguage && (
                    <p className="mt-1 text-xs text-red-700">{errors.preferredLanguage}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="career-note" className="block text-xs font-semibold text-[#0B1F3A]">
                  Brief Experience Summary (Optional)
                </label>
                <textarea
                  id="career-note"
                  rows={3}
                  value={formState.coverNote}
                  onChange={(e) => setFormState({ ...formState, coverNote: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                  placeholder="Share your banking, NBFC, or customer follow-up background..."
                />
              </div>

              {submitError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeApplicationForm}
                  className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer rounded-md bg-[#0B1F3A] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#132D52] disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
