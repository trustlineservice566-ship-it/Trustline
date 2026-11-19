import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId } from '../data/companyData';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const PRIMARY_NAV: { id: PageId; label: string }[] = [
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'process', label: 'Our Process' },
  { id: 'careers', label: 'Careers' },
];

const MOBILE_ALL_NAV: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Our Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'process', label: 'Our Process' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'disclaimer', label: 'Disclaimer' },
];

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          aria-label="Trustline Home"
          className="cursor-pointer rounded-md py-1 text-left transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <BrandLogo variant="dark" size={30} />
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {PRIMARY_NAV.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative cursor-pointer py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#0B1F3A] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-[#C6973F]'
                    : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#132D52] whitespace-nowrap shrink-0"
          >
            Request Consultation
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-slate-200 text-[#0B1F3A] transition-colors hover:bg-slate-50 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          <div className="grid grid-cols-1 gap-1">
            {MOBILE_ALL_NAV.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F4F6F9] text-[#0B1F3A]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B1F3A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C6973F]" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="w-full cursor-pointer rounded-md bg-[#0B1F3A] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#132D52]"
            >
              Request a Business Consultation
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
