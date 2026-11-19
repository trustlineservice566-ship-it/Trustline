/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PageId } from './data/companyData';
import { AboutPage } from './pages/AboutPage';
import { CareersPage, SubmittedJobApplication } from './pages/CareersPage';
import { ContactPage, SubmittedEnquiry } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { HomePage } from './pages/HomePage';
import { IndustriesPage } from './pages/IndustriesPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProcessPage } from './pages/ProcessPage';
import { ServicesPage } from './pages/ServicesPage';

const VALID_PAGES: PageId[] = [
  'home',
  'about',
  'services',
  'industries',
  'process',
  'careers',
  'contact',
  'privacy',
  'disclaimer',
];

function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '') as PageId;
  if (VALID_PAGES.includes(hash)) {
    return hash;
  }
  const pathSegment = window.location.pathname.replace(/^\/+|\/+$/g, '') as PageId;
  if (VALID_PAGES.includes(pathSegment)) {
    return pathSegment;
  }
  return 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [submittedEnquiries, setSubmittedEnquiries] = useState<SubmittedEnquiry[]>([]);
  const [submittedApplications, setSubmittedApplications] = useState<SubmittedJobApplication[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      } else if (!hash) {
        setActivePage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activePage]);

  const handleNavigate = (
    page: PageId,
    options?: { serviceTitle?: string; industryName?: string }
  ) => {
    if (options?.serviceTitle) {
      setSelectedService(options.serviceTitle);
    }
    if (options?.industryName) {
      setSelectedIndustry(options.industryName);
    }
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'home' ? '' : page;
    }
  };

  return (
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
          />
        )}
        {activePage === 'privacy' && <PrivacyPolicyPage />}
        {activePage === 'disclaimer' && <DisclaimerPage />}
      </main>

      <Footer onNavigate={(page) => handleNavigate(page)} />
    </div>
  );
}
