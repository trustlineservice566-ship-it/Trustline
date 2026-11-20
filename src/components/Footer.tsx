import React from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone, UserCheck } from 'lucide-react';
import { COMPANY_INFO, PageId } from '../data/companyData';
import { BrandLogo } from './BrandLogo';
import { buildWhatsAppUrl } from '../utils/validation';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const companyLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Our Services' },
    { id: 'industries', label: 'Industries' },
    { id: 'process', label: 'Our Process' },
  ];

  const governanceLinks: { id: PageId; label: string }[] = [
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'disclaimer', label: 'Disclaimer' },
  ];

  return (
    <footer className="border-t border-[#1D3F6E] bg-[#0B1F3A] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="cursor-pointer text-left"
              aria-label="Trustline Collection Services Home"
            >
              <BrandLogo variant="light" size={32} />
            </button>
            <p className="mt-3 text-sm font-semibold tracking-wide text-[#C6973F]">
              {COMPANY_INFO.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {COMPANY_INFO.tagline} — B2B debt collection and financial recovery management for
              India’s banks, NBFCs, and lending institutions.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Founded {COMPANY_INFO.founded} · {COMPANY_INFO.businessType}
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="cursor-pointer text-sm text-slate-300 transition-colors hover:text-[#D9B05B]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance & Engagement Column */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white">Resources</h2>
            <ul className="mt-4 space-y-2.5">
              {governanceLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="cursor-pointer text-sm text-slate-300 transition-colors hover:text-[#D9B05B]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-semibold text-white">Bengaluru Headquarters</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <span className="text-white font-medium">
                  {COMPANY_INFO.ownerName} ({COMPANY_INFO.ownerRole})
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <span className="text-slate-300">{COMPANY_INFO.headquarters}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-300">
                  <a
                    href={`tel:${COMPANY_INFO.ownerPhone.replace(/\s+/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {COMPANY_INFO.ownerPhone}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <a
                  href={buildWhatsAppUrl(
                    COMPANY_INFO.ownerPhone,
                    COMPANY_INFO.ownerWhatsappMessage
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9B05B] transition-colors hover:text-white"
                >
                  WhatsApp Direct ({COMPANY_INFO.ownerPhone})
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-[#C6973F]" aria-hidden="true" />
                <span className="text-slate-300">{COMPANY_INFO.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {COMPANY_INFO.founded} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <p>
            Representative corporate figures shown on this site are illustrative placeholders for
            presentation.
          </p>
        </div>
      </div>
    </footer>
  );
};
