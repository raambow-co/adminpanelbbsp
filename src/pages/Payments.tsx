import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  Download, 
  CheckCircle, 
  Plus
} from 'lucide-react';

interface TransactionItem {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  type: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Processing';
  mode: 'Razorpay UPI' | 'Debit/Credit Card' | 'Direct Escrow NEFT';
}

const mockTransactions: TransactionItem[] = [];

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTxns = mockTransactions.filter(t => 
    t.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fee Payments"
        description="Official payment records and receipts mapped to sequential Member IDs (BBSP-001, BBSP-002...)."
        badge="₹10,000 Today (2 Members)"
        action={
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/15 rounded-xl text-xs font-bold transition-all shadow-sm">
              <Download className="w-3.5 h-3.5" /> Download Receipts
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25">
              <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Record Payment
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Today's Collection</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-[#10367D]">₹10,000</h3>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">2 New Members (@ ₹5,000 each)</p>
        </div>

        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Total Month Collection</span>
            <div className="p-2 rounded-xl bg-[#10367D]/10 text-[#10367D]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-[#10367D]">₹90,000</h3>
          <p className="text-[11px] text-[#1A4594]/80 font-semibold mt-1">18 verified active members</p>
        </div>

        <div className="bbsp-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1A4594]/70 uppercase font-sora">Payment Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-emerald-700">100%</h3>
          <p className="text-[11px] text-[#1A4594]/80 font-semibold mt-1">All payments verified</p>
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
                <th className="py-3.5 px-4 text-right rounded-r-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10367D]/8">
              {filteredTxns.map((t) => (
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
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#1A4594]/70 font-medium">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
