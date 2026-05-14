import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'hotels';
const hotelsRef = collection(db, COLLECTION_NAME);

export const getHotels = async () => {
  const snapshot = await getDocs(hotelsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getHotelById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addHotel = async (hotelData, customId = null) => {
  if (customId) {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, hotelData);
    return { id: customId, ...hotelData };
  } else {
    const docRef = await addDoc(hotelsRef, hotelData);
    return { id: docRef.id, ...hotelData };
  }
};

export const updateHotel = async (id, hotelData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, hotelData);
  return { id, ...hotelData };
};

export const deleteHotel = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
};
