import { db, collection, doc, updateDoc, onSnapshot } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  X, 
  Phone, 
  Building2, 
  Landmark,
  Coins,
  FileCheck,
  Eye,
  Send,
  CheckCircle2,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal } from '../components/MemberCertificateModal';
import type { CertificateMember } from '../components/MemberCertificateModal';
import { 
  INITIAL_SUBMISSIONS, 
  FORM_TYPE_CONFIG
} from '../data/mockData';
import type { 
  UnifiedSubmission, 
  SubmissionStatus 
} from '../data/mockData';

export function Applications() {
  const [submissions, setSubmissions] = useState<UnifiedSubmission[]>(INITIAL_SUBMISSIONS);

  useEffect(() => {
    try {
      const q = collection(db, 'submissions');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const liveList = snapshot.docs.map(d => {
          const data = d.data() || {};
          return {
            id: d.id,
            formType: data.formType || 'partner-registration',
            formName: data.formName || 'Application',
            sourceFile: data.sourceFile || '',
            applicantName: data.applicantName || data.name || data.fullName || 'Anonymous Applicant',
            phone: data.phone || data.mobileNumber || data.mobile || '',
            email: data.email || '',
            city: data.city || data.location || data.district || '',
            state: data.state || '',
            timestamp: data.timestamp || data.submittedAt || data.createdAt || 'Recent',
            status: data.status || 'Pending',
            ...data
          };
        }) as UnifiedSubmission[];

        // Client-side sort: newest first
        liveList.sort((a: any, b: any) => {
          const tA = new Date(a.submittedAt || a.timestamp || a.createdAt || 0).getTime();
          const tB = new Date(b.submittedAt || b.timestamp || b.createdAt || 0).getTime();
          return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        });

        if (liveList.length > 0) {
          setSubmissions(liveList);
        }
      }, (err) => {
        console.warn('Firestore live listener notice (offline/empty):', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore init notice:', e);
    }
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeModalApp, setActiveModalApp] = useState<UnifiedSubmission | null>(null);
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = (id: string, newStatus: SubmissionStatus, name: string) => {
    setSubmissions(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    if (activeModalApp && activeModalApp.id === id) {
      setActiveModalApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Application #${id} (${name}) marked as "${newStatus}"!`);
    try {
      updateDoc(doc(db, 'submissions', id), { status: newStatus });
    } catch (err) {
      console.error('Error updating status in Firestore:', err);
    }
  };

  const openCertificate = (app: UnifiedSubmission) => {
    setCertificateMember({
      id: app.id || '',
      name: app.applicantName || 'Applicant',
      phone: app.phone || '',
      email: app.email || '',
      amountPaid: app.amountPaid || app.processingFee || app.requiredAmount || 'Verified',
      state: (app.city || '') + (app.state ? `, ${app.state}` : ''),
      date: 'Today, 29 Aug 2026'
    });
  };

  // Filter Logic
  const filteredSubmissions = submissions.filter(app => {
    const s = (searchTerm || '').trim().toLowerCase();
    const applicantName = (app.applicantName || '').toLowerCase();
    const id = (app.id || '').toLowerCase();
    const phone = (app.phone || '');
    const email = (app.email || '').toLowerCase();
    const city = (app.city || '').toLowerCase();
    const businessName = (app.businessName || '').toLowerCase();
    const mapEnquiryMessage = (app.mapEnquiryMessage || '').toLowerCase();

    const matchesSearch = 
      applicantName.includes(s) ||
      id.includes(s) ||
      phone.includes(searchTerm) ||
      email.includes(s) ||
      city.includes(s) ||
      businessName.includes(s) ||
      mapEnquiryMessage.includes(s);

    const matchesFormType = selectedFormType === 'all' || app.formType === selectedFormType;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesFormType && matchesStatus;
  });

  return (
    <div className="space-y-6 relative text-left font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {/* Certificate / WhatsApp Modal */}
      {certificateMember && (
        <MemberCertificateModal
          member={certificateMember}
          onClose={() => setCertificateMember(null)}
          onSentToast={showToast}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Multi-Channel Applications & Form Submissions"
        description="Unified desk managing Synergy Partner Registrations (₹5,000), 7-Stage Loan Dossiers, Quick Leads, Map Desk Enquiries, and Real Estate Bookings."
        badge={`${submissions.length} Total Applications`}
        action={
          <button 
            onClick={() => showToast('Exported applications report to CSV/Excel.')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#A5CEE0]" /> Export Submissions
          </button>
        }
      />

      {/* FORM CATEGORY SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Submissions', count: submissions.length },
          { id: 'map-enquiry', label: 'Map & HQ Leads', count: submissions.filter(s => s.formType === 'map-enquiry').length },
          { id: 'partner-registration', label: 'Synergy Partners (₹5,000)', count: submissions.filter(s => s.formType === 'partner-registration').length },
          { id: 'formal-loan', label: '7-Stage Loan Dossiers', count: submissions.filter(s => s.formType === 'formal-loan').length },
          { id: 'quick-loan', label: 'Quick Digital Leads', count: submissions.filter(s => s.formType === 'quick-loan').length },
          { id: 'real-estate-enquiry', label: 'Real Estate Enquiries', count: submissions.filter(s => s.formType === 'real-estate-enquiry').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFormType(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              selectedFormType === tab.id
                ? 'bg-[#10367D] text-white border-[#10367D] shadow-sm'
                : 'bg-white text-[#10367D] border-[#10367D]/15 hover:bg-[#FAF9F6]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedFormType === tab.id ? 'bg-white/20 text-white' : 'bg-[#10367D]/10 text-[#10367D]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bbsp-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-96">
          <Search className="w-4 h-4 text-[#1A4594]/70" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Applicant, Phone, City, Notes..."
            className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#1A4594]/70 hidden sm:block" />
          <span className="text-xs font-bold text-[#10367D] hidden sm:block">Status:</span>
          {['all', 'Approved', 'Underwriting', 'In Review', 'Contacted', 'Visit Scheduled', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-[#10367D] text-white shadow-sm'
                  : 'bg-white text-[#10367D] border border-[#10367D]/15 hover:bg-[#FAF9F6]'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* SUBMISSIONS TABLE */}
      <div className="bbsp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#10367D]/10 text-[#10367D] font-sora font-extrabold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Tracking ID</th>
                <th className="p-3.5">Channel / Form</th>
                <th className="p-3.5">Applicant & Business</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Amount / Value</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/5 text-[#10367D]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((app) => {
                  const config = FORM_TYPE_CONFIG[app.formType] || {
                    label: app.formType || 'Application',
                    shortCode: 'APP',
                    sourceFile: '',
                    badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
                    description: 'Application Dossier'
                  };

                  const safePhone = (app.phone || '').replace(/[^0-9]/g, '');
                  const safeApplicant = app.applicantName || 'Applicant';
                  const safeId = app.id || '';

                  return (
                    <tr key={app.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#10367D]">
                        <button 
                          onClick={() => setActiveModalApp(app)}
                          className="hover:underline font-bold text-[#10367D] cursor-pointer text-left"
                        >
                          {safeId}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${config.badgeColor}`}>
                          {config.label}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-extrabold text-[#10367D] text-sm">{safeApplicant}</div>
                        <div className="text-[11px] text-[#1A4594]/70 font-medium truncate max-w-[200px]">
                          {app.businessName || app.mapServiceInterest || app.propertyType || app.loanPurpose || app.city || 'Applicant'}
                        </div>
                      </td>

                      <td className="p-3.5 space-y-0.5">
                        <div className="font-semibold text-stone-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#1A4594]" /> {app.phone || 'N/A'}
                        </div>
                        <div className="text-[11px] text-[#1A4594]/70 truncate max-w-[180px]">
                          {app.email || 'N/A'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        {app.amountPaid ? (
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {app.amountPaid} Fee
                          </span>
                        ) : app.requiredAmount ? (
                          <span className="font-mono font-bold text-[#10367D] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {app.requiredAmount} Req
                          </span>
                        ) : app.budgetRange ? (
                          <span className="font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {app.budgetRange}
                          </span>
                        ) : (
                          <span className="text-stone-400 font-mono">Lead</span>
                        )}
                      </td>

                      <td className="p-3.5 text-[#1A4594]/70 whitespace-nowrap">
                        {app.timestamp || 'Recent'}
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          app.status === 'Approved' || app.status === 'Sanctioned' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'Underwriting'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : app.status === 'In Review' || app.status === 'Contacted'
                            ? 'bg-blue-50 text-[#10367D] border-blue-200'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveModalApp(app)}
                            title="Inspect Full Application Details"
                            className="p-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/${safePhone}?text=${encodeURIComponent(`Hello ${safeApplicant}, Build Bharat Team is reviewing your application #${safeId}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Direct WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer text-decoration-none"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {app.formType === 'partner-registration' && (
                            <button
                              onClick={() => openCertificate(app)}
                              title="Generate Member Certificate"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#10367D] border border-blue-200 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED INSPECTION MODAL */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#10367D]/15 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-[#10367D]/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#10367D] bg-[#FAF9F6] px-2.5 py-0.5 rounded border border-[#10367D]/15">
                    {activeModalApp.id}
                  </span>
                  {(() => {
                    const modalConfig = FORM_TYPE_CONFIG[activeModalApp.formType] || {
                      label: activeModalApp.formType || 'Application',
                      badgeColor: 'bg-stone-50 text-stone-700 border-stone-200'
                    };
                    return (
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${modalConfig.badgeColor}`}>
                        {modalConfig.label}
                      </span>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-sora font-extrabold text-[#10367D]">
                  {activeModalApp.applicantName}
                </h3>
                <span className="text-xs text-[#1A4594]/70 font-sans">
                  Source: <code className="text-[#10367D] font-mono">{activeModalApp.sourceFile || 'Direct Inbound'}</code>
                </span>
              </div>

              <button
                onClick={() => setActiveModalApp(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Based on Form Type */}
            <div className="py-5 space-y-5 text-xs text-stone-800">
              
              {/* Common Contact Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-[#10367D]/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#1A4594]/70 block">Mobile Hotline</span>
                  <span className="font-bold text-[#10367D] text-sm">{activeModalApp.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#1A4594]/70 block">Email Desk</span>
                  <span className="font-bold text-[#10367D] text-sm truncate block">{activeModalApp.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#1A4594]/70 block">Location / Hub</span>
                  <span className="font-bold text-[#10367D] text-sm">{activeModalApp.city}{activeModalApp.state ? `, ${activeModalApp.state}` : ''}</span>
                </div>
              </div>

              {/* Specific for MAP ENQUIRY DESK */}
              {activeModalApp.formType === 'map-enquiry' && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                      <MapPin className="w-4 h-4 text-[#D57530]" />
                      <span>Interactive Headquarters Map Lead Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">Service / Ecosystem Vertical:</span>
                        <span className="font-bold text-[#10367D] text-sm">{activeModalApp.mapServiceInterest || activeModalApp.vertical}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">Headquarters Destination:</span>
                        <span className="font-bold text-stone-900 text-sm">Hayath Nagar Regional Desk</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Customer Enquiry Message & Requirements:</span>
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 text-stone-900 font-medium leading-relaxed">
                        "{activeModalApp.mapEnquiryMessage}"
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specific for SYNERGY PARTNER REGISTRATION */}
              {activeModalApp.formType === 'partner-registration' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-bold text-[#10367D] text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Partner Enterprise & Fee Summary
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Business Name:</span>
                        <strong className="text-stone-900">{activeModalApp.businessName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Vertical Focus:</span>
                        <strong className="text-[#10367D] uppercase">{activeModalApp.vertical}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Onboarding Fee:</span>
                        <strong className="text-emerald-700 font-mono text-sm">{activeModalApp.amountPaid}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Transaction ID:</span>
                        <strong className="text-stone-900 font-mono text-[11px] truncate block">{activeModalApp.transactionId}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#10367D]" /> Settlement Bank Details
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Bank Name:</span>
                        <strong>{activeModalApp.bankName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Account Holder:</span>
                        <strong>{activeModalApp.accountHolderName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Account No:</span>
                        <strong className="font-mono">{activeModalApp.accountNumber}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">IFSC Code:</span>
                        <strong className="font-mono">{activeModalApp.ifscCode}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specific for 7-STAGE FORMAL LOAN */}
              {activeModalApp.formType === 'formal-loan' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-2">
                      <Coins className="w-4 h-4" /> Legal Loan Terms & Sanction Target
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Requested Amount:</span>
                        <strong className="text-emerald-700 font-mono text-sm">{activeModalApp.requiredAmount}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Sanction Amount:</span>
                        <strong className="text-[#10367D] font-mono text-sm">{activeModalApp.sanctionAmount || 'Under Review'}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Tenure:</span>
                        <strong>{activeModalApp.tenureMonths}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Branch Office:</span>
                        <strong>{activeModalApp.branchName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#10367D]" /> Applicant Dossier & Nominee
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Mother Name:</span>
                        <strong>{activeModalApp.motherName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">DOB / Gender:</span>
                        <strong>{activeModalApp.dob} ({activeModalApp.gender})</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Nominee Name:</span>
                        <strong>{activeModalApp.nomineeName} ({activeModalApp.nomineeRelation})</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Upline Code:</span>
                        <strong className="font-mono text-[#10367D]">{activeModalApp.uplineIdCode}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#10367D]/10 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Update Lifecycle Status:</span>
                <select
                  value={activeModalApp.status}
                  onChange={(e) => handleStatusChange(activeModalApp.id, e.target.value as SubmissionStatus, activeModalApp.applicantName)}
                  className="bg-[#FAF9F6] border border-[#10367D]/20 rounded-xl px-3 py-1.5 text-xs font-bold text-[#10367D] outline-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Review">In Review</option>
                  <option value="Underwriting">Underwriting</option>
                  <option value="Approved">Approved</option>
                  <option value="Sanctioned">Sanctioned</option>
                  <option value="Visit Scheduled">Visit Scheduled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {activeModalApp.formType === 'partner-registration' && (
                  <button
                    onClick={() => {
                      openCertificate(activeModalApp);
                      setActiveModalApp(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Issue Partner Certificate
                  </button>
                )}

                <a
                  href={`tel:${activeModalApp.phone}`}
                  className="px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer text-decoration-none"
                >
                  <Phone className="w-3.5 h-3.5 text-[#A5CEE0]" /> Call Applicant
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
