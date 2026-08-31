import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal, type CertificateMember } from '../components/MemberCertificateModal';
import { 
  Users, 
  MousePointerClick, 
  UserPlus, 
  UserCheck, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  Mail, 
  Eye, 
  Check, 
  X, 
  Send,
  CheckCircle2,
  BookOpenCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  category: string;
  details: string;
  timestamp: string;
  amountPaid: string;
  status: 'Pending Review' | 'Contacted' | 'Approved' | 'Follow Up';
  state: string;
}

const initialEnquiries: CustomerEnquiry[] = [
  {
    id: 'BBSP-001',
    customerName: 'Aditya Nandyala',
    phone: '+91 75699 28327',
    email: 'aditya.nandyala@gmail.com',
    category: 'New Member Registration',
    details: 'Submitted new membership registration and paid ₹5,000 fee. Awaiting admin approval.',
    timestamp: '10 mins ago',
    amountPaid: '₹5,000',
    status: 'Pending Review',
    state: 'Hyderabad'
  },
  {
    id: 'BBSP-002',
    customerName: 'Rajesh Nandyala',
    phone: '+91 94933 03499',
    email: 'rajesh.nandyala@gmail.com',
    category: 'Premium Member',
    details: 'Paid ₹5,000 membership fee via online UPI. Account verification completed.',
    timestamp: '35 mins ago',
    amountPaid: '₹5,000',
    status: 'Approved',
    state: 'Nandyal'
  },
  {
    id: 'BBSP-003',
    customerName: 'Yuvan Datti',
    phone: '+91 76748 77337',
    email: 'yuvan.datti@gmail.com',
    category: 'Gold Member',
    details: 'Registered online for membership. ₹5,000 payment received.',
    timestamp: '1 hour ago',
    amountPaid: '₹5,000',
    status: 'Approved',
    state: 'Visakhapatnam'
  },
  {
    id: 'BBSP-004',
    customerName: 'Alisha',
    phone: '+91 81257 37275',
    email: 'alisha.k@gmail.com',
    category: 'Executive Member',
    details: 'Submitted member form with ₹5,000 payment receipt. Requested profile activation.',
    timestamp: '2 hours ago',
    amountPaid: '₹5,000',
    status: 'Pending Review',
    state: 'Bengaluru'
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [manualCount, setManualCount] = useState<number>(3);
  const [totalMembersCount, setTotalMembersCount] = useState<number>(18);

  useEffect(() => {
    try {
      const savedManual = localStorage.getItem('bbsp_manual_members');
      if (savedManual) {
        const parsed = JSON.parse(savedManual);
        setManualCount(parsed.length);
      }
      const savedMembers = localStorage.getItem('bbsp_members_directory');
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        setTotalMembersCount(parsed.length + 12);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveEnquiry = (id: string, name: string) => {
    setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
    triggerToast(`Membership for ${name} (ID: ${id}) successfully Approved!`);
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const openCertificate = (enq: CustomerEnquiry) => {
    setCertificateMember({
      id: enq.id,
      name: enq.customerName,
      phone: enq.phone,
      email: enq.email,
      amountPaid: enq.amountPaid,
      state: enq.state,
      date: 'Today, 29 Aug 2026'
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toastMessage}</span>
        </div>
      )}

      {/* Certificate / Quotation Modal */}
      {certificateMember && (
        <MemberCertificateModal
          member={certificateMember}
          onClose={() => setCertificateMember(null)}
          onSentToast={triggerToast}
        />
      )}

      {/* Top Banner / Executive Header */}
      <PageHeader 
        title="Dashboard" 
        description="Welcome back, Sudheer Reddy Anna. Here is today's member summary."
        badge="Admin"
        action={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/accounts')}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <BookOpenCheck className="w-3.5 h-3.5 text-emerald-700" />
              Accounts Book
            </button>
            <button 
              onClick={() => setShowProposalsModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#1A4594]" />
              Today's Applications (4)
            </button>
            <button 
              onClick={() => navigate('/applications')}
              className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A5CEE0]" />
              View All Applications
            </button>
          </div>
        }
      />

      {/* 4 SIDE-BY-SIDE SECTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Section 1: Customer Clicks & Actions Today */}
        <div 
          onClick={() => triggerToast("Customer Clicks: 142 website visits and clicks today.")}
          className="bbsp-card p-5 cursor-pointer hover:border-[#10367D]/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10367D]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#10367D]/10 border border-[#10367D]/20 text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Today
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
              Customer Clicks Today
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              142
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              Website page visits and clicks
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-semibold text-[#10367D]/80">
              <span>Member Page: 94</span>
              <span>Inquiries: 48</span>
            </div>
          </div>
        </div>

        {/* Section 2: Members Joined Today */}
        <div 
          onClick={() => setShowProposalsModal(true)}
          className="bbsp-card p-5 cursor-pointer hover:border-[#10367D]/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#A5CEE0]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#A5CEE0]/25 border border-[#A5CEE0] text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +2 Today
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
              Joined Today
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              2
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              New members joined today (₹5,000 paid)
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-semibold text-[#10367D]/80">
              <span>BBSP-001 Aditya</span>
              <span>BBSP-002 Rajesh</span>
            </div>
          </div>
        </div>

        {/* Section 3: Total Existing Members */}
        <div 
          onClick={() => navigate('/members')}
          className="bbsp-card p-5 cursor-pointer hover:border-[#10367D]/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#80B5CE]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#80B5CE]/25 border border-[#80B5CE] text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/20">
              All Members
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
              Total Existing Members
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              {totalMembersCount}
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              Sequential IDs (BBSP-001 to BBSP-{String(totalMembersCount).padStart(3, '0')})
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-semibold text-[#10367D]/80">
              <span>{Math.max(0, totalMembersCount - manualCount)} Online</span>
              <span>{manualCount} Offline</span>
            </div>
          </div>
        </div>

        {/* Section 4: Manual Members (Offline) */}
        <div 
          onClick={() => navigate('/manual-members')}
          className="bbsp-card p-5 cursor-pointer hover:border-[#10367D]/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#5A9CBE]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#5A9CBE]/25 border border-[#5A9CBE] text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Offline
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
              Manual Members
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              {manualCount}
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              Sequential BBSP-007 to BBSP-{String(6 + manualCount).padStart(3, '0')}
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-semibold text-[#10367D]/80">
              <span>Direct Entry</span>
              <span>₹{(manualCount * 5000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OPERATIONAL FEED: CUSTOMER ENQUIRIES */}
      <div className="bbsp-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#10367D]/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sora font-extrabold text-lg text-[#10367D] tracking-tight">
                Customer Enquiries & Applications
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-[#1A4594]/80 mt-0.5">
              Live sequential membership inquiries with contact numbers and fee status
            </p>
          </div>

          <button 
            onClick={() => setShowProposalsModal(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FAF9F6] text-[#10367D] hover:bg-[#10367D]/10 border border-[#10367D]/15 transition-all flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of Enquiries with Unique Sequential IDs */}
        <div className="mt-5 space-y-3.5">
          {enquiries.map((enq) => (
            <div 
              key={enq.id}
              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#10367D]/12 hover:bg-white hover:border-[#10367D]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-[#10367D] bg-white px-2 py-0.5 rounded border border-[#10367D]/15 shadow-sm">
                    {enq.id}
                  </span>
                  <h4 className="font-sora font-extrabold text-sm text-[#10367D]">
                    {enq.customerName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15">
                    {enq.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {enq.amountPaid} Paid
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#10367D]/90">
                  {enq.details}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#1A4594]/80 flex-wrap">
                  <a href={`tel:${enq.phone}`} className="flex items-center gap-1 font-bold hover:text-[#10367D]">
                    <Phone className="w-3 h-3 text-[#10367D]" />
                    {enq.phone}
                  </a>
                  <a href={`mailto:${enq.email}`} className="flex items-center gap-1 font-bold hover:text-[#10367D]">
                    <Mail className="w-3 h-3 text-[#10367D]" />
                    {enq.email}
                  </a>
                  <span className="text-[10px] font-semibold text-[#10367D]">{enq.state}</span>
                  <span className="flex items-center gap-1 text-[#1A4594]/60">
                    <Clock className="w-3 h-3" />
                    {enq.timestamp}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#10367D]/10">
                <button
                  onClick={() => openCertificate(enq)}
                  title="Generate Quotation & Send on WhatsApp"
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Quotation</span>
                </button>

                <button
                  onClick={() => setSelectedEnquiry(enq)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1A4594]" />
                  <span>Review</span>
                </button>

                {enq.status === 'Approved' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Approved
                  </span>
                ) : (
                  <button
                    onClick={() => handleApproveEnquiry(enq.id, enq.customerName)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-[#A5CEE0]" />
                    <span>Approve</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-[#10367D]/10">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#10367D]/10 text-[#10367D]">
                  {selectedEnquiry.id} • {selectedEnquiry.category}
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  {selectedEnquiry.customerName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/10 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Sequential Member ID:</span>
                  <span className="font-mono font-extrabold text-sm text-[#10367D]">{selectedEnquiry.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Mobile Number:</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#10367D]" /> {selectedEnquiry.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Email Address:</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#10367D]" /> {selectedEnquiry.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Fee Paid:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedEnquiry.amountPaid} (Payment Verified)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Location:</span>
                  <span className="font-bold text-[#10367D]">{selectedEnquiry.state}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Details:</label>
                <p className="p-3.5 bg-[#FAF9F6] rounded-xl text-[#10367D] border border-[#10367D]/10 font-medium leading-relaxed">
                  {selectedEnquiry.details}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-[#10367D]/10">
              <button
                onClick={() => {
                  const target = selectedEnquiry;
                  setSelectedEnquiry(null);
                  openCertificate(target);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Generate Quotation & Send on WhatsApp</span>
              </button>

              {selectedEnquiry.status !== 'Approved' ? (
                <button
                  onClick={() => handleApproveEnquiry(selectedEnquiry.id, selectedEnquiry.customerName)}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-[#A5CEE0]" />
                  <span>Approve Member</span>
                </button>
              ) : (
                <div className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved by Sudheer Reddy Anna</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK PROPOSALS MODAL */}
      {showProposalsModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-[#10367D]/15 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#10367D]/10">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ₹5,000 Fee Paid Verified
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Today's Applications ({enquiries.length})
                </h3>
                <p className="text-xs text-[#1A4594]/80">
                  Sequential ID sequence (BBSP-001 to BBSP-004) for Sudheer Reddy Anna
                </p>
              </div>
              <button 
                onClick={() => setShowProposalsModal(false)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {enquiries.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#10367D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#10367D] bg-white px-2 py-0.5 rounded border border-[#10367D]/15">
                        {p.id}
                      </span>
                      <p className="font-sora font-extrabold text-sm text-[#10367D]">{p.customerName}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {p.amountPaid} Paid
                      </span>
                    </div>
                    <p className="text-xs text-[#10367D]/90 font-semibold">{p.category}</p>
                    <div className="flex items-center gap-4 text-xs text-[#1A4594]/80">
                      <span className="font-bold flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>
                      <span className="font-bold flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowProposalsModal(false);
                        openCertificate(p);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp Quotation</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEnquiry(p);
                        setShowProposalsModal(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#10367D]/15 text-xs font-bold text-[#10367D] hover:bg-[#FAF9F6]"
                    >
                      Review
                    </button>
                    
                    {p.status === 'Approved' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproveEnquiry(p.id, p.customerName)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#10367D] text-white text-xs font-bold hover:bg-[#1A4594]"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#10367D]/10 flex justify-end">
              <button
                onClick={() => {
                  setShowProposalsModal(false);
                  navigate('/applications');
                }}
                className="px-4 py-2 bg-[#10367D] text-white rounded-xl text-xs font-bold"
              >
                Go to Applications Management
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
