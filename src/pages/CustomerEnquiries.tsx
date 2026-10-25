import { db, collection, doc, updateDoc, deleteDoc, onSnapshot } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Check, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  MapPin, 
  MessageSquare,
  Inbox,
  Edit,
  Trash2,
  X,
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
  UnifiedSubmission 
} from '../data/mockData';

export function CustomerEnquiries() {
  const [enquiries, setEnquiries] = useState<UnifiedSubmission[]>(INITIAL_SUBMISSIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Edit Enquiry state
  const [editingEnquiry, setEditingEnquiry] = useState<UnifiedSubmission | null>(null);
  const [editForm, setEditForm] = useState<{
    applicantName: string;
    phone: string;
    email: string;
    city: string;
    mapServiceInterest: string;
    mapEnquiryMessage: string;
    status: string;
  }>({
    applicantName: '',
    phone: '',
    email: '',
    city: '',
    mapServiceInterest: '',
    mapEnquiryMessage: '',
    status: 'In Review'
  });

  // Security Confirmation state
  const [confirmDeleteEnquiry, setConfirmDeleteEnquiry] = useState<UnifiedSubmission | null>(null);
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
            formType: data.formType || 'general-contact',
            formName: data.formName || 'Customer Enquiry',
            sourceFile: data.sourceFile || '',
            applicantName: data.applicantName || data.name || data.fullName || 'Anonymous Applicant',
            phone: data.phone || data.mobileNumber || data.mobile || '',
            email: data.email || '',
            city: data.city || data.location || data.district || '',
            state: data.state || '',
            timestamp: data.timestamp || data.submittedAt || data.createdAt || 'Recent',
            status: data.status || 'In Review',
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
          setEnquiries(liveList);
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

  const handleApprove = (id: string, name: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
    showToast(`Inquiry #${id} for ${name} marked as Approved!`);
    try {
      updateDoc(doc(db, 'submissions', id), { status: 'Approved' });
    } catch (err) {
      console.error('Error approving in Firestore:', err);
    }
  };

  const openCertificate = (enq: UnifiedSubmission) => {
    setCertificateMember({
      id: enq.id || '',
      name: enq.applicantName || 'Applicant',
      phone: enq.phone || '',
      email: enq.email || '',
      amountPaid: enq.amountPaid || enq.processingFee || enq.requiredAmount || 'Verified',
      state: (enq.city || '') + (enq.state ? `, ${enq.state}` : ''),
      date: 'Today'
    });
  };

  // Open Edit Modal
  const openEditModal = (enq: UnifiedSubmission) => {
    setEditingEnquiry(enq);
    setEditForm({
      applicantName: enq.applicantName,
      phone: enq.phone,
      email: enq.email,
      city: enq.city,
      mapServiceInterest: enq.mapServiceInterest || '',
      mapEnquiryMessage: enq.mapEnquiryMessage || '',
      status: enq.status
    });
  };

  // Submit Edit -> Intercepted by Double Confirmation
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;

    const updated: UnifiedSubmission = {
      ...editingEnquiry,
      applicantName: editForm.applicantName.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      city: editForm.city.trim(),
      mapServiceInterest: editForm.mapServiceInterest.trim(),
      mapEnquiryMessage: editForm.mapEnquiryMessage.trim(),
      status: editForm.status as any
    };

    const changes: FieldChange[] = [];
    if (editingEnquiry.applicantName !== updated.applicantName) {
      changes.push({ field: 'Customer Name', from: editingEnquiry.applicantName, to: updated.applicantName });
    }
    if (editingEnquiry.phone !== updated.phone) {
      changes.push({ field: 'Phone Number', from: editingEnquiry.phone, to: updated.phone });
    }
    if (editingEnquiry.email !== updated.email) {
      changes.push({ field: 'Email Address', from: editingEnquiry.email, to: updated.email });
    }
    if (editingEnquiry.city !== updated.city) {
      changes.push({ field: 'City / Location', from: editingEnquiry.city, to: updated.city });
    }
    if (editingEnquiry.status !== updated.status) {
      changes.push({ field: 'Status', from: editingEnquiry.status, to: updated.status });
    }
    if (editingEnquiry.mapEnquiryMessage !== updated.mapEnquiryMessage) {
      changes.push({ field: 'Message / Notes', from: editingEnquiry.mapEnquiryMessage || 'None', to: updated.mapEnquiryMessage || '' });
    }

    if (changes.length === 0) {
      setEditingEnquiry(null);
      showToast('No modifications detected.');
      return;
    }

    setEditingEnquiry(null);
    setConfirmModifyPending({
      original: editingEnquiry,
      updated,
      changes
    });
  };

  // Commit Edit after 2nd Confirmation
  const commitEnquiryModification = () => {
    if (!confirmModifyPending) return;
    const { updated } = confirmModifyPending;

    setEnquiries(prev => prev.map(e => e.id === updated.id ? updated : e));
    try {
      updateDoc(doc(db, 'submissions', updated.id), {
        applicantName: updated.applicantName,
        phone: updated.phone,
        email: updated.email,
        city: updated.city,
        mapServiceInterest: updated.mapServiceInterest,
        mapEnquiryMessage: updated.mapEnquiryMessage,
        status: updated.status
      });
    } catch (e) {
      console.warn('Firestore update error (saved locally):', e);
    }

    setConfirmModifyPending(null);
    showToast(`Enquiry #${updated.id} (${updated.applicantName}) updated successfully!`);
  };

  // Request Delete -> Intercepted by Double Confirmation
  const requestDeleteEnquiry = (enq: UnifiedSubmission) => {
    setConfirmDeleteEnquiry(enq);
  };

  // Commit Delete after 2nd Confirmation
  const commitDeleteEnquiry = () => {
    if (!confirmDeleteEnquiry) return;
    const { id, applicantName } = confirmDeleteEnquiry;

    setEnquiries(prev => prev.filter(e => e.id !== id));
    try {
      deleteDoc(doc(db, 'submissions', id));
    } catch (e) {
      console.warn('Firestore delete error (deleted locally):', e);
    }

    setConfirmDeleteEnquiry(null);
    showToast(`Enquiry #${id} for ${applicantName} permanently deleted.`);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Inquiry ID', 'Customer Name', 'Phone', 'Email', 'City / Location', 'Channel', 'Interest', 'Message', 'Status', 'Timestamp'];
    const rows = filtered.map(enq => [
      enq.id,
      `"${enq.applicantName}"`,
      enq.phone,
      enq.email,
      `"${enq.city}${enq.state ? ', ' + enq.state : ''}"`,
      `"${enq.formName || enq.formType}"`,
      `"${enq.mapServiceInterest || ''}"`,
      `"${(enq.mapEnquiryMessage || '').replace(/"/g, '""')}"`,
      enq.status,
      `"${enq.timestamp}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BBSP_Customer_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer Inquiries exported to CSV!');
  };

  const filtered = enquiries.filter(enq => {
    const s = (searchTerm || '').trim().toLowerCase();
    const name = (enq.applicantName || '').toLowerCase();
    const id = (enq.id || '').toLowerCase();
    const phone = (enq.phone || '');
    const email = (enq.email || '').toLowerCase();
    const city = (enq.city || '').toLowerCase();
    const msg = (enq.mapEnquiryMessage || '').toLowerCase();

    const matchesSearch = 
      name.includes(s) || 
      id.includes(s) ||
      phone.includes(searchTerm) ||
      email.includes(s) ||
      city.includes(s) ||
      msg.includes(s);

    const matchesForm = selectedFormType === 'all' || enq.formType === selectedFormType;
    return matchesSearch && matchesForm;
  });

  return (
    <div className="space-y-6 relative text-left font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {certificateMember && (
        <MemberCertificateModal
          member={certificateMember}
          onClose={() => setCertificateMember(null)}
          onSentToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: DELETE MODAL */}
      {/* ========================================================================= */}
      {confirmDeleteEnquiry && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Delete Inquiry #${confirmDeleteEnquiry.id}?`}
          subtitle={`Are you sure you want to permanently delete customer inquiry from ${confirmDeleteEnquiry.applicantName}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Inquiry ID', value: confirmDeleteEnquiry.id, highlight: true },
            { label: 'Customer Name', value: confirmDeleteEnquiry.applicantName },
            { label: 'Phone', value: confirmDeleteEnquiry.phone },
            { label: 'City', value: confirmDeleteEnquiry.city },
            { label: 'Status', value: confirmDeleteEnquiry.status }
          ]}
          warningMessage="Purging this customer enquiry removes the record from live customer support and lead desk."
          confirmButtonText="Yes, Permanently Delete Inquiry"
          onConfirm={commitDeleteEnquiry}
          onClose={() => setConfirmDeleteEnquiry(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY MODAL */}
      {/* ========================================================================= */}
      {confirmModifyPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes for Inquiry #${confirmModifyPending.original.id}`}
          subtitle={`Review modifications to customer lead for ${confirmModifyPending.original.applicantName} before saving.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyPending.changes}
          itemDetails={[
            { label: 'Inquiry ID', value: confirmModifyPending.original.id },
            { label: 'Customer Name', value: confirmModifyPending.original.applicantName }
          ]}
          warningMessage="Modifying contact details directly synchronizes with admin notification records."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitEnquiryModification}
          onClose={() => setConfirmModifyPending(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Customer Inquiries & Inbound Leads"
        description="Real-time multi-channel inquiries and website map leads with full editing, deletion, and 2-step verification."
        badge={`${enquiries.length} Inquiries`}
        action={
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-[#A5CEE0]" /> Export Inquiries (CSV)
          </button>
        }
      />

      {/* Filter and Search */}
      <div className="bbsp-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone, message..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[#10367D]">Source:</span>
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'map-enquiry', label: 'HQ Map Desk' },
              { id: 'general-contact', label: 'Contact Desk' },
              { id: 'quick-loan', label: 'Quick Loan Leads' },
              { id: 'real-estate-enquiry', label: 'Realty Enquiries' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFormType(tab.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedFormType === tab.id 
                    ? 'bg-[#10367D] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bbsp-card p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-[#10367D] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="font-sora font-extrabold text-base text-[#10367D]">
              No Inquiries Found
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Real-time inquiries from the Website Map Section, Loan forms, and Partner registrations will appear here when submitted.
            </p>
          </div>
        ) : (
          filtered.map((enq) => {
            const config = FORM_TYPE_CONFIG[enq.formType] || {
              label: enq.formType || 'Customer Enquiry',
              shortCode: 'ENQ',
              sourceFile: '',
              badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
              description: 'Customer Inbound Lead'
            };

            const safePhone = (enq.phone || '').replace(/[^0-9]/g, '');
            const safeApplicant = enq.applicantName || 'Applicant';
            const safeId = enq.id || '';

            return (
              <div key={enq.id} className="bbsp-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-[#10367D] bg-[#FAF9F6] px-2.5 py-0.5 rounded border border-[#10367D]/15 shadow-sm">
                      #{safeId.slice(0, 8)}
                    </span>
                    <h4 className="font-sora font-extrabold text-base text-[#10367D]">{safeApplicant}</h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
                      {config.label}
                    </span>
                    {enq.amountPaid && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {enq.amountPaid} Verified Deposit
                      </span>
                    )}
                    {enq.formType === 'map-enquiry' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D57530]" /> Hayath Nagar HQ Desk
                      </span>
                    )}
                  </div>

                  {enq.mapEnquiryMessage ? (
                    <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1">
                      <div className="text-[10px] font-extrabold text-[#D57530] uppercase tracking-wider">
                        Interest: {enq.mapServiceInterest || enq.vertical || 'General Ecosystem'}
                      </div>
                      <p className="font-medium leading-relaxed italic">
                        "{enq.mapEnquiryMessage}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-stone-800">
                      {enq.loanPurpose || enq.businessName || enq.propertyType || enq.formName}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[#1A4594]/80 flex-wrap">
                    <a href={`tel:${enq.phone || ''}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                      <Phone className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.phone || 'N/A'}
                    </a>
                    {enq.email && (
                      <a href={`mailto:${enq.email}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                        <Mail className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.email}
                      </a>
                    )}
                    <span className="text-stone-700 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> {enq.city || 'N/A'}{enq.state ? `, ${enq.state}` : ''}
                    </span>
                    <span className="text-[#1A4594]/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {enq.timestamp || 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#10367D]/10">
                  <a
                    href={`https://wa.me/${safePhone}?text=${encodeURIComponent(`Hello ${safeApplicant}, Build Bharat Team is responding to your enquiry #${safeId}. How can we assist you today?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm text-decoration-none"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {enq.formType === 'partner-registration' && (
                    <button
                      onClick={() => openCertificate(enq)}
                      title="Generate Certificate & Send on WhatsApp"
                      className="px-3 py-1.5 rounded-xl bg-[#10367D]/10 hover:bg-[#10367D]/20 text-[#10367D] border border-[#10367D]/20 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#10367D]" />
                    </button>
                  )}

                  {enq.status === 'Approved' || enq.status === 'Sanctioned' ? (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(enq.id, enq.applicantName)}
                      className="px-3 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#A5CEE0]" /> Approve
                    </button>
                  )}

                  <button
                    onClick={() => openEditModal(enq)}
                    title="Edit Inquiry"
                    className="p-1.5 rounded-xl text-[#10367D] hover:bg-[#10367D]/10 border border-[#10367D]/15 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => requestDeleteEnquiry(enq)}
                    title="Delete Inquiry (Double Confirmation)"
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* EDIT ENQUIRY MODAL */}
      {/* ========================================================================= */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Customer Inquiry
                </h3>
                <p className="text-xs text-stone-500">Inquiry ID: #{editingEnquiry.id}</p>
              </div>
              <button 
                onClick={() => setEditingEnquiry(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.applicantName}
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
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
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
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Service Interest</label>
                <input
                  type="text"
                  value={editForm.mapServiceInterest}
                  onChange={(e) => setEditForm({ ...editForm, mapServiceInterest: e.target.value })}
                  placeholder="e.g. Solar Rooftop EPC, MSME Loan"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Message / Inquiry Details</label>
                <textarea
                  rows={3}
                  value={editForm.mapEnquiryMessage}
                  onChange={(e) => setEditForm({ ...editForm, mapEnquiryMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-medium text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step review modal before applying changes.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
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
