import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ConfirmationModal, type FieldChange } from '../components/ConfirmationModal';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  Download, 
  CheckCircle, 
  Plus,
  Edit,
  Trash2,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface TransactionItem {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  type: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Processing';
  mode: 'Razorpay UPI' | 'Debit/Credit Card' | 'Direct Escrow NEFT' | 'Cash / Physical Receipt';
}

const initialTransactions: TransactionItem[] = [
  {
    id: 'TXN-9021',
    memberId: 'BBSP-001',
    memberName: 'Aditya Nandyala',
    phone: '+91 75699 28327',
    type: 'Partner Onboarding Fee',
    amount: '₹5,000',
    date: 'Today, 04:30 PM',
    status: 'Completed',
    mode: 'Razorpay UPI'
  },
  {
    id: 'TXN-9022',
    memberId: 'BBSP-002',
    memberName: 'Rajesh Nandyala',
    phone: '+91 94933 03499',
    type: 'Partner Onboarding Fee',
    amount: '₹5,000',
    date: 'Today, 02:15 PM',
    status: 'Completed',
    mode: 'Direct Escrow NEFT'
  },
  {
    id: 'TXN-9023',
    memberId: 'BBSP-003',
    memberName: 'Yuvan Datti',
    phone: '+91 76748 77337',
    type: 'Partner Onboarding Fee',
    amount: '₹5,000',
    date: 'Yesterday',
    status: 'Completed',
    mode: 'Debit/Credit Card'
  }
];

