import { 
  collection, 
  addDoc, 
  doc,
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './config';
import { NotFoundError, ValidationError } from './errors';

export async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new NotFoundError(`Document not found in ${collectionName}`);
    }
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument(collectionName, docId, updates) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function queryDocuments(collectionName, conditions, orderByOptions) {
  try {
    const q = query(
      collection(db, collectionName),
      ...conditions.map(([field, op, value]) => where(field, op, value)),
      orderBy(orderByOptions.field, orderByOptions.direction)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error querying documents in ${collectionName}:`, error);
    throw error;
  }
}