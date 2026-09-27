import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal, type CertificateMember } from '../components/MemberCertificateModal';
import { ConfirmationModal, type FieldChange } from '../components/ConfirmationModal';
import { 
  Search, 
  Mail, 
  MapPin, 
  Plus, 
  Award, 
  CheckCircle, 
  Phone, 
  Download, 
  Send, 
  CheckCircle2,
  Trash2,
  Edit,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export interface MemberItem {
  id: string;
  name: string;
  tier: 'Premium Member' | 'Gold Member' | 'Executive Member' | 'Standard Member';
  phone: string;
  email: string;
  state: string;
  joinDate: string;
  feePaid: string;
  isVerified: boolean;
}

const initialMockMembers: MemberItem[] = [];

export function Members() {
  const [members, setMembers] = useState<MemberItem[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_members_directory');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading members from localStorage:', e);
    }
    return initialMockMembers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    phone: string;
    email: string;
    state: string;
    tier: 'Premium Member' | 'Gold Member' | 'Executive Member' | 'Standard Member';
    feeAmount: string;
    isVerified: boolean;
  }>({
    name: '',
    phone: '',
    email: '',
    state: '',
    tier: 'Premium Member',
    feeAmount: '5000',
    isVerified: true
  });

  // Security Confirmation Modals
  const [confirmDeleteMember, setConfirmDeleteMember] = useState<MemberItem | null>(null);
  const [confirmModifyPending, setConfirmModifyPending] = useState<{
    original: MemberItem;
    updated: MemberItem;
    changes: FieldChange[];
  } | null>(null);

  // New Member Form State
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Hyderabad',
    tier: 'Premium Member' as 'Premium Member' | 'Gold Member' | 'Executive Member' | 'Standard Member',
    feeAmount: '5000',
    autoOpenQuotation: true
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbsp_members_directory', JSON.stringify(members));
    } catch (e) {
      console.error('Error saving members to localStorage:', e);
    }
  }, [members]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const getNextSequentialId = () => {
    let maxSeq = 6;
    members.forEach(m => {
      const match = m.id.match(/BBSP-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    });
    return `BBSP-${String(maxSeq + 1).padStart(3, '0')}`;
  };

  const openCertificate = (m: MemberItem) => {
    setCertificateMember({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      amountPaid: m.feePaid || '₹5,000',
      state: m.state,
      date: m.joinDate === 'Today' ? '29 Aug 2026' : m.joinDate
    });
  };

  // Add Member
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone || !newMember.email) {
      showToast('Please fill all required fields.');
      return;
    }

    const assignedId = getNextSequentialId();
    const created: MemberItem = {
      id: assignedId,
      name: newMember.name.trim(),
      tier: newMember.tier,
      phone: newMember.phone.trim(),
      email: newMember.email.trim(),
      state: newMember.state || 'Hyderabad',
      joinDate: 'Today',
      feePaid: `₹${Number(newMember.feeAmount || 5000).toLocaleString('en-IN')}`,
      isVerified: true
    };

    setMembers([created, ...members]);
    setShowAddModal(false);
    showToast(`Member ${created.name} (${created.id}) added successfully!`);

    if (newMember.autoOpenQuotation) {
      openCertificate(created);
    }

    setNewMember({
      name: '',
      phone: '',
      email: '',
      state: 'Hyderabad',
      tier: 'Premium Member',
      feeAmount: '5000',
      autoOpenQuotation: true
    });
  };

  // Trigger Edit Member Form
  const openEditModal = (m: MemberItem) => {
    setEditingMember(m);
    const rawFee = m.feePaid.replace(/[^0-9]/g, '') || '5000';
    setEditForm({
      name: m.name,
      phone: m.phone,
      email: m.email,
      state: m.state,
      tier: m.tier,
      feeAmount: rawFee,
      isVerified: m.isVerified
    });
    setShowEditModal(true);
  };

  // Submit Edit Form -> Intercepted by Double Confirmation
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const formattedFee = `₹${Number(editForm.feeAmount || 5000).toLocaleString('en-IN')}`;
    const updated: MemberItem = {
      ...editingMember,
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      state: editForm.state.trim() || 'Hyderabad',
      tier: editForm.tier,
      feePaid: formattedFee,
      isVerified: editForm.isVerified
    };

    // Calculate changes to show in 2nd confirmation
    const changes: FieldChange[] = [];
    if (editingMember.name !== updated.name) {
      changes.push({ field: 'Member Name', from: editingMember.name, to: updated.name });
    }
    if (editingMember.phone !== updated.phone) {
      changes.push({ field: 'Phone Number', from: editingMember.phone, to: updated.phone });
    }
    if (editingMember.email !== updated.email) {
      changes.push({ field: 'Email Address', from: editingMember.email, to: updated.email });
    }
    if (editingMember.tier !== updated.tier) {
      changes.push({ field: 'Membership Tier', from: editingMember.tier, to: updated.tier });
    }
    if (editingMember.feePaid !== updated.feePaid) {
      changes.push({ field: 'Fee Paid', from: editingMember.feePaid, to: updated.feePaid });
    }
    if (editingMember.state !== updated.state) {
      changes.push({ field: 'City / State', from: editingMember.state, to: updated.state });
    }
    if (editingMember.isVerified !== updated.isVerified) {
      changes.push({ field: 'Verification Status', from: editingMember.isVerified ? 'Verified' : 'Pending', to: updated.isVerified ? 'Verified' : 'Pending' });
    }

    if (changes.length === 0) {
      setShowEditModal(false);
      showToast('No changes detected.');
      return;
    }

    setShowEditModal(false);
    setConfirmModifyPending({
      original: editingMember,
      updated,
      changes
    });
  };

  // Commit Modification after 2nd Confirmation
  const commitMemberModification = () => {
    if (!confirmModifyPending) return;
    const { updated } = confirmModifyPending;

    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    setConfirmModifyPending(null);
    setEditingMember(null);
    showToast(`Member ${updated.name} (${updated.id}) updated successfully!`);
  };

  // Trigger Delete Member -> Intercepted by Double Confirmation
  const requestDeleteMember = (m: MemberItem) => {
    setConfirmDeleteMember(m);
  };

  // Commit Delete after 2nd Confirmation
  const commitDeleteMember = () => {
    if (!confirmDeleteMember) return;
    const { id, name } = confirmDeleteMember;
    setMembers(prev => prev.filter(m => m.id !== id));
    setConfirmDeleteMember(null);
    showToast(`Member ${name} (${id}) permanently deleted.`);
  };

  const handleExportCSV = () => {
    const headers = ['Member ID', 'Name', 'Tier', 'Phone', 'Email', 'City / State', 'Fee Paid', 'Join Date', 'Status'];
    const rows = members.map(m => [
      m.id,
      `"${m.name}"`,
      m.tier,
      m.phone,
      m.email,
      `"${m.state}"`,
      `"${m.feePaid}"`,
      m.joinDate,
      m.isVerified ? 'Verified' : 'Unverified'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BBSP_Members_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Members Directory exported to CSV!');
  };

  const filteredMembers = members.filter(m => {
    const s = (searchTerm || '').trim().toLowerCase();
    const name = (m.name || '').toLowerCase();
    const id = (m.id || '').toLowerCase();
    const phone = (m.phone || '');
    const email = (m.email || '').toLowerCase();
    const state = (m.state || '').toLowerCase();

    const matchesSearch = 
      name.includes(s) || 
      id.includes(s) ||
      phone.includes(searchTerm) ||
      email.includes(s) ||
      state.includes(s);
    const matchesTier = selectedTier === 'All' || m.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const nextIdPreview = getNextSequentialId();

  return (
    <div className="space-y-6 relative text-left">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {/* Certificate / Quotation Modal */}
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
      {confirmDeleteMember && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Delete Member ${confirmDeleteMember.name}?`}
          subtitle={`Are you sure you want to permanently delete member record ${confirmDeleteMember.id}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Member ID', value: confirmDeleteMember.id, highlight: true },
            { label: 'Member Name', value: confirmDeleteMember.name },
            { label: 'Contact Phone', value: confirmDeleteMember.phone },
            { label: 'Email', value: confirmDeleteMember.email },
            { label: 'Tier', value: confirmDeleteMember.tier },
            { label: 'Fee Paid', value: confirmDeleteMember.feePaid }
          ]}
          warningMessage="Permanent Action: Deleting this member will remove their credentials, sequential ID record, and access across the ecosystem."
          confirmButtonText="Yes, Permanently Delete Member"
          onConfirm={commitDeleteMember}
          onClose={() => setConfirmDeleteMember(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY MODAL */}
      {/* ========================================================================= */}
      {confirmModifyPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes for ${confirmModifyPending.original.name}`}
          subtitle={`Please review the modifications to member record ${confirmModifyPending.original.id} before saving.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyPending.changes}
          itemDetails={[
            { label: 'Member ID', value: confirmModifyPending.original.id },
            { label: 'Current Name', value: confirmModifyPending.original.name }
          ]}
          warningMessage="Modifying member credentials or fees directly alters official quotations and records. Confirm to apply."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitMemberModification}
          onClose={() => setConfirmModifyPending(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Members Directory"
        description="Full access to add, edit, modify details, and manage sequential IDs (BBSP-001, BBSP-002...) with 2-step security verification."
        badge={`${members.length} Total Members`}
        action={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export List (CSV)
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Add Member
            </button>
          </div>
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
              placeholder="Search by ID (BBSP-001), name, phone, city..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[#10367D]">Tier:</span>
            {['All', 'Premium Member', 'Gold Member', 'Executive Member', 'Standard Member'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedTier === tier 
                    ? 'bg-[#10367D] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bbsp-card p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-[#10367D] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <h4 className="font-sora font-extrabold text-base text-[#10367D]">
            No Members Found
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Click "Add Member" to onboard new verified members with instant WhatsApp Quotation support.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => {
            const initials = (m.name || 'Member')
              .split(' ')
              .filter(Boolean)
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'M';

            return (
              <div key={m.id} className="bbsp-card p-5 relative overflow-hidden flex flex-col justify-between group hover:border-[#10367D]/30 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10367D]" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#10367D] text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-[#10367D]/20 flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[11px] font-extrabold text-[#10367D] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#10367D]/15">
                            {m.id}
                          </span>
                          <h3 className="font-sora font-extrabold text-base text-[#10367D] truncate">{m.name || 'Anonymous'}</h3>
                          {m.isVerified && <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D] inline-block mt-0.5">
                          {m.tier}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Edit and Delete */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(m)}
                        title="Edit / Modify Member Details"
                        className="p-1.5 text-[#10367D] hover:bg-[#10367D]/10 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => requestDeleteMember(m)}
                        title="Delete Member (Double Confirmation)"
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs py-3 border-y border-[#10367D]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A4594]/70 font-semibold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone:
                      </span>
                      <a href={`tel:${m.phone}`} className="font-bold text-[#10367D] hover:underline">{m.phone}</a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A4594]/70 font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email:
                      </span>
                      <a href={`mailto:${m.email}`} className="font-bold text-[#10367D] hover:underline truncate max-w-[170px]">{m.email}</a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A4594]/70 font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> City:
                      </span>
                      <span className="font-bold text-[#10367D]">{m.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A4594]/70 font-semibold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Joined:
                      </span>
                      <span className="font-bold text-[#10367D]">{m.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Fee Paid</p>
                    <p className="font-sora font-extrabold text-sm text-emerald-700">{m.feePaid}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => openCertificate(m)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp Quotation</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MEMBER MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D]">
                  Add New Member
                </h3>
                <p className="text-xs text-[#1A4594]/80 mt-0.5">
                  Sequential ID: <strong className="text-[#10367D] font-mono px-2 py-0.5 bg-[#FAF9F6] rounded border border-[#10367D]/20">{nextIdPreview}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Sudheer Reddy"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="member@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">City / State</label>
                  <input
                    type="text"
                    value={newMember.state}
                    onChange={(e) => setNewMember({ ...newMember, state: e.target.value })}
                    placeholder="e.g. Hyderabad"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Membership Tier</label>
                  <select
                    value={newMember.tier}
                    onChange={(e) => setNewMember({ ...newMember, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="Premium Member">Premium Member</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="Executive Member">Executive Member</option>
                    <option value="Standard Member">Standard Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Registration Fee (₹)</label>
                <input
                  type="number"
                  value={newMember.feeAmount}
                  onChange={(e) => setNewMember({ ...newMember, feeAmount: e.target.value })}
                  placeholder="5000"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              {/* Instant WhatsApp Quotation Toggle */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    Open WhatsApp Quotation right away
                  </p>
                  <p className="text-[10px] text-emerald-800 font-medium">
                    Automatically opens the official Quotation certificate ready to send to WhatsApp.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={newMember.autoOpenQuotation}
                  onChange={(e) => setNewMember({ ...newMember, autoOpenQuotation: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-bold text-xs shadow-md shadow-[#10367D]/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#A5CEE0]" />
                  Save & Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / MODIFY MEMBER MODAL */}
      {/* ========================================================================= */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Member Details
                </h3>
                <p className="text-xs text-[#1A4594]/80 mt-0.5">
                  Member ID: <strong className="text-[#10367D] font-mono px-2 py-0.5 bg-[#FAF9F6] rounded border border-[#10367D]/20">{editingMember.id}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Member Name"
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
                  <label className="block font-bold text-[#10367D] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">City / State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Membership Tier</label>
                  <select
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="Premium Member">Premium Member</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="Executive Member">Executive Member</option>
                    <option value="Standard Member">Standard Member</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.feeAmount}
                    onChange={(e) => setEditForm({ ...editForm, feeAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Status Verification</label>
                  <select
                    value={editForm.isVerified ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="true">Verified Active Member</option>
                    <option value="false">Unverified / Pending</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step verification review to ensure accuracy.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
