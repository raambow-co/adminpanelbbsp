import { db, collection, doc, updateDoc, onSnapshot, query, orderBy } from '../lib/firebase';
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
  Inbox
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal } from '../components/MemberCertificateModal';
import type { CertificateMember } from '../components/MemberCertificateModal';
import { 
  INITIAL_SUBMISSIONS, 
  FORM_TYPE_CONFIG 
} from '../data/mockData';
import type { 
  UnifiedSubmission
} from '../data/mockData';

export function CustomerEnquiries() {
  const [enquiries, setEnquiries] = useState<UnifiedSubmission[]>(INITIAL_SUBMISSIONS);

  useEffect(() => {
    try {
      const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const liveList = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as UnifiedSubmission[];
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
      id: enq.id,
      name: enq.applicantName,
      phone: enq.phone,
      email: enq.email,
      amountPaid: enq.amountPaid || enq.processingFee || enq.requiredAmount || 'Verified',
      state: enq.city + (enq.state ? `, ${enq.state}` : ''),
      date: 'Today'
    });
  };

  const filtered = enquiries.filter(e => {
    const matchesSearch = 
      e.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.businessName && e.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.mapEnquiryMessage && e.mapEnquiryMessage.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.mapServiceInterest && e.mapServiceInterest.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedFormType === 'all' || e.formType === selectedFormType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 relative text-left font-sans">
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
        title="Customer Inquiries Stream"
        description="Real-time multi-channel feed of all inbound leads, loan requests, site visit bookings, and map desk inquiries."
        badge={`${enquiries.length} Inquiries`}
        action={
          <button 
            onClick={() => showToast('Exported inquiries feed to CSV.')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Inquiries
          </button>
        }
      />

      {/* FORM TYPE CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Inbound Channels' },
          { id: 'map-enquiry', label: 'Map & HQ Desk' },
          { id: 'partner-registration', label: 'Synergy Partners' },
          { id: 'formal-loan', label: '7-Stage Loans' },
          { id: 'quick-loan', label: 'Quick Loans' },
          { id: 'real-estate-enquiry', label: 'Real Estate Visits' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFormType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
              selectedFormType === tab.id
                ? 'bg-[#10367D] text-white border-[#10367D] shadow-sm'
                : 'bg-white text-[#10367D] border-[#10367D]/15 hover:bg-[#FAF9F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bbsp-card p-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-96">
          <Search className="w-4 h-4 text-[#1A4594]/70" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by ID, Name, Phone, City, Message..."
            className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
          />
        </div>
      </div>

      <div className="space-y-3.5">
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
            const config = FORM_TYPE_CONFIG[enq.formType];

            return (
              <div key={enq.id} className="bbsp-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-[#10367D] bg-[#FAF9F6] px-2.5 py-0.5 rounded border border-[#10367D]/15 shadow-sm">
                      {enq.id}
                    </span>
                    <h4 className="font-sora font-extrabold text-base text-[#10367D]">{enq.applicantName}</h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
                      {config.label}
                    </span>
                    {enq.amountPaid && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {enq.amountPaid} Verified Deposit
                      </span>
                    )}
                    {enq.requiredAmount && !enq.amountPaid && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#10367D] border border-blue-200">
                        {enq.requiredAmount} Capital Req
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
                    <a href={`tel:${enq.phone}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                      <Phone className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.phone}
                    </a>
                    <a href={`mailto:${enq.email}`} className="font-bold text-[#10367D] flex items-center gap-1 hover:underline">
                      <Mail className="w-3.5 h-3.5 text-[#1A4594]" /> {enq.email}
                    </a>
                    <span className="text-stone-700 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" /> {enq.city}{enq.state ? `, ${enq.state}` : ''}
                    </span>
                    <span className="text-[#1A4594]/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {enq.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#10367D]/10">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.applicantName}, Build Bharat Team is responding to your enquiry #${enq.id}. How can we assist you today?`)}`}
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
                      <span>Certificate</span>
                    </button>
                  )}

                  <a
                    href={`tel:${enq.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15 text-xs font-bold flex items-center gap-1 cursor-pointer text-decoration-none"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#10367D]" /> Call
                  </a>

                  {enq.status === 'Approved' || enq.status === 'Sanctioned' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(enq.id, enq.applicantName)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#A5CEE0]" /> Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
