import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  Sun, 
  Banknote, 
  Building, 
  GraduationCap, 
  Download
} from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('Quarterly');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Cross-Pillar Synergy Analytics"
        description="Macro-level econometric indices, ESG impact assessments, and multi-vertical capital velocity."
        badge="Live Telemetry"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-xl border border-[#10367D]/15 p-1 text-xs font-bold">
              {['Monthly', 'Quarterly', 'YTD', 'All Time'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    timeRange === range
                      ? 'bg-[#10367D] text-white'
                      : 'text-[#10367D]/70 hover:text-[#10367D]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25">
              <Download className="w-3.5 h-3.5 text-[#A5CEE0]" /> Export BI Report
            </button>
          </div>
        }
      />

      {/* 4 Pillars In-Depth Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Solar & Clean Power Deep Dive */}
        <div className="bbsp-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#A5CEE0]" />
          <div className="flex items-center justify-between pb-4 border-b border-[#10367D]/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A5CEE0]/20 text-[#10367D] border border-[#A5CEE0]">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora font-extrabold text-base text-[#10367D]">Solar & Renewable Energy</h3>
                <p className="text-[11px] text-[#1A4594]/75">Pillar 1 • Clean Infrastructure</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +14.2% YoY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Installed Capacity</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">48.6 MW</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Carbon Offset</p>
              <p className="font-sora font-extrabold text-lg text-emerald-700 mt-0.5">62.4k Tons</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Grid Efficiency</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">99.1%</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold text-[#10367D]">
              <span>Solar Farm Expansion Target</span>
              <span>72% of 65 MW Target</span>
            </div>
            <div className="w-full h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#10367D]/10">
              <div className="h-full bg-[#A5CEE0] rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>

        {/* 2. Loans & Capital Deep Dive */}
        <div className="bbsp-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#80B5CE]" />
          <div className="flex items-center justify-between pb-4 border-b border-[#10367D]/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#80B5CE]/20 text-[#10367D] border border-[#80B5CE]">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora font-extrabold text-base text-[#10367D]">Loans & Institutional Capital</h3>
                <p className="text-[11px] text-[#1A4594]/75">Pillar 2 • Credit & Working Capital</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +18.7% YoY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Active Pool</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">₹142.8 Cr</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Gross NPA</p>
              <p className="font-sora font-extrabold text-lg text-emerald-700 mt-0.5">0.18%</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Avg IRR</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">14.6%</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold text-[#10367D]">
              <span>Credit Underwriting Velocity</span>
              <span>88% Automated</span>
            </div>
            <div className="w-full h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#10367D]/10">
              <div className="h-full bg-[#80B5CE] rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* 3. Real Estate Deep Dive */}
        <div className="bbsp-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#5A9CBE]" />
          <div className="flex items-center justify-between pb-4 border-b border-[#10367D]/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#5A9CBE]/20 text-[#10367D] border border-[#5A9CBE]">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora font-extrabold text-base text-[#10367D]">Real Estate & Commercial Infra</h3>
                <p className="text-[11px] text-[#1A4594]/75">Pillar 3 • Logistics & Eco-Villas</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +9.5% YoY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Managed Space</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">3.2M SqFt</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Occupancy</p>
              <p className="font-sora font-extrabold text-lg text-emerald-700 mt-0.5">97.4%</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Green Cert</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">IGBC Gold</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold text-[#10367D]">
              <span>Eco-Park Development Completion</span>
              <span>64% Delivered</span>
            </div>
            <div className="w-full h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#10367D]/10">
              <div className="h-full bg-[#5A9CBE] rounded-full" style={{ width: '64%' }} />
            </div>
          </div>
        </div>

        {/* 4. EdTech Deep Dive */}
        <div className="bbsp-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3B7E9F]" />
          <div className="flex items-center justify-between pb-4 border-b border-[#10367D]/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#3B7E9F]/20 text-[#10367D] border border-[#3B7E9F]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora font-extrabold text-base text-[#10367D]">EdTech & Human Capital</h3>
                <p className="text-[11px] text-[#1A4594]/75">Pillar 4 • Vocational & AI Upskilling</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +22.8% YoY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Scholars Trained</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">18,450</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Placement %</p>
              <p className="font-sora font-extrabold text-lg text-emerald-700 mt-0.5">94.6%</p>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-center">
              <p className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Salary Lift</p>
              <p className="font-sora font-extrabold text-lg text-[#10367D] mt-0.5">+140%</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold text-[#10367D]">
              <span>Tier-2 / Tier-3 Outreach Cohort</span>
              <span>85% Enrolled</span>
            </div>
            <div className="w-full h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#10367D]/10">
              <div className="h-full bg-[#3B7E9F] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
