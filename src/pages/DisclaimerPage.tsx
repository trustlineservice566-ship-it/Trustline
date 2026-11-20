import React from 'react';
import { COMPANY_INFO } from '../data/companyData';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
            Legal &amp; Compliance Information
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Disclaimer</h1>
          <p className="mt-2 text-sm text-slate-300">
            {COMPANY_INFO.name} · Bengaluru, Karnataka, India
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-sm leading-relaxed text-slate-700 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              1. B2B Agency Scope &amp; Authorization
            </h2>
            <p className="mt-2">
              {COMPANY_INFO.name} operates exclusively as a Business-to-Business (B2B) debt
              collection and financial recovery agency. We act strictly as an authorized service
              partner on behalf of banks, NBFCs, microfinance institutions, and regulated lenders
              under formal service-level agreements.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              2. Sample Statistics Notice
            </h2>
            <p className="mt-2">
              All numerical statistics presented across this website (including executive counts,
              business client counts, years of experience, and accounts handled) are fictional
              illustrative placeholders intended for corporate website design and presentation
              purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              3. Ethical Collection &amp; Payment Verification
            </h2>
            <p className="mt-2">
              Trustline follows fair and respectful communication practices. Borrowers making
              overdue payments or one-time settlements are advised to verify official payment links,
              authorized lender accounts, or official receipts issued directly by the respective
              lending institution or verified Trustline representatives.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              4. No Legal or Financial Advice
            </h2>
            <p className="mt-2">
              Information published on this website is for general corporate informational purposes
              only and does not constitute legal, regulatory, or financial advice. Specific recovery
              mandates, settlement eligibility, and restructuring terms remain subject to the
              respective lending institution&apos;s policies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              5. Official Correspondence
            </h2>
            <p className="mt-2">
              Official communications from {COMPANY_INFO.name} (Owner: {COMPANY_INFO.ownerName})
              are handled during working hours ({COMPANY_INFO.workingHours}) via{' '}
              {COMPANY_INFO.email}, {COMPANY_INFO.ownerPhone}, and {COMPANY_INFO.phone}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
