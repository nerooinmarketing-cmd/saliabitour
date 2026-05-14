import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'reservations';
const reservationsRef = collection(db, COLLECTION_NAME);

export const getReservations = async () => {
  const snapshot = await getDocs(reservationsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getReservationById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addReservation = async (reservationData, customId = null) => {
  if (customId) {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, reservationData);
    return { id: customId, ...reservationData };
  } else {
    const docRef = await addDoc(reservationsRef, reservationData);
    return { id: docRef.id, ...reservationData };
  }
};

export const updateReservation = async (id, reservationData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, reservationData);
  return { id, ...reservationData };
};

export const deleteReservation = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
};
