import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Check, 
  Save,
  CheckCircle2
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'governance' | 'api'>('general');
  const [membershipFee, setMembershipFee] = useState('5000');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 relative">
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10367D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#A5CEE0]/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A5CEE0]" />
          <span className="text-xs font-bold font-sora">Settings updated successfully!</span>
        </div>
      )}

      <PageHeader 
        title="Admin Portal Settings"
        description="Configure membership fee policies, automated email receipts, and secretariat security settings."
        badge="Sudheer Reddy Anna Admin"
        action={
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#10367D] hover:bg-[#1A4594] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10367D]/25"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-[#A5CEE0]" />}
            {savedSuccess ? 'Settings Saved!' : 'Save Configurations'}
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#10367D]/12 pb-2 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Secretariat', icon: SettingsIcon },
          { id: 'governance', label: 'Membership Fee Policies', icon: Shield },
          { id: 'api', label: 'Payment Gateway & SMS Keys', icon: Key },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-[#10367D] text-white shadow-sm'
                : 'bg-white text-[#10367D]/70 hover:bg-[#FAF9F6] hover:text-[#10367D] border border-[#10367D]/10'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bbsp-card p-6 space-y-4">
            <h3 className="font-sora font-extrabold text-base text-[#10367D]">Admin Profile</h3>
            
            <div>
              <label className="block text-xs font-bold text-[#10367D] mb-1">Administrator Name</label>
              <input 
                type="text" 
                defaultValue="Sudheer Reddy Anna"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#10367D]/15 text-xs text-[#10367D] font-bold focus:outline-none focus:border-[#10367D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10367D] mb-1">Official Secretariat Email</label>
              <input 
                type="email" 
                defaultValue="sudheer.reddy@bbsp.in"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#10367D]/15 text-xs text-[#10367D] font-semibold focus:outline-none focus:border-[#10367D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10367D] mb-1">Organization Title</label>
              <input 
                type="text" 
                defaultValue="Build Bharat Synergy Partners"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#10367D]/15 text-xs text-[#10367D] font-semibold focus:outline-none focus:border-[#10367D]"
              />
            </div>
          </div>

          <div className="bbsp-card p-6 space-y-4">
            <h3 className="font-sora font-extrabold text-base text-[#10367D]">Notifications & Alerts</h3>
            
            <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10">
              <div>
                <p className="text-xs font-bold text-[#10367D]">Real-time Member Registration Alerts</p>
                <p className="text-[11px] text-[#1A4594]/75">Notify when a new member pays ₹5,000 fee on website</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#10367D]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10">
              <div>
                <p className="text-xs font-bold text-[#10367D]">Instant WhatsApp Receipt Trigger</p>
                <p className="text-[11px] text-[#1A4594]/75">Send automated PDF receipt to applicant's phone number</p>
              </div>
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 accent-[#10367D]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="bbsp-card p-6 space-y-4">
          <h3 className="font-sora font-extrabold text-base text-[#10367D]">Membership Fee Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#10367D]/10 space-y-2">
              <p className="text-xs font-bold text-[#10367D]">Standard Application & Processing Fee</p>
              <p className="text-[11px] text-[#1A4594]/75">Applicable for all online and offline member intake</p>
              <div className="flex items-center gap-2">
                <span className="font-sora font-extrabold text-base text-[#10367D]">₹</span>
                <input 
                  type="text" 
                  value={membershipFee}
                  onChange={(e) => setMembershipFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#10367D]/15 text-xs font-bold text-[#10367D]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#10367D]/10 space-y-2">
              <p className="text-xs font-bold text-[#10367D]">GST & Invoice Type</p>
              <p className="text-[11px] text-[#1A4594]/75">Tax category for membership registration</p>
              <select className="w-full px-3 py-2 rounded-xl bg-white border border-[#10367D]/15 text-xs font-bold text-[#10367D]">
                <option>18% SAC Code 998399 (Professional Syndicate Service)</option>
                <option>Exempted Society Trust Membership</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bbsp-card p-6 space-y-4">
          <h3 className="font-sora font-extrabold text-base text-[#10367D]">Active Integration Credentials</h3>
          
          <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#10367D]">Razorpay Payment Gateway Webhook</p>
              <p className="text-[11px] text-[#1A4594]/75 font-mono">rzp_live_sec_bbsp_member_894194</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Connected
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#10367D]/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#10367D]">SMS & WhatsApp Business API</p>
              <p className="text-[11px] text-[#1A4594]/75 font-mono">auth_sms_gateway_active_v2</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Connected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
