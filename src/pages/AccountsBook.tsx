import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ConfirmationModal, type FieldChange } from '../components/ConfirmationModal';
import { 
  BookOpen, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sun, 
  Building2, 
  GraduationCap, 
  Landmark, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  X, 
  Send, 
  ShieldCheck, 
  FileText,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';

export type WorkCategory = 'Solar' | 'Real Estate' | 'Course' | 'Loan';

export interface CommissionEntry {
  id: string;
  voucherNo: string;
  dateTime: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  workCategory: WorkCategory;
  projectTitle: string;
  dealAmount: number;
  commissionAmount: number;
  type: 'CREDIT' | 'DEBIT_CLEARANCE';
  status: 'In Wallet' | 'Cleared' | 'Pending Clearance';
  clearedDate?: string;
  payoutMethod?: string;
  payoutRef?: string;
  notes?: string;
}

export interface MemberWallet {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  totalEarned: number;
  walletBalance: number;
  totalCleared: number;
  lastActive: string;
}

// Initial realistic members data from Build Bharat ecosystem
const initialMembers: MemberWallet[] = [
  {
    id: 'BBSP-001',
    name: 'Aditya Nandyala',
    phone: '+91 75699 28327',
    email: 'aditya.nandyala@gmail.com',
    tier: 'Standard Member',
    totalEarned: 45000,
    walletBalance: 20000,
    totalCleared: 25000,
    lastActive: 'Today, 04:30 PM'
  },
  {
    id: 'BBSP-002',
    name: 'Rajesh Nandyala',
    phone: '+91 94933 03499',
    email: 'rajesh.nandyala@gmail.com',
    tier: 'Premium Member',
    totalEarned: 85000,
    walletBalance: 45000,
    totalCleared: 40000,
    lastActive: 'Today, 02:15 PM'
  },
  {
    id: 'BBSP-003',
    name: 'Yuvan Datti',
    phone: '+91 76748 77337',
    email: 'yuvan.datti@gmail.com',
    tier: 'Gold Member',
    totalEarned: 62000,
    walletBalance: 32000,
    totalCleared: 30000,
    lastActive: 'Yesterday'
  },
  {
    id: 'BBSP-004',
    name: 'Alisha',
    phone: '+91 81257 37275',
    email: 'alisha.k@gmail.com',
    tier: 'Executive Member',
    totalEarned: 35000,
    walletBalance: 15000,
    totalCleared: 20000,
    lastActive: '27 Aug 2026'
  },
  {
    id: 'BBSP-005',
    name: 'Suresh Kumar',
    phone: '+91 98490 11223',
    email: 'suresh.k@gmail.com',
    tier: 'Standard Member',
    totalEarned: 18000,
    walletBalance: 18000,
    totalCleared: 0,
    lastActive: '26 Aug 2026'
  },
  {
    id: 'BBSP-006',
    name: 'Priya Reddy',
    phone: '+91 94401 88990',
    email: 'priya.r@gmail.com',
    tier: 'Premium Member',
    totalEarned: 52000,
    walletBalance: 22000,
    totalCleared: 30000,
    lastActive: '25 Aug 2026'
  },
  {
    id: 'BBSP-007',
    name: 'K. Madhusudhan',
    phone: '+91 94405 12345',
    email: 'madhusudhan.k@gmail.com',
    tier: 'Offline Member',
    totalEarned: 30000,
    walletBalance: 10000,
    totalCleared: 20000,
    lastActive: '28 Aug 2026'
  },
  {
    id: 'BBSP-008',
    name: 'B. Jagadeesh Reddy',
    phone: '+91 98481 98765',
    email: 'jagadeesh.reddy@gmail.com',
    tier: 'Offline Member',
    totalEarned: 95000,
    walletBalance: 45000,
    totalCleared: 50000,
    lastActive: '27 Aug 2026'
  },
  {
    id: 'BBSP-009',
    name: 'S. Ratna Kumari',
    phone: '+91 97014 45678',
    email: 'ratna.kumari@gmail.com',
    tier: 'Offline Member',
    totalEarned: 24000,
    walletBalance: 24000,
    totalCleared: 0,
    lastActive: '26 Aug 2026'
  }
];

// Initial Accounts Book Ledger Entries
const initialEntries: CommissionEntry[] = [
  {
    id: 'COMM-101',
    voucherNo: 'BBSP-VCH-2026-081',
    dateTime: '29 Aug 2026, 04:30 PM',
    memberId: 'BBSP-001',
    memberName: 'Aditya Nandyala',
    memberPhone: '+91 75699 28327',
    memberEmail: 'aditya.nandyala@gmail.com',
    workCategory: 'Solar',
    projectTitle: '10 KW On-Grid Solar Plant Installation - Gachibowli',
    dealAmount: 550000,
    commissionAmount: 20000,
    type: 'CREDIT',
    status: 'In Wallet',
    notes: '5% commission approved upon site survey & vendor dispatch.'
  },
  {
    id: 'COMM-102',
    voucherNo: 'BBSP-VCH-2026-080',
    dateTime: '29 Aug 2026, 02:15 PM',
    memberId: 'BBSP-002',
    memberName: 'Rajesh Nandyala',
    memberPhone: '+91 94933 03499',
    memberEmail: 'rajesh.nandyala@gmail.com',
    workCategory: 'Real Estate',
    projectTitle: '200 Sq.Yds Open Plot Sale - Nandyal Highway Phase-2',
    dealAmount: 1800000,
    commissionAmount: 45000,
    type: 'CREDIT',
    status: 'In Wallet',
    notes: 'Direct client site closure commission credited.'
  },
  {
    id: 'COMM-103',
    voucherNo: 'BBSP-CLR-2026-042',
    dateTime: '29 Aug 2026, 11:00 AM',
    memberId: 'BBSP-001',
    memberName: 'Aditya Nandyala',
    memberPhone: '+91 75699 28327',
    memberEmail: 'aditya.nandyala@gmail.com',
    workCategory: 'Course',
    projectTitle: 'Wallet Commission Settlement Payout (UPI)',
    dealAmount: 0,
    commissionAmount: 25000,
    type: 'DEBIT_CLEARANCE',
    status: 'Cleared',
    clearedDate: '29 Aug 2026, 11:00 AM',
    payoutMethod: 'UPI (GPay / 7569928327@upi)',
    payoutRef: 'UPI-REF-994821034',
    notes: 'Cleared by SuperAdmin Sudheer Reddy.'
  },
  {
    id: 'COMM-104',
    voucherNo: 'BBSP-VCH-2026-079',
    dateTime: '28 Aug 2026, 05:45 PM',
    memberId: 'BBSP-003',
    memberName: 'Yuvan Datti',
    memberPhone: '+91 76748 77337',
    memberEmail: 'yuvan.datti@gmail.com',
    workCategory: 'Loan',
    projectTitle: 'Business MSME Loan Disbursement - ₹25 Lakhs',
    dealAmount: 2500000,
    commissionAmount: 32000,
    type: 'CREDIT',
    status: 'In Wallet',
    notes: '1.25% channel partner commission credited.'
  },
  {
    id: 'COMM-105',
    voucherNo: 'BBSP-VCH-2026-078',
    dateTime: '28 Aug 2026, 01:20 PM',
    memberId: 'BBSP-008',
    memberName: 'B. Jagadeesh Reddy',
    memberPhone: '+91 98481 98765',
    memberEmail: 'jagadeesh.reddy@gmail.com',
    workCategory: 'Real Estate',
    projectTitle: 'Commercial Space Booking - Cyber Gateway Tower',
    dealAmount: 3200000,
    commissionAmount: 45000,
    type: 'CREDIT',
    status: 'In Wallet',
    notes: 'Exclusive partner commission added by admin.'
  },
  {
    id: 'COMM-106',
    voucherNo: 'BBSP-VCH-2026-077',
    dateTime: '27 Aug 2026, 03:10 PM',
    memberId: 'BBSP-004',
    memberName: 'Alisha',
    memberPhone: '+91 81257 37275',
    memberEmail: 'alisha.k@gmail.com',
    workCategory: 'Course',
    projectTitle: 'Build Bharat Masterclass & Franchise Pack (10 Enrolments)',
    dealAmount: 150000,
    commissionAmount: 15000,
    type: 'CREDIT',
    status: 'In Wallet',
    notes: 'Institutional course referral incentive.'
  }
];

export function AccountsBook() {
  const [members, setMembers] = useState<MemberWallet[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_accounts_members');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialMembers;
  });

  const [entries, setEntries] = useState<CommissionEntry[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_accounts_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialEntries;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbsp_accounts_members', JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('bbsp_accounts_entries', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPassbookModal, setShowPassbookModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  
  // Edit Modals
  const [editingEntry, setEditingEntry] = useState<CommissionEntry | null>(null);
  const [editEntryForm, setEditEntryForm] = useState<{
    projectTitle: string;
    dealAmount: string;
    commissionAmount: string;
    workCategory: WorkCategory;
    customDateTime: string;
    notes: string;
  }>({
    projectTitle: '',
    dealAmount: '',
    commissionAmount: '',
    workCategory: 'Solar',
    customDateTime: '',
    notes: ''
  });

  // Double Confirmation Security state
  const [confirmDeleteEntry, setConfirmDeleteEntry] = useState<CommissionEntry | null>(null);
  const [confirmModifyEntryPending, setConfirmModifyEntryPending] = useState<{
    original: CommissionEntry;
    updated: CommissionEntry;
    changes: FieldChange[];
  } | null>(null);

  // Modal Context State
  const [activeMember, setActiveMember] = useState<MemberWallet | null>(null);
  const [activeEntry, setActiveEntry] = useState<CommissionEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Commission Form State
  const [newCommission, setNewCommission] = useState({
    memberId: initialMembers[0]?.id || 'BBSP-001',
    workCategory: 'Solar' as WorkCategory,
    projectTitle: '',
    dealAmount: '',
    commissionAmount: '',
    customDateTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    notes: ''
  });

  // Clearance Form State
  const [clearanceForm, setClearanceForm] = useState({
    amount: '',
    payoutMethod: 'UPI (GPay / PhonePe / Paytm)',
    payoutRef: '',
    notes: 'Paid and settled in full by Sudheer Reddy'
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Format INR Currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get Category Badge Style
  const getCategoryMeta = (cat: WorkCategory) => {
    switch (cat) {
      case 'Solar':
        return {
          icon: Sun,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          pillBg: 'bg-amber-500/10 text-amber-700'
        };
      case 'Real Estate':
        return {
          icon: Building2,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          pillBg: 'bg-emerald-500/10 text-emerald-700'
        };
      case 'Course':
        return {
          icon: GraduationCap,
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          pillBg: 'bg-indigo-500/10 text-indigo-700'
        };
      case 'Loan':
        return {
          icon: Landmark,
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          pillBg: 'bg-sky-500/10 text-sky-700'
        };
    }
  };

  // Overall Financial Calculations
  const stats = useMemo(() => {
    const totalDistributed = entries
      .filter(e => e.type === 'CREDIT')
      .reduce((sum, e) => sum + e.commissionAmount, 0);

    const totalCleared = entries
      .filter(e => e.type === 'DEBIT_CLEARANCE')
      .reduce((sum, e) => sum + e.commissionAmount, 0);

    const activeWalletTotal = members.reduce((sum, m) => sum + m.walletBalance, 0);

    // Category Breakdown
    const catBreakdown = {
      Solar: entries.filter(e => e.type === 'CREDIT' && e.workCategory === 'Solar').reduce((s, e) => s + e.commissionAmount, 0),
      RealEstate: entries.filter(e => e.type === 'CREDIT' && e.workCategory === 'Real Estate').reduce((s, e) => s + e.commissionAmount, 0),
      Course: entries.filter(e => e.type === 'CREDIT' && e.workCategory === 'Course').reduce((s, e) => s + e.commissionAmount, 0),
      Loan: entries.filter(e => e.type === 'CREDIT' && e.workCategory === 'Loan').reduce((s, e) => s + e.commissionAmount, 0),
    };

    return {
      totalDistributed,
      totalCleared,
      activeWalletTotal,
      catBreakdown
    };
  }, [entries, members]);

  // Filtered Ledger Entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const s = (searchTerm || '').trim().toLowerCase();
      const memberName = (entry.memberName || '').toLowerCase();
      const memberId = (entry.memberId || '').toLowerCase();
      const voucherNo = (entry.voucherNo || '').toLowerCase();
      const projectTitle = (entry.projectTitle || '').toLowerCase();
      const workCategory = (entry.workCategory || '').toLowerCase();

      const matchesSearch = 
        memberName.includes(s) ||
        memberId.includes(s) ||
        voucherNo.includes(s) ||
        projectTitle.includes(s) ||
        workCategory.includes(s);

      const matchesCat = selectedCategory === 'All' || entry.workCategory === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || 
        (selectedStatus === 'In Wallet' && entry.status === 'In Wallet') ||
        (selectedStatus === 'Cleared' && entry.status === 'Cleared');
      const matchesMember = selectedMemberFilter === 'All' || entry.memberId === selectedMemberFilter;

      return matchesSearch && matchesCat && matchesStatus && matchesMember;
    });
  }, [entries, searchTerm, selectedCategory, selectedStatus, selectedMemberFilter]);

  // Handle Adding New Commission
  const handleAddCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === newCommission.memberId);
    if (!mem) return;

    const commAmt = parseFloat(newCommission.commissionAmount) || 0;
    const dealAmt = parseFloat(newCommission.dealAmount) || 0;

    if (commAmt <= 0) {
      alert('Please enter a valid commission amount greater than 0.');
      return;
    }

    const nextVoucher = `BBSP-VCH-${new Date().getFullYear()}-${String(entries.length + 100).slice(-3)}`;
    const newEntry: CommissionEntry = {
      id: `COMM-${Date.now().toString().slice(-4)}`,
      voucherNo: nextVoucher,
      dateTime: newCommission.customDateTime || (new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })),
      memberId: mem.id,
      memberName: mem.name,
      memberPhone: mem.phone,
      memberEmail: mem.email,
      workCategory: newCommission.workCategory,
      projectTitle: newCommission.projectTitle || `${newCommission.workCategory} Commission Entry`,
      dealAmount: dealAmt,
      commissionAmount: commAmt,
      type: 'CREDIT',
      status: 'In Wallet',
      notes: newCommission.notes || `Commission added by Admin for ${newCommission.workCategory} work.`
    };

    // 1. Add to entries ledger
    setEntries([newEntry, ...entries]);

    // 2. Automatically update Member's Wallet balance
    setMembers(prev => prev.map(m => {
      if (m.id === mem.id) {
        return {
          ...m,
          totalEarned: m.totalEarned + commAmt,
          walletBalance: m.walletBalance + commAmt,
          lastActive: 'Just now'
        };
      }
      return m;
    }));

    setShowAddModal(false);
    triggerToast(`🎉 ₹${commAmt.toLocaleString('en-IN')} Commission added! Credited to ${mem.name}'s (${mem.id}) Wallet.`);

    // Reset Form
    setNewCommission({
      memberId: members[0]?.id || 'BBSP-001',
      workCategory: 'Solar',
      projectTitle: '',
      dealAmount: '',
      commissionAmount: '',
      customDateTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      notes: ''
    });
  };

  // Open Edit Modal for an Entry
  const openEditEntryModal = (entry: CommissionEntry) => {
    setEditingEntry(entry);
    setEditEntryForm({
      projectTitle: entry.projectTitle,
      dealAmount: entry.dealAmount ? entry.dealAmount.toString() : '0',
      commissionAmount: entry.commissionAmount.toString(),
      workCategory: entry.workCategory,
      customDateTime: entry.dateTime,
      notes: entry.notes || ''
    });
  };

  // Submit Edit Entry -> Intercepted by Double Confirmation
  const handleEditEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const newComm = parseFloat(editEntryForm.commissionAmount) || 0;
    const newDeal = parseFloat(editEntryForm.dealAmount) || 0;

    const updated: CommissionEntry = {
      ...editingEntry,
      projectTitle: editEntryForm.projectTitle.trim(),
      dealAmount: newDeal,
      commissionAmount: newComm,
      workCategory: editEntryForm.workCategory,
      dateTime: editEntryForm.customDateTime.trim() || editingEntry.dateTime,
      notes: editEntryForm.notes.trim()
    };

    const changes: FieldChange[] = [];
    if (editingEntry.projectTitle !== updated.projectTitle) {
      changes.push({ field: 'Project / Description', from: editingEntry.projectTitle, to: updated.projectTitle });
    }
    if (editingEntry.workCategory !== updated.workCategory) {
      changes.push({ field: 'Work Vertical', from: editingEntry.workCategory, to: updated.workCategory });
    }
    if (editingEntry.dealAmount !== updated.dealAmount) {
      changes.push({ field: 'Deal Amount', from: formatINR(editingEntry.dealAmount), to: formatINR(updated.dealAmount) });
    }
    if (editingEntry.commissionAmount !== updated.commissionAmount) {
      changes.push({ field: 'Commission Figure', from: formatINR(editingEntry.commissionAmount), to: formatINR(updated.commissionAmount) });
    }
    if (editingEntry.dateTime !== updated.dateTime) {
      changes.push({ field: 'Date & Time', from: editingEntry.dateTime, to: updated.dateTime });
    }

    if (changes.length === 0) {
      setEditingEntry(null);
      triggerToast('No ledger modifications detected.');
      return;
    }

    setEditingEntry(null);
    setConfirmModifyEntryPending({
      original: editingEntry,
      updated,
      changes
    });
  };

  // Commit Entry Modification after 2nd Confirmation
  const commitEntryModification = () => {
    if (!confirmModifyEntryPending) return;
    const { original, updated } = confirmModifyEntryPending;

    // Recalibrate Member Wallet if Commission Amount Changed
    const diff = updated.commissionAmount - original.commissionAmount;
    if (diff !== 0 && original.type === 'CREDIT') {
      setMembers(prev => prev.map(m => {
        if (m.id === original.memberId) {
          return {
            ...m,
            totalEarned: m.totalEarned + diff,
            walletBalance: m.walletBalance + diff,
            lastActive: 'Just now (Updated)'
          };
        }
        return m;
      }));
    }

    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    setConfirmModifyEntryPending(null);
    triggerToast(`Ledger Entry ${updated.voucherNo} updated successfully!`);
  };

  // Request Delete Entry -> Intercepted by Double Confirmation
  const requestDeleteEntry = (entry: CommissionEntry) => {
    setConfirmDeleteEntry(entry);
  };

  // Commit Delete Entry after 2nd Confirmation
  const commitDeleteEntry = () => {
    if (!confirmDeleteEntry) return;
    const entry = confirmDeleteEntry;

    // Safely Adjust Member Wallet Balance on Deletion
    if (entry.type === 'CREDIT') {
      setMembers(prev => prev.map(m => {
        if (m.id === entry.memberId) {
          return {
            ...m,
            totalEarned: Math.max(0, m.totalEarned - entry.commissionAmount),
            walletBalance: Math.max(0, m.walletBalance - entry.commissionAmount),
            lastActive: 'Just now (Entry Purged)'
          };
        }
        return m;
      }));
    } else if (entry.type === 'DEBIT_CLEARANCE') {
      setMembers(prev => prev.map(m => {
        if (m.id === entry.memberId) {
          return {
            ...m,
            walletBalance: m.walletBalance + entry.commissionAmount,
            totalCleared: Math.max(0, m.totalCleared - entry.commissionAmount),
            lastActive: 'Just now (Clearance Reverted)'
          };
        }
        return m;
      }));
    }

    setEntries(prev => prev.filter(e => e.id !== entry.id));
    setConfirmDeleteEntry(null);
    triggerToast(`Ledger Voucher ${entry.voucherNo} (${formatINR(entry.commissionAmount)}) deleted and member balance adjusted.`);
  };

  // Open Clearance Modal for a Member
  const openClearanceModal = (member: MemberWallet) => {
    setActiveMember(member);
    setClearanceForm({
      amount: member.walletBalance.toString(),
      payoutMethod: 'UPI (GPay / PhonePe / Paytm)',
      payoutRef: `UPI-REF-${Math.floor(100000000 + Math.random() * 900000000)}`,
      notes: `Full balance clearance of ₹${member.walletBalance.toLocaleString('en-IN')} paid by Sudheer Reddy`
    });
    setShowClearModal(true);
  };

  // Handle Clearing / Settling Wallet
  const handleClearWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember) return;

    const clearAmt = parseFloat(clearanceForm.amount) || 0;
    if (clearAmt <= 0 || clearAmt > activeMember.walletBalance) {
      alert(`Please enter a valid clearance amount between ₹1 and ₹${activeMember.walletBalance.toLocaleString('en-IN')}`);
      return;
    }

    const nextClearVoucher = `BBSP-CLR-${new Date().getFullYear()}-${String(entries.length + 50).slice(-3)}`;
    const clearanceEntry: CommissionEntry = {
      id: `CLR-${Date.now().toString().slice(-4)}`,
      voucherNo: nextClearVoucher,
      dateTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      memberId: activeMember.id,
      memberName: activeMember.name,
      memberPhone: activeMember.phone,
      memberEmail: activeMember.email,
      workCategory: 'Solar',
      projectTitle: `Wallet Payout & Clearance (${clearanceForm.payoutMethod})`,
      dealAmount: 0,
      commissionAmount: clearAmt,
      type: 'DEBIT_CLEARANCE',
      status: 'Cleared',
      clearedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      payoutMethod: clearanceForm.payoutMethod,
      payoutRef: clearanceForm.payoutRef,
      notes: clearanceForm.notes
    };

    // 1. Add debit clearance to ledger
    setEntries([clearanceEntry, ...entries]);

    // 2. Deduct from Member Wallet and add to Total Cleared
    setMembers(prev => prev.map(m => {
      if (m.id === activeMember.id) {
        return {
          ...m,
          walletBalance: m.walletBalance - clearAmt,
          totalCleared: m.totalCleared + clearAmt,
          lastActive: 'Just now (Cleared)'
        };
      }
      return m;
    }));

    setShowClearModal(false);
    triggerToast(`✅ ₹${clearAmt.toLocaleString('en-IN')} Wallet Balance successfully Cleared for ${activeMember.name}!`);
  };

  // Open Passbook for a member
  const openPassbook = (memberId: string) => {
    const mem = members.find(m => m.id === memberId);
    if (mem) {
      setActiveMember(mem);
      setShowPassbookModal(true);
    }
  };

  // Open Voucher modal
  const openVoucher = (entry: CommissionEntry) => {
    setActiveEntry(entry);
    setShowVoucherModal(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Voucher No', 'Date & Time', 'Member ID', 'Member Name', 'Category', 'Project / Reference', 'Deal Amount (INR)', 'Commission Amount (INR)', 'Type', 'Status', 'Notes'];
    const rows = filteredEntries.map(e => [
      `"${e.voucherNo}"`,
      `"${e.dateTime}"`,
      `"${e.memberId}"`,
      `"${e.memberName}"`,
      `"${e.workCategory}"`,
      `"${e.projectTitle.replace(/"/g, '""')}"`,
      e.dealAmount,
      e.commissionAmount,
      e.type,
      e.status,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Build_Bharat_Accounts_Book_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Accounts Book CSV successfully exported!');
  };

  return (
    <div className="space-y-6 relative pb-10 text-left font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#A5CEE0]/40 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0] flex-shrink-0" />
          <span className="text-xs font-bold font-sora">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: DELETE ENTRY */}
      {/* ========================================================================= */}
      {confirmDeleteEntry && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Delete Voucher ${confirmDeleteEntry.voucherNo}?`}
          subtitle={`Are you sure you want to permanently delete this financial record for ${confirmDeleteEntry.memberName}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Voucher No', value: confirmDeleteEntry.voucherNo, highlight: true },
            { label: 'Member Name', value: `${confirmDeleteEntry.memberName} (${confirmDeleteEntry.memberId})` },
            { label: 'Commission Figure', value: formatINR(confirmDeleteEntry.commissionAmount), highlight: true },
            { label: 'Vertical', value: confirmDeleteEntry.workCategory },
            { label: 'Type', value: confirmDeleteEntry.type }
          ]}
          warningMessage="Auditing Safeguard: Deleting this financial entry will automatically reverse the amount from the member's wallet balance."
          confirmButtonText="Yes, Permanently Delete Entry"
          onConfirm={commitDeleteEntry}
          onClose={() => setConfirmDeleteEntry(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY ENTRY */}
      {/* ========================================================================= */}
      {confirmModifyEntryPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes to Voucher ${confirmModifyEntryPending.original.voucherNo}`}
          subtitle={`Please review the modifications to ${confirmModifyEntryPending.original.memberName}'s commission record.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyEntryPending.changes}
          itemDetails={[
            { label: 'Voucher Ref', value: confirmModifyEntryPending.original.voucherNo },
            { label: 'Member', value: confirmModifyEntryPending.original.memberName }
          ]}
          warningMessage="Financial modification will automatically adjust the associated member's live wallet balance."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitEntryModification}
          onClose={() => setConfirmModifyEntryPending(null)}
        />
      )}

      {/* Page Header */}
      <PageHeader
        title="Accounts Book & Commission Ledger"
        description="Full access to add, edit, adjust, and purge commission payouts with automatic member wallet recalculation & 2-step verification."
        badge="Live Financial Ledger"
        action={
          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#1A4594]" />
              Export Statement
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" />
              Add Commission Entry
            </button>
          </div>
        }
      />

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Commissions Distributed */}
        <div className="bbsp-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10367D]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#10367D]/10 border border-[#10367D]/20 text-[#10367D] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Total Distributed
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
            Gross Commissions
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
            {formatINR(stats.totalDistributed)}
          </h3>
          <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
            Across all 4 business verticals
          </p>
        </div>

        {/* Card 2: Available in Member Wallets (Unsettled) */}
        <div className="bbsp-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              In Member Wallets
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
            Active Wallet Balance
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-amber-700 tracking-tight mt-1">
            {formatINR(stats.activeWalletTotal)}
          </h3>
          <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
            Ready for admin clearance / payout
          </p>
        </div>

        {/* Card 3: Cleared / Settled Payouts */}
        <div className="bbsp-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Paid to Bank/UPI
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
            Total Cleared / Settled
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-emerald-700 tracking-tight mt-1">
            {formatINR(stats.totalCleared)}
          </h3>
          <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
            Verified payouts by SuperAdmin
          </p>
        </div>

        {/* Card 4: 4-Vertical Revenue Breakdown */}
        <div className="bbsp-card p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#A5CEE0]" />
          <div>
            <p className="text-[10px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora mb-2">
              Vertical Distribution
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/60">
                <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                  <Sun className="w-3 h-3" /> Solar
                </span>
                <p className="font-extrabold text-[#10367D] text-xs mt-0.5">{formatINR(stats.catBreakdown.Solar)}</p>
              </div>
              <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Real Estate
                </span>
                <p className="font-extrabold text-[#10367D] text-xs mt-0.5">{formatINR(stats.catBreakdown.RealEstate)}</p>
              </div>
              <div className="bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-200/60">
                <span className="text-[10px] font-bold text-indigo-800 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Course
                </span>
                <p className="font-extrabold text-[#10367D] text-xs mt-0.5">{formatINR(stats.catBreakdown.Course)}</p>
              </div>
              <div className="bg-sky-50/70 p-1.5 rounded-lg border border-sky-200/60">
                <span className="text-[10px] font-bold text-sky-800 flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Loan
                </span>
                <p className="font-extrabold text-[#10367D] text-xs mt-0.5">{formatINR(stats.catBreakdown.Loan)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Wallets Quick Overview */}
      <div className="bbsp-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-sora font-extrabold text-base text-[#10367D]">
              Member Wallets & Payout Desks
            </h3>
            <p className="text-xs text-[#1A4594]/80">
              Click "Clear Wallet" to record bank/UPI payout, or "View Passbook" for full ledger audit.
            </p>
          </div>
          <span className="text-xs font-bold text-[#10367D] bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#10367D]/15 self-start sm:self-auto">
            {members.length} Registered Wallets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#10367D]/12 hover:border-[#10367D]/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#10367D]/15 text-[#10367D]">
                        {m.id}
                      </span>
                      <h4 className="font-sora font-extrabold text-sm text-[#10367D]">{m.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#1A4594]/70 mt-0.5">{m.phone}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D]">
                    {m.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-white border border-[#10367D]/8 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Available Balance</span>
                    <strong className="text-amber-700 font-sora font-extrabold text-sm">
                      {formatINR(m.walletBalance)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Lifetime Cleared</span>
                    <strong className="text-emerald-700 font-sora font-extrabold text-sm">
                      {formatINR(m.totalCleared)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#10367D]/8">
                <button
                  onClick={() => openPassbook(m.id)}
                  className="flex-1 py-1.5 bg-white hover:bg-[#FAF9F6] border border-[#10367D]/15 rounded-xl text-xs font-bold text-[#10367D] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Passbook
                </button>
                {m.walletBalance > 0 ? (
                  <button
                    onClick={() => openClearanceModal(m)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clear
                  </button>
                ) : (
                  <span className="flex-1 py-1.5 text-center text-[11px] font-bold text-slate-400 bg-slate-100 rounded-xl">
                    Settled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar for Ledger Entries */}
      <div className="bbsp-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search voucher, member, project..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#10367D]">Status:</span>
              {['All', 'In Wallet', 'Cleared'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    selectedStatus === st 
                      ? 'bg-[#10367D] text-white shadow-sm'
                      : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#10367D]">Vertical:</span>
              {['All', 'Solar', 'Real Estate', 'Course', 'Loan'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#10367D] text-white shadow-sm'
                      : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#10367D]">Member:</span>
              <select
                value={selectedMemberFilter}
                onChange={(e) => setSelectedMemberFilter(e.target.value)}
                className="bg-[#FAF9F6] border border-[#10367D]/15 text-[#10367D] text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="All">All Members</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.id} - {m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Ledger Table */}
      <div className="bbsp-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#10367D]/10 text-[#1A4594]/70 font-bold uppercase tracking-wider text-[10px] bg-[#FAF9F6]">
                <th className="py-3.5 px-3.5 rounded-l-lg">Date & Time</th>
                <th className="py-3.5 px-3">Voucher Ref</th>
                <th className="py-3.5 px-3">Member Details</th>
                <th className="py-3.5 px-3">Work Vertical</th>
                <th className="py-3.5 px-3">Project / Deal Reference</th>
                <th className="py-3.5 px-3 text-right">Deal Value</th>
                <th className="py-3.5 px-3 text-right">Commission Figure</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/8">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-[#1A4594]/60 font-semibold">
                    No commission entries found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const catMeta = getCategoryMeta(entry.workCategory);
                  const Icon = catMeta.icon;

                  return (
                    <tr key={entry.id} className="hover:bg-[#FAF9F6]/80 transition-colors group">
                      {/* Date & Time */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#10367D] font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#1A4594]/70" />
                          <span>{entry.dateTime}</span>
                        </div>
                      </td>

                      {/* Voucher / Ref */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[11px] text-[#10367D] whitespace-nowrap">
                        <span className="bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#10367D]/12">
                          {entry.voucherNo}
                        </span>
                      </td>

                      {/* Member Info */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold text-[#10367D] bg-white px-1.5 py-0.5 rounded border border-[#10367D]/15">
                            {entry.memberId}
                          </span>
                          <div>
                            <p className="font-sora font-extrabold text-xs text-[#10367D]">{entry.memberName}</p>
                            <p className="text-[10px] text-[#1A4594]/70">{entry.memberPhone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Work Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${catMeta.bg}`}>
                          <Icon className="w-3 h-3" />
                          {entry.workCategory}
                        </span>
                      </td>

                      {/* Project / Deal Reference */}
                      <td className="py-3.5 px-3 max-w-[220px]">
                        <p className="font-semibold text-xs text-[#10367D] truncate" title={entry.projectTitle}>
                          {entry.projectTitle}
                        </p>
                        {entry.notes && (
                          <p className="text-[10px] text-[#1A4594]/70 truncate mt-0.5" title={entry.notes}>
                            {entry.notes}
                          </p>
                        )}
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-3 text-right font-medium text-slate-600 whitespace-nowrap">
                        {entry.dealAmount > 0 ? formatINR(entry.dealAmount) : '—'}
                      </td>

                      {/* Commission Amount */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {entry.type === 'CREDIT' ? (
                          <span className="inline-flex items-center gap-1 font-sora font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                            +{formatINR(entry.commissionAmount)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-sora font-extrabold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <ArrowUpRight className="w-3 h-3 text-rose-600" />
                            -{formatINR(entry.commissionAmount)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {entry.status === 'In Wallet' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            In Wallet
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Cleared & Settled
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openVoucher(entry)}
                            title="View / Print Digital Voucher Receipt"
                            className="p-1.5 bg-white hover:bg-[#FAF9F6] border border-[#10367D]/15 rounded-lg text-[#10367D] transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#1A4594]" />
                          </button>
                          <button
                            onClick={() => openPassbook(entry.memberId)}
                            title="View Full Member Passbook"
                            className="p-1.5 bg-white hover:bg-[#FAF9F6] border border-[#10367D]/15 rounded-lg text-[#10367D] transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#10367D]" />
                          </button>
                          <button
                            onClick={() => openEditEntryModal(entry)}
                            title="Edit Commission Record"
                            className="p-1.5 bg-white hover:bg-[#FAF9F6] border border-[#10367D]/15 rounded-lg text-[#10367D] transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#10367D]" />
                          </button>
                          <button
                            onClick={() => requestDeleteEntry(entry)}
                            title="Delete Entry (Double Confirmation)"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 transition-colors cursor-pointer"
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
      {/* 1. ADD COMMISSION ENTRY MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#10367D]/15 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#10367D]/10">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Accounts Book • Entry Form
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Add Commission Record
                </h3>
                <p className="text-xs text-[#1A4594]/80">
                  Select member and work vertical. Amount will be automatically added to member's wallet.
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCommission} className="space-y-4 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Select Member *</label>
                <select
                  required
                  value={newCommission.memberId}
                  onChange={(e) => setNewCommission({ ...newCommission, memberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} — {m.name} ({m.phone}) • Current Wallet: {formatINR(m.walletBalance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">
                  Work / Vertical (Dropdown) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Solar', 'Real Estate', 'Course', 'Loan'] as WorkCategory[]).map(cat => {
                    const isSelected = newCommission.workCategory === cat;
                    const catMeta = getCategoryMeta(cat);
                    const Icon = catMeta.icon;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewCommission({ ...newCommission, workCategory: cat })}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#10367D] text-white border-[#10367D] shadow-md shadow-[#10367D]/20' 
                            : 'bg-[#FAF9F6] text-[#10367D] border-[#10367D]/15 hover:bg-[#10367D]/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#A5CEE0]' : 'text-[#1A4594]'}`} />
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Date & Time Stamp *</label>
                  <input
                    type="text"
                    required
                    value={newCommission.customDateTime}
                    onChange={(e) => setNewCommission({ ...newCommission, customDateTime: e.target.value })}
                    placeholder="e.g. 29 Aug 2026, 05:00 PM"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Deal / Project Amount (₹)</label>
                  <input
                    type="number"
                    value={newCommission.dealAmount}
                    onChange={(e) => setNewCommission({ ...newCommission, dealAmount: e.target.value })}
                    placeholder="e.g. 550000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1">
                  Commission Payout Amount (₹) * <span className="text-[10px] text-emerald-600 font-normal">(Directly added to member wallet)</span>
                </label>
                <input
                  type="number"
                  required
                  value={newCommission.commissionAmount}
                  onChange={(e) => setNewCommission({ ...newCommission, commissionAmount: e.target.value })}
                  placeholder="e.g. 20000"
                  className="w-full px-3.5 py-2.5 bg-emerald-50/50 rounded-xl border border-emerald-300 text-sm font-extrabold text-emerald-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Project / Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newCommission.projectTitle}
                  onChange={(e) => setNewCommission({ ...newCommission, projectTitle: e.target.value })}
                  placeholder="e.g. 10 KW Rooftop Solar EPC - Client: Ramesh Naidu"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Notes / Internal Reference</label>
                <input
                  type="text"
                  value={newCommission.notes}
                  onChange={(e) => setNewCommission({ ...newCommission, notes: e.target.value })}
                  placeholder="e.g. Milestone 2 payment approved by Sudheer Reddy"
                  className="w-full px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#10367D]/10">
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
                  Credit Commission to Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT COMMISSION ENTRY MODAL */}
      {/* ========================================================================= */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#10367D]/15 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#10367D]/10">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Commission Record
                </h3>
                <p className="text-xs text-[#1A4594]/80">
                  Voucher: <strong className="font-mono text-[#10367D]">{editingEntry.voucherNo}</strong> • Member: {editingEntry.memberName}
                </p>
              </div>
              <button 
                onClick={() => setEditingEntry(null)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditEntrySubmit} className="space-y-4 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Work / Vertical *</label>
                <select
                  value={editEntryForm.workCategory}
                  onChange={(e) => setEditEntryForm({ ...editEntryForm, workCategory: e.target.value as WorkCategory })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                >
                  <option value="Solar">Solar Energy</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Course">Course & Franchise</option>
                  <option value="Loan">Loan & Microfinance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Project / Description *</label>
                <input
                  type="text"
                  required
                  value={editEntryForm.projectTitle}
                  onChange={(e) => setEditEntryForm({ ...editEntryForm, projectTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Deal Amount (₹)</label>
                  <input
                    type="number"
                    value={editEntryForm.dealAmount}
                    onChange={(e) => setEditEntryForm({ ...editEntryForm, dealAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-800 mb-1">Commission Figure (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editEntryForm.commissionAmount}
                    onChange={(e) => setEditEntryForm({ ...editEntryForm, commissionAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-emerald-50/50 rounded-xl border border-emerald-300 text-sm font-extrabold text-emerald-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Date & Time Stamp</label>
                <input
                  type="text"
                  value={editEntryForm.customDateTime}
                  onChange={(e) => setEditEntryForm({ ...editEntryForm, customDateTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Notes / Ledger Remarks</label>
                <input
                  type="text"
                  value={editEntryForm.notes}
                  onChange={(e) => setEditEntryForm({ ...editEntryForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step review modal before applying changes. Member wallet balances will adjust accordingly.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#10367D]/10">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
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

      {/* ========================================================================= */}
      {/* 3. SETTLE / CLEAR WALLET MODAL */}
      {/* ========================================================================= */}
      {showClearModal && activeMember && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#10367D]/10">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Accounts Book • Wallet Clearance
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Clear Member Wallet Payout
                </h3>
                <p className="text-xs text-[#1A4594]/80">
                  Settle wallet balance for <strong>{activeMember.name} ({activeMember.id})</strong>.
                </p>
              </div>
              <button 
                onClick={() => setShowClearModal(false)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClearWallet} className="space-y-3.5 text-xs pt-1">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Current Wallet Balance
                  </p>
                  <p className="font-sora font-extrabold text-2xl text-emerald-900 mt-0.5">
                    {formatINR(activeMember.walletBalance)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-700">Lifetime Earned</p>
                  <p className="font-bold text-xs text-emerald-800">{formatINR(activeMember.totalEarned)}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Clearance Amount (₹) *</label>
                <input
                  type="number"
                  required
                  max={activeMember.walletBalance}
                  min={1}
                  value={clearanceForm.amount}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-sm font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Payout Method *</label>
                <select
                  value={clearanceForm.payoutMethod}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, payoutMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                >
                  <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank NEFT / IMPS Transfer">Bank NEFT / IMPS Transfer</option>
                  <option value="Cash Office Clearance">Cash Office Clearance</option>
                  <option value="Cheque Payment">Cheque Payment</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Transaction Ref / UTR No. *</label>
                <input
                  type="text"
                  required
                  value={clearanceForm.payoutRef}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, payoutRef: e.target.value })}
                  placeholder="e.g. UPI-REF-9849204812 / NEFT-294819"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Admin Clearance Notes</label>
                <input
                  type="text"
                  value={clearanceForm.notes}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#10367D]/10">
                <button
                  type="button"
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Confirm & Clear Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MEMBER DIGITAL PASSBOOK MODAL */}
      {/* ========================================================================= */}
      {showPassbookModal && activeMember && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-[#10367D]/15 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10367D]/12 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#10367D] text-white flex items-center justify-center font-sora font-extrabold text-base shadow-md shadow-[#10367D]/20">
                  {activeMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#10367D] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#10367D]/15">
                      {activeMember.id}
                    </span>
                    <h3 className="font-sora font-extrabold text-lg text-[#10367D]">
                      {activeMember.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#1A4594]/80 mt-0.5">
                    {activeMember.phone} • {activeMember.email} • {activeMember.tier}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] rounded-xl text-xs font-bold border border-[#10367D]/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Passbook</span>
                </button>
                <button
                  onClick={() => setShowPassbookModal(false)}
                  className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/10">
                <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Total Earned</p>
                <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">
                  {formatINR(activeMember.totalEarned)}
                </p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-800 uppercase">Available In Wallet</p>
                <p className="font-sora font-extrabold text-lg text-emerald-900 mt-0.5">
                  {formatINR(activeMember.walletBalance)}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-600 uppercase">Total Cleared</p>
                <p className="font-sora font-extrabold text-lg text-slate-800 mt-0.5">
                  {formatINR(activeMember.totalCleared)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-sora font-bold text-xs text-[#10367D] mb-2 uppercase tracking-wider">
                Passbook Statement & Audit Trail
              </h4>
              <div className="border border-[#10367D]/12 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#10367D]/10 text-[10px] uppercase font-bold text-[#1A4594]/70">
                    <tr>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Voucher Ref</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Project / Details</th>
                      <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                      <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#10367D]/8">
                    {entries
                      .filter(e => e.memberId === activeMember.id)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF9F6]">
                          <td className="py-3 px-3 font-medium text-[#10367D] whitespace-nowrap">{item.dateTime}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[11px] text-[#10367D]">{item.voucherNo}</td>
                          <td className="py-3 px-3 font-bold text-[11px] text-[#10367D]">{item.workCategory}</td>
                          <td className="py-3 px-3 max-w-[200px] truncate text-[#10367D] font-medium" title={item.projectTitle}>
                            {item.projectTitle}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-700">
                            {item.type === 'CREDIT' ? `+${formatINR(item.commissionAmount)}` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-rose-700">
                            {item.type === 'DEBIT_CLEARANCE' ? `-${formatINR(item.commissionAmount)}` : '—'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.status === 'In Wallet' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-[#10367D]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#1A4594]/80 gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Build Bharat Official Accounts Book • Managed by Sudheer Reddy</span>
              </div>

              {activeMember.walletBalance > 0 && (
                <button
                  onClick={() => {
                    setShowPassbookModal(false);
                    openClearanceModal(activeMember);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                >
                  Clear Available Balance ({formatINR(activeMember.walletBalance)})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DIGITAL COMMISSION VOUCHER / RECEIPT MODAL */}
      {/* ========================================================================= */}
      {showVoucherModal && activeEntry && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center pb-4 border-b border-[#10367D]/10 relative">
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="absolute right-0 top-0 p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-mono text-[10px] font-bold text-[#1A4594]/80 tracking-widest uppercase">
                COMMISSION VOUCHER & LEDGER RECEIPT
              </span>
              <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                Build Bharat Synergy Partners
              </h3>
              <p className="text-[11px] text-[#1A4594]/70 font-mono mt-0.5">
                Voucher No: <strong className="text-[#10367D]">{activeEntry.voucherNo}</strong>
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#10367D]/10 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#10367D]/10">
                <span className="text-[#1A4594]/80">Member Beneficiary:</span>
                <span className="font-sora font-extrabold text-[#10367D] text-sm">
                  {activeEntry.memberName} ({activeEntry.memberId})
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#10367D]/10">
                <span className="text-[#1A4594]/80">Work Category:</span>
                <span className="font-bold text-[#10367D]">{activeEntry.workCategory}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#10367D]/10">
                <span className="text-[#1A4594]/80">Project Description:</span>
                <span className="font-bold text-[#10367D] truncate max-w-[200px]">{activeEntry.projectTitle}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#10367D]/10">
                <span className="text-[#1A4594]/80">Transaction Type:</span>
                <span className={`font-bold ${activeEntry.type === 'CREDIT' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {activeEntry.type === 'CREDIT' ? 'Commission Credit (+)' : 'Wallet Debit Payout (-)'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm">
                <span className="font-bold text-[#10367D]">Voucher Amount:</span>
                <span className="font-sora font-extrabold text-xl text-emerald-800">
                  {formatINR(activeEntry.commissionAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs border border-[#10367D]/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Voucher
              </button>
              <button
                onClick={() => {
                  const phone = (activeEntry.memberPhone || '').replace(/[^0-9]/g, '');
                  const msg = `Official Commission Voucher from Build Bharat:\n\nVoucher Ref: ${activeEntry.voucherNo}\nMember: ${activeEntry.memberName} (${activeEntry.memberId})\nProject: ${activeEntry.projectTitle}\nAmount: ${formatINR(activeEntry.commissionAmount)}\nStatus: ${activeEntry.status}\n\nProcessed by Build Bharat SuperAdmin Sudheer Reddy.`;
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
