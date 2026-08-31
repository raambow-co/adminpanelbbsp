import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal, type CertificateMember } from '../components/MemberCertificateModal';
import { 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  Download, 
  Send,
  CheckCircle2
} from 'lucide-react';

interface EnquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  query: string;
  feePaid: string;
  timestamp: string;
  status: 'Pending' | 'Contacted' | 'Approved' | 'Resolved';
  state: string;
}

const mockEnquiries: EnquiryItem[] = [
  {
    id: 'BBSP-001',
    name: 'Aditya Nandyala',
    phone: '+91 75699 28327',
    email: 'aditya.nandyala@gmail.com',
    category: 'New Member Registration',
    query: 'Submitted new membership registration form and paid ₹5,000 fee. Awaiting admin approval.',
    feePaid: '₹5,000 (Paid)',
    timestamp: '10 mins ago',
    status: 'Pending',
    state: 'Hyderabad'
  },
  {
    id: 'BBSP-002',
    name: 'Rajesh Nandyala',
    phone: '+91 94933 03499',
    email: 'rajesh.nandyala@gmail.com',
    category: 'Premium Member',
    query: 'Paid ₹5,000 membership fee via online UPI. Account verification completed.',
    feePaid: '₹5,000 (Paid)',
    timestamp: '35 mins ago',
    status: 'Approved',
    state: 'Nandyal'
  },
  {
    id: 'BBSP-003',
    name: 'Yuvan Datti',
    phone: '+91 76748 77337',
    email: 'yuvan.datti@gmail.com',
    category: 'Gold Member',
    query: 'Registered online for membership. ₹5,000 payment received.',
    feePaid: '₹5,000 (Paid)',
    timestamp: '1 hour ago',
    status: 'Approved',
    state: 'Visakhapatnam'
  },
  {
    id: 'BBSP-004',
    name: 'Alisha',
    phone: '+91 81257 37275',
    email: 'alisha.k@gmail.com',
    category: 'Executive Member',
    query: 'Submitted member form with ₹5,000 payment receipt. Requested profile activation.',
    feePaid: '₹5,000 (Paid)',
    timestamp: '2 hours ago',
    status: 'Pending',
    state: 'Bengaluru'
  }
];

export function CustomerEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(mockEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
    showToast(`Application for ${name} (ID: ${id}) successfully Approved!`);
  };

  const openCertificate = (enq: EnquiryItem) => {
    setCertificateMember({
      id: enq.id,
      name: enq.name,
      phone: enq.phone,
      email: enq.email,
      amountPaid: enq.feePaid,
      state: enq.state,
      date: 'Today, 29 Aug 2026'
    });
  };

  const filtered = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.phone.includes(searchTerm) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
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

      <PageHeader 
        title="Customer Inquiries"
        description="Stream of website member registrations with sequential IDs (BBSP-001, BBSP-002...)."
        badge={`${enquiries.length} Inquiries`}
        action={
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export Inquiries
          </button>
        }
      />

      <div className="bbsp-card p-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-96">
          <Search className="w-4 h-4 text-[#1A4594]/70" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by ID, name, phone, city..."
            className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {filtered.map((enq) => (
          <div key={enq.id} className="bbsp-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#10367D] bg-[#FAF9F6] px-2.5 py-0.5 rounded border border-[#10367D]/15 shadow-sm">
                  {enq.id}
                </span>
                <h4 className="font-sora font-extrabold text-base text-[#10367D]">{enq.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D]">
                  {enq.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {enq.feePaid}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#10367D]/90">
                {enq.query}
              </p>

              <div className="flex items-center gap-4 text-xs text-[#1A4594]/80 flex-wrap">
                <a href={`tel:${enq.phone}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                  <Phone className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.phone}
                </a>
                <a href={`mailto:${enq.email}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                  <Mail className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.email}
                </a>
                <span className="text-[#10367D] font-medium">{enq.state}</span>
                <span className="text-[#1A4594]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {enq.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#10367D]/10">
              <button
                onClick={() => openCertificate(enq)}
                title="Generate Quotation & Send on WhatsApp"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quotation</span>
              </button>

              <a
                href={`tel:${enq.phone}`}
                className="px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15 text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#10367D]" /> Call
              </a>

              {enq.status === 'Approved' ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Approved
                </span>
              ) : (
                <button
                  onClick={() => handleApprove(enq.id, enq.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold shadow-sm flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-[#A5CEE0]" /> Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
