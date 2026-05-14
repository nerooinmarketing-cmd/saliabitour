import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SearchSidebar({ className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  
  // Default to package if on tours page, else hotel
  const [activeTab, setActiveTab] = useState(location.pathname.includes('/tours') ? 'package' : 'hotel');
  const [destination, setDestination] = useState(searchParams.get('q') || '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [children, setChildren] = useState('0');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Sync state with URL changes (when navigating via header menus)
  useEffect(() => {
    setActiveTab(location.pathname.includes('/tours') ? 'package' : 'hotel');
    const newQ = new URLSearchParams(location.search).get('q');
    setDestination(newQ || '');
  }, [location.pathname, location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests !== '2') params.set('guests', guests);
    if (children !== '0') params.set('children', children);
    
    if (activeTab === 'hotel') {
      navigate(`/hotels?${params.toString()}`);
    } else {
      navigate(`/tours?${params.toString()}`);
    }
  };

  return (
    <div className={`w-full lg:w-[320px] rounded-sm shadow-sm overflow-hidden flex flex-col shrink-0 border border-slate-200 bg-white ${className}`}>
      {/* Tabs */}
      <div className="flex bg-[#e9ecef]">
        <button 
          onClick={() => setActiveTab('hotel')}
          className={`flex-1 py-3 text-center text-xs font-bold transition-colors flex flex-col items-center gap-1 border-r border-white ${activeTab === 'hotel' ? 'bg-[#F0F0F0] text-[#24292E]' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hotel</span>
          {t('sidebar.hotel')}
        </button>
        <button 
          onClick={() => setActiveTab('package')}
          className={`flex-1 py-3 text-center text-xs font-bold transition-colors flex flex-col items-center gap-1 ${activeTab === 'package' ? 'bg-[#F0F0F0] text-[#24292E]' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
          {t('sidebar.packageTour')}
        </button>
      </div>

      {/* Search Body */}
      <div className="bg-[#F0F0F0] p-5 space-y-4 flex-1 flex flex-col">
        <h2 className="text-[#24292E] font-black text-lg flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined font-black">search</span>
          {activeTab === 'hotel' ? t('sidebar.searchHoliday') : activeTab === 'package' ? t('sidebar.searchTour') : t('sidebar.searchFlight')}
        </h2>

        <div className="space-y-1">
          <label className="text-[11px] text-[#24292E] font-bold tracking-tight">
            {activeTab === 'hotel' ? t('sidebar.destinationPlaceholderHotel') : activeTab === 'package' ? t('sidebar.destinationPlaceholderTour') : t('sidebar.destinationPlaceholderFlight')}
          </label>
          <input 
            type="text" 
            placeholder={activeTab === 'flight' ? t('sidebar.inputPlaceholderFlight') : t('sidebar.inputPlaceholder')}
            className="w-full bg-white border border-slate-200 rounded-sm px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#24292E] shadow-inner"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-[#24292E] font-bold tracking-tight">
              {activeTab === 'flight' ? t('sidebar.departureDate') : t('sidebar.checkIn')}
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-sm px-3 py-2.5 text-xs text-[#24292E] font-bold cursor-pointer outline-none" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-[#24292E] font-bold tracking-tight">
              {activeTab === 'flight' ? t('sidebar.returnDate') : t('sidebar.checkOut')}
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-sm px-3 py-2.5 text-xs text-[#24292E] font-bold cursor-pointer outline-none" 
              />
            </div>
          </div>
        </div>

        {activeTab !== 'flight' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[#24292E] font-bold tracking-tight">{t('sidebar.adult')}</label>
              <div className="bg-white border border-slate-200 rounded-sm flex items-center justify-between p-1">
                <button onClick={() => setGuests(Math.max(1, parseInt(guests) - 1).toString())} className="w-6 h-6 flex items-center justify-center text-[#24292E] font-black hover:bg-slate-100 rounded-sm text-lg leading-none">-</button>
                <span className="text-xs font-bold text-slate-700">{guests}</span>
                <button onClick={() => setGuests((parseInt(guests) + 1).toString())} className="w-6 h-6 flex items-center justify-center text-[#24292E] font-black hover:bg-slate-100 rounded-sm text-lg leading-none">+</button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#24292E] font-bold tracking-tight">{t('sidebar.child')}</label>
              <div className="bg-white border border-slate-200 rounded-sm flex items-center justify-between p-1">
                <button onClick={() => setChildren(Math.max(0, parseInt(children) - 1).toString())} className="w-6 h-6 flex items-center justify-center text-[#24292E] font-black hover:bg-slate-100 rounded-sm text-lg leading-none">-</button>
                <span className="text-xs font-bold text-slate-700">{children}</span>
                <button onClick={() => setChildren((parseInt(children) + 1).toString())} className="w-6 h-6 flex items-center justify-center text-[#24292E] font-black hover:bg-slate-100 rounded-sm text-lg leading-none">+</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotel' && (
          <label className="flex items-center gap-2 cursor-pointer group mt-2">
            <input 
              type="checkbox" 
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm border-slate-300 text-[#24292E] focus:ring-0 cursor-pointer" 
            />
            <span className="text-[11px] text-[#24292E] tracking-tight">{t('sidebar.availableOnly')}</span>
          </label>
        )}

        <button 
          onClick={handleSearch}
          className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 mt-auto rounded-sm transition-all text-sm shadow-md active:scale-[0.98]"
        >
          {activeTab === 'hotel' ? t('sidebar.searchHotelBtn') : activeTab === 'package' ? t('sidebar.searchTourBtn') : t('sidebar.searchFlightBtn')}
        </button>
      </div>
    </div>
  );
}
