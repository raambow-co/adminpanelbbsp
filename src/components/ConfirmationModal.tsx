import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  ArrowRight,
  Lock
} from 'lucide-react';

export interface FieldChange {
  field: string;
  from: string | number | boolean;
  to: string | number | boolean;
}

export interface ItemDetail {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'delete' | 'modify';
  title: string;
  subtitle?: string;
  itemDetails?: ItemDetail[];
  changesSummary?: FieldChange[];
  warningMessage?: string;
  confirmButtonText?: string;
  requireDoubleConfirmation?: boolean;
  requireKeyword?: string; // e.g. "CONFIRM" or "DELETE"
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  subtitle,
  itemDetails = [],
  changesSummary = [],
  warningMessage,
  confirmButtonText,
  requireDoubleConfirmation = true,
  requireKeyword,
  onConfirm,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [typedKeyword, setTypedKeyword] = useState('');
  const [checkboxConfirmed, setCheckboxConfirmed] = useState(false);

  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const keywordTarget = requireKeyword || (isDelete ? 'DELETE' : 'CONFIRM');
  const isKeywordValid = !requireKeyword && !isDelete ? true : typedKeyword.trim().toUpperCase() === keywordTarget.toUpperCase();
  const canProceedStep2 = isDelete 
    ? (checkboxConfirmed && (requireKeyword ? isKeywordValid : true))
    : true;

  const handleInitialProceed = () => {
    if (requireDoubleConfirmation && step === 1) {
      setStep(2);
    } else {
      onConfirm();
    }
  };

  const handleFinalConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#10367D]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border shadow-2xl space-y-4 my-auto relative transform transition-all ${
          isDelete ? 'border-rose-200 shadow-rose-900/20' : 'border-amber-200 shadow-[#10367D]/20'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                isDelete 
                  ? 'bg-rose-50 border border-rose-200 text-rose-600' 
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}
            >
              {isDelete ? <Trash2 className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    isDelete 
                      ? 'bg-rose-100/70 text-rose-800 border-rose-200' 
                      : 'bg-amber-100/70 text-amber-900 border-amber-200'
                  }`}
                >
                  {isDelete ? 'Security Deletion Prompt' : 'Modification Review'}
                </span>
                {requireDoubleConfirmation && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D]">
                    Step {step} of 2
                  </span>
                )}
              </div>
              <h3 className="font-sora font-extrabold text-lg text-[#10367D] mt-1">
                {title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Summary of Item / Changes */}
        {step === 1 && (
          <div className="space-y-3.5 text-xs">
            {subtitle && (
              <p className="text-slate-600 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Item Details list */}
            {itemDetails.length > 0 && (
              <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#10367D]/10 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-[#1A4594]/70 tracking-wider">
                  Target Record Details
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {itemDetails.map((detail, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] font-semibold">{detail.label}:</span>
                      <p className={`font-bold truncate ${detail.highlight ? 'text-rose-600 font-mono' : 'text-[#10367D]'}`}>
                        {String(detail.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changes Summary if Modifying */}
            {changesSummary.length > 0 && (
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Key Information Being Modified
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {changesSummary.map((c, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-xl border border-amber-100 flex items-center justify-between gap-2">
                      <span className="font-bold text-[#10367D] text-[11px]">{c.field}</span>
                      <div className="flex items-center gap-1.5 text-[11px] truncate">
                        <span className="text-slate-400 line-through truncate max-w-[120px]">{String(c.from || 'None')}</span>
                        <ArrowRight className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span className="font-extrabold text-emerald-700 truncate max-w-[140px]">{String(c.to)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Message Box */}
            <div 
              className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                isDelete 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
                  : 'bg-blue-50/80 border-blue-200 text-[#10367D]'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDelete ? 'text-rose-600' : 'text-[#10367D]'}`} />
              <p className="text-[11px] leading-relaxed font-medium">
                {warningMessage || (isDelete 
                  ? 'Deleting this record will immediately purge it from the system and linked financial ledgers. This action is irreversible.'
                  : 'Please double-check the modified details before saving to ensure records and certificates remain accurate.'
                )}
              </p>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitialProceed}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isDelete 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25' 
                    : 'bg-[#10367D] hover:bg-[#1A4594] shadow-[#10367D]/25'
                }`}
              >
                {requireDoubleConfirmation ? 'Proceed to Confirmation ➔' : (confirmButtonText || (isDelete ? 'Delete Record' : 'Save Changes'))}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Second Time Final Confirmation Screen */}
        {step === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-300 text-rose-950 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                <h4 className="font-sora font-extrabold text-sm text-rose-900">
                  {isDelete ? 'Final Security Confirmation (Step 2 of 2)' : 'Confirm Application of Changes'}
                </h4>
              </div>
              <p className="text-[11px] text-rose-900/90 font-medium leading-relaxed">
                {isDelete 
                  ? 'You are about to permanently delete this item. To prevent accidental data loss, please confirm the safeguard below.'
                  : 'You are applying permanent updates to live records. Please confirm that you have verified all fields.'
                }
              </p>
            </div>

            {/* Checkbox verification */}
            <label className="flex items-start gap-2.5 p-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 cursor-pointer hover:bg-white transition-colors">
              <input
                type="checkbox"
                checked={checkboxConfirmed}
                onChange={(e) => setCheckboxConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
              />
              <span className="font-bold text-[11px] text-[#10367D] leading-snug">
                I understand that this action is critical and I explicitly confirm these changes.
              </span>
            </label>

            {/* Keyword confirmation if required */}
            {requireKeyword && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Type <strong className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{keywordTarget}</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={typedKeyword}
                  onChange={(e) => setTypedKeyword(e.target.value)}
                  placeholder={`Type ${keywordTarget} here`}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] rounded-xl border border-rose-200 text-xs font-mono font-bold text-rose-700 focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#10367D]/10 text-[#10367D] font-bold text-xs transition-colors"
              >
                ⟵ Back / Review
              </button>
              <button
                type="button"
                disabled={!canProceedStep2}
                onClick={handleFinalConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  canProceedStep2
                    ? isDelete 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25 active:scale-95' 
                      : 'bg-[#10367D] hover:bg-[#1A4594] shadow-[#10367D]/25 active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {confirmButtonText || (isDelete ? 'Permanently Delete' : 'Confirm & Save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
