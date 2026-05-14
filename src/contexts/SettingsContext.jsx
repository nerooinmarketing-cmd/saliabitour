import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const SettingsContext = createContext(null);

const DEFAULT_MENUS = [
  { id: 'hotels', path: '/hotels', label: 'Oteller', active: true },
  { id: 'tours', path: '/tours', label: 'Turlar', active: true },
  { id: 'cruise', path: '/tours?q=gemi', label: 'Gemi', active: false },
  { id: 'flight', path: '/tours?q=uçak', label: 'Uçak', active: false },
  { id: 'car', path: '/hotels?q=araç', label: 'Araç', active: false },
  { id: 'cyprus', path: '/hotels?q=kıbrıs', label: 'Kıbrıs Otelleri', active: true },
  { id: 'early_booking', path: '/hotels?q=erken', label: 'Erken Rezervasyon', active: true },
  { id: 'eid', path: '/tours?q=bayram', label: 'Bayram Turları', active: true },
  { id: 'campaign', path: '/tours?q=kampanya', label: 'Kampanyalar', active: true },
];

const DEFAULT_TOPBAR_MENUS = [
  { id: 'phone', icon: 'phone_in_talk', label: 'Telefon Numarası', value: '444 44 20', path: '', isPhone: true, active: true },
  { id: 'esim', icon: 'sim_card', label: 'eSIM Menüsü', value: 'eSIM', path: '/contact', active: true },
  { id: 'offices', icon: 'location_on', label: 'Satış Ofisleri Menüsü', value: 'Satış Ofisleri', path: '/contact', active: true },
  { id: 'add_hotel', icon: 'domain_add', label: 'Tesis Ekleme Menüsü', value: 'Tesisinizi Ekleyin', path: '/contact', active: true },
  { id: 'blog', icon: '', label: 'Blog Menüsü', value: 'Blog', path: '/blog', active: true },
];

const DEFAULT_UI_ELEMENTS = {
  topAnnouncement: { 
    text: 'Tüm Kartlara %5 Ek İndirim Fırsatını Kaçırma!', 
    linkText: 'HEMEN İNCELE', 
    linkPath: '/tours?q=kampanya', 
    visible: true,
    bgColor: 'var(--color-primary)' 
  },
  leftStickyPromo: { 
    text: '1.500 TL İNDİRİM', 
    path: '/tours', 
    visible: true 
  },
  whatsapp: { 
    number: '905322638775', 
    message: 'Merhaba, bilgi almak istiyorum.', 
    visible: true 
  },
  rightStickyButtons: { 
    visible: true 
  }
};

const DEFAULT_OFFICES = [
  { id: '1', name: 'Merkez Ofis', address: 'İstanbul, Şişli', phone: '0532 263 87 75', mapUrl: '' }
];

export function SettingsProvider({ children }) {
  const [menus, setMenus] = useState(DEFAULT_MENUS);
  const [topBarMenus, setTopBarMenus] = useState(DEFAULT_TOPBAR_MENUS);
  const [uiElements, setUiElements] = useState(DEFAULT_UI_ELEMENTS);
  const [salesOffices, setSalesOffices] = useState(DEFAULT_OFFICES);
  const [favorites, setFavorites] = useState([]);

  // Load from Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.menus) setMenus(data.menus);
        if (data.topBarMenus) setTopBarMenus(data.topBarMenus);
        if (data.uiElements) setUiElements(data.uiElements);
        if (data.salesOffices) setSalesOffices(data.salesOffices);
      } else {
        // Seed initial settings if none exist
        setDoc(doc(db, 'settings', 'site_config'), {
          menus: DEFAULT_MENUS,
          topBarMenus: DEFAULT_TOPBAR_MENUS,
          uiElements: DEFAULT_UI_ELEMENTS,
          salesOffices: DEFAULT_OFFICES
        });
      }
    });

    // Favorites stay in local storage as they are user-specific
    const savedFavorites = localStorage.getItem('site_favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    return () => unsub();
  }, []);

  const saveToFirebase = async (updates) => {
    const current = { menus, topBarMenus, uiElements, salesOffices };
    await setDoc(doc(db, 'settings', 'site_config'), { ...current, ...updates });
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFavorite = prev.some(f => f.id === item.id);
      let newFavorites = isFavorite ? prev.filter(f => f.id !== item.id) : [...prev, item];
      localStorage.setItem('site_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleMenu = (id) => {
    const newMenus = menus.map(m => m.id === id ? { ...m, active: !m.active } : m);
    setMenus(newMenus);
    saveToFirebase({ menus: newMenus });
  };

  const toggleTopBarMenu = (id) => {
    const newTop = topBarMenus.map(m => m.id === id ? { ...m, active: !m.active } : m);
    setTopBarMenus(newTop);
    saveToFirebase({ topBarMenus: newTop });
  };

  const updateTopBarMenu = (id, field, newValue) => {
    const newTop = topBarMenus.map(m => m.id === id ? { ...m, [field]: newValue } : m);
    setTopBarMenus(newTop);
    saveToFirebase({ topBarMenus: newTop });
  };

  const updateMenuLabel = (id, newLabel) => {
    const newMenus = menus.map(m => m.id === id ? { ...m, label: newLabel } : m);
    setMenus(newMenus);
    saveToFirebase({ menus: newMenus });
  };

  const updateUiElement = (element, field, value) => {
    const newUI = {
      ...uiElements,
      [element]: {
        ...uiElements[element],
        [field]: value
      }
    };
    setUiElements(newUI);
    saveToFirebase({ uiElements: newUI });
  };

  const addSalesOffice = (office) => {
    const newOffices = [...salesOffices, { ...office, id: Date.now().toString() }];
    setSalesOffices(newOffices);
    saveToFirebase({ salesOffices: newOffices });
  };

  const updateSalesOffice = (id, officeData) => {
    const newOffices = salesOffices.map(o => o.id === id ? { ...o, ...officeData } : o);
    setSalesOffices(newOffices);
    saveToFirebase({ salesOffices: newOffices });
  };

  const deleteSalesOffice = (id) => {
    const newOffices = salesOffices.filter(o => o.id !== id);
    setSalesOffices(newOffices);
    saveToFirebase({ salesOffices: newOffices });
  };

  return (
    <SettingsContext.Provider value={{ 
      menus, 
      topBarMenus, 
      uiElements,
      salesOffices,
      favorites,
      toggleMenu, 
      toggleTopBarMenu, 
      updateTopBarMenu, 
      updateMenuLabel,
      updateUiElement,
      addSalesOffice,
      updateSalesOffice,
      deleteSalesOffice,
      toggleFavorite
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
