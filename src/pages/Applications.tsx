import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MemberCertificateModal, type CertificateMember } from '../components/MemberCertificateModal';
import { 
  Search, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  Check, 
  X, 
  UserCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  Filter, 
  ArrowUpRight,
  Send
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  applicantName: string;
  phone: string;
  email: string;
  amountPaid: string;
  state: string;
  submissionDate: string;
  status: 'Approved' | 'In Review';
  isExistingMember: boolean;
}

const initialApplications: ApplicationItem[] = [
  {
    id: 'BBSP-001',
    applicantName: 'Aditya Nandyala',
    phone: '+91 75699 28327',
    email: 'aditya.nandyala@gmail.com',
    amountPaid: '₹5,000',
    state: 'Hyderabad',
    submissionDate: 'Today, 14:20',
    status: 'In Review',
    isExistingMember: false
  },
  {
    id: 'BBSP-002',
    applicantName: 'Rajesh Nandyala',
    phone: '+91 94933 03499',
    email: 'rajesh.nandyala@gmail.com',
    amountPaid: '₹5,000',
    state: 'Nandyal',
    submissionDate: 'Today, 11:05',
    status: 'Approved',
    isExistingMember: true
  },
  {
    id: 'BBSP-003',
    applicantName: 'Yuvan Datti',
    phone: '+91 76748 77337',
    email: 'yuvan.datti@gmail.com',
    amountPaid: '₹5,000',
    state: 'Visakhapatnam',
    submissionDate: 'Today, 09:30',
    status: 'Approved',
    isExistingMember: false
  },
  {
    id: 'BBSP-004',
    applicantName: 'Alisha',
    phone: '+91 81257 37275',
    email: 'alisha.k@gmail.com',
    amountPaid: '₹5,000',
    state: 'Bengaluru',
    submissionDate: 'Today, 08:15',
    status: 'In Review',
    isExistingMember: false
  }
];

