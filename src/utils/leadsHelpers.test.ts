import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLeadsCsv,
  filterLeadsByQueryAndStatus,
  generateDocumentId,
  generateUniqueReferenceId,
  getDefaultStatusGuidance,
  getTrackingTimelineSteps,
  isAuthorizedAdminEmail,
  isValidTrackingReferenceId,
  normalizeTrackingReferenceId,
  sanitizeCareerPayload,
  sanitizeEnquiryPayload,
  sanitizePublicUpdateText,
  sanitizeTrackingCreatePayload,
} from './leadsHelpers';

test('isAuthorizedAdminEmail requires verified admin email', () => {
  assert.equal(isAuthorizedAdminEmail('trustlineservice566@gmail.com', true), true);
  assert.equal(isAuthorizedAdminEmail('Trustlineservice566@gmail.com', true), true);
  assert.equal(isAuthorizedAdminEmail('trustlineservice566@gmail.com', false), false);
  assert.equal(isAuthorizedAdminEmail('other@example.com', true), false);
});

test('generateDocumentId and generateUniqueReferenceId match Firestore rule patterns', () => {
  const docId = generateDocumentId('enq');
  assert.match(docId, /^[a-zA-Z0-9_\-]+$/);

  const tcsRef = generateUniqueReferenceId('TCS');
  assert.match(tcsRef, /^TCS-2026-[0-9]{4,12}$/);

  const jobRef = generateUniqueReferenceId('JOB');
  assert.match(jobRef, /^JOB-2026-[0-9]{4,12}$/);
});

test('normalizeTrackingReferenceId and isValidTrackingReferenceId validate tracking IDs', () => {
  assert.equal(normalizeTrackingReferenceId(' tcs-2026-991754 '), 'TCS-2026-991754');
  assert.equal(isValidTrackingReferenceId('tcs-2026-991754'), true);
  assert.equal(isValidTrackingReferenceId('JOB-2026-123456'), true);
  assert.equal(isValidTrackingReferenceId('BAD-2026-123456'), false);
  assert.equal(isValidTrackingReferenceId('TCS-2026-12'), false);
  assert.equal(isValidTrackingReferenceId(''), false);
});

test('sanitizeTrackingCreatePayload and sanitizePublicUpdateText enforce blueprint constraints', () => {
  const track = sanitizeTrackingCreatePayload({
    referenceId: ' tcs-2026-123456 ',
    sourceId: 'enq_1700000_123456',
    recordType: 'enquiry',
    categoryLabel: 'Field Collection Services · NBFCs',
  });
  assert.equal(track.referenceId, 'TCS-2026-123456');
  assert.equal(track.status, 'New');
  assert.equal('publicUpdate' in track, false);

  const longText = 'a'.repeat(350);
  assert.equal(sanitizePublicUpdateText(`  ${longText}  `).length, 300);
});

test('getTrackingTimelineSteps computes progress stages accurately', () => {
  const discussionSteps = getTrackingTimelineSteps('enquiry', 'In Discussion');
  assert.equal(discussionSteps.length, 4);
  assert.equal(discussionSteps[0].state, 'completed');
  assert.equal(discussionSteps[1].state, 'completed');
  assert.equal(discussionSteps[2].state, 'current');
  assert.equal(discussionSteps[3].state, 'upcoming');

  const hiredSteps = getTrackingTimelineSteps('application', 'Hired');
  assert.equal(hiredSteps[3].state, 'current');
  assert.equal(hiredSteps[3].label, 'Final Hiring Decision');

  assert.ok(getDefaultStatusGuidance('enquiry', 'Converted').includes('confirmed'));
  assert.ok(getDefaultStatusGuidance('application', 'Shortlisted').includes('shortlisted'));
});

test('sanitizeEnquiryPayload and sanitizeCareerPayload enforce blueprint bounds and status New', () => {
  const enq = sanitizeEnquiryPayload(
    {
      fullName: '  Meera Nair  ',
      companyName: '  Deccan FinCorp  ',
      email: ' meera@deccan.in ',
      phone: ' +91 9845011223 ',
      industry: 'NBFCs',
      service: 'Telecalling & Payment Follow-ups',
      message: '  Looking for structured 1-60 DPD telecalling support.  ',
    },
    'TCS-2026-123456'
  );
  assert.equal(enq.status, 'New');
  assert.equal(enq.fullName, 'Meera Nair');

  const app = sanitizeCareerPayload(
    {
      fullName: 'Karthik Gowda',
      email: 'karthik@example.com',
      phone: '9845011223',
      experienceYears: '1–3 Years',
      preferredLanguage: 'Kannada, English',
      coverNote: '',
    },
    'field-officer',
    'Field Collection Officer',
    'JOB-2026-654321'
  );
  assert.equal(app.status, 'New');
  assert.equal(app.jobId, 'field-officer');
});

test('filterLeadsByQueryAndStatus filters by status and search text', () => {
  const sample = [
    {
      referenceId: 'TCS-2026-0001',
      status: 'New',
      fullName: 'Meera Nair',
      companyName: 'Deccan FinCorp',
      email: 'meera@deccan.in',
      phone: '9845011223',
    },
    {
      referenceId: 'TCS-2026-0002',
      status: 'Converted',
      fullName: 'Rohan Desai',
      companyName: 'Apex Bank',
      email: 'rohan@apexbank.in',
      phone: '9880011223',
    },
  ];

  assert.equal(filterLeadsByQueryAndStatus(sample, 'All', '').length, 2);
  assert.equal(filterLeadsByQueryAndStatus(sample, 'New', '').length, 1);
  assert.equal(filterLeadsByQueryAndStatus(sample, 'All', 'apex').length, 1);
  assert.equal(filterLeadsByQueryAndStatus(sample, 'New', 'apex').length, 0);
});

test('buildLeadsCsv formats valid CSV with escaped quotes', () => {
  const csv = buildLeadsCsv([
    {
      id: '1',
      referenceId: 'TCS-2026-0001',
      fullName: 'Meera Nair',
      companyName: 'Deccan "NBFC" Ltd',
      email: 'meera@deccan.in',
      phone: '9845011223',
      industry: 'NBFCs',
      service: 'Telecalling & Payment Follow-ups',
      message: 'Overdue portfolio recovery support.',
      status: 'New',
      notes: 'Called back',
      publicUpdate: 'Discovery scheduled',
      createdAtMs: 1700000000000,
      updatedAtMs: 1700000000000,
    },
  ]);
  assert.ok(csv.includes('"Reference ID","Status","Company"'));
  assert.ok(csv.includes('"Deccan ""NBFC"" Ltd"'));
  assert.ok(csv.includes('"Discovery scheduled"'));
});
