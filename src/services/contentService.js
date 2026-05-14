import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

export const getContent = async (collectionName) => {
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getContentById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addContent = async (collectionName, data, customId = null) => {
  if (customId) {
    const docRef = doc(db, collectionName, customId);
    await setDoc(docRef, data);
    return { id: customId, ...data };
  } else {
    const ref = collection(db, collectionName);
    const docRef = await addDoc(ref, data);
    return { id: docRef.id, ...data };
  }
};

export const updateContent = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteContent = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return id;
};
