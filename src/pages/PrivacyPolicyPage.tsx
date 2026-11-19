import React from 'react';
import { COMPANY_INFO } from '../data/companyData';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Data Governance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-300">
            Effective Date: 2026 · {COMPANY_INFO.name}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-sm leading-relaxed text-slate-700 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              1. Commitment to Customer Data Protection
            </h2>
            <p className="mt-2">
              {COMPANY_INFO.name} (&ldquo;Trustline&rdquo;) handles institutional client records,
              borrower account details, and corporate enquiry data with strict confidentiality and
              role-based security controls.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              2. Information We Collect &amp; Process
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong>Institutional &amp; Enquiry Information:</strong> Contact name, organization
                name, business email, phone number, and service enquiry details submitted through
                our consultation forms.
              </li>
              <li>
                <strong>Allocated Recovery Data:</strong> Account balances, due dates, contact
                records, and disposition histories securely provided by authorized partner banks,
                NBFCs, and lending companies solely for authorized collection operations.
              </li>
              <li>
                <strong>Recruitment Data:</strong> Candidate contact details, experience levels,
                and language proficiencies submitted via our Careers page.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              3. Confidentiality &amp; Access Controls
            </h2>
            <p className="mt-2">
              Customer financial records are never sold, rented, or disclosed to unauthorized third
              parties. Access is restricted strictly to verified operational personnel bound by
              non-disclosure obligations and institutional audit trails.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              4. Communication &amp; Privacy Standards
            </h2>
            <p className="mt-2">
              All payment follow-up communications are conducted respectfully within permitted hours
              and only with authorized account holders or designated representatives in line with
              lender instructions and applicable Indian regulatory guidelines.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">5. Privacy Contact</h2>
            <p className="mt-2">
              For questions regarding data protection, record updates, or institutional compliance
              audits, contact us at{' '}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="font-medium text-[#0B1F3A] underline"
              >
                {COMPANY_INFO.email}
              </a>{' '}
              or write to our headquarters at {COMPANY_INFO.headquarters}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
