export interface ConsultationFormInput {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  service: string;
  message: string;
}

export interface CareerApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  experienceYears: string;
  preferredLanguage: string;
  coverNote: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeIndianPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizeIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(normalized) || /^\d{10,12}$/.test(phone.replace(/\D/g, ''));
}

export function validateConsultationForm(
  input: ConsultationFormInput
): FormErrors<ConsultationFormInput> {
  const errors: FormErrors<ConsultationFormInput> = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  if (input.companyName.trim().length < 2) {
    errors.companyName = 'Please enter your bank, NBFC, or company name.';
  }
  if (!isValidEmail(input.email)) {
    errors.email = 'Please enter a valid business email address.';
  }
  if (!isValidPhone(input.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }
  if (!input.industry.trim()) {
    errors.industry = 'Please select your industry sector.';
  }
  if (!input.service.trim()) {
    errors.service = 'Please select a primary service of interest.';
  }
  if (input.message.trim().length < 15) {
    errors.message = 'Please provide brief details about your portfolio or enquiry (min 15 characters).';
  }

  return errors;
}

export function validateCareerApplication(
  input: CareerApplicationInput
): FormErrors<CareerApplicationInput> {
  const errors: FormErrors<CareerApplicationInput> = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!isValidEmail(input.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!isValidPhone(input.phone)) {
    errors.phone = 'Please enter a valid 10-digit contact number.';
  }
  if (!input.experienceYears.trim()) {
    errors.experienceYears = 'Please select your experience level.';
  }
  if (input.preferredLanguage.trim().length < 2) {
    errors.preferredLanguage = 'Please list languages you speak fluently.';
  }

  return errors;
}

export function generateReferenceId(prefix: 'TCS' | 'JOB', seedNumber: number): string {
  const padded = String(Math.max(1, seedNumber)).padStart(4, '0');
  return `${prefix}-2026-${padded}`;
}

export function filterJobOpenings<T extends { department: string }>(
  jobs: T[],
  department: string
): T[] {
  if (department === 'All') {
    return jobs;
  }
  return jobs.filter((job) => job.department === department);
}

export function buildWhatsAppUrl(rawPhone: string, message?: string): string {
  const tenDigit = normalizeIndianPhone(rawPhone);
  const international = tenDigit.length === 10 ? `91${tenDigit}` : rawPhone.replace(/\D/g, '');
  const base = `https://wa.me/${international}`;
  if (message && message.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}

