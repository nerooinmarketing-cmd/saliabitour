import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'tours';
const toursRef = collection(db, COLLECTION_NAME);

export const getTours = async () => {
  const snapshot = await getDocs(toursRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTourById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addTour = async (tourData, customId = null) => {
  if (customId) {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, tourData);
    return { id: customId, ...tourData };
  } else {
    const docRef = await addDoc(toursRef, tourData);
    return { id: docRef.id, ...tourData };
  }
};

export const updateTour = async (id, tourData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, tourData);
  return { id, ...tourData };
};

export const deleteTour = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
};