export function Applications() {
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'approved' | 'unapproved' | 'existing'>('all');
  const [activeModalApp, setActiveModalApp] = useState<ApplicationItem | null>(null);
  const [certificateMember, setCertificateMember] = useState<CertificateMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'Approved' } : app));
    showToast(`Application for ${name} (ID: ${id}) successfully Approved!`);
    if (activeModalApp?.id === id) {
      setActiveModalApp(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const openCertificate = (app: ApplicationItem) => {
    setCertificateMember({
      id: app.id,
      name: app.applicantName,
      phone: app.phone,
      email: app.email,
      amountPaid: app.amountPaid,
      state: app.state,
      date: 'Today, 29 Aug 2026'
    });
  };

  const totalToday = applications.length;
  const approvedToday = applications.filter(a => a.status === 'Approved').length;
  const unapprovedToday = applications.filter(a => a.status !== 'Approved').length;
  const existingMemberApps = applications.filter(a => a.isExistingMember).length;

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.phone.includes(searchTerm);
    
    let matchesCategory = true;
    if (selectedFilter === 'approved') matchesCategory = app.status === 'Approved';
    if (selectedFilter === 'unapproved') matchesCategory = app.status !== 'Approved';
    if (selectedFilter === 'existing') matchesCategory = app.isExistingMember;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 relative">
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

      {/* Header Section */}
      <PageHeader 
        title="Member Applications"
        description="Review incoming member applications, verify ₹5,000 fees, and generate official quotations."
        badge="Admin Command"
        action={
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm">
              <Download className="w-3.5 h-3.5 text-[#1A4594]" /> Export Records
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25">
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Add Member
            </button>
          </div>
        }
      />

      {/* 4 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Today Applications */}
        <div 
          onClick={() => setSelectedFilter('all')}
          className={`bbsp-card p-5 cursor-pointer transition-all relative overflow-hidden group hover:scale-[1.01] ${
            selectedFilter === 'all' 
              ? 'ring-2 ring-[#10367D] border-[#10367D] shadow-lg bg-white' 
              : 'hover:border-[#10367D]/30'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10367D]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#10367D]/10 border border-[#10367D]/20 text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ₹5,000 Paid
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#1A4594]/80 uppercase tracking-wider font-sora">
              Total Today Applications
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              {totalToday}
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              Sequential BBSP-001 to BBSP-004
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-bold">
            <span className={selectedFilter === 'all' ? 'text-[#10367D]' : 'text-[#1A4594]/70'}>
              {selectedFilter === 'all' ? '● Active Filter' : 'Click to View All'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#1A4594]" />
          </div>
        </div>

        {/* Card 2: Approved Today */}
        <div 
          onClick={() => setSelectedFilter('approved')}
          className={`bbsp-card p-5 cursor-pointer transition-all relative overflow-hidden group hover:scale-[1.01] ${
            selectedFilter === 'approved' 
              ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-lg bg-white' 
              : 'hover:border-emerald-300'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-sora">
              Approved Today
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-emerald-700 tracking-tight mt-1">
              {approvedToday}
            </h3>
            <p className="text-[11px] text-emerald-800/85 font-medium mt-1">
              Approved by Sudheer Reddy Anna
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
            <span>{selectedFilter === 'approved' ? '● Active Filter' : 'Click to Filter'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Unapproved / In Review */}
        <div 
          onClick={() => setSelectedFilter('unapproved')}
          className={`bbsp-card p-5 cursor-pointer transition-all relative overflow-hidden group hover:scale-[1.01] ${
            selectedFilter === 'unapproved' 
              ? 'ring-2 ring-amber-600 border-amber-600 shadow-lg bg-white' 
              : 'hover:border-amber-300'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Action Required
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-sora">
              Unapproved / In Review
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-amber-700 tracking-tight mt-1">
              {unapprovedToday}
            </h3>
            <p className="text-[11px] text-amber-800/85 font-medium mt-1">
              Awaiting your approval
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
            <span>{selectedFilter === 'unapproved' ? '● Active Filter' : 'Click to Filter'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Existing Member Applications */}
        <div 
          onClick={() => setSelectedFilter('existing')}
          className={`bbsp-card p-5 cursor-pointer transition-all relative overflow-hidden group hover:scale-[1.01] ${
            selectedFilter === 'existing' 
              ? 'ring-2 ring-[#80B5CE] border-[#80B5CE] shadow-lg bg-white' 
              : 'hover:border-[#80B5CE]/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#80B5CE]" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#80B5CE]/20 border border-[#80B5CE] text-[#10367D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/20">
              Existing
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#10367D] uppercase tracking-wider font-sora">
              Existing Member Applications
            </p>
            <h3 className="text-3xl font-extrabold font-sora text-[#10367D] tracking-tight mt-1">
              {existingMemberApps}
            </h3>
            <p className="text-[11px] text-[#1A4594]/85 font-medium mt-1">
              Renewal submissions
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#10367D]/10 flex items-center justify-between text-[11px] font-bold text-[#10367D]">
            <span>{selectedFilter === 'existing' ? '● Active Filter' : 'Click to Filter'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* SEARCH AND QUICK FILTER */}
      <div className="bbsp-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-96 focus-within:border-[#10367D] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member name, ID (e.g. BBSP-001)..."
              className="bg-transparent border-none outline-none text-xs font-semibold placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-[#1A4594]/60 hover:text-[#10367D]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[#10367D] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#1A4594]" /> Filter:
            </span>
            {[
              { id: 'all', label: `All (${totalToday})` },
              { id: 'approved', label: `Approved (${approvedToday})` },
              { id: 'unapproved', label: `In Review (${unapprovedToday})` },
              { id: 'existing', label: `Existing (${existingMemberApps})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-[#10367D] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#10367D]/75 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLEAN APPLICATIONS TABLE (NO MEMBERSHIP DETAILS CLUTTER) */}
      <div className="bbsp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#10367D]/10 text-[#1A4594]/70 font-bold uppercase tracking-wider text-[10px] bg-[#FAF9F6]">
                <th className="py-4 px-4 rounded-l-lg">Member ID</th>
                <th className="py-4 px-4">Member Name</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-4">Fee Paid</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right rounded-r-lg">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/8">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs font-bold text-[#1A4594]/60">
                    No applications found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF9F6] transition-colors group">
                    <td className="py-4 px-4 font-mono font-extrabold text-[#10367D]">
                      <span className="bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-[#10367D]/15 shadow-sm">
                        {app.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <p className="font-sora font-extrabold text-sm text-[#10367D]">{app.applicantName}</p>
                        {app.isExistingMember && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#1A4594]/80 font-medium mt-0.5">{app.state}</p>
                    </td>
                    <td className="py-4 px-4">
                      <a href={`tel:${app.phone}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#1A4594]" /> {app.phone}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <a href={`mailto:${app.email}`} className="text-[11px] font-bold text-[#10367D] hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#1A4594]" /> {app.email}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-sora font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> {app.amountPaid} Paid
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {app.status === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" /> In Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openCertificate(app)}
                          title="Generate Quotation & Send on WhatsApp"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Quotation</span>
                        </button>

                        <button
                          onClick={() => setActiveModalApp(app)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#10367D]/15 text-xs font-bold text-[#10367D] hover:bg-[#FAF9F6] transition-colors shadow-sm"
                        >
                          Review
                        </button>
                        
                        {app.status === 'Approved' ? (
                          <span className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprove(app.id, app.applicantName)}
                            className="px-3 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 text-[#A5CEE0]" />
                            <span>Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL APPLICANT DOSSIER MODAL */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#10367D]/15 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#10367D]/10">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#10367D]/10 text-[#10367D]">
                  {activeModalApp.id}
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1.5">
                  {activeModalApp.applicantName}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalApp(null)}
                className="p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/10 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Member ID:</span>
                  <span className="font-mono font-extrabold text-sm text-[#10367D]">{activeModalApp.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Mobile Phone:</span>
                  <a href={`tel:${activeModalApp.phone}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#10367D]" /> {activeModalApp.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Email Address:</span>
                  <a href={`mailto:${activeModalApp.email}`} className="font-bold text-[#10367D] hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#10367D]" /> {activeModalApp.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">Registration Fee Paid:</span>
                  <span className="font-sora font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeModalApp.amountPaid} (Online Payment Verified)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1A4594]">City / Location:</span>
                  <span className="font-bold text-[#10367D]">{activeModalApp.state}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-[#10367D]/10">
              <button
                onClick={() => {
                  const target = activeModalApp;
                  setActiveModalApp(null);
                  openCertificate(target);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Generate Quotation & Send on WhatsApp</span>
              </button>

              {activeModalApp.status !== 'Approved' ? (
                <button
                  onClick={() => handleApprove(activeModalApp.id, activeModalApp.applicantName)}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-[#A5CEE0]" />
                  <span>Approve Member</span>
                </button>
              ) : (
                <div className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approved by Sudheer Reddy Anna</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
