/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PageId } from './data/companyData';
import { AboutPage } from './pages/AboutPage';
import { CareersPage, SubmittedJobApplication } from './pages/CareersPage';
import { ContactPage, SubmittedEnquiry } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { HomePage } from './pages/HomePage';
import { IndustriesPage } from './pages/IndustriesPage';
import { LeadsPage } from './pages/LeadsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProcessPage } from './pages/ProcessPage';
import { ServicesPage } from './pages/ServicesPage';
import { TrackEnquiryPage } from './pages/TrackEnquiryPage';

const VALID_PAGES: PageId[] = [
  'home',
  'about',
  'services',
  'industries',
  'process',
  'careers',
  'contact',
  'track',
  'leads',
  'privacy',
  'disclaimer',
];

function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home';
  const pathSegment = window.location.pathname.replace(/^\/+|\/+$/g, '') as PageId;
  if (pathSegment === ('admin' as PageId)) {
    return 'leads';
  }
  if (VALID_PAGES.includes(pathSegment)) {
    return pathSegment;
  }
  const hash = window.location.hash.replace('#', '') as PageId;
  if (VALID_PAGES.includes(hash)) {
    return hash;
  }
  return 'home';
}

function getInitialTrackReference(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('ref') ?? '';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [trackReferenceId, setTrackReferenceId] = useState<string>(getInitialTrackReference);
  const [submittedEnquiries, setSubmittedEnquiries] = useState<SubmittedEnquiry[]>([]);
  const [submittedApplications, setSubmittedApplications] = useState<SubmittedJobApplication[]>([]);

  useEffect(() => {
    const syncRoute = () => {
      setActivePage(getInitialPage());
      setTrackReferenceId(getInitialTrackReference());
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activePage]);

  const handleNavigate = (
    page: PageId,
    options?: { serviceTitle?: string; industryName?: string; referenceId?: string }
  ) => {
    if (options?.serviceTitle) {
      setSelectedService(options.serviceTitle);
    }
    if (options?.industryName) {
      setSelectedIndustry(options.industryName);
    }
    if (page === 'track') {
      setTrackReferenceId(options?.referenceId ?? '');
    }
    setActivePage(page);
    if (typeof window !== 'undefined') {
      const targetUrl =
        page === 'home'
          ? '/'
          : page === 'track' && options?.referenceId
            ? `/track?ref=${encodeURIComponent(options.referenceId)}`
            : `/${page}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl !== targetUrl || window.location.hash) {
        window.history.pushState(null, '', targetUrl);
      }
    }
  };

  const recentTrackReferences = [
    ...submittedEnquiries.map((item) => ({
      referenceId: item.referenceId,
      label: `${item.companyName} · ${item.service}`,
    })),
    ...submittedApplications.map((item) => ({
      referenceId: item.referenceId,
      label: item.jobTitle,
    })),
  ];

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0B1F3A]">
        <Header activePage={activePage} onNavigate={(page) => handleNavigate(page)} />

        <main className="flex-1">
          {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {activePage === 'about' && <AboutPage onNavigate={(p) => handleNavigate(p)} />}
          {activePage === 'services' && (
            <ServicesPage
              initialServiceTitle={selectedService}
              onNavigate={handleNavigate}
            />
          )}
          {activePage === 'industries' && (
            <IndustriesPage
              initialIndustryName={selectedIndustry}
              onNavigate={handleNavigate}
            />
          )}
          {activePage === 'process' && <ProcessPage onNavigate={(p) => handleNavigate(p)} />}
          {activePage === 'careers' && (
            <CareersPage
              submittedApplications={submittedApplications}
              onApplicationSubmitted={(app) =>
                setSubmittedApplications((prev) => [app, ...prev])
              }
              onTrackReference={(refId) => handleNavigate('track', { referenceId: refId })}
            />
          )}
          {activePage === 'contact' && (
            <ContactPage
              preselectedService={selectedService}
              preselectedIndustry={selectedIndustry}
              submittedEnquiries={submittedEnquiries}
              onEnquirySubmitted={(enq) =>
                setSubmittedEnquiries((prev) => [enq, ...prev])
              }
              onTrackReference={(refId) => handleNavigate('track', { referenceId: refId })}
            />
          )}
          {activePage === 'track' && (
            <TrackEnquiryPage
              initialReferenceId={trackReferenceId}
              recentReferences={recentTrackReferences}
              onNavigate={(p) => handleNavigate(p)}
            />
          )}
          {activePage === 'leads' && <LeadsPage onNavigate={(p) => handleNavigate(p)} />}
          {activePage === 'privacy' && <PrivacyPolicyPage />}
          {activePage === 'disclaimer' && <DisclaimerPage />}
        </main>

        <Footer onNavigate={(page) => handleNavigate(page)} />
      </div>
    </ErrorBoundary>
  );
}
