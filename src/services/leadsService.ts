import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { OperationType, db, handleFirestoreError } from '../firebase';
import { CareerApplicationInput, ConsultationFormInput } from '../utils/validation';
import {
  ApplicationLeadRecord,
  ApplicationStatus,
  EnquiryLeadRecord,
  EnquiryStatus,
  TrackingRecord,
  generateDocumentId,
  generateUniqueReferenceId,
  isValidTrackingReferenceId,
  normalizeTrackingReferenceId,
  sanitizeCareerPayload,
  sanitizeEnquiryPayload,
  sanitizePublicUpdateText,
  sanitizeTrackingCreatePayload,
} from '../utils/leadsHelpers';

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  return Date.now();
}

export async function createConsultationEnquiry(
  input: ConsultationFormInput
): Promise<{ id: string; referenceId: string }> {
  const id = generateDocumentId('enq');
  const referenceId = generateUniqueReferenceId('TCS');
  const payload = sanitizeEnquiryPayload(input, referenceId);
  const trackingPayload = sanitizeTrackingCreatePayload({
    referenceId,
    sourceId: id,
    recordType: 'enquiry',
    categoryLabel: `${payload.service} · ${payload.industry}`,
  });
  const path = `enquiries/${id}`;

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'enquiries', id), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'enquiry_status', referenceId), {
      ...trackingPayload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return { id, referenceId };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createCareerApplication(
  input: CareerApplicationInput,
  jobId: string,
  jobTitle: string
): Promise<{ id: string; referenceId: string }> {
  const id = generateDocumentId('app');
  const referenceId = generateUniqueReferenceId('JOB');
  const payload = sanitizeCareerPayload(input, jobId, jobTitle, referenceId);
  const trackingPayload = sanitizeTrackingCreatePayload({
    referenceId,
    sourceId: id,
    recordType: 'application',
    categoryLabel: payload.jobTitle,
  });
  const path = `applications/${id}`;

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'applications', id), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'enquiry_status', referenceId), {
      ...trackingPayload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
    return { id, referenceId };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchTrackingStatusByReferenceId(
  rawReferenceId: string
): Promise<TrackingRecord | null> {
  const refId = normalizeTrackingReferenceId(rawReferenceId);
  if (!isValidTrackingReferenceId(refId)) {
    return null;
  }
  const path = `enquiry_status/${refId}`;
  try {
    const snap = await getDoc(doc(db, 'enquiry_status', refId));
    if (!snap.exists()) {
      return null;
    }
    const d = snap.data();
    return {
      referenceId: String(d.referenceId ?? refId),
      sourceId: String(d.sourceId ?? ''),
      recordType: d.recordType === 'application' ? 'application' : 'enquiry',
      categoryLabel: String(d.categoryLabel ?? ''),
      status: (d.status as EnquiryStatus | ApplicationStatus) ?? 'New',
      publicUpdate: typeof d.publicUpdate === 'string' ? d.publicUpdate : '',
      createdAtMs: toMillis(d.createdAt),
      updatedAtMs: toMillis(d.updatedAt),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function checkIsAdminRecord(uid: string): Promise<boolean> {
  const path = `admins/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      return false;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToEnquiries(
  onData: (items: EnquiryLeadRecord[]) => void,
  onError: (err: Error) => void
): () => void {
  const path = 'enquiries';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: EnquiryLeadRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          referenceId: String(d.referenceId ?? ''),
          fullName: String(d.fullName ?? ''),
          companyName: String(d.companyName ?? ''),
          email: String(d.email ?? ''),
          phone: String(d.phone ?? ''),
          industry: String(d.industry ?? ''),
          service: String(d.service ?? ''),
          message: String(d.message ?? ''),
          status: (d.status as EnquiryStatus) ?? 'New',
          notes: typeof d.notes === 'string' ? d.notes : '',
          publicUpdate: typeof d.publicUpdate === 'string' ? d.publicUpdate : '',
          createdAtMs: toMillis(d.createdAt),
          updatedAtMs: toMillis(d.updatedAt),
        };
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeToApplications(
  onData: (items: ApplicationLeadRecord[]) => void,
  onError: (err: Error) => void
): () => void {
  const path = 'applications';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: ApplicationLeadRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          referenceId: String(d.referenceId ?? ''),
          jobId: String(d.jobId ?? ''),
          jobTitle: String(d.jobTitle ?? ''),
          fullName: String(d.fullName ?? ''),
          email: String(d.email ?? ''),
          phone: String(d.phone ?? ''),
          experienceYears: String(d.experienceYears ?? ''),
          preferredLanguage: String(d.preferredLanguage ?? ''),
          coverNote: typeof d.coverNote === 'string' ? d.coverNote : '',
          status: (d.status as ApplicationStatus) ?? 'New',
          publicUpdate: typeof d.publicUpdate === 'string' ? d.publicUpdate : '',
          createdAtMs: toMillis(d.createdAt),
          updatedAtMs: toMillis(d.updatedAt),
        };
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function updateEnquiryLead(
  lead: EnquiryLeadRecord,
  status: EnquiryStatus,
  notes: string,
  publicUpdate: string = lead.publicUpdate ?? ''
): Promise<void> {
  const path = `enquiries/${lead.id}`;
  const cleanNotes = notes.trim().slice(0, 2000);
  const cleanPublicUpdate = sanitizePublicUpdateText(publicUpdate);

  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'enquiries', lead.id), {
      status,
      notes: cleanNotes,
      publicUpdate: cleanPublicUpdate,
      updatedAt: serverTimestamp(),
    });

    if (isValidTrackingReferenceId(lead.referenceId)) {
      const statusRef = doc(db, 'enquiry_status', lead.referenceId);
      const existingTrack = await getDoc(statusRef);
      if (existingTrack.exists()) {
        batch.update(statusRef, {
          status,
          publicUpdate: cleanPublicUpdate,
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.set(statusRef, {
          referenceId: lead.referenceId,
          sourceId: lead.id,
          recordType: 'enquiry',
          categoryLabel: `${lead.service} · ${lead.industry}`.slice(0, 180),
          status,
          publicUpdate: cleanPublicUpdate,
          createdAt: Timestamp.fromMillis(lead.createdAtMs),
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateApplicationStatus(
  app: ApplicationLeadRecord,
  status: ApplicationStatus,
  publicUpdate: string = app.publicUpdate ?? ''
): Promise<void> {
  const path = `applications/${app.id}`;
  const cleanPublicUpdate = sanitizePublicUpdateText(publicUpdate);

  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'applications', app.id), {
      status,
      publicUpdate: cleanPublicUpdate,
      updatedAt: serverTimestamp(),
    });

    if (isValidTrackingReferenceId(app.referenceId)) {
      const statusRef = doc(db, 'enquiry_status', app.referenceId);
      const existingTrack = await getDoc(statusRef);
      if (existingTrack.exists()) {
        batch.update(statusRef, {
          status,
          publicUpdate: cleanPublicUpdate,
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.set(statusRef, {
          referenceId: app.referenceId,
          sourceId: app.id,
          recordType: 'application',
          categoryLabel: app.jobTitle.slice(0, 180),
          status,
          publicUpdate: cleanPublicUpdate,
          createdAt: Timestamp.fromMillis(app.createdAtMs),
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteLeadDocument(
  collectionName: 'enquiries' | 'applications',
  id: string,
  referenceId?: string
): Promise<void> {
  const path = `${collectionName}/${id}`;
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, collectionName, id));
    if (referenceId && isValidTrackingReferenceId(referenceId)) {
      batch.delete(doc(db, 'enquiry_status', normalizeTrackingReferenceId(referenceId)));
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
