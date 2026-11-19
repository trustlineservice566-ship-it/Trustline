import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterJobOpenings,
  generateReferenceId,
  isValidEmail,
  isValidPhone,
  normalizeIndianPhone,
  validateCareerApplication,
  validateConsultationForm,
} from './validation';

test('normalizeIndianPhone handles +91 and leading zero', () => {
  assert.equal(normalizeIndianPhone('+91 9731677019'), '9731677019');
  assert.equal(normalizeIndianPhone('09731677019'), '9731677019');
  assert.equal(normalizeIndianPhone('97316-77019'), '9731677019');
});

test('email and phone validators catch malformed input and accept valid values', () => {
  assert.equal(isValidEmail('Trustlinesrvice566@gmail.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidPhone('+91 9731677019'), true);
  assert.equal(isValidPhone('12345'), false);
});

test('validateConsultationForm rejects empty inputs and passes valid submission', () => {
  const emptyErrors = validateConsultationForm({
    fullName: '',
    companyName: '',
    email: 'bad',
    phone: '123',
    industry: '',
    service: '',
    message: 'short',
  });
  assert.ok(emptyErrors.fullName);
  assert.ok(emptyErrors.companyName);
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.phone);
  assert.ok(emptyErrors.industry);
  assert.ok(emptyErrors.service);
  assert.ok(emptyErrors.message);

  const validErrors = validateConsultationForm({
    fullName: 'Raghavendra Rao',
    companyName: 'Karnataka FinServ NBFC',
    email: 'raghav@kfinserv.in',
    phone: '+91 9845012345',
    industry: 'NBFCs',
    service: 'Telecalling & Payment Follow-ups',
    message: 'Looking for structured early-bucket telecalling support for 2,500 accounts.',
  });
  assert.deepEqual(validErrors, {});
});

test('validateCareerApplication validates required candidate details', () => {
  const errors = validateCareerApplication({
    fullName: 'A',
    email: 'wrong',
    phone: '42',
    experienceYears: '',
    preferredLanguage: '',
    coverNote: '',
  });
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.experienceYears);
  assert.ok(errors.preferredLanguage);

  const valid = validateCareerApplication({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9880112233',
    experienceYears: '1–3 Years',
    preferredLanguage: 'English, Kannada, Hindi',
    coverNote: 'Experienced in retail banking customer follow-ups.',
  });
  assert.deepEqual(valid, {});
});

test('generateReferenceId formats deterministic reference IDs', () => {
  assert.equal(generateReferenceId('TCS', 1), 'TCS-2026-0001');
  assert.equal(generateReferenceId('JOB', 42), 'JOB-2026-0042');
});

test('filterJobOpenings filters by department or returns all', () => {
  const sample = [
    { id: '1', department: 'Voice Operations' },
    { id: '2', department: 'Field Recovery' },
    { id: '3', department: 'Analytics & MIS' },
  ];
  assert.equal(filterJobOpenings(sample, 'All').length, 3);
  assert.deepEqual(
    filterJobOpenings(sample, 'Field Recovery').map((j) => j.id),
    ['2']
  );
});
