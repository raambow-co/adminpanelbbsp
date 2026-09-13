import { db, collection, onSnapshot } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Coins, 
  ArrowUpRight, 
  Phone,
  CreditCard,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { MemberCertificateModal } from '../components/MemberCertificateModal';
import type { CertificateMember } from '../components/MemberCertificateModal';
import { 
  INITIAL_SUBMISSIONS, 
  FORM_TYPE_CONFIG 
} from '../data/mockData';
import type { 
  UnifiedSubmission 
} from '../data/mockData';

export function Dashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<UnifiedSubmission[]>(INITIAL_SUBMISSIONS);

  useEffect(() => {
    try {
      const q = collection(db, 'submissions');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const liveList = snapshot.docs.map(d => {
          const data = d.data() || {};
          return {
            id: d.id,
            formType: data.formType || 'map-enquiry',
            formName: data.formName || 'Submission',
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
        console.warn('Firestore live dashboard listener notice:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore init notice:', e);
    }
  }, []);
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // KPIs
  const totalSubmissions = submissions.length;
  const mapDeskLeads = submissions.filter(s => s?.formType === 'map-enquiry').length;
  const partnerRegistrations = submissions.filter(s => s?.formType === 'partner-registration').length;
  const totalVerifiedRevenue = partnerRegistrations * 5000;
  const totalLoansRequestedCr = (submissions
    .filter(s => Boolean(s?.requiredAmount))
    .reduce((acc, curr) => {
      const num = parseInt((curr.requiredAmount || '').replace(/[^0-9]/g, '') || '0', 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0) / 10000000).toFixed(2);

  return (
    <div className="space-y-6 text-left font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">{toast}</span>
        </div>
      )}

      {/* Certificate Modal */}
      {certificateMember && (
        <MemberCertificateModal
          member={certificateMember}
          onClose={() => setCertificateMember(null)}
          onSentToast={showToast}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Executive Overview" 
        description="Consolidated pipeline across Map HQ Desk, Synergy Partner Registrations, Formal Loan Dossiers, and Real Estate Inquiries."
        badge="Multi-Channel Active"
      />

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Applications */}
        <div className="bbsp-card p-5 space-y-2 border-l-4 border-l-[#10367D]">
          <div className="flex items-center justify-between text-[#1A4594]/70 text-xs font-bold">
            <span>Total Inbound Leads</span>
            <FileText className="w-4 h-4 text-[#10367D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-sora font-extrabold text-[#10367D]">
            {totalSubmissions}
          </div>
          <div className="text-[11px] text-[#1A4594]/60 font-medium">
            Across 5 Web Form Entrypoints
          </div>
        </div>

        {/* Card 2: Map Desk & HQ Leads */}
        <div className="bbsp-card p-5 space-y-2 border-l-4 border-l-[#D57530]">
          <div className="flex items-center justify-between text-[#1A4594]/70 text-xs font-bold">
            <span>Map Desk & HQ Leads</span>
            <MapPin className="w-4 h-4 text-[#D57530]" />
          </div>
          <div className="text-2xl sm:text-3xl font-sora font-extrabold text-amber-800">
            {mapDeskLeads}
          </div>
          <div className="text-[11px] text-[#1A4594]/60 font-medium">
            Interactive Map Section Queries
          </div>
        </div>

        {/* Card 3: Partner Registrations */}
        <div className="bbsp-card p-5 space-y-2 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-[#1A4594]/70 text-xs font-bold">
            <span>Partner Onboardings</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-sora font-extrabold text-emerald-700">
            {partnerRegistrations}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            ₹{totalVerifiedRevenue.toLocaleString('en-IN')} Verified Fees
          </div>
        </div>

        {/* Card 4: Loan Pipeline Volume */}
        <div className="bbsp-card p-5 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-[#1A4594]/70 text-xs font-bold">
            <span>Loan Pipeline Volume</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-sora font-extrabold text-[#10367D]">
            ₹{totalLoansRequestedCr} Cr
          </div>
          <div className="text-[11px] text-blue-700 font-medium">
            Active Underwriting & Sanction
          </div>
        </div>

      </div>

      {/* FORM TYPE BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Map HQ Desk Form */}
        <div className="bbsp-card p-5 space-y-3 bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#D57530] uppercase">Map HQ Desk</span>
            <MapPin className="w-4 h-4 text-[#D57530]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sora font-bold text-sm text-[#10367D]">Instant Site Queries</h4>
            <p className="text-[11px] text-stone-600 leading-snug">
              Hayath Nagar HQ enquiries for loans, solar, real estate & franchise.
            </p>
          </div>
          <button
            onClick={() => navigate('/enquiries')}
            className="w-full py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-amber-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Map Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Synergy Partner Registration */}
        <div className="bbsp-card p-5 space-y-3 bg-gradient-to-br from-[#10367D]/5 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#10367D] uppercase">₹5,000 Partner</span>
            <Users className="w-4 h-4 text-[#10367D]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sora font-bold text-sm text-[#10367D]">Synergy Partners</h4>
            <p className="text-[11px] text-stone-600 leading-snug">
              Audited Solar, Loans, Realty & EdTech channel partners.
            </p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="w-full py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Registrations</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7-Stage Formal Loan */}
        <div className="bbsp-card p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase">Formal Loan</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sora font-bold text-sm text-[#10367D]">7-Stage Loan Dossier</h4>
            <p className="text-[11px] text-stone-600 leading-snug">
              Complete borrower KYC, nominee, upline code, and legal verification.
            </p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="w-full py-2 bg-white hover:bg-[#FAF9F6] text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Loan Dossiers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Estate & Quick Leads */}
        <div className="bbsp-card p-5 space-y-3 bg-gradient-to-br from-purple-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700 uppercase">Realty & Leads</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sora font-bold text-sm text-[#10367D]">Site Visits & Leads</h4>
            <p className="text-[11px] text-stone-600 leading-snug">
              Fast commercial real estate inquiries & quick digital loan requests.
            </p>
          </div>
          <button
            onClick={() => navigate('/enquiries')}
            className="w-full py-2 bg-white hover:bg-[#FAF9F6] text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Inquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* RECENT INBOUND SUBMISSIONS TABLE */}
      <div className="bbsp-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-sora font-extrabold text-[#10367D]">
              Recent Multi-Channel Submissions
            </h3>
            <p className="text-xs text-[#1A4594]/70 mt-0.5">
              Live inbound stream from Website Map Section, Partnership Form & Loan Desk.
            </p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="text-xs font-bold text-[#10367D] hover:underline flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#10367D]/10 text-[#10367D] font-sora font-extrabold uppercase text-[10px] tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Source Channel</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Value / Req</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/5 text-[#10367D]">
              {submissions.slice(0, 5).map((item) => {
                const config = FORM_TYPE_CONFIG[item.formType] || {
                  label: item.formType || 'Submission',
                  shortCode: 'SUB',
                  sourceFile: '',
                  badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
                  description: 'Inbound Submission'
                };

                const safePhone = (item.phone || '').replace(/[^0-9]/g, '');
                const safeApplicant = item.applicantName || 'Applicant';
                const safeId = item.id || '';

                return (
                  <tr key={item.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="p-3 font-mono font-bold">{safeId}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{safeApplicant}</td>
                    <td className="p-3 text-[#1A4594]/80">{item.city || 'N/A'}</td>
                    <td className="p-3 font-mono font-bold">
                      {item.amountPaid || item.requiredAmount || item.budgetRange || 'Inquiry'}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#10367D] border border-blue-200">
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${safePhone}?text=${encodeURIComponent(`Hello ${safeApplicant}, Build Bharat Team is reviewing your submission ${safeId}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-decoration-none"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${item.phone || ''}`}
                          title="Call"
                          className="p-1.5 rounded-lg bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 text-decoration-none"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
