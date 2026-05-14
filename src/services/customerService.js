import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'customers';
const customersRef = collection(db, COLLECTION_NAME);

export const getCustomers = async () => {
  const snapshot = await getDocs(customersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCustomerById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addCustomer = async (customerData, customId = null) => {
  if (customId) {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, customerData);
    return { id: customId, ...customerData };
  } else {
    const docRef = await addDoc(customersRef, customerData);
    return { id: docRef.id, ...customerData };
  }
};

export const updateCustomer = async (id, customerData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, customerData);
  return { id, ...customerData };
};

export const deleteCustomer = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
};
