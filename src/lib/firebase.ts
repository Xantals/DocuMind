import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DocumentItem, Folder, AuditLog, User } from '../types';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass database ID as second parameter
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}


// Test connection helper
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'check'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Auth functions
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
}

export async function logoutUser() {
  return firebaseSignOut(auth);
}

// Data Sync Helpers with Firestore

// Listeners / Collection Fetchers
export function subscribeToDocuments(onData: (documents: DocumentItem[]) => void, onError?: (err: Error) => void) {
  const path = 'documents';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const docs: DocumentItem[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as DocumentItem);
      });
      onData(docs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export function subscribeToFolders(onData: (folders: Folder[]) => void, onError?: (err: Error) => void) {
  const path = 'folders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const folders: Folder[] = [];
      snapshot.forEach((doc) => {
        folders.push({ id: doc.id, ...doc.data() } as Folder);
      });
      onData(folders);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export function subscribeToAuditLogs(onData: (logs: AuditLog[]) => void, onError?: (err: Error) => void) {
  const path = 'auditLogs';
  const q = query(collection(db, path), orderBy('timestamp', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AuditLog[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as AuditLog);
      });
      onData(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

// Write mutations
export async function saveDocumentToFirestore(document: DocumentItem) {
  const path = `documents/${document.id}`;
  try {
    await setDoc(doc(db, 'documents', document.id), document);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateDocumentInFirestore(documentId: string, updates: Partial<DocumentItem>) {
  const path = `documents/${documentId}`;
  try {
    await updateDoc(doc(db, 'documents', documentId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDocumentFromFirestore(documentId: string) {
  const path = `documents/${documentId}`;
  try {
    await deleteDoc(doc(db, 'documents', documentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveFolderToFirestore(folder: Folder) {
  const path = `folders/${folder.id}`;
  try {
    await setDoc(doc(db, 'folders', folder.id), folder);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addAuditLogToFirestore(log: AuditLog) {
  const path = `auditLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'auditLogs', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveInitialDataIfEmpty(
  initialDocs: DocumentItem[],
  initialFolders: Folder[],
  initialLogs: AuditLog[]
) {
  try {
    const docsSnap = await getDocs(collection(db, 'documents'));
    if (docsSnap.empty) {
      console.log("Seeding initial documents into Firestore...");
      for (const d of initialDocs) {
        await saveDocumentToFirestore(d);
      }
    }

    const foldersSnap = await getDocs(collection(db, 'folders'));
    if (foldersSnap.empty) {
      console.log("Seeding initial folders into Firestore...");
      for (const f of initialFolders) {
        await saveFolderToFirestore(f);
      }
    }

    const logsSnap = await getDocs(collection(db, 'auditLogs'));
    if (logsSnap.empty) {
      console.log("Seeding initial audit logs into Firestore...");
      for (const l of initialLogs) {
        await addAuditLogToFirestore(l);
      }
    }
  } catch (err) {
    console.error("Error seeding initial Firestore data:", err);
  }
}
