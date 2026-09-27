import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ConfirmationModal, type FieldChange } from '../components/ConfirmationModal';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface CompanyItem {
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

const initialCompanies: CompanyItem[] = [
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
  const [companies, setCompanies] = useState<CompanyItem[]>(() => {
    try {
      const saved = localStorage.getItem('bbsp_companies_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCompanies;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);

  // New Company form
  const [newCompany, setNewCompany] = useState({
    name: '',
    category: '',
    pillar: 'Solar Energy',
    valuation: '₹100 Cr',
    synergyDeals: 5,
    incorporationYear: 2023,
    complianceRating: 'AAA',
    city: 'Hyderabad'
  });

  // Edit form
  const [editForm, setEditForm] = useState<Partial<CompanyItem>>({});

  // Security confirmation state
  const [confirmDeleteCompany, setConfirmDeleteCompany] = useState<CompanyItem | null>(null);
  const [confirmModifyPending, setConfirmModifyPending] = useState<{
    original: CompanyItem;
    updated: CompanyItem;
    changes: FieldChange[];
  } | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbsp_companies_list', JSON.stringify(companies));
    } catch (e) {
      console.error(e);
    }
  }, [companies]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'Solar Energy': return '#A5CEE0';
      case 'Loans & Capital': return '#80B5CE';
      case 'Real Estate': return '#5A9CBE';
      case 'EdTech': return '#3B7E9F';
      default: return '#10367D';
    }
  };

  // Add Company
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.category) {
      showToast('Please fill all required fields.');
      return;
    }

    const created: CompanyItem = {
      id: `CMP-${String(companies.length + 1).padStart(2, '0')}`,
      name: newCompany.name.trim(),
      category: newCompany.category.trim(),
      pillar: newCompany.pillar,
      pillarColor: getPillarColor(newCompany.pillar),
      valuation: newCompany.valuation,
      synergyDeals: Number(newCompany.synergyDeals) || 0,
      incorporationYear: Number(newCompany.incorporationYear) || 2024,
      complianceRating: newCompany.complianceRating,
      city: newCompany.city.trim() || 'Hyderabad'
    };

    setCompanies([created, ...companies]);
    setShowAddModal(false);
    showToast(`Company ${created.name} registered successfully!`);
    setNewCompany({
      name: '',
      category: '',
      pillar: 'Solar Energy',
      valuation: '₹100 Cr',
      synergyDeals: 5,
      incorporationYear: 2023,
      complianceRating: 'AAA',
      city: 'Hyderabad'
    });
  };

  // Open Edit Modal
  const openEditModal = (c: CompanyItem) => {
    setEditingCompany(c);
    setEditForm({ ...c });
    setShowEditModal(true);
  };

  // Submit Edit -> Intercepted by Double Confirmation
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    const updated: CompanyItem = {
      ...editingCompany,
      name: editForm.name?.trim() || editingCompany.name,
      category: editForm.category?.trim() || editingCompany.category,
      pillar: editForm.pillar || editingCompany.pillar,
      pillarColor: getPillarColor(editForm.pillar || editingCompany.pillar),
      valuation: editForm.valuation || editingCompany.valuation,
      synergyDeals: Number(editForm.synergyDeals) || editingCompany.synergyDeals,
      incorporationYear: Number(editForm.incorporationYear) || editingCompany.incorporationYear,
      complianceRating: editForm.complianceRating || editingCompany.complianceRating,
      city: editForm.city?.trim() || editingCompany.city
    };

    const changes: FieldChange[] = [];
    if (editingCompany.name !== updated.name) {
      changes.push({ field: 'Company Name', from: editingCompany.name, to: updated.name });
    }
    if (editingCompany.pillar !== updated.pillar) {
      changes.push({ field: 'Pillar', from: editingCompany.pillar, to: updated.pillar });
    }
    if (editingCompany.valuation !== updated.valuation) {
      changes.push({ field: 'Valuation', from: editingCompany.valuation, to: updated.valuation });
    }
    if (editingCompany.city !== updated.city) {
      changes.push({ field: 'City', from: editingCompany.city, to: updated.city });
    }
    if (editingCompany.complianceRating !== updated.complianceRating) {
      changes.push({ field: 'Rating', from: editingCompany.complianceRating, to: updated.complianceRating });
    }

    if (changes.length === 0) {
      setShowEditModal(false);
      showToast('No modifications detected.');
      return;
    }

    setShowEditModal(false);
    setConfirmModifyPending({
      original: editingCompany,
      updated,
      changes
    });
  };

  // Commit Edit after 2nd Confirmation
  const commitCompanyModification = () => {
    if (!confirmModifyPending) return;
    const { updated } = confirmModifyPending;

    setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    setConfirmModifyPending(null);
    setEditingCompany(null);
    showToast(`Company ${updated.name} updated successfully!`);
  };

  // Request Delete -> Intercepted by Double Confirmation
  const requestDeleteCompany = (c: CompanyItem) => {
    setConfirmDeleteCompany(c);
  };

  // Commit Delete after 2nd Confirmation
  const commitDeleteCompany = () => {
    if (!confirmDeleteCompany) return;
    const { id, name } = confirmDeleteCompany;
    setCompanies(prev => prev.filter(c => c.id !== id));
    setConfirmDeleteCompany(null);
    showToast(`Company ${name} (${id}) permanently removed.`);
  };

  const filteredCompanies = companies.filter(c => {
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
      {confirmDeleteCompany && (
        <ConfirmationModal
          isOpen={true}
          type="delete"
          title={`Remove Partner Company ${confirmDeleteCompany.name}?`}
          subtitle={`Are you sure you want to permanently delete company profile ${confirmDeleteCompany.id}?`}
          requireDoubleConfirmation={true}
          itemDetails={[
            { label: 'Company ID', value: confirmDeleteCompany.id, highlight: true },
            { label: 'Company Name', value: confirmDeleteCompany.name },
            { label: 'Pillar', value: confirmDeleteCompany.pillar },
            { label: 'Valuation', value: confirmDeleteCompany.valuation }
          ]}
          warningMessage="Purging this company removes its synergy deals and directory listing."
          confirmButtonText="Yes, Permanently Remove Company"
          onConfirm={commitDeleteCompany}
          onClose={() => setConfirmDeleteCompany(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* SECURITY DOUBLE CONFIRMATION: MODIFY MODAL */}
      {/* ========================================================================= */}
      {confirmModifyPending && (
        <ConfirmationModal
          isOpen={true}
          type="modify"
          title={`Confirm Changes for ${confirmModifyPending.original.name}`}
          subtitle={`Review modifications to company ${confirmModifyPending.original.id} before saving.`}
          requireDoubleConfirmation={true}
          changesSummary={confirmModifyPending.changes}
          itemDetails={[
            { label: 'Company ID', value: confirmModifyPending.original.id },
            { label: 'Pillar', value: confirmModifyPending.original.pillar }
          ]}
          warningMessage="Modifying enterprise records updates the public consortium directory."
          confirmButtonText="Confirm & Save Updates"
          onConfirm={commitCompanyModification}
          onClose={() => setConfirmModifyPending(null)}
        />
      )}

      <PageHeader 
        title="Partner Companies & Consortiums"
        description="Institutional enterprise directory vetted under BBSP compliance guidelines with full edit/delete control & 2-step verification."
        badge={`${companies.length} Active Partners`}
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25 cursor-pointer active:scale-95"
          >
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
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
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
          <div key={c.id} className="bbsp-card p-5 relative overflow-hidden flex flex-col justify-between group">
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: c.pillarColor }}
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
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
                  <h3 className="font-sora font-extrabold text-base text-[#10367D] truncate">{c.name}</h3>
                  <p className="text-xs text-[#1A4594]/80 mt-0.5 truncate">{c.category}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button 
                    onClick={() => openEditModal(c)}
                    title="Edit Company"
                    className="p-1.5 rounded-lg text-[#10367D] hover:bg-[#10367D]/10 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => requestDeleteCompany(c)}
                    title="Delete Company (Double Confirmation)"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                  <p className="text-[10px] font-bold text-[#1A4594]/60 uppercase">Rating</p>
                  <span className="font-extrabold text-emerald-700">{c.complianceRating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#10367D]/10">
              <button 
                onClick={() => showToast(`Opening company portfolio for ${c.name}`)}
                className="flex-1 py-1.5 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View Dossier
              </button>
              <button 
                onClick={() => openEditModal(c)}
                className="p-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/15 transition-colors cursor-pointer"
              >
                <Edit className="w-4 h-4 text-[#1A4594]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD COMPANY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D]">
                  Register Enterprise Partner
                </h3>
                <p className="text-xs text-[#1A4594]/80 mt-0.5">Add verified partner company to directory</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Company / Consortium Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Kaveri Solar Agritech Infra"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D] focus:bg-white focus:outline-none focus:border-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Pillar *</label>
                  <select
                    value={newCompany.pillar}
                    onChange={(e) => setNewCompany({ ...newCompany, pillar: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  >
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Loans & Capital">Loans & Capital</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="EdTech">EdTech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Valuation</label>
                  <input
                    type="text"
                    value={newCompany.valuation}
                    onChange={(e) => setNewCompany({ ...newCompany, valuation: e.target.value })}
                    placeholder="e.g. ₹250 Cr"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Sector & Specialization *</label>
                <input
                  type="text"
                  required
                  value={newCompany.category}
                  onChange={(e) => setNewCompany({ ...newCompany, category: e.target.value })}
                  placeholder="e.g. Agri-PV & Microgrid Systems"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Headquarters City</label>
                  <input
                    type="text"
                    value={newCompany.city}
                    onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Compliance Rating</label>
                  <select
                    value={newCompany.complianceRating}
                    onChange={(e) => setNewCompany({ ...newCompany, complianceRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  >
                    <option value="AAA">AAA (Tier 1 Verified)</option>
                    <option value="AA+">AA+ (High Compliance)</option>
                    <option value="AA">AA (Standard Institutional)</option>
                  </select>
                </div>
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPANY MODAL */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#10367D]/15 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Edit Mode
                </span>
                <h3 className="font-sora font-extrabold text-xl text-[#10367D] mt-1">
                  Edit Company Profile
                </h3>
                <p className="text-xs text-[#1A4594]/80">Company ID: {editingCompany.id}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-xl text-[#1A4594] hover:bg-[#FAF9F6] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs pt-1">
              <div>
                <label className="block font-bold text-[#10367D] mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Pillar</label>
                  <select
                    value={editForm.pillar || 'Solar Energy'}
                    onChange={(e) => setEditForm({ ...editForm, pillar: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  >
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Loans & Capital">Loans & Capital</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="EdTech">EdTech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Valuation</label>
                  <input
                    type="text"
                    value={editForm.valuation || ''}
                    onChange={(e) => setEditForm({ ...editForm, valuation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10367D] mb-1">Category / Specialization</label>
                <input
                  type="text"
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10367D] mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10367D] mb-1">Compliance Rating</label>
                  <select
                    value={editForm.complianceRating || 'AAA'}
                    onChange={(e) => setEditForm({ ...editForm, complianceRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                  >
                    <option value="AAA">AAA</option>
                    <option value="AA+">AA+</option>
                    <option value="AA">AA</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <p className="text-[11px] font-medium">
                  Saving will open the 2-step review modal before applying changes.
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
