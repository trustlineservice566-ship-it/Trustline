export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'industries'
  | 'process'
  | 'careers'
  | 'contact'
  | 'privacy'
  | 'disclaimer';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  outcomeMetric: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  summary: string;
  recoveryFocus: string;
  complianceApproach: string;
  typicalBuckets: string;
}

export interface ProcessStage {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  controls: string[];
}

export interface JobOpening {
  id: string;
  title: string;
  department: 'Voice Operations' | 'Field Recovery' | 'Analytics & MIS';
  location: string;
  employmentType: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const COMPANY_INFO = {
  brandShort: 'Trustline',
  name: 'Trustline Collection Services',
  tagline: 'Recover Smart. Build Trust.',
  industry: 'Debt Collection & Financial Recovery',
  founded: '2026',
  businessType: 'B2B Collection Agency',
  headquarters: 'Bengaluru, Madavara, Madanayakanahalli 562162, Karnataka, India',
  email: 'Trustlinesrvice566@gmail.com',
  phone: '+91 9731677019',
  workingHours: 'Monday–Saturday, 9 AM–6 PM',
  mission:
    'To simplify financial recovery through technology, professionalism and customer-focused solutions.',
  vision:
    'To be India’s most trusted B2B financial recovery partner, setting the benchmark for ethical communication, transparent reporting, and preserved lender-customer relationships.',
  aboutSummary:
    'Trustline Collection Services is a professional debt collection and financial recovery agency based in Bengaluru, India. We help banks, NBFCs, financial institutions and lending companies manage overdue accounts through professional communication, customer support and structured recovery solutions.',
  approachSummary:
    'Our approach focuses on ethical recovery practices, transparency and maintaining positive relationships between lenders and customers.',
};

export const HERO_ASSETS = {
  heroImage: '/src/assets/images/hero_corporate_bengaluru_1795075812721.jpg',
  aboutImage: '/src/assets/images/about_executive_office_1795075813256.jpg',
  operationsImage: '/src/assets/images/operations_analytics_desk_1795075813711.jpg',
};

export const SAMPLE_STATS = [
  {
    value: '50+',
    label: 'Collection Executives',
    detail: 'Trained voice and field professionals',
  },
  {
    value: '5+',
    label: 'Business Clients',
    detail: 'Banks, NBFCs and lending partners',
  },
  {
    value: '5+',
    label: 'Years of Experience',
    detail: 'Combined leadership & recovery domain expertise',
  },
  {
    value: '10K+',
    label: 'Accounts Handled',
    detail: 'Structured lifecycle case management',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Professional collection executives',
    description:
      'Disciplined, verified voice and field personnel trained in respectful borrower engagement and regulatory conduct.',
  },
  {
    title: 'Customer-friendly communication',
    description:
      'Solution-oriented conversations that resolve payment friction while safeguarding your institutional brand reputation.',
  },
  {
    title: 'Transparent recovery processes',
    description:
      'Every interaction, promise-to-pay commitment, and field visit is documented with clear audit trails.',
  },
  {
    title: 'Dedicated account management',
    description:
      'Single-point institutional coordinators aligned to your portfolio buckets, SLAs, and escalation matrices.',
  },
  {
    title: 'Regular performance reporting',
    description:
      'Scheduled daily, weekly, and monthly MIS reconciliations detailing contactability, promises, and collections.',
  },
  {
    title: 'Technology-driven operations',
    description:
      'Structured dialing workflows, digital disposition tracking, and bucket-level portfolio analytics.',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'telecalling',
    number: '01',
    title: 'Telecalling & Payment Follow-ups',
    shortDescription:
      'Professional customer communication for overdue payment reminders and account follow-ups.',
    fullDescription:
      'Structured multi-language outbound and inbound engagement focused on early-bucket reminders, soft delinquency resolution, and promise-to-pay tracking without damaging customer goodwill.',
    deliverables: [
      'Early-stage EMI reminders and due-date follow-ups',
      'Multilingual customer support (Kannada, English, Hindi, Tamil, Telugu)',
      'Structured Promise-to-Pay (PTP) capture and calendar reminders',
      'Call disposition logging and recorded quality audits',
    ],
    outcomeMetric: 'Designed for X-bucket & 1–60 DPD containment',
  },
  {
    id: 'field-collection',
    number: '02',
    title: 'Field Collection Services',
    shortDescription:
      'Authorized field visits and customer coordination for outstanding dues.',
    fullDescription:
      'Verified, uniformed field executives across Bengaluru and Karnataka hubs executing compliant doorstep visits, address verification, and authorized payment coordination.',
    deliverables: [
      'Authorized residential and workplace verification visits',
      'Digital receipting and verified payment link facilitation',
      'Geo-tagged visit logs with structured customer feedback',
      'Strict adherence to permitted visiting hours and conduct norms',
    ],
    outcomeMetric: 'Covers Bengaluru & key Karnataka lending corridors',
  },
  {
    id: 'settlement',
    number: '03',
    title: 'Settlement Assistance',
    shortDescription:
      'Coordination between customers and lenders regarding eligible settlement options.',
    fullDescription:
      'Facilitated negotiation and documentation support for distressed borrowers eligible for restructuring, one-time settlements (OTS), or revised repayment schedules approved by the lender.',
    deliverables: [
      'Lender-approved OTS and restructuring option presentation',
      'Hardship documentation collection and verification',
      'Closure letter coordination and final payment tracking',
      'Reduced litigation overhead through amicable resolution',
    ],
    outcomeMetric: 'Structured mediation aligned to lender policy',
  },
  {
    id: 'npa-management',
    number: '04',
    title: 'NPA & Overdue Account Management',
    shortDescription:
      'Structured follow-up and reporting for non-performing and overdue accounts.',
    fullDescription:
      'Dedicated recovery workflows for 90+ DPD, written-off, and chronic overdue portfolios combining skip tracing, persistent follow-ups, and escalation coordination.',
    deliverables: [
      'Bucket-wise segmentation for 60–90+ DPD and NPA pools',
      'Contactability enrichment and address trace verification',
      'Coordinated escalation summaries for institutional review',
      'Sustained recovery cadence on aged balances',
    ],
    outcomeMetric: 'Focused on high-value & aged NPA recovery',
  },
  {
    id: 'analytics',
    number: '05',
    title: 'Recovery Analytics & Reporting',
    shortDescription:
      'Performance reports, account tracking and recovery progress monitoring.',
    fullDescription:
      'Transparent institutional MIS dashboards and reconciliation packs giving your risk and collections leadership clear visibility into bucket movement, agent productivity, and settlement closures.',
    deliverables: [
      'Daily disposition and contact-rate summary packs',
      'Bucket roll-forward vs. stabilization analytics',
      'Payment reconciliation statements and audit logs',
      'Periodic portfolio strategy review briefings',
    ],
    outcomeMetric: 'Daily & monthly MIS reconciliation cadence',
  },
];

export const INDUSTRIES: IndustryItem[] = [
  {
    id: 'banks',
    name: 'Banks',
    summary:
      'Public, private, and scheduled commercial banks seeking compliant, brand-safe retail and SME recovery management.',
    recoveryFocus:
      'Soft-bucket stabilization, NPA lifecycle follow-ups, and audit-ready call and field documentation.',
    complianceApproach:
      'Strict adherence to institutional code of conduct, call recording retention, and verified authorization letters.',
    typicalBuckets: '30–90+ DPD & Written-off Pools',
  },
  {
    id: 'nbfcs',
    name: 'NBFCs',
    summary:
      'Non-Banking Financial Companies managing high-volume retail, MSME, and vehicle loan portfolios.',
    recoveryFocus:
      'Rapid allocation turnaround, blended voice-plus-field follow-ups, and daily collection reconciliation.',
    complianceApproach:
      'Dedicated SLA tracking, transparent fee structures, and real-time disposition reporting.',
    typicalBuckets: 'Early Delinquency to 180+ DPD',
  },
  {
    id: 'microfinance',
    name: 'Microfinance Institutions',
    summary:
      'JLG and MFI lenders requiring empathetic, local-language borrower engagement and community-respectful field coordination.',
    recoveryFocus:
      'Regional language telecalling, repayment counseling, and courteous field outreach in peri-urban zones.',
    complianceApproach:
      'Zero-coercion communication standards designed to preserve borrower dignity and long-term inclusion.',
    typicalBuckets: '1–90 DPD & Field Stabilization',
  },
  {
    id: 'personal-loans',
    name: 'Personal Loan Providers',
    summary:
      'Digital lenders and unsecured personal credit institutions balancing fast recovery with customer retention.',
    recoveryFocus:
      'High-frequency digital payment link reminders, salary-cycle follow-ups, and structured settlement mediation.',
    complianceApproach:
      'Digital consent verification, privacy-first contact protocols, and standardized escalation rules.',
    typicalBuckets: 'X-Bucket, 1–60 DPD & Settlements',
  },
  {
    id: 'two-wheeler',
    name: 'Two-Wheeler Finance Companies',
    summary:
      'Secured mobility financiers operating across Bengaluru and Karnataka suburban markets.',
    recoveryFocus:
      'Localized field verification, EMI regularization follow-ups, and overdue settlement coordination.',
    complianceApproach:
      'Authorized representative identification and documented field visit logs.',
    typicalBuckets: '30–120 DPD Regional Portfolios',
  },
  {
    id: 'consumer-durable',
    name: 'Consumer Durable Finance Companies',
    summary:
      'Point-of-sale and small-ticket electronics/appliance financiers managing high-count installment accounts.',
    recoveryFocus:
      'Automated reminder cadences, polite telecalling, and fast digital UPI/NEFT closure tracking.',
    complianceApproach:
      'High-volume data security and standardized script compliance across every call.',
    typicalBuckets: 'High-Volume 1–60 DPD Accounts',
  },
  {
    id: 'credit-cards',
    name: 'Credit Card Providers',
    summary:
      'Issuers managing revolving credit balances, minimum-due reminders, and structured hardship settlements.',
    recoveryFocus:
      'Statement-cycle nudges, minimum-amount-due recovery, and one-time settlement coordination.',
    complianceApproach:
      'Confidential financial data handling and strict permitted-hours outreach.',
    typicalBuckets: 'Cycle Due to Chronic Overdue',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: '01',
    title: 'Account Allocation & Data Onboarding',
    subtitle: 'Secure portfolio ingestion',
    description:
      'Encrypted transfer of overdue account files from the lending partner, mapped to bucket definitions, SLA targets, and institutional communication guidelines.',
    controls: ['Role-based access control', 'Allocation validation checks', 'SLA & script sign-off'],
  },
  {
    step: '02',
    title: 'Segmentation & Contactability Audit',
    subtitle: 'Prioritized recovery routing',
    description:
      'Accounts are segmented by DPD bucket, outstanding principal, geography, and historical response patterns to assign the right channel mix.',
    controls: ['Bucket prioritization', 'Language preference tagging', 'Duplicate & DND screening'],
  },
  {
    step: '03',
    title: 'Ethical Telecalling & Payment Reminders',
    subtitle: 'Solution-oriented outreach',
    description:
      'Trained executives initiate polite, structured reminders during permitted hours, clarifying dues and facilitating convenient digital repayment options.',
    controls: ['100% call logging', 'PTP commitment tracking', 'Supervisor quality sampling'],
  },
  {
    step: '04',
    title: 'Authorized Field Visits & Settlement Support',
    subtitle: 'On-ground resolution',
    description:
      'For uncontactable or escalated accounts, verified field officers conduct authorized visits or coordinate lender-approved settlement proposals.',
    controls: ['ID-verified field personnel', 'Geo-tagged visit records', 'Lender-approved OTS terms'],
  },
  {
    step: '05',
    title: 'Reconciliation & Executive Reporting',
    subtitle: 'Full lifecycle transparency',
    description:
      'Recovered amounts, payment proofs, and account statuses are reconciled against lender records and delivered in structured MIS dashboards.',
    controls: ['Daily recovery trackers', 'Bucket roll-rate analysis', 'Monthly audit reviews'],
  },
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'telecalling-exec',
    title: 'Telecalling Collection Executive',
    department: 'Voice Operations',
    location: 'Madavara, Bengaluru (On-site)',
    employmentType: 'Full-Time',
    experience: '0–3 Years',
    summary:
      'Engage with borrowers over phone in a polite, structured manner to remind overdue payments, record Promise-to-Pay commitments, and support digital repayment.',
    responsibilities: [
      'Handle daily outbound follow-up calls for assigned banking and NBFC buckets',
      'Maintain accurate call dispositions and Promise-to-Pay dates in the CRM',
      'Communicate payment options and settlement eligibility clearly and respectfully',
    ],
    requirements: [
      'Fluency in English and Kannada or Hindi (additional South Indian languages preferred)',
      'Clear verbal communication and calm problem-solving attitude',
      'Prior telecalling or banking customer support experience is an advantage',
    ],
  },
  {
    id: 'field-officer',
    title: 'Field Collection Officer',
    department: 'Field Recovery',
    location: 'Bengaluru North & West Zones',
    employmentType: 'Full-Time',
    experience: '1–4 Years',
    summary:
      'Conduct authorized customer visits across designated Bengaluru corridors to verify addresses, coordinate overdue repayments, and submit daily visit logs.',
    responsibilities: [
      'Execute scheduled field visits strictly within authorized hours and conduct standards',
      'Assist customers with verified lender payment links and official receipt acknowledgments',
      'Coordinate daily status updates with the Bengaluru hub supervisor',
    ],
    requirements: [
      'Valid two-wheeler driving license and familiarity with Bengaluru routes',
      'Prior experience in NBFC, two-wheeler, or retail banking field recovery',
      'High integrity and disciplined documentation habits',
    ],
  },
  {
    id: 'recovery-team-lead',
    title: 'Recovery Operations Team Lead',
    department: 'Voice Operations',
    location: 'Madavara, Bengaluru (On-site)',
    employmentType: 'Full-Time',
    experience: '3–6 Years',
    summary:
      'Lead a dedicated pod of 12–15 collection executives, monitor quality compliance, coach communication standards, and achieve monthly lender SLA benchmarks.',
    responsibilities: [
      'Manage daily bucket targets, dialer efficiency, and contactability conversion',
      'Audit recorded calls for ethical conduct and script adherence',
      'Conduct weekly client review calls with partner NBFC and bank managers',
    ],
    requirements: [
      '3+ years leading B2B debt recovery or BFSI voice operations teams',
      'Strong understanding of DPD bucket metrics and RBI fair-practice norms',
      'Proficiency in MIS reporting and team mentoring',
    ],
  },
  {
    id: 'mis-analyst',
    title: 'MIS & Recovery Reporting Analyst',
    department: 'Analytics & MIS',
    location: 'Madavara, Bengaluru (On-site)',
    employmentType: 'Full-Time',
    experience: '1–3 Years',
    summary:
      'Prepare daily allocation trackers, bucket movement analytics, and payment reconciliation reports for institutional lending clients.',
    responsibilities: [
      'Compile daily and monthly recovery performance dashboards for banking clients',
      'Reconcile collected amounts and settlement closures against portfolio files',
      'Identify contactability trends to optimize telecalling and field allocation',
    ],
    requirements: [
      'Strong command of Excel / spreadsheets, pivot tables, and data validation',
      'Experience in BFSI operations or collections MIS preferred',
      'High attention to numerical accuracy and confidentiality',
    ],
  },
];