export function Payments() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_payments_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialTransactions;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState<TransactionItem | null>(null);

  // Form states
  const [newTxn, setNewTxn] = useState({
    memberId: 'BBSP-004',
    memberName: '',
    phone: '',
    type: 'Partner Onboarding Fee',
    amount: '5000',
    date: 'Today',
    status: 'Completed' as 'Completed' | 'Processing',
    mode: 'Razorpay UPI' as any
  });

  const [editForm, setEditForm] = useState<Partial<TransactionItem>>({});

  // Security confirmation states
  const [confirmDeleteTxn, setConfirmDeleteTxn] = useState<TransactionItem | null>(null);
  const [confirmModifyPending, setConfirmModifyPending] = useState<{
    original: TransactionItem;
    updated: TransactionItem;
    changes: FieldChange[];
  } | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbsp_payments_list', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Add Payment
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxn.memberName || !newTxn.amount) {
      showToast('Please fill all required fields.');
      return;
    }

    const created: TransactionItem = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: newTxn.memberId,
      memberName: newTxn.memberName.trim(),
      phone: newTxn.phone.trim(),
      type: newTxn.type,
      amount: `₹${Number(newTxn.amount).toLocaleString('en-IN')}`,
      date: newTxn.date || 'Today',
      status: newTxn.status,
      mode: newTxn.mode
    };

    setTransactions([created, ...transactions]);
    setShowAddModal(false);
    showToast(`Payment of ${created.amount} recorded for ${created.memberName}!`);
    setNewTxn({
      memberId: 'BBSP-005',
      memberName: '',
      phone: '',
      type: 'Partner Onboarding Fee',
      amount: '5000',
      date: 'Today',
      status: 'Completed',
      mode: 'Razorpay UPI'
    });
  };

  // Open Edit Modal
  const openEditModal = (t: TransactionItem) => {
    setEditingTxn(t);
    const rawAmt = t.amount.replace(/[^0-9]/g, '') || '5000';
    setEditForm({
      ...t,
      amount: rawAmt
    });
    setShowEditModal(true);
  };

  // Submit Edit -> Intercepted by Double Confirmation
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTxn) return;

    const formattedAmt = `₹${Number(editForm.amount || 5000).toLocaleString('en-IN')}`;
    const updated: TransactionItem = {
      ...editingTxn,
      memberId: editForm.memberId || editingTxn.memberId,
      memberName: editForm.memberName?.trim() || editingTxn.memberName,
      phone: editForm.phone?.trim() || editingTxn.phone,
      type: editForm.type || editingTxn.type,
      amount: formattedAmt,
      mode: editForm.mode || editingTxn.mode,
      status: (editForm.status || editingTxn.status) as any,
      date: editForm.date || editingTxn.date
    };

    const changes: FieldChange[] = [];
    if (editingTxn.memberName !== updated.memberName) {
      changes.push({ field: 'Member Name', from: editingTxn.memberName, to: updated.memberName });
    }
    if (editingTxn.amount !== updated.amount) {
      changes.push({ field: 'Payment Amount', from: editingTxn.amount, to: updated.amount });
    }
    if (editingTxn.mode !== updated.mode) {
      changes.push({ field: 'Payment Method', from: editingTxn.mode, to: updated.mode });
    }
    if (editingTxn.status !== updated.status) {
      changes.push({ field: 'Payment Status', from: editingTxn.status, to: updated.status });
    }

    if (changes.length === 0) {
      setShowEditModal(false);
      showToast('No modifications detected.');
      return;
    }

    setShowEditModal(false);
    setConfirmModifyPending({
      original: editingTxn,
      updated,
      changes
    });
  };

  // Commit Edit after 2nd Confirmation
  const commitPaymentModification = () => {
    if (!confirmModifyPending) return;
    const { updated } = confirmModifyPending;

    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    setConfirmModifyPending(null);
    setEditingTxn(null);
    showToast(`Payment receipt ${updated.id} updated successfully!`);
  };

  // Request Delete -> Intercepted by Double Confirmation
  const requestDeleteTxn = (t: TransactionItem) => {
    setConfirmDeleteTxn(t);
  };

  // Commit Delete after 2nd Confirmation
  const commitDeleteTxn = () => {
    if (!confirmDeleteTxn) return;
    const { id, memberName, amount } = confirmDeleteTxn;
    setTransactions(prev => prev.filter(t => t.id !== id));
    setConfirmDeleteTxn(null);
    showToast(`Payment ${id} (${amount}) for ${memberName} permanently purged.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Transaction Ref', 'Member ID', 'Member Name', 'Phone', 'Purpose', 'Amount', 'Payment Method', 'Status', 'Date'];
    const rows = filteredTxns.map(t => [
      t.id,
      `"${t.memberId}"`,
      `"${t.memberName}"`,
      t.phone,
      `"${t.type}"`,
      `"${t.amount}"`,
      `"${t.mode}"`,
      t.status,
      `"${t.date}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BBSP_Payment_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payment receipts exported to CSV!');
  };

  const filteredTxns = transactions.filter(t => {
    const s = (searchTerm || '').trim().toLowerCase();
    const memberName = (t.memberName || '').toLowerCase();
    const id = (t.id || '').toLowerCase();
    const memberId = (t.memberId || '').toLowerCase();
    const phone = (t.phone || '');

    return (
      memberName.includes(s) || 
      id.includes(s) ||
      memberId.includes(s) ||
      phone.includes(searchTerm)
    );
  });

  const totalAmountNum = transactions.reduce((sum, t) => {
    const val = parseInt(t.amount.replace(/[^0-9]/g, '') || '0', 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-6 relative text-left font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: DELETE MODAL */}
      {/* ========================================================================= */}
      {confirmDeleteTxn && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Delete Payment Record ${confirmDeleteTxn.id}?`}
          subtitle={`Are you sure you want to permanently delete receipt record for ${confirmDeleteTxn.memberName}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Payment Ref', value: confirmDeleteTxn.id, highlight: true },
            { label: 'Member Name', value: confirmDeleteTxn.memberName },
            { label: 'Amount Paid', value: confirmDeleteTxn.amount, highlight: true },
            { label: 'Method', value: confirmDeleteTxn.mode }
          ]}
          warningMessage="Purging this payment receipt permanently removes the financial proof from audit logs."
          confirmButtonText="Yes, Permanently Delete Receipt"
          onConfirm={commitDeleteTxn}
          onClose={() => setConfirmDeleteTxn(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY MODAL */}
      {/* ========================================================================= */}
      {confirmModifyPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes to Payment ${confirmModifyPending.original.id}`}
          subtitle={`Review modifications to payment receipt for ${confirmModifyPending.original.memberName} before saving.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyPending.changes}
          itemDetails={[
            { label: 'Receipt Ref', value: confirmModifyPending.original.id },
            { label: 'Member', value: confirmModifyPending.original.memberName }
          ]}
          warningMessage="Modifying payment figures directly alters financial bookkeeping records."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitPaymentModification}
          onClose={() => setConfirmModifyPending(null)}
        />
      )}

      <PageHeader 
        title="Fee Payments & Collections"
        description="Official payment records and receipts with full modification, deletion access, and 2-step security verification."
        badge={`₹${totalAmountNum.toLocaleString('en-IN')} Total Recorded`}
        action={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> Download Receipts (CSV)
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Record Payment
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Total Collections</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-[#10367D]">₹{totalAmountNum.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">{transactions.length} Verified Receipts Recorded</p>
        </div>

        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Total Members Paid</span>
            <div className="p-2 rounded-xl bg-[#10367D]/10 text-[#10367D]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-[#10367D]">{transactions.length} Members</h3>
          <p className="text-[11px] text-[#1A4594]/80 font-semibold mt-1">Onboarding fee @ ₹5,000 standard</p>
        </div>

        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Payment Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-emerald-700">100%</h3>
          <p className="text-[11px] text-[#1A4594]/80 font-semibold mt-1">Verified Escrow & Direct Deposits</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bbsp-card p-6">
        <div className="flex items-center justify-between pb-5 border-b border-[#10367D]/10">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (BBSP-001), name..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#10367D]/10 text-[#1A4594]/70 font-bold uppercase tracking-wider text-[10px] bg-[#FAF9F6]">
                <th className="py-3.5 px-4 rounded-l-lg">Payment Ref</th>
                <th className="py-3.5 px-4">Member ID</th>
                <th className="py-3.5 px-4">Member Name & Contact</th>
                <th className="py-3.5 px-4">Purpose</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/8">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#1A4594]/60 font-semibold">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#10367D]">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-[#10367D]">
                      <span className="bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#10367D]/15">
                        {t.memberId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-sora font-extrabold text-sm text-[#10367D]">{t.memberName}</p>
                      <p className="text-[11px] text-[#1A4594]/80">{t.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#10367D] font-medium">
                      {t.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-sora font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {t.amount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1A4594]/80 font-medium">
                      {t.mode}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1A4594]/70 font-medium whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(t)}
                          title="Edit Payment"
                          className="p-1.5 rounded-lg text-[#10367D] hover:bg-[#10367D]/10 border border-[#10367D]/15 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => requestDeleteTxn(t)}
                          title="Delete Receipt (Double Confirmation)"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* RECORD PAYMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D]">
                  Record Fee Payment
                </h3>
                <p className="text-xs text-[#1A4594]/80 mt-0.5">Add verified member transaction receipt</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Member ID *</label>
                  <input
                    type="text"
                    required
                    value={newTxn.memberId}
                    onChange={(e) => setNewTxn({ ...newTxn, memberId: e.target.value })}
                    placeholder="e.g. BBSP-004"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Member Name *</label>
                  <input
                    type="text"
                    required
                    value={newTxn.memberName}
                    onChange={(e) => setNewTxn({ ...newTxn, memberName: e.target.value })}
                    placeholder="e.g. Ramesh Naidu"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newTxn.phone}
                    onChange={(e) => setNewTxn({ ...newTxn, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newTxn.amount}
                    onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                    placeholder="5000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Payment Method</label>
                <select
                  value={newTxn.mode}
                  onChange={(e) => setNewTxn({ ...newTxn, mode: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                >
                  <option value="Razorpay UPI">Razorpay UPI</option>
                  <option value="Debit/Credit Card">Debit/Credit Card</option>
                  <option value="Direct Escrow NEFT">Direct Escrow NEFT</option>
                  <option value="Cash / Physical Receipt">Cash / Physical Receipt</option>
                </select>
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
                  Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PAYMENT MODAL */}
      {showEditModal && editingTxn && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Payment Record
                </h3>
                <p className="text-xs text-[#1A4594]/80">Receipt Ref: {editingTxn.id}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Member ID</label>
                  <input
                    type="text"
                    value={editForm.memberId || ''}
                    onChange={(e) => setEditForm({ ...editForm, memberId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Member Name</label>
                  <input
                    type="text"
                    value={editForm.memberName || ''}
                    onChange={(e) => setEditForm({ ...editForm, memberName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.amount || ''}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Status</label>
                  <select
                    value={editForm.status || 'Completed'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Payment Method</label>
                <select
                  value={editForm.mode || 'Razorpay UPI'}
                  onChange={(e) => setEditForm({ ...editForm, mode: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                >
                  <option value="Razorpay UPI">Razorpay UPI</option>
                  <option value="Debit/Credit Card">Debit/Credit Card</option>
                  <option value="Direct Escrow NEFT">Direct Escrow NEFT</option>
                  <option value="Cash / Physical Receipt">Cash / Physical Receipt</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step review modal before updating payment ledgers.
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
