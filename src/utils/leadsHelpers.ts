import { CareerApplicationInput, ConsultationFormInput } from './validation';

export type EnquiryStatus = 'New' | 'Contacted' | 'In Discussion' | 'Converted' | 'Closed';
export type ApplicationStatus = 'New' | 'Shortlisted' | 'Interviewed' | 'Hired' | 'Archived';

export interface EnquiryLeadRecord {
  id: string;
  referenceId: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  service: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  publicUpdate?: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface ApplicationLeadRecord {
  id: string;
  referenceId: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experienceYears: string;
  preferredLanguage: string;
  coverNote?: string;
  status: ApplicationStatus;
  publicUpdate?: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface TrackingRecord {
  referenceId: string;
  sourceId: string;
  recordType: 'enquiry' | 'application';
  categoryLabel: string;
  status: EnquiryStatus | ApplicationStatus;
  publicUpdate?: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface TrackingTimelineStep {
  key: string;
  label: string;
  description: string;
  state: 'completed' | 'current' | 'upcoming';
}

export const ADMIN_EMAIL = 'trustlineservice566@gmail.com';
export const TRACKING_REFERENCE_REGEX = /^(TCS|JOB)-2026-[0-9]{4,12}$/;

export function isAuthorizedAdminEmail(email?: string | null, emailVerified?: boolean): boolean {
  if (!email || !emailVerified) return false;
  return email.toLowerCase() === ADMIN_EMAIL;
}

export function normalizeTrackingReferenceId(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidTrackingReferenceId(raw: string): boolean {
  return TRACKING_REFERENCE_REGEX.test(normalizeTrackingReferenceId(raw));
}

export function generateDocumentId(prefix: string): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}_${Date.now()}_${randomDigits}`;
}

export function generateUniqueReferenceId(prefix: 'TCS' | 'JOB'): string {
  const timeSuffix = String(Date.now()).slice(-4);
  const randSuffix = String(Math.floor(10 + Math.random() * 90));
  return `${prefix}-2026-${timeSuffix}${randSuffix}`;
}

export function sanitizePublicUpdateText(raw: string): string {
  return raw.trim().slice(0, 300);
}

export function sanitizeEnquiryPayload(
  input: ConsultationFormInput,
  referenceId: string
) {
  return {
    referenceId: referenceId.trim().slice(0, 24),
    fullName: input.fullName.trim().slice(0, 100),
    companyName: input.companyName.trim().slice(0, 140),
    email: input.email.trim().slice(0, 160),
    phone: input.phone.trim().slice(0, 20),
    industry: input.industry.trim().slice(0, 80),
    service: input.service.trim().slice(0, 100),
    message: input.message.trim().slice(0, 2000),
    status: 'New' as const,
  };
}

export function sanitizeCareerPayload(
  input: CareerApplicationInput,
  jobId: string,
  jobTitle: string,
  referenceId: string
) {
  return {
    referenceId: referenceId.trim().slice(0, 24),
    jobId: jobId.trim().slice(0, 64),
    jobTitle: jobTitle.trim().slice(0, 120),
    fullName: input.fullName.trim().slice(0, 100),
    email: input.email.trim().slice(0, 160),
    phone: input.phone.trim().slice(0, 20),
    experienceYears: input.experienceYears.trim().slice(0, 40),
    preferredLanguage: input.preferredLanguage.trim().slice(0, 120),
    coverNote: input.coverNote.trim().slice(0, 2000),
    status: 'New' as const,
  };
}

export function sanitizeTrackingCreatePayload(params: {
  referenceId: string;
  sourceId: string;
  recordType: 'enquiry' | 'application';
  categoryLabel: string;
}) {
  return {
    referenceId: normalizeTrackingReferenceId(params.referenceId).slice(0, 24),
    sourceId: params.sourceId.trim().slice(0, 64),
    recordType: params.recordType,
    categoryLabel: params.categoryLabel.trim().slice(0, 180),
    status: 'New' as const,
  };
}

export function getTrackingTimelineSteps(
  recordType: 'enquiry' | 'application',
  status: string
): TrackingTimelineStep[] {
  if (recordType === 'application') {
    const stages: { key: string; label: string; description: string }[] = [
      {
        key: 'New',
        label: 'Application Received',
        description: 'Logged with our Bengaluru hiring desk.',
      },
      {
        key: 'Shortlisted',
        label: 'Profile Shortlisted',
        description: 'Screened for language, territory, and domain fit.',
      },
      {
        key: 'Interviewed',
        label: 'Interview Stage',
        description: 'Operations coordinator evaluation and role briefing.',
      },
      {
        key: 'Outcome',
        label: status === 'Archived' ? 'Application Archived' : 'Final Hiring Decision',
        description:
          status === 'Hired'
            ? 'Selected for onboarding at Trustline Collection Services.'
            : status === 'Archived'
              ? 'Retained on file for upcoming Bengaluru openings.'
              : 'Offer and joining schedule coordination.',
      },
    ];

    const stageIndex =
      status === 'New'
        ? 0
        : status === 'Shortlisted'
          ? 1
          : status === 'Interviewed'
            ? 2
            : 3;

    return stages.map((stage, idx) => ({
      ...stage,
      state: idx < stageIndex ? 'completed' : idx === stageIndex ? 'current' : 'upcoming',
    }));
  }

  const enquiryStages: { key: string; label: string; description: string }[] = [
    {
      key: 'New',
      label: 'Enquiry Logged',
      description: 'Reference ID generated and queued for account review.',
    },
    {
      key: 'Contacted',
      label: 'Initial Contact',
      description: 'Account coordinator reached out to confirm portfolio scope.',
    },
    {
      key: 'In Discussion',
      label: 'SLA & Bucket Review',
      description: 'Aligning on DPD buckets, service scope, and MIS cadence.',
    },
    {
      key: 'Outcome',
      label: status === 'Closed' ? 'Enquiry Closed' : 'Mandate Onboarding',
      description:
        status === 'Converted'
          ? 'Approved for institutional onboarding and portfolio allocation.'
          : status === 'Closed'
            ? 'Consultation concluded and archived by our Bengaluru desk.'
            : 'Agreement sign-off and pilot allocation setup.',
    },
  ];

  const stageIndex =
    status === 'New'
      ? 0
      : status === 'Contacted'
        ? 1
        : status === 'In Discussion'
          ? 2
          : 3;

  return enquiryStages.map((stage, idx) => ({
    ...stage,
    state: idx < stageIndex ? 'completed' : idx === stageIndex ? 'current' : 'upcoming',
  }));
}

export function getDefaultStatusGuidance(
  recordType: 'enquiry' | 'application',
  status: string
): string {
  if (recordType === 'application') {
    switch (status) {
      case 'Shortlisted':
        return 'Your application has been shortlisted by our Bengaluru HR team. Expect an interview schedule call during working hours (Monday–Saturday, 9 AM–6 PM).';
      case 'Interviewed':
        return 'Your interview has been completed and is currently under final operations review.';
      case 'Hired':
        return 'Congratulations — your profile has been selected. Our coordinator will share onboarding documentation shortly.';
      case 'Archived':
        return 'This application cycle has concluded; your profile remains on record for future Bengaluru openings.';
      default:
        return 'Your application is queued for review by our Bengaluru hiring team during working hours (Monday–Saturday, 9 AM–6 PM).';
    }
  }

  switch (status) {
    case 'Contacted':
      return 'Our institutional desk has initiated contact regarding your portfolio requirements.';
    case 'In Discussion':
      return 'We are currently reviewing DPD bucket allocations, commercial SLAs, and MIS reporting formats with your team.';
    case 'Converted':
      return 'Your institutional partnership mandate is confirmed. Dedicated account management is active.';
    case 'Closed':
      return 'This consultation ticket has been closed. Submit a new enquiry or message us on WhatsApp anytime to reopen discussions.';
    default:
      return 'Your consultation request has been received and assigned to our Bengaluru B2B coordination desk for review.';
  }
}

export function filterLeadsByQueryAndStatus<
  T extends {
    status: string;
    fullName: string;
    email: string;
    phone: string;
    referenceId: string;
    companyName?: string;
    jobTitle?: string;
  },
>(leads: T[], statusFilter: string, searchQuery: string): T[] {
  const q = searchQuery.trim().toLowerCase();
  return leads.filter((lead) => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    if (!matchesStatus) return false;
    if (!q) return true;
    return (
      lead.fullName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.referenceId.toLowerCase().includes(q) ||
      (lead.companyName?.toLowerCase().includes(q) ?? false) ||
      (lead.jobTitle?.toLowerCase().includes(q) ?? false)
    );
  });
}

function escapeCsvCell(value: string): string {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

export function buildLeadsCsv(leads: EnquiryLeadRecord[]): string {
  const headers = [
    'Reference ID',
    'Status',
    'Company',
    'Contact Name',
    'Email',
    'Phone',
    'Industry',
    'Service',
    'Message',
    'Internal Notes',
    'Client Status Update',
    'Submitted Date',
  ];
  const rows = leads.map((lead) => [
    lead.referenceId,
    lead.status,
    lead.companyName,
    lead.fullName,
    lead.email,
    lead.phone,
    lead.industry,
    lead.service,
    lead.message,
    lead.notes ?? '',
    lead.publicUpdate ?? '',
    new Date(lead.createdAtMs).toISOString(),
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\n');
}
