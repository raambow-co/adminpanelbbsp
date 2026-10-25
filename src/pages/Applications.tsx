import { db, collection, doc, updateDoc, deleteDoc, onSnapshot, approveMemberInFirestore, updateSubmissionStatus, normalizeSubmissionStatus } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  X, 
  Phone, 
  Building2, 
  Landmark,
  Eye,
  Send,
  CheckCircle2,
  MapPin,
  Edit,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal } from '../components/MemberCertificateModal';
import type { CertificateMember } from '../components/MemberCertificateModal';
import { ConfirmationModal, type FieldChange } from '../components/ConfirmationModal';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeModalApp, setActiveModalApp] = useState<UnifiedSubmission | null>(null);
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Edit State
  const [editingApp, setEditingApp] = useState<UnifiedSubmission | null>(null);
  const [editForm, setEditForm] = useState<Partial<UnifiedSubmission>>({});

  // Security Confirmation State
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<UnifiedSubmission | null>(null);
  const [confirmModifyPending, setConfirmModifyPending] = useState<{
    original: UnifiedSubmission;
    updated: UnifiedSubmission;
    changes: FieldChange[];
  } | null>(null);

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
            status: normalizeSubmissionStatus(data.status, data.isApproved),
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Status Change with Direct Feedback
  
  // Approve Member & Move to Website Member Directory
  const handleApproveMember = async (app: UnifiedSubmission) => {
    setSubmissions(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Approved' as SubmissionStatus } : a));
    if (activeModalApp && activeModalApp.id === app.id) {
      setActiveModalApp(prev => prev ? { ...prev, status: 'Approved' as SubmissionStatus } : null);
    }
    showToast(`✓ ${app.applicantName} Approved! Added to Website Member Directory with login access.`);

    try {
      await approveMemberInFirestore(app);
    } catch (e) {
      console.error('Error during member approval:', e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus, name: string) => {
    const target = submissions.find(a => a.id === id);
    if (newStatus === 'Approved' && target) {
      return handleApproveMember(target);
    }

    setSubmissions(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    if (activeModalApp && activeModalApp.id === id) {
      setActiveModalApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Application #${id} (${name}) marked as "${newStatus}"!`);

    if (target) {
      try {
        await updateSubmissionStatus(id, newStatus, target.email);
      } catch (err) {
        console.error('Error updating status in Firestore:', err);
      }
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

  // Open Edit Modal
  const openEditModal = (app: UnifiedSubmission) => {
    setEditingApp(app);
    setEditForm({
      applicantName: app.applicantName,
      phone: app.phone,
      email: app.email,
      city: app.city,
      state: app.state,
      status: app.status,
      businessName: app.businessName,
      requiredAmount: app.requiredAmount,
      sanctionAmount: app.sanctionAmount,
      tenureMonths: app.tenureMonths,
      amountPaid: app.amountPaid,
      mapServiceInterest: app.mapServiceInterest,
      mapEnquiryMessage: app.mapEnquiryMessage
    });
  };

  // Submit Edit -> Intercepted by Double Confirmation
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const updated: UnifiedSubmission = {
      ...editingApp,
      ...editForm,
      applicantName: editForm.applicantName?.trim() || editingApp.applicantName,
      phone: editForm.phone?.trim() || editingApp.phone,
      email: editForm.email?.trim() || editingApp.email,
      city: editForm.city?.trim() || editingApp.city,
      status: (editForm.status || editingApp.status) as SubmissionStatus
    };

    const changes: FieldChange[] = [];
    if (editingApp.applicantName !== updated.applicantName) {
      changes.push({ field: 'Applicant Name', from: editingApp.applicantName, to: updated.applicantName });
    }
    if (editingApp.phone !== updated.phone) {
      changes.push({ field: 'Phone Number', from: editingApp.phone, to: updated.phone });
    }
    if (editingApp.email !== updated.email) {
      changes.push({ field: 'Email Address', from: editingApp.email, to: updated.email });
    }
    if (editingApp.city !== updated.city) {
      changes.push({ field: 'City / Location', from: editingApp.city, to: updated.city });
    }
    if (editingApp.status !== updated.status) {
      changes.push({ field: 'Lifecycle Status', from: editingApp.status, to: updated.status });
    }
    if (editingApp.amountPaid !== updated.amountPaid && updated.amountPaid) {
      changes.push({ field: 'Amount Paid', from: editingApp.amountPaid || 'None', to: updated.amountPaid });
    }
    if (editingApp.requiredAmount !== updated.requiredAmount && updated.requiredAmount) {
      changes.push({ field: 'Required Loan Amount', from: editingApp.requiredAmount || 'None', to: updated.requiredAmount });
    }
    if (editingApp.sanctionAmount !== updated.sanctionAmount && updated.sanctionAmount) {
      changes.push({ field: 'Sanction Amount', from: editingApp.sanctionAmount || 'None', to: updated.sanctionAmount });
    }

    if (changes.length === 0) {
      setEditingApp(null);
      showToast('No modifications detected.');
      return;
    }

    setEditingApp(null);
    setConfirmModifyPending({
      original: editingApp,
      updated,
      changes
    });
  };

  // Commit Edit after 2nd Confirmation
  const commitAppModification = () => {
    if (!confirmModifyPending) return;
    const { updated } = confirmModifyPending;

    setSubmissions(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (activeModalApp && activeModalApp.id === updated.id) {
      setActiveModalApp(updated);
    }

    try {
      updateDoc(doc(db, 'submissions', updated.id), {
        applicantName: updated.applicantName,
        phone: updated.phone,
        email: updated.email,
        city: updated.city,
        state: updated.state || '',
        status: updated.status,
        businessName: updated.businessName || '',
        requiredAmount: updated.requiredAmount || '',
        sanctionAmount: updated.sanctionAmount || '',
        tenureMonths: updated.tenureMonths || '',
        amountPaid: updated.amountPaid || '',
        mapServiceInterest: updated.mapServiceInterest || '',
        mapEnquiryMessage: updated.mapEnquiryMessage || ''
      });
    } catch (e) {
      console.warn('Firestore update error (persisting locally):', e);
    }

    setConfirmModifyPending(null);
    showToast(`Application #${updated.id} (${updated.applicantName}) updated successfully!`);
  };

  // Request Delete Application -> Intercepted by Double Confirmation
  const requestDeleteApp = (app: UnifiedSubmission) => {
    setConfirmDeleteApp(app);
  };

  // Commit Delete after 2nd Confirmation
  const commitDeleteApp = () => {
    if (!confirmDeleteApp) return;
    const { id, applicantName } = confirmDeleteApp;

    setSubmissions(prev => prev.filter(a => a.id !== id));
    if (activeModalApp && activeModalApp.id === id) {
      setActiveModalApp(null);
    }

    try {
      deleteDoc(doc(db, 'submissions', id));
    } catch (e) {
      console.warn('Firestore delete error (deleted locally):', e);
    }

    setConfirmDeleteApp(null);
    showToast(`Application #${id} for ${applicantName} permanently deleted.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Application ID', 'Channel / Form Type', 'Applicant Name', 'Phone', 'Email', 'City / Location', 'Amount / Value', 'Status', 'Timestamp'];
    const rows = filteredSubmissions.map(app => [
      app.id,
      `"${app.formName || app.formType}"`,
      `"${app.applicantName}"`,
      app.phone,
      app.email,
      `"${app.city}${app.state ? ', ' + app.state : ''}"`,
      `"${app.amountPaid || app.requiredAmount || 'N/A'}"`,
      app.status,
      `"${app.timestamp}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BBSP_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Applications report exported to CSV!');
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

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: DELETE APPLICATION */}
      {/* ========================================================================= */}
      {confirmDeleteApp && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Delete Application #${confirmDeleteApp.id}?`}
          subtitle={`Are you sure you want to permanently delete application dossier for ${confirmDeleteApp.applicantName}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Tracking ID', value: confirmDeleteApp.id, highlight: true },
            { label: 'Form Channel', value: confirmDeleteApp.formName || confirmDeleteApp.formType },
            { label: 'Applicant Name', value: confirmDeleteApp.applicantName },
            { label: 'Phone', value: confirmDeleteApp.phone },
            { label: 'Status', value: confirmDeleteApp.status }
          ]}
          warningMessage="Permanent Action: Deleting this dossier purges it from live database, Firestore records, and underwriting pipelines."
          confirmButtonText="Yes, Permanently Delete Application"
          onConfirm={commitDeleteApp}
          onClose={() => setConfirmDeleteApp(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY APPLICATION */}
      {/* ========================================================================= */}
      {confirmModifyPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes for Dossier #${confirmModifyPending.original.id}`}
          subtitle={`Please review modifications to ${confirmModifyPending.original.applicantName}'s application.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyPending.changes}
          itemDetails={[
            { label: 'Tracking ID', value: confirmModifyPending.original.id },
            { label: 'Channel', value: confirmModifyPending.original.formName || confirmModifyPending.original.formType }
          ]}
          warningMessage="Updating applicant contact info, loan amounts, or statuses directly synchronizes with backend records."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitAppModification}
          onClose={() => setConfirmModifyPending(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Multi-Channel Applications & Form Submissions"
        description="Unified admin desk with full edit, status management, and 2-step security verification across all ecosystem channels."
        badge={`${submissions.length} Total Applications`}
        action={
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-[#A5CEE0]" /> Export Submissions (CSV)
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
          {[
          { id: 'all', label: 'All Submissions', count: submissions.length },
          { id: 'In Review', label: 'In Review', count: submissions.filter(s => s.status === 'In Review').length },
          { id: 'Contacted', label: 'Contacted', count: submissions.filter(s => s.status === 'Contacted').length },
          { id: 'Approved', label: 'Approved (Website Member Directory)', count: submissions.filter(s => s.status === 'Approved').length },
          { id: 'Rejected', label: 'Rejected', count: submissions.filter(s => s.status === 'Rejected').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedStatus === tab.id
                ? tab.id === 'Approved' ? 'bg-emerald-600 text-white shadow-sm'
                : tab.id === 'Rejected' ? 'bg-rose-600 text-white shadow-sm'
                : tab.id === 'Contacted' ? 'bg-blue-600 text-white shadow-sm'
                : tab.id === 'In Review' ? 'bg-amber-500 text-slate-900 shadow-sm'
                : 'bg-[#10367D] text-white shadow-sm'
                : 'bg-white text-[#10367D] border border-[#10367D]/15 hover:bg-[#FAF9F6]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      </div>

      
      {/* Banner for Website Member Directory Section */}
      {selectedStatus === 'Approved' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-800 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#10367D] text-sm">Website Member Directory</h4>
              <p className="text-emerald-700 text-xs mt-0.5">
                All approved partners listed below have permanent login access granted to the website member portal with their registered Email ID.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
              {submissions.filter(s => s.status === 'Approved').length} Active Website Members
            </span>
          </div>
        </div>
      )}

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
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((app) => {
                  const config = FORM_TYPE_CONFIG[app.formType] || {
                    label: app.formType,
                    shortCode: 'GEN',
                    badgeColor: 'bg-stone-50 text-stone-700 border-stone-200'
                  };

                  return (
                    <tr key={app.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#10367D]">
                        <span className="bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#10367D]/15">
                          #{app.id.slice(0, 8)}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                          {config.label}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-sora font-extrabold text-[#10367D]">{app.applicantName}</p>
                        {app.businessName && (
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-[#1A4594]" /> {app.businessName}
                          </p>
                        )}
                      </td>

                      <td className="p-3.5">
                        <a href={`tel:${app.phone}`} className="font-semibold text-[#10367D] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#1A4594]" /> {app.phone || 'N/A'}
                        </a>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-stone-400" /> {app.city || 'N/A'}{app.state ? `, ${app.state}` : ''}
                        </p>
                      </td>

                      <td className="p-3.5 font-mono font-bold">
                        {app.amountPaid && (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                            {app.amountPaid} Paid
                          </span>
                        )}
                        {app.requiredAmount && (
                          <span className="text-[#10367D] bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                            {app.requiredAmount} Req
                          </span>
                        )}
                        {!app.amountPaid && !app.requiredAmount && '—'}
                      </td>

                      <td className="p-3.5 text-stone-500 text-[11px] whitespace-nowrap">
                        {app.timestamp}
                      </td>

                      <td className="p-3.5">
    <div className="flex items-center gap-2">
      {app.status !== 'Approved' ? (
        <button
          onClick={() => handleApproveMember(app)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer border-none shrink-0"
          title="Approve applicant and move to Website Member Directory with instant login access"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approve</span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Member Active</span>
        </span>
      )}

      <select
        value={app.status}
        onChange={(e) => handleStatusChange(app.id, e.target.value as SubmissionStatus, app.applicantName)}
        className={`text-[11px] font-bold rounded-xl px-2.5 py-1 border outline-none cursor-pointer transition-colors ${
          app.status === 'Approved'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : app.status === 'Contacted'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : app.status === 'Rejected'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}
      >
        <option value="In Review">In Review</option>
        <option value="Contacted">Contacted</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveModalApp(app)}
                            title="View Full Application Dossier"
                            className="p-1.5 bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] rounded-lg border border-[#10367D]/15 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(app)}
                            title="Edit Application Details"
                            className="p-1.5 bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] rounded-lg border border-[#10367D]/15 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => requestDeleteApp(app)}
                            title="Delete Application (Double Confirmation)"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ========================================================================= */}
      {/* DETAILED VIEW APPLICATION MODAL */}
      {/* ========================================================================= */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#10367D]/10">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#10367D] border border-blue-200">
                  {activeModalApp.formName || activeModalApp.formType}
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  {activeModalApp.applicantName}
                </h3>
                <p className="text-xs text-stone-500">Tracking ID: #{activeModalApp.id}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const target = activeModalApp;
                    setActiveModalApp(null);
                    openEditModal(target);
                  }}
                  className="p-1.5 rounded-xl text-[#10367D] hover:bg-[#FAF9F6] border border-[#10367D]/15 cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => setActiveModalApp(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Applicant details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-500 block text-[10px]">Mobile Phone:</span>
                <strong className="text-[#10367D]">{activeModalApp.phone}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Email Address:</span>
                <strong className="text-[#10367D] truncate block">{activeModalApp.email || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">City / State:</span>
                <strong className="text-[#10367D]">{activeModalApp.city}{activeModalApp.state ? `, ${activeModalApp.state}` : ''}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Submission Time:</span>
                <strong className="text-stone-700">{activeModalApp.timestamp}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Current Status:</span>
                <strong className="text-emerald-700 font-extrabold">{activeModalApp.status}</strong>
              </div>
              {activeModalApp.amountPaid && (
                <div>
                  <span className="text-stone-500 block text-[10px]">Fee / Deposit:</span>
                  <strong className="text-emerald-700 font-extrabold">{activeModalApp.amountPaid}</strong>
                </div>
              )}
            </div>

            {/* Specific for MAP ENQUIRY */}
            {activeModalApp.mapEnquiryMessage && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                <p className="text-[10px] font-extrabold uppercase text-amber-800">
                  Customer Map Inquiry Note
                </p>
                <p className="font-semibold text-stone-800 italic">
                  "{activeModalApp.mapEnquiryMessage}"
                </p>
              </div>
            )}

            {/* Specific for PARTNER REGISTRATION */}
            {activeModalApp.formType === 'partner-registration' && activeModalApp.bankName && (
              <div className="bg-[#10367D]/5 border border-[#10367D]/15 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-[#10367D] text-sm flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" /> Partner Bank & Tax Dossier
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            )}

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

      {/* ========================================================================= */}
      {/* EDIT APPLICATION MODAL */}
      {/* ========================================================================= */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Application Details
                </h3>
                <p className="text-xs text-stone-500">Tracking ID: #{editingApp.id}</p>
              </div>
              <button 
                onClick={() => setEditingApp(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.applicantName || ''}
                  onChange={(e) => setEditForm({ ...editForm, applicantName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">City / Location</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Lifecycle Status</label>
                  <select
                    value={editForm.status || 'Pending'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as SubmissionStatus })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
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
              </div>

              {/* Amount / Capital Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Amount Paid / Fee</label>
                  <input
                    type="text"
                    value={editForm.amountPaid || ''}
                    onChange={(e) => setEditForm({ ...editForm, amountPaid: e.target.value })}
                    placeholder="e.g. ₹5,000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Required Loan / Deal Value</label>
                  <input
                    type="text"
                    value={editForm.requiredAmount || ''}
                    onChange={(e) => setEditForm({ ...editForm, requiredAmount: e.target.value })}
                    placeholder="e.g. ₹10 Lakhs"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step review modal before updating live records.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-bold text-xs shadow-md shadow-[#10367D]/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-4 h-4 text-[#A5CEE0]" />
                  Review & Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
