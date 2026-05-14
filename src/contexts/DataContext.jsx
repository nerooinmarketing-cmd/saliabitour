import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { hotels as initialHotels } from '../data/hotels';
import { tours as initialTours } from '../data/tours';
import { reservations as initialReservations } from '../data/reservations';
import { customers as initialCustomers } from '../data/customers';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load & Realtime Sync from Firebase
  useEffect(() => {
    // Listen for Hotels
    const unsubHotels = onSnapshot(collection(db, 'hotels'), async (snapshot) => {
      const hotelData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (hotelData.length > 0) {
        setHotels(hotelData);
      } else {
        // DB is empty, seed it with initial data so it's persistent
        console.log('Seeding hotels to Firestore...');
        for (const h of initialHotels) {
          await setDoc(doc(db, 'hotels', h.id), { ...h, status: 'active' });
        }
      }
    });

    // Listen for Tours
    const unsubTours = onSnapshot(collection(db, 'tours'), async (snapshot) => {
      const tourData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (tourData.length > 0) {
        setTours(tourData);
      } else {
        // DB is empty, seed it with initial data
        console.log('Seeding tours to Firestore...');
        for (const t of initialTours) {
          await setDoc(doc(db, 'tours', t.id), { ...t, status: 'active' });
        }
      }
    });

    // Listen for Reservations
    const unsubReservations = onSnapshot(collection(db, 'reservations'), async (snapshot) => {
      const resData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (resData.length > 0) {
        setReservations(resData);
      } else {
        console.log('Seeding reservations to Firestore...');
        for (const r of initialReservations) {
          await setDoc(doc(db, 'reservations', r.id), r);
        }
      }
    });

    // Listen for Customers
    const unsubCustomers = onSnapshot(collection(db, 'customers'), async (snapshot) => {
      const custData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (custData.length > 0) {
        setCustomers(custData);
      } else {
        console.log('Seeding customers to Firestore...');
        for (const c of initialCustomers) {
          await setDoc(doc(db, 'customers', c.id), c);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubHotels();
      unsubTours();
      unsubReservations();
      unsubCustomers();
    };
  }, []);

  // 2. Save Functions (Firebase)
  const saveHotel = async (hotelData) => {
    try {
      const hotelId = hotelData.id || doc(collection(db, 'hotels')).id;
      const docRef = doc(db, 'hotels', hotelId);
      await setDoc(docRef, { ...hotelData, id: hotelId }, { merge: true });
      console.log('Hotel saved to Firebase');
    } catch (e) {
      console.error('Error saving hotel to Firebase', e);
      // Local fallback in case of error
      localStorage.setItem('site_data_hotels', JSON.stringify([...hotels, hotelData]));
    }
  };

  const deleteHotel = async (id) => {
    try {
      await deleteDoc(doc(db, 'hotels', id));
    } catch (e) {
      console.error('Error deleting hotel from Firebase', e);
    }
  };

  const saveTour = async (tourData) => {
    try {
      const tourId = tourData.id || doc(collection(db, 'tours')).id;
      const docRef = doc(db, 'tours', tourId);
      await setDoc(docRef, { ...tourData, id: tourId }, { merge: true });
      console.log('Tour saved to Firebase');
    } catch (e) {
      console.error('Error saving tour to Firebase', e);
    }
  };

  const deleteTour = async (id) => {
    try {
      await deleteDoc(doc(db, 'tours', id));
    } catch (e) {
      console.error('Error deleting tour from Firebase', e);
    }
  };

  const saveReservation = async (resData) => {
    try {
      const resId = resData.id || doc(collection(db, 'reservations')).id;
      const docRef = doc(db, 'reservations', resId);
      await setDoc(docRef, { ...resData, id: resId }, { merge: true });
    } catch (e) {
      console.error('Error saving reservation to Firebase', e);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
    } catch (e) {
      console.error('Error deleting reservation from Firebase', e);
    }
  };

  const saveCustomer = async (custData) => {
    try {
      const custId = custData.id || doc(collection(db, 'customers')).id;
      const docRef = doc(db, 'customers', custId);
      await setDoc(docRef, { ...custData, id: custId }, { merge: true });
    } catch (e) {
      console.error('Error saving customer to Firebase', e);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (e) {
      console.error('Error deleting customer from Firebase', e);
    }
  };

  return (
    <DataContext.Provider value={{ 
      hotels, 
      tours, 
      reservations,
      customers,
      loading,
      saveHotel, 
      deleteHotel, 
      saveTour, 
      deleteTour,
      saveReservation,
      deleteReservation,
      saveCustomer,
      deleteCustomer    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
