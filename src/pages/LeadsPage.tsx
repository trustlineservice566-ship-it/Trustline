import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { COMPANY_INFO, PageId } from '../data/companyData';
import {
  checkIsAdminRecord,
  deleteLeadDocument,
  subscribeToApplications,
  subscribeToEnquiries,
  updateApplicationStatus,
  updateEnquiryLead,
} from '../services/leadsService';
import {
  ADMIN_EMAIL,
  ApplicationLeadRecord,
  ApplicationStatus,
  EnquiryLeadRecord,
  EnquiryStatus,
  buildLeadsCsv,
  filterLeadsByQueryAndStatus,
  isAuthorizedAdminEmail,
} from '../utils/leadsHelpers';
import { buildWhatsAppUrl } from '../utils/validation';

interface LeadsPageProps {
  onNavigate: (page: PageId) => void;
}

const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Converted',
  'Closed',
];

const APPLICATION_STATUSES: ApplicationStatus[] = [
  'New',
  'Shortlisted',
  'Interviewed',
  'Hired',
  'Archived',
];

export const LeadsPage: React.FC<LeadsPageProps> = ({ onNavigate }) => {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'enquiries' | 'applications'>('enquiries');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [enquiries, setEnquiries] = useState<EnquiryLeadRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationLeadRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [publicUpdateDraft, setPublicUpdateDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedBannerId, setSavedBannerId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError('');
      if (!user) {
        setIsAdmin(false);
        setEnquiries([]);
        setApplications([]);
        setAuthReady(true);
        return;
      }

      if (isAuthorizedAdminEmail(user.email, user.emailVerified)) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const hasAdminDoc = user.emailVerified ? await checkIsAdminRecord(user.uid) : false;
        setIsAdmin(hasAdminDoc);
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !currentUser || !isAdmin) {
      return;
    }
    setLoadingData(true);
    setDataError('');

    const unsubEnquiries = subscribeToEnquiries(
      (items) => {
        setEnquiries(items);
        setLoadingData(false);
      },
      (err) => {
        setDataError(err.message);
        setLoadingData(false);
      }
    );

    const unsubApps = subscribeToApplications(
      (items) => {
        setApplications(items);
      },
      (err) => {
        setDataError(err.message);
      }
    );

    return () => {
      unsubEnquiries();
      unsubApps();
    };
  }, [authReady, currentUser, isAdmin]);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Unable to complete Google sign-in. Please allow popups and try again.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleCopyLink = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  const handleSaveEnquiry = async (
    lead: EnquiryLeadRecord,
    nextStatus: EnquiryStatus,
    nextNotes: string,
    nextPublicUpdate: string
  ) => {
    setSavingId(lead.id);
    setDataError('');
    try {
      await updateEnquiryLead(lead, nextStatus, nextNotes, nextPublicUpdate);
      setSavedBannerId(lead.id);
      window.setTimeout(() => setSavedBannerId(null), 2000);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to update enquiry.');
    } finally {
      setSavingId(null);
    }
  };

  const handleApplicationStatusChange = async (
    app: ApplicationLeadRecord,
    nextStatus: ApplicationStatus,
    nextPublicUpdate: string
  ) => {
    setSavingId(app.id);
    setDataError('');
    try {
      await updateApplicationStatus(app, nextStatus, nextPublicUpdate);
      setSavedBannerId(app.id);
      window.setTimeout(() => setSavedBannerId(null), 2000);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to update application status.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRecord = async (
    collectionName: 'enquiries' | 'applications',
    id: string,
    referenceId?: string
  ) => {
    setSavingId(id);
    setDataError('');
    try {
      await deleteLeadDocument(collectionName, id, referenceId);
      setConfirmDeleteId(null);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to delete record.');
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCsv = () => {
    const csvContent = buildLeadsCsv(enquiries);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trustline-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredEnquiries = filterLeadsByQueryAndStatus(enquiries, statusFilter, searchQuery);
  const filteredApplications = filterLeadsByQueryAndStatus(applications, statusFilter, searchQuery);

  const newEnquiryCount = enquiries.filter((e) => e.status === 'New').length;
  const activePipelineCount = enquiries.filter(
    (e) => e.status === 'Contacted' || e.status === 'In Discussion'
  ).length;
  const convertedCount = enquiries.filter((e) => e.status === 'Converted').length;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const consultationShareUrl = `${originUrl}/contact`;
  const trackPortalShareUrl = `${originUrl}/track`;
  const ownerWhatsAppUrl = buildWhatsAppUrl(
    COMPANY_INFO.ownerPhone,
    COMPANY_INFO.ownerWhatsappMessage
  );

  return (
    <div className="bg-[#F4F6F9]">
      <section className="border-b border-slate-200 bg-[#0B1F3A] py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#D9B05B] uppercase">
              Owner Portal · {COMPANY_INFO.ownerName}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Client Enquiries &amp; Leads Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Real-time B2B consultation requests and job applications submitted from your website.
            </p>
          </div>

          {authReady && currentUser && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-300">{currentUser.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/25 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!authReady ? (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              Checking authorization status...
            </div>
          ) : !currentUser ? (
            <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-2.5 text-[#A67C2E]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                <p className="text-xs font-semibold tracking-wider uppercase">
                  Authorized Owner Access
                </p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-[#0B1F3A]">
                Sign In to View Client Enquiries
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                To protect client contact details and business confidentiality, enquiries are
                restricted to the authorized owner Google account (
                <span className="font-medium text-[#0B1F3A]">{ADMIN_EMAIL}</span>).
              </p>

              {authError && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {authError}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={signingIn}
                  onClick={handleGoogleSignIn}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#132D52] disabled:opacity-60"
                >
                  <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-4 py-3 text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Submit Test Enquiry
                </button>
              </div>

              <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                Note for Netlify custom domains: ensure your live Netlify domain is listed under
                Firebase Console → Authentication → Settings → Authorized domains.
              </p>
            </div>
          ) : !isAdmin ? (
            <div className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-white p-8">
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Access Restricted</h2>
              <p className="mt-2 text-sm text-slate-600">
                You are currently signed in as{' '}
                <strong className="text-[#0B1F3A]">{currentUser.email}</strong>. Client enquiries
                can only be viewed by the authorized owner account (
                <span className="font-medium text-[#0B1F3A]">{ADMIN_EMAIL}</span>).
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-5 cursor-pointer rounded-md bg-[#0B1F3A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#132D52]"
              >
                Sign Out &amp; Switch Account
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPI Summary Strip */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Enquiries</p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-[#0B1F3A] tabular-nums">
                    {enquiries.length}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500 uppercase">New Uncontacted</p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-[#A67C2E] tabular-nums">
                    {newEnquiryCount}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500 uppercase">Active Pipeline</p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-[#0B1F3A] tabular-nums">
                    {activePipelineCount}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Converted / Careers
                  </p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-[#0B1F3A] tabular-nums">
                    {convertedCount} / {applications.length}
                  </p>
                </div>
              </div>

              {/* Lead Generation Share Bar */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <h2 className="text-base font-semibold text-[#0B1F3A]">
                      Share Links to Generate Leads
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Share these direct links on LinkedIn, Google Business Profile, and client
                      proposals—every form submission appears below automatically.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => void handleCopyLink('consult', consultationShareUrl)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                    >
                      {copiedKey === 'consult' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                      )}
                      <span>
                        {copiedKey === 'consult'
                          ? 'Consultation Link Copied'
                          : 'Copy Consultation URL'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleCopyLink('whatsapp', ownerWhatsAppUrl)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                    >
                      {copiedKey === 'whatsapp' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                      )}
                      <span>
                        {copiedKey === 'whatsapp' ? 'WhatsApp Link Copied' : 'Copy WhatsApp URL'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleCopyLink('track', trackPortalShareUrl)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                    >
                      {copiedKey === 'track' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                      )}
                      <span>
                        {copiedKey === 'track' ? 'Track Link Copied' : 'Copy Track Inquiry URL'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCsv}
                      disabled={enquiries.length === 0}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#0B1F3A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#132D52] disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Export Enquiries CSV</span>
                    </button>
                  </div>
                </div>
              </div>

              {dataError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                  {dataError}
                </div>
              )}

              {/* Tabs & Filters */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div
                  role="tablist"
                  aria-label="Lead categories"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'enquiries'}
                    onClick={() => {
                      setActiveTab('enquiries');
                      setStatusFilter('All');
                    }}
                    className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                      activeTab === 'enquiries'
                        ? 'bg-[#0B1F3A] text-white'
                        : 'text-slate-600 hover:text-[#0B1F3A]'
                    }`}
                  >
                    Business Enquiries ({enquiries.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'applications'}
                    onClick={() => {
                      setActiveTab('applications');
                      setStatusFilter('All');
                    }}
                    className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                      activeTab === 'applications'
                        ? 'bg-[#0B1F3A] text-white'
                        : 'text-slate-600 hover:text-[#0B1F3A]'
                    }`}
                  >
                    Career Applications ({applications.length})
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      aria-label="Search leads"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search company, name, phone..."
                      className="w-64 rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                    />
                  </div>

                  <select
                    aria-label="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    {(activeTab === 'enquiries' ? ENQUIRY_STATUSES : APPLICATION_STATUSES).map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Leads List */}
              {loadingData ? (
                <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
                  Loading live enquiries...
                </div>
              ) : activeTab === 'enquiries' ? (
                filteredEnquiries.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
                    <p className="text-base font-semibold text-[#0B1F3A]">
                      No enquiries match your current view
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      New submissions from the Contact Us consultation form appear here in real
                      time.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="mt-4 cursor-pointer rounded-md bg-[#0B1F3A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#132D52]"
                    >
                      Open Consultation Form
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnquiries.map((lead) => {
                      const currentNotes = notesDraft[lead.id] ?? lead.notes ?? '';
                      const currentPublicUpdate =
                        publicUpdateDraft[lead.id] ?? lead.publicUpdate ?? '';
                      const clientTrackUrl = `${originUrl}/track?ref=${encodeURIComponent(lead.referenceId)}`;
                      const waClientHref = buildWhatsAppUrl(
                        lead.phone,
                        `Hello ${lead.fullName}, this is ${COMPANY_INFO.ownerName} from Trustline Collection Services regarding your ${lead.service} enquiry (${lead.referenceId}). Track live status: ${clientTrackUrl}`
                      );

                      return (
                        <article
                          key={lead.id}
                          className="rounded-lg border border-slate-200 bg-white p-6"
                        >
                          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono font-semibold text-[#A67C2E]">
                                  {lead.referenceId}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{lead.industry}</span>
                                <span aria-hidden="true">·</span>
                                <span>{lead.service}</span>
                                <span aria-hidden="true">·</span>
                                <span>{new Date(lead.createdAtMs).toLocaleString('en-IN')}</span>
                              </div>
                              <h3 className="mt-1.5 text-lg font-semibold text-[#0B1F3A]">
                                {lead.companyName} — {lead.fullName}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  void handleCopyLink(`track-${lead.id}`, clientTrackUrl)
                                }
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                              >
                                {copiedKey === `track-${lead.id}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                                )}
                                <span>
                                  {copiedKey === `track-${lead.id}`
                                    ? 'Track Link Copied'
                                    : 'Copy Tracking Link'}
                                </span>
                              </button>

                              <label className="sr-only" htmlFor={`status-${lead.id}`}>
                                Status for {lead.companyName}
                              </label>
                              <select
                                id={`status-${lead.id}`}
                                value={lead.status}
                                disabled={savingId === lead.id}
                                onChange={(e) =>
                                  void handleSaveEnquiry(
                                    lead,
                                    e.target.value as EnquiryStatus,
                                    currentNotes,
                                    currentPublicUpdate
                                  )
                                }
                                className="rounded-md border border-slate-300 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                              >
                                {ENQUIRY_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>

                              {confirmDeleteId === lead.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleDeleteRecord(
                                        'enquiries',
                                        lead.id,
                                        lead.referenceId
                                      )
                                    }
                                    className="cursor-pointer rounded-md bg-red-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-800"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="cursor-pointer rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  aria-label={`Delete enquiry ${lead.referenceId}`}
                                  onClick={() => setConfirmDeleteId(lead.id)}
                                  className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-relaxed text-slate-700">
                            {lead.message}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                            <a
                              href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 font-medium text-[#0B1F3A] hover:bg-slate-50"
                            >
                              <Phone className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                              <span>{lead.phone}</span>
                            </a>

                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 font-medium text-[#0B1F3A] hover:bg-slate-50"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                              <span>{lead.email}</span>
                            </a>

                            <a
                              href={waClientHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md bg-[#0B1F3A] px-3 py-1.5 font-medium text-white hover:bg-[#132D52]"
                            >
                              <MessageCircle
                                className="h-3.5 w-3.5 text-[#D9B05B]"
                                aria-hidden="true"
                              />
                              <span>WhatsApp Client</span>
                              <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
                            </a>
                          </div>

                          {/* Internal Notes + Client-Visible Status Update */}
                          <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                            <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                              <div>
                                <label
                                  className="block text-[11px] font-semibold text-slate-500 uppercase"
                                  htmlFor={`note-${lead.id}`}
                                >
                                  Private Internal Notes
                                </label>
                                <input
                                  id={`note-${lead.id}`}
                                  type="text"
                                  value={currentNotes}
                                  onChange={(e) =>
                                    setNotesDraft((prev) => ({
                                      ...prev,
                                      [lead.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Internal only: call summary, SLA quoted, callback date..."
                                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label
                                  className="block text-[11px] font-semibold text-slate-500 uppercase"
                                  htmlFor={`public-update-${lead.id}`}
                                >
                                  Client-Visible Status Update (Track Inquiry Page)
                                </label>
                                <input
                                  id={`public-update-${lead.id}`}
                                  type="text"
                                  maxLength={300}
                                  value={currentPublicUpdate}
                                  onChange={(e) =>
                                    setPublicUpdateDraft((prev) => ({
                                      ...prev,
                                      [lead.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Shown to client on Track Inquiry (e.g. Discovery call scheduled Friday 11 AM)"
                                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                type="button"
                                disabled={savingId === lead.id}
                                onClick={() =>
                                  void handleSaveEnquiry(
                                    lead,
                                    lead.status,
                                    currentNotes,
                                    currentPublicUpdate
                                  )
                                }
                                className="cursor-pointer rounded-md border border-[#0B1F3A] px-4 py-2 text-xs font-semibold text-[#0B1F3A] transition-colors hover:bg-[#0B1F3A] hover:text-white disabled:opacity-60 whitespace-nowrap shrink-0"
                              >
                                {savedBannerId === lead.id
                                  ? 'Saved & Synced'
                                  : savingId === lead.id
                                    ? 'Saving...'
                                    : 'Save Notes & Status Update'}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
                  <p className="text-base font-semibold text-[#0B1F3A]">
                    No career applications found
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Candidate applications submitted on the Careers page will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => {
                    const currentAppUpdate =
                      publicUpdateDraft[app.id] ?? app.publicUpdate ?? '';
                    return (
                      <article
                        key={app.id}
                        className="rounded-lg border border-slate-200 bg-white p-6"
                      >
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="font-mono font-semibold text-[#A67C2E]">
                                {app.referenceId}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{app.experienceYears}</span>
                              <span aria-hidden="true">·</span>
                              <span>{app.preferredLanguage}</span>
                              <span aria-hidden="true">·</span>
                              <span>{new Date(app.createdAtMs).toLocaleString('en-IN')}</span>
                            </div>
                            <h3 className="mt-1.5 text-lg font-semibold text-[#0B1F3A]">
                              {app.fullName} — {app.jobTitle}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              aria-label={`Status for ${app.fullName}`}
                              value={app.status}
                              disabled={savingId === app.id}
                              onChange={(e) =>
                                void handleApplicationStatusChange(
                                  app,
                                  e.target.value as ApplicationStatus,
                                  currentAppUpdate
                                )
                              }
                              className="rounded-md border border-slate-300 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0B1F3A]"
                            >
                              {APPLICATION_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              aria-label={`Delete application ${app.referenceId}`}
                              onClick={() =>
                                void handleDeleteRecord(
                                  'applications',
                                  app.id,
                                  app.referenceId
                                )
                              }
                              className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {app.coverNote && (
                          <p className="mt-3 text-sm text-slate-700">{app.coverNote}</p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                          <a
                            href={`tel:${app.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 font-medium text-[#0B1F3A] hover:bg-slate-50"
                          >
                            <Phone className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                            <span>{app.phone}</span>
                          </a>
                          <a
                            href={`mailto:${app.email}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 font-medium text-[#0B1F3A] hover:bg-slate-50"
                          >
                            <Mail className="h-3.5 w-3.5 text-[#A67C2E]" aria-hidden="true" />
                            <span>{app.email}</span>
                          </a>
                          <a
                            href={buildWhatsAppUrl(
                              app.phone,
                              `Hello ${app.fullName}, regarding your application (${app.referenceId}) for ${app.jobTitle} at Trustline Collection Services.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#0B1F3A] px-3 py-1.5 font-medium text-white hover:bg-[#132D52]"
                          >
                            <MessageCircle
                              className="h-3.5 w-3.5 text-[#D9B05B]"
                              aria-hidden="true"
                            />
                            <span>WhatsApp Applicant</span>
                          </a>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                          <label className="sr-only" htmlFor={`app-update-${app.id}`}>
                            Candidate tracking update for {app.fullName}
                          </label>
                          <input
                            id={`app-update-${app.id}`}
                            type="text"
                            maxLength={300}
                            value={currentAppUpdate}
                            onChange={(e) =>
                              setPublicUpdateDraft((prev) => ({
                                ...prev,
                                [app.id]: e.target.value,
                              }))
                            }
                            placeholder="Optional candidate status update shown on Track Inquiry page..."
                            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={savingId === app.id}
                            onClick={() =>
                              void handleApplicationStatusChange(
                                app,
                                app.status,
                                currentAppUpdate
                              )
                            }
                            className="cursor-pointer rounded-md border border-[#0B1F3A] px-4 py-2 text-xs font-semibold text-[#0B1F3A] transition-colors hover:bg-[#0B1F3A] hover:text-white disabled:opacity-60 whitespace-nowrap shrink-0"
                          >
                            {savedBannerId === app.id ? 'Updated' : 'Save Update'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
