import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  addDoc, 
  getDoc,
  getDocs,
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCeYjOFGjyTnoBboNpZqy4iUQNfsPZhce4",
  authDomain: "bbspartners-01.firebaseapp.com",
  projectId: "bbspartners-01",
  storageBucket: "bbspartners-01.firebasestorage.app",
  messagingSenderId: "813985229438",
  appId: "1:813985229438:web:29e43c31e108892600462f",
  measurementId: "G-MEPVVD2GPN"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  addDoc, 
  getDoc,
  getDocs,
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp 
};

/**
 * Normalize any status strictly into the 4 finite statuses
 */
export function normalizeSubmissionStatus(status?: string, isApproved?: boolean): 'In Review' | 'Contacted' | 'Approved' | 'Rejected' {
  if (isApproved === true) return 'Approved';
  const s = (status || '').toLowerCase().trim();
  if (s === 'approved' || s === 'sanctioned') return 'Approved';
  if (s === 'contacted') return 'Contacted';
  if (s === 'rejected' || s === 'declined') return 'Rejected';
  return 'In Review';
}

/**
 * Approve Member in Firestore:
 * 1. Updates 'submissions' collection
 * 2. Creates/updates permanent record in 'members' collection (Website Member Directory)
 * 3. Syncs with local 'bbsp_members_directory'
 */
export async function approveMemberInFirestore(appData: any): Promise<{ success: boolean; memberId: string }> {
  const cleanEmail = (appData.email || '').toLowerCase().trim();
  const docId = appData.id;
  const memberCode = appData.membershipCode || appData.applicationId || (cleanEmail ? `BBSP-${cleanEmail.slice(0, 4).toUpperCase()}` : appData.id || 'BBSP-PARTNER');

  try {
    // 1. Update in submissions collection
    let updatedSub = false;
    if (docId) {
      try {
        await updateDoc(doc(db, 'submissions', docId), {
          status: 'Approved',
          isApproved: true,
          updatedAt: serverTimestamp()
        });
        updatedSub = true;
      } catch (e) {
        console.warn('Direct doc update failed, fallback to query:', e);
      }
    }

    if (cleanEmail) {
      try {
        const qEmail = query(collection(db, 'submissions'), where('email', '==', cleanEmail));
        const snap = await getDocs(qEmail);
        for (const d of snap.docs) {
          await updateDoc(d.ref, {
            status: 'Approved',
            isApproved: true,
            updatedAt: serverTimestamp()
          });
          updatedSub = true;
        }
      } catch (e) {}
    }

    if (!updatedSub && !docId) {
      try {
        await addDoc(collection(db, 'submissions'), {
          ...appData,
          status: 'Approved',
          isApproved: true,
          membershipCode: memberCode,
          updatedAt: serverTimestamp()
        });
      } catch (e) {}
    }

    // 2. Add to dedicated 'members' collection indexed by cleanEmail (Website Member Directory)
    if (cleanEmail) {
      const memberRef = doc(db, 'members', cleanEmail);
      await setDoc(memberRef, {
        id: memberCode,
        memberId: memberCode,
        membershipCode: memberCode,
        fullName: appData.applicantName || appData.name || appData.fullName || 'BBSP Partner',
        name: appData.applicantName || appData.name || appData.fullName || 'BBSP Partner',
        email: cleanEmail,
        phone: appData.phone || '',
        cadre: appData.cadre || appData.vertical || 'District Cadre Syndicate Partner',
        status: 'Approved',
        isApproved: true,
        loginAccess: true,
        bankName: appData.bankName || '',
        accountNumber: appData.accountNumber || '',
        ifscCode: appData.ifscCode || '',
        amountPaid: appData.amountPaid || '₹5,000',
        transactionId: appData.transactionId || '',
        approvedAt: serverTimestamp(),
        joinedAt: appData.timestamp || appData.submittedAt || new Date().toISOString()
      }, { merge: true });
    }

    // 3. Update localStorage 'bbsp_members_directory' so Members.tsx reflects it instantly
    try {
      const raw = localStorage.getItem('bbsp_members_directory');
      const list = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((m: any) => (m.email || '').toLowerCase().trim() !== cleanEmail);
      filtered.unshift({
        id: memberCode,
        name: appData.applicantName || appData.name || 'BBSP Partner',
        tier: 'Premium Member',
        phone: appData.phone || '',
        email: cleanEmail,
        state: appData.state || appData.city || 'National',
        joinDate: new Date().toLocaleDateString('en-GB'),
        feePaid: appData.amountPaid || '₹5,000',
        isVerified: true,
        status: 'Approved'
      });
      localStorage.setItem('bbsp_members_directory', JSON.stringify(filtered));
    } catch (e) {}

    return { success: true, memberId: memberCode };
  } catch (err) {
    console.error('Error approving member in Firestore:', err);
    return { success: false, memberId: memberCode };
  }
}

/**
 * Update general status for an application
 */
export async function updateSubmissionStatus(id: string, newStatus: string, email?: string): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();
  try {
    let success = false;
    try {
      await updateDoc(doc(db, 'submissions', id), {
        status: newStatus,
        isApproved: newStatus === 'Approved',
        updatedAt: serverTimestamp()
      });
      success = true;
    } catch (e) {}

    if (!success && cleanEmail) {
      const q = query(collection(db, 'submissions'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await updateDoc(d.ref, {
          status: newStatus,
          isApproved: newStatus === 'Approved',
          updatedAt: serverTimestamp()
        });
        success = true;
      }
    }
    return success;
  } catch (e) {
    console.error('Failed to update submission status:', e);
    return false;
  }
}

export default app;
