import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal, type CertificateMember } from '../components/MemberCertificateModal';
import { 
  Search, 
  Plus, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Trash2, 
  Users, 
  CreditCard, 
  Building2, 
  X 
} from 'lucide-react';

export interface ManualMember {
  id: string;
  name: string;
  tier?: 'Premium Member' | 'Gold Member' | 'Executive Member' | 'Standard Member';
  phone: string;
  email: string;
  hubLocation: string;
  onboardingDate: string;
  feePaid: string;
  notes: string;
}

const mockManualMembers: ManualMember[] = [];

export function ManualMembers() {
  const [manualList, setManualList] = useState<ManualMember[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_manual_members');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading manual members from localStorage:', e);
    }
    return mockManualMembers;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    hubLocation: 'Hyderabad Main Office',
    tier: 'Premium Member' as 'Premium Member' | 'Gold Member' | 'Executive Member' | 'Standard Member',
    feeAmount: '5000',
    paymentMode: 'Cash',
    notes: '',
    autoOpenQuotation: true
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('bbsp_manual_members', JSON.stringify(manualList));
    } catch (e) {
      console.error('Error saving manual members to localStorage:', e);
    }
  }, [manualList]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Calculate next sequential ID accurately
  const getNextSequentialId = () => {
    let maxSeq = 6;
    manualList.forEach(m => {
      const match = m.id.match(/BBSP-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    });
    return `BBSP-${String(maxSeq + 1).padStart(3, '0')}`;
  };

  // Open Quotation & Certificate Modal
  const openCertificate = (m: ManualMember) => {
    const rawFee = m.feePaid || '₹5,000';
    const amountOnly = rawFee.includes('(') ? rawFee.split('(')[0].trim() : rawFee;
    setCertificateMember({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      amountPaid: amountOnly || '₹5,000',
      state: m.hubLocation,
      date: m.onboardingDate === 'Today' ? '29 Aug 2026' : m.onboardingDate
    });
  };

  // Handle Add Member
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone || !newMember.email) {
      showToast('Please fill in all required fields.');
      return;
    }

    const assignedId = getNextSequentialId();
    const formattedFee = `₹${Number(newMember.feeAmount || 5000).toLocaleString('en-IN')} (${newMember.paymentMode})`;

    const created: ManualMember = {
      id: assignedId,
      name: newMember.name.trim(),
      tier: newMember.tier,
      phone: newMember.phone.trim(),
      email: newMember.email.trim(),
      hubLocation: newMember.hubLocation || 'Hyderabad Main Office',
      onboardingDate: 'Today',
      feePaid: formattedFee,
      notes: newMember.notes.trim() || `Direct office onboarding via ${newMember.paymentMode}.`
    };

    const updatedList = [created, ...manualList];
    setManualList(updatedList);
    setShowAddModal(false);

    showToast(`Manual Member ${created.name} (${created.id}) added successfully!`);

    // Open WhatsApp Quotation immediately if toggled
    if (newMember.autoOpenQuotation) {
      openCertificate(created);
    }

    // Reset Form
    setNewMember({
      name: '',
      phone: '',
      email: '',
      hubLocation: 'Hyderabad Main Office',
      tier: 'Premium Member',
      feeAmount: '5000',
      paymentMode: 'Cash',
      notes: '',
      autoOpenQuotation: true
    });
  };

  // Handle Delete Member
  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${id})?`)) {
      setManualList(prev => prev.filter(m => m.id !== id));
      showToast(`Member ${name} (${id}) removed from offline log.`);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Member ID', 'Name', 'Tier', 'Phone', 'Email', 'Office Branch', 'Fee Paid', 'Notes', 'Onboarding Date'];
    const rows = manualList.map(m => [
      m.id,
      `"${m.name}"`,
      m.tier || 'Standard Member',
      m.phone,
      m.email,
      `"${m.hubLocation}"`,
      `"${m.feePaid}"`,
      `"${m.notes.replace(/"/g, '""')}"`,
      m.onboardingDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BBSP_Manual_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Manual Members log exported to CSV!');
  };

  const branches = ['All', 'Hyderabad Office', 'Vijayawada Office', 'Tirupati Office', 'Visakhapatnam Office', 'Bengaluru Office'];

  const filtered = manualList.filter(m => {
    const s = (searchTerm || '').trim().toLowerCase();
    const name = (m.name || '').toLowerCase();
    const phone = (m.phone || '');
    const id = (m.id || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    const hubLocation = (m.hubLocation || '').toLowerCase();
    const notes = (m.notes || '').toLowerCase();

    const matchesSearch = 
      name.includes(s) ||
      phone.includes(searchTerm) ||
      id.includes(s) ||
      email.includes(s) ||
      hubLocation.includes(s) ||
      notes.includes(s);

    const branchTarget = (selectedBranch || '').toLowerCase().replace(' office', '');
    const matchesBranch = selectedBranch === 'All' || hubLocation.includes(branchTarget);

    return matchesSearch && matchesBranch;
  });

  const nextIdPreview = getNextSequentialId();

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {/* Member Certificate / Quotation Modal */}
      {certificateMember && (
        <MemberCertificateModal
          member={certificateMember}
          onClose={() => setCertificateMember(null)}
          onSentToast={showToast}
        />
      )}

      {/* Header */}
      <PageHeader 
        title="Manual Members (Offline)"
        description="Sequential offline members (BBSP-007, BBSP-008...) added from office hubs with full WhatsApp Quotation support."
        badge={`${manualList.length} Members`}
        action={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> Export Log (CSV)
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Add Manual Member
            </button>
          </div>
        }
      />

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bbsp-card p-4 flex items-center gap-3.5 border-l-4 border-l-[#10367D]">
          <div className="w-11 h-11 rounded-2xl bg-[#10367D]/10 text-[#10367D] flex items-center justify-center font-extrabold flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/70 uppercase tracking-wider">Total Manual Members</p>
            <p className="font-sora font-extrabold text-xl text-[#10367D]">{manualList.length} Members</p>
          </div>
        </div>

        <div className="bbsp-card p-4 flex items-center gap-3.5 border-l-4 border-l-emerald-600">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">Offline Fees Collected</p>
            <p className="font-sora font-extrabold text-xl text-emerald-700">₹{(manualList.length * 5000).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bbsp-card p-4 flex items-center gap-3.5 border-l-4 border-l-[#5A9CBE]">
          <div className="w-11 h-11 rounded-2xl bg-[#5A9CBE]/15 text-[#10367D] flex items-center justify-center font-extrabold flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/70 uppercase tracking-wider">Next Sequential ID</p>
            <p className="font-mono font-extrabold text-xl text-[#10367D]">{nextIdPreview}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bbsp-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search manual member by ID, name, phone, branch..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[#10367D] flex-shrink-0">Branch:</span>
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedBranch === b 
                    ? 'bg-[#10367D] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Members Table */}
      <div className="bbsp-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#10367D]/10 text-[#1A4594]/70 font-bold uppercase tracking-wider text-[10px] bg-[#FAF9F6]">
                <th className="py-3.5 px-4 rounded-l-lg">Member ID</th>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Office Branch</th>
                <th className="py-3.5 px-4">Fee Paid</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right rounded-r-lg">Quotation & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/8">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#1A4594]/60 font-semibold">
                    No manual members found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-extrabold text-[#10367D]">
                      <span className="bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-[#10367D]/15 shadow-sm inline-block">
                        {m.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#10367D] text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-sora font-extrabold text-sm text-[#10367D]">{m.name}</p>
                          {m.tier && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#10367D]/10 text-[#10367D] inline-block">
                              {m.tier}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <a href={`tel:${m.phone}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#1A4594]" /> {m.phone}
                      </a>
                      <a href={`mailto:${m.email}`} className="text-[11px] text-[#1A4594]/80 hover:underline flex items-center gap-1 truncate max-w-[180px]">
                        <Mail className="w-3 h-3 text-[#1A4594]" /> {m.email}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#10367D] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1A4594]" /> {m.hubLocation}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px] border border-emerald-200 inline-block">
                        {m.feePaid}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#10367D] font-medium max-w-[180px] truncate" title={m.notes}>
                      {m.notes}
                    </td>
                    <td className="py-4 px-4 text-[#1A4594]/80 font-medium whitespace-nowrap">
                      {m.onboardingDate}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openCertificate(m)}
                          title="Generate HD Quotation Certificate & Send on WhatsApp"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp Quotation</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          title="Remove Member"
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Manual Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D]">
                  Add Manual Member
                </h3>
                <p className="text-xs text-[#1A4594]/80 mt-0.5">
                  Sequential ID: <strong className="text-[#10367D] font-mono px-2 py-0.5 bg-[#FAF9F6] rounded border border-[#10367D]/20">{nextIdPreview}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6]"
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
                  placeholder="e.g. Ramesh Naidu"
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
                  <label className="block font-bold text-[#10367D] mb-1">Office Hub / Branch</label>
                  <select
                    value={newMember.hubLocation}
                    onChange={(e) => setNewMember({ ...newMember, hubLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="Hyderabad Main Office">Hyderabad Main Office</option>
                    <option value="Vijayawada Office">Vijayawada Office</option>
                    <option value="Tirupati Office">Tirupati Office</option>
                    <option value="Visakhapatnam Office">Visakhapatnam Office</option>
                    <option value="Bengaluru Office">Bengaluru Office</option>
                    <option value="Nandyal Office">Nandyal Office</option>
                    <option value="Kurnool Office">Kurnool Office</option>
                    <option value="Secretariat Office">Secretariat Office</option>
                  </select>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Payment Mode</label>
                  <select
                    value={newMember.paymentMode}
                    onChange={(e) => setNewMember({ ...newMember, paymentMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  >
                    <option value="Cash">Cash (Physical Receipt)</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="UPI Online">UPI / QR Code</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Notes / Receipt Ref</label>
                <input
                  type="text"
                  value={newMember.notes}
                  onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                  placeholder="e.g. Receipt #409 issued by Admin at Office"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              {/* Instant WhatsApp Quotation Trigger Toggle */}
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
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-bold text-xs shadow-md shadow-[#10367D]/25 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#A5CEE0]" />
                  Save & Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
