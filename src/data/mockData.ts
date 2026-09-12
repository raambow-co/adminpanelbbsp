export type FormType = 
  | 'partner-registration' 
  | 'formal-loan' 
  | 'quick-loan' 
  | 'real-estate-enquiry'
  | 'map-enquiry'
  | 'newsletter'
  | 'general-contact';

export type SubmissionStatus = 
  | 'Pending' 
  | 'In Review' 
  | 'Underwriting' 
  | 'Approved' 
  | 'Sanctioned' 
  | 'Disbursed' 
  | 'Visit Scheduled' 
  | 'Contacted' 
  | 'Rejected';

export interface UnifiedSubmission {
  id: string;
  formType: FormType;
  formName: string;
  sourceFile: string;
  applicantName: string;
  phone: string;
  email: string;
  city: string;
  state?: string;
  timestamp: string;
  status: SubmissionStatus;
  
  // Specific fields for Synergy Partner Registration (PartnershipCTA.tsx)
  businessName?: string;
  vertical?: 'Solar' | 'Loans' | 'Real Estate' | 'EdTech' | 'General';
  aadhaarNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  amountPaid?: string;
  transactionId?: string;

  // Specific fields for 7-Stage Formal Loan (FormalLoanModal.tsx)
  motherName?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  presentAddress?: string;
  pinCode?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeAge?: string;
  branchName?: string;
  requiredAmount?: string;
  sanctionAmount?: string;
  tenureMonths?: string;
  processingFee?: string;
  loanPurpose?: string;
  uplineName?: string;
  uplineIdCode?: string;
  sponsorIdCode?: string;
  executiveName?: string;
  executiveSponsorId?: string;
  diCode?: string;
  witness1Name?: string;
  witness1Mobile?: string;
  witness1Address?: string;
  witness2Name?: string;
  witness2Mobile?: string;
  witness2Address?: string;
  signatureDate?: string;

  // Specific fields for Quick Digital Loan Lead (LoansHomepage.tsx)
  employmentType?: 'Salaried' | 'Self-Employed' | 'Business Owner';
  monthlyIncome?: string;
  quickLoanType?: string;

  // Specific fields for Real Estate Enquiry (RealEstateHomepage.tsx)
  propertyType?: string;
  budgetRange?: string;
  preferredLocality?: string;
  timeline?: string;
  siteVisitRequested?: boolean;

  // Specific fields for Map Section Quick Enquiry Desk (PartnershipCTA.tsx)
  mapServiceInterest?: string;
  mapEnquiryMessage?: string;
}

export const FORM_TYPE_CONFIG: Record<FormType, {
  label: string;
  shortCode: string;
  sourceFile: string;
  badgeColor: string;
  description: string;
}> = {
  'map-enquiry': {
    label: 'Map & HQ Quick Desk',
    shortCode: 'MAP-ENQ',
    sourceFile: 'src/components/PartnershipCTA.tsx',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Direct enquiries submitted from the Interactive Headquarters Map'
  },
  'partner-registration': {
    label: 'Synergy Partner (₹5,000)',
    shortCode: 'PARTNER',
    sourceFile: 'src/components/PartnershipCTA.tsx',
    badgeColor: 'bg-[#10367D]/10 text-[#10367D] border-[#10367D]/20',
    description: '4-Step Partner Onboarding & Verified Registration Fee'
  },
  'formal-loan': {
    label: '7-Stage Formal Loan Dossier',
    shortCode: 'FORMAL-LOAN',
    sourceFile: 'src/components/FormalLoanModal.tsx',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Complete 7-Step Verified Legal Loan Application'
  },
  'quick-loan': {
    label: 'Quick Digital Loan Lead',
    shortCode: 'QUICK-LOAN',
    sourceFile: 'src/pages/LoansHomepage.tsx',
    badgeColor: 'bg-blue-50 text-[#10367D] border-blue-200',
    description: 'Fast Inbound Credit Calculation & Lead Capture'
  },
  'real-estate-enquiry': {
    label: 'Real Estate Property Enquiry',
    shortCode: 'REALTY',
    sourceFile: 'src/pages/RealEstateHomepage.tsx',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Site Visit & Commercial Property Requirements'
  },
  'newsletter': {
    label: 'Ecosystem Newsletter',
    shortCode: 'NEWSLETTER',
    sourceFile: 'src/components/Footer.tsx',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    description: 'Market Insights & Monthly Digest Subscription'
  },
  'general-contact': {
    label: 'Support Desk Hotline',
    shortCode: 'SUPPORT',
    sourceFile: 'src/pages/ContactPage.tsx',
    badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
    description: 'Corporate Hotline & General Headquarters Inquiries'
  }
};

// Clean production state: 0 dummy/mock submissions
export const INITIAL_SUBMISSIONS: UnifiedSubmission[] = [];
