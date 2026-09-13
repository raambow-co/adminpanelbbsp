import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Plus
} from 'lucide-react';

interface CompanyItem {
  id: string;
  name: string;
  category: string;
  pillar: string;
  pillarColor: string;
  valuation: string;
  synergyDeals: number;
  incorporationYear: number;
  complianceRating: string;
  city: string;
}

const mockCompanies: CompanyItem[] = [
  {
    id: 'CMP-01',
    name: 'SuryaVeda Renewable Grid Ltd',
    category: 'Solar Power Generation & EPC',
    pillar: 'Solar Energy',
    pillarColor: '#A5CEE0',
    valuation: '₹320 Cr',
    synergyDeals: 12,
    incorporationYear: 2021,
    complianceRating: 'AAA',
    city: 'Ahmedabad'
  },
  {
    id: 'CMP-02',
    name: 'Apex FinCorp Synergy Bridge',
    category: 'Institutional NBFC & Microfinance',
    pillar: 'Loans & Capital',
    pillarColor: '#80B5CE',
    valuation: '₹540 Cr',
    synergyDeals: 28,
    incorporationYear: 2019,
    complianceRating: 'AAA',
    city: 'Mumbai'
  },
  {
    id: 'CMP-03',
    name: 'Bharat Eco-Park Infrastructure',
    category: 'Smart Commercial Parks & Logistics',
    pillar: 'Real Estate',
    pillarColor: '#5A9CBE',
    valuation: '₹890 Cr',
    synergyDeals: 9,
    incorporationYear: 2018,
    complianceRating: 'AA+',
    city: 'Chennai'
  },
  {
    id: 'CMP-04',
    name: 'Pratibha Skill Matrix Academy',
    category: 'Vocational Training & AI Certifications',
    pillar: 'EdTech',
    pillarColor: '#3B7E9F',
    valuation: '₹110 Cr',
    synergyDeals: 15,
    incorporationYear: 2022,
    complianceRating: 'AAA',
    city: 'Bengaluru'
  },
  {
    id: 'CMP-05',
    name: 'Kaveri Solar Agritech Infra',
    category: 'Agri-PV & Microgrid Systems',
    pillar: 'Solar Energy',
    pillarColor: '#A5CEE0',
    valuation: '₹175 Cr',
    synergyDeals: 7,
    incorporationYear: 2023,
    complianceRating: 'AA',
    city: 'Vijayawada'
  }
];

export function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('All');

  const filteredCompanies = mockCompanies.filter(c => {
    const s = (searchTerm || '').trim().toLowerCase();
    const name = (c.name || '').toLowerCase();
    const category = (c.category || '').toLowerCase();
    const city = (c.city || '').toLowerCase();

    const matchesSearch = name.includes(s) || 
                          category.includes(s) ||
                          city.includes(s);
    const matchesPillar = selectedPillar === 'All' || c.pillar === selectedPillar;
    return matchesSearch && matchesPillar;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Partner Companies & Consortiums"
        description="Institutional enterprise directory vetted under BBSP compliance guidelines."
        badge={`${filteredCompanies.length} Active Partners`}
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25">
            <Plus className="w-3.5 h-3.5 text-[#A5CEE0]" /> Register Company
          </button>
        }
      />

      {/* Filter and Search */}
      <div className="bbsp-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A4594]/70" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company name, sector, city..."
              className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-full text-[#10367D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[#10367D] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Pillar:
            </span>
            {['All', 'Solar Energy', 'Loans & Capital', 'Real Estate', 'EdTech'].map((pillar) => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedPillar === pillar 
                    ? 'bg-[#10367D] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#10367D]/70 hover:bg-[#10367D]/10 hover:text-[#10367D]'
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((c) => (
          <div key={c.id} className="bbsp-card p-5 relative overflow-hidden flex flex-col justify-between">
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: c.pillarColor }}
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span 
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2"
                    style={{ 
                      backgroundColor: c.pillarColor + '20',
                      borderColor: c.pillarColor,
                      color: '#10367D'
                    }}
                  >
                    {c.pillar}
                  </span>
                  <h3 className="font-sora font-extrabold text-base text-[#10367D]">{c.name}</h3>
                  <p className="text-xs text-[#1A4594]/80 mt-0.5">{c.category}</p>
                </div>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {c.complianceRating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Valuation</p>
                  <p className="font-sora font-extrabold text-sm text-[#10367D]">{c.valuation}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Synergy Deals</p>
                  <p className="font-sora font-extrabold text-sm text-[#10367D]">{c.synergyDeals} Active</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Headquarters</p>
                  <p className="font-bold text-[#10367D]">{c.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Est. Year</p>
                  <p className="font-bold text-[#10367D]">{c.incorporationYear}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#10367D]/10">
              <button className="flex-1 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold transition-colors">
                View Dossier
              </button>
              <button className="p-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15 transition-colors">
                <ExternalLink className="w-4 h-4 text-[#1A4594]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
