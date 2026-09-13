import { useRef, useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, 
  Send, 
  Printer, 
  CheckCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  Award, 
  MapPin
} from 'lucide-react';

export interface CertificateMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  amountPaid?: string;
  state?: string;
  date?: string;
}

interface MemberCertificateModalProps {
  member: CertificateMember | null;
  onClose: () => void;
  onSentToast?: (msg: string) => void;
}

export function MemberCertificateModal({ member, onClose, onSentToast }: MemberCertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const imageBlobRef = useRef<Blob | null>(null);

  if (!member) return null;

  const rawPhone = (member.phone || '').replace(/\D/g, '');
  const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
  const feeAmount = member.amountPaid || '₹5,000';
  const dateStr = member.date || '29 August 2026';
  const memberName = member.name || 'Member';
  const fileName = `${memberName.replace(/\s+/g, '_')}_BBSP_Quotation.png`;

  // Pre-render certificate into high-res Blob
  const preRenderImage = useCallback(async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });
      canvas.toBlob((blob) => {
        if (blob) {
          imageBlobRef.current = blob;
          setIsReady(true);
        }
      }, 'image/png');
    } catch (e) {
      console.error('Pre-render error:', e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      preRenderImage();
    }, 250);
    return () => clearTimeout(timer);
  }, [preRenderImage]);

  // Unified 1-Click WhatsApp Action
  const handleSingleClickWhatsApp = async () => {
    if (imageBlobRef.current) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': imageBlobRef.current })
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 4000);
      } catch (err) {
        console.warn('Clipboard write warning:', err);
      }
    }

    // Trigger instant download for backup
    if (imageBlobRef.current) {
      const url = URL.createObjectURL(imageBlobRef.current);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    const message = `🏛️ *BUILD BHARAT SYNERGY PARTNERS*
*Official Quotation & Confirmation*

Dear *${member.name}*,

Congratulations! Your official registration has been confirmed.

📋 *Member ID:* ${member.id}
👤 *Name:* ${member.name}
📞 *Mobile:* ${member.phone}
📧 *Email:* ${member.email}
💳 *Registration Fee:* ${feeAmount} (Paid & Verified)
📅 *Issue Date:* ${dateStr}

🏛️ *Authorized By:* Sudheer Reddy
Managing Director & SuperAdmin, Build Bharat Synergy Partners

_(Your Official Quotation Certificate Image is attached below)_`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    if (onSentToast) {
      onSentToast(`Opening WhatsApp for ${member.name}! Press Ctrl+V to paste the certificate image.`);
    }
  };

  const handleCopyImageOnly = async () => {
    if (imageBlobRef.current) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': imageBlobRef.current })
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
        if (onSentToast) onSentToast('Quotation Image copied! Press Ctrl+V in WhatsApp.');
      } catch (e) {
        console.error(e);
      }
    } else {
      await preRenderImage();
    }
  };

  const handleDownloadImageOnly = () => {
    if (imageBlobRef.current) {
      const url = URL.createObjectURL(imageBlobRef.current);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      if (onSentToast) onSentToast(`Saved image as ${fileName}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#10367D]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#10367D]/20 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Top Control Bar */}
        <div className="bg-[#FAF9F6] px-6 py-4 border-b border-[#10367D]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10367D]" />
            <h3 className="font-sora font-extrabold text-sm text-[#10367D]">
              Member Quotation & Certificate Preview
            </h3>
            {isReady && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                HD Ready
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#1A4594] hover:bg-white border border-transparent hover:border-[#10367D]/15 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ULTRA-CLEAN CERTIFICATE CONTAINER (ONLY LOGO, NAME, NUMBER, EMAIL, FEE, ID, SIGNATURE) */}
        <div className="p-4 sm:p-6 bg-[#EBEBEB]/40 overflow-x-auto flex justify-center">
          <div 
            ref={certificateRef}
            className="bg-white w-full max-w-[560px] p-6 sm:p-8 rounded-3xl border-8 border-[#10367D] shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #FFFFFF 0%, #FAF9F6 100%)'
            }}
          >
            {/* Elegant Background Border */}
            <div className="absolute inset-2 border border-[#10367D]/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-3 border-2 border-[#A5CEE0]/40 rounded-xl pointer-events-none" />

            {/* Corner Luxury Ornaments */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#10367D]" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#10367D]" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#10367D]" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#10367D]" />

            {/* HEADER WITH LOGO */}
            <div className="text-center relative z-10 space-y-2">
              <div className="w-20 h-20 mx-auto flex items-center justify-center filter drop-shadow-sm">
                <img 
                  src="/build-bharat-logo.png" 
                  alt="Build Bharat Logo" 
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>

              <div>
                <h2 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10367D] tracking-tight uppercase">
                  Build Bharat Synergy Partners
                </h2>
              </div>

              <div className="inline-block mt-1">
                <div className="px-4 py-1 rounded-full bg-gradient-to-r from-[#10367D] via-[#1A4594] to-[#10367D] text-white shadow-md">
                  <p className="text-[11px] font-extrabold tracking-widest uppercase font-sora flex items-center gap-1.5 justify-center">
                    <Award className="w-3.5 h-3.5 text-[#A5CEE0]" />
                    Official Member Quotation & Certificate
                  </p>
                </div>
              </div>
            </div>

            {/* MEMBER NAME SPOTLIGHT */}
            <div className="text-center my-6 relative z-10 space-y-2">
              <p className="text-xs text-[#1A4594]/85 font-medium italic">
                This is to officially certify
              </p>

              <div className="py-3 px-4 bg-[#FAF9F6] border-y-2 border-[#10367D]/30 rounded-xl max-w-md mx-auto">
                <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-[#10367D] tracking-tight">
                  {member.name}
                </h1>
              </div>
            </div>

            {/* CLEAN DETAILS GRID: ID, PHONE, EMAIL, LOCATION */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto text-xs relative z-10">
              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/15 space-y-1">
                <span className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Member ID</span>
                <p className="font-mono font-extrabold text-sm text-[#10367D]">
                  {member.id}
                </p>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/15 space-y-1">
                <span className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Mobile Number</span>
                <p className="font-sora font-bold text-xs text-[#10367D] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#10367D]" />
                  {member.phone}
                </p>
              </div>

              <div className="col-span-2 p-3 bg-[#FAF9F6] rounded-2xl border border-[#10367D]/15 space-y-1">
                <span className="text-[10px] font-bold text-[#1A4594]/70 uppercase">Email Address</span>
                <p className="font-sora font-bold text-xs text-[#10367D] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#10367D]" />
                  {member.email}
                </p>
              </div>
            </div>

            {/* VERIFIED REGISTRATION FEE BOX */}
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between relative z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Registration Fee Paid</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-sora font-extrabold text-sm text-emerald-800">
                    {feeAmount}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white font-sora">
                Verified
              </span>
            </div>

            {/* SIGNATURE & AUTHENTIC FOOTER */}
            <div className="mt-6 pt-5 border-t-2 border-dashed border-[#10367D]/20 flex items-end justify-between text-xs relative z-10">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#10367D]">
                  <Calendar className="w-3.5 h-3.5 text-[#1A4594]" />
                  <span>Date: {dateStr}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#1A4594]/70">
                  <MapPin className="w-3 h-3" />
                  <span>Build Bharat Secretariat</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="inline-block border-b-2 border-[#10367D] pb-1 mb-1">
                  <p className="font-sora font-extrabold text-base text-[#10367D] tracking-tight">
                    Sudheer Reddy
                  </p>
                </div>
                <p className="text-[10px] font-bold text-[#1A4594] uppercase tracking-wider">
                  Managing Director & SuperAdmin
                </p>
                <p className="text-[9px] text-emerald-700 font-bold flex items-center justify-end gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-[#FAF9F6] px-6 py-4 border-t border-[#10367D]/10 space-y-3">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-950">
                1-Click WhatsApp Dispatch to {member.name} ({member.phone}):
              </p>
              <p className="text-[11px] text-emerald-800 font-medium">
                Clicking opens WhatsApp directly for <strong>{member.phone}</strong> and copies the image. Just press <strong className="bg-white px-1.5 py-0.2 rounded border border-emerald-300 font-mono font-bold text-emerald-900">Ctrl + V</strong> in WhatsApp to send!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyImageOnly}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/20 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#10367D]" />}
                <span>{copiedSuccess ? 'Image Copied!' : 'Copy Image'}</span>
              </button>

              <button
                onClick={handleDownloadImageOnly}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/20 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#10367D]" />
                <span>Save PNG</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#10367D] border border-[#10367D]/20 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#10367D]" />
                <span>Print</span>
              </button>
            </div>

            <button
              onClick={handleSingleClickWhatsApp}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Quotation & Image on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
