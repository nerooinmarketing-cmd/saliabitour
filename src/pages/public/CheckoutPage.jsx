import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useData } from '../../contexts/DataContext';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite, favorites } = useSettings();
  const { hotels, tours, saveReservation, saveCustomer } = useData();
  
  const roomId = searchParams.get('room');
  const tourId = searchParams.get('tour');
  const checkIn = searchParams.get('checkin');
  const checkOut = searchParams.get('checkout');
  const adults = searchParams.get('adults') || 2;
  const children = searchParams.get('children') || 0;

  // Find the hotel/room or tour
  const hotel = roomId ? hotels.find(h => h.roomTypes?.some(r => r.id === roomId)) : null;
  const room = roomId ? hotel?.roomTypes?.find(r => r.id === roomId) : null;
  const tour = tourId ? tours.find(t => t.id === tourId) : null;

  const item = room || tour;

  const [step, setStep] = useState('review');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    notes: ''
  });

  // Login sonrası form verilerini geri yükle
  useEffect(() => {
    const pending = sessionStorage.getItem('pending_booking');
    if (pending && isAuthenticated) {
      try {
        const data = JSON.parse(pending);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: user?.email || data.email || '',
          phone: data.phone || '',
          notes: data.notes || ''
        });
        // Veriyi geri yükledikten sonra temizle
        sessionStorage.removeItem('pending_booking');
      } catch (e) {
        console.error('Pending booking parse error', e);
      }
    }
  }, [isAuthenticated, user]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = item?.price ? (room ? item.price * nights : item.price) : 0;

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    
    // Form verilerini kontrol et
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Lütfen zorunlu alanları (Ad, Soyad, Telefon) doldurunuz.');
      return;
    }

    if (!isAuthenticated) {
      // Form verilerini login sonrası geri yüklemek için geçici olarak sakla
      sessionStorage.setItem('pending_booking', JSON.stringify({
        ...formData,
        roomId,
        checkIn,
        checkOut,
        adults,
        children
      }));
      
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Rezervasyonu Firebase'e kaydet
    const reservationId = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    const customerId = user?.uid || 'CUST-' + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      id: reservationId,
      customerId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      type: room ? 'hotel' : 'tour',
      itemId: room ? roomId : tourId,
      itemName: lang === 'tr' ? (room?.nameTR || tour?.titleTR) : (room?.nameEN || tour?.titleEN),
      date: checkIn || new Date().toISOString().split('T')[0],
      endDate: checkOut || (tour ? new Date().toISOString().split('T')[0] : ''),
      guests: Number(adults) + Number(children),
      amount: totalPrice,
      currency: 'TRY',
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: formData.notes,
      adminNotes: '',
      createdAt: new Date().toISOString(),
      ...formData
    };

    const newCustomer = {
      id: customerId,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      lastReservation: new Date().toISOString().split('T')[0],
      notes: ''
    };

    try {
      await saveReservation(newBooking);
      await saveCustomer(newCustomer);
      
      alert('Rezervasyonunuz başarıyla tamamlandı! Rezervasyonlarım sayfasına yönlendiriliyorsunuz.');
      navigate('/admin/reservations'); 
    } catch (error) {
      console.error('Booking error:', error);
      alert('Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  if (!item) return (
    <div className="pt-32 text-center py-20 bg-[#f4f4f4] min-h-screen">
      <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-sm">
        <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">inventory_2</span>
        <h2 className="text-xl font-black text-slate-800 mb-2">Öğe Bulunamadı</h2>
        <p className="text-sm text-slate-500 mb-6">Lütfen otel veya tur sayfasından tekrar bir seçim yapınız.</p>
        <Link to="/tours" className="bg-[#0073bc] text-white px-6 py-3 rounded-lg font-bold text-sm">Turlara Dön</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f4f4f4] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-8 space-y-6">
            
            {step === 'review' ? (
              // STEP 1: REVIEW
              <div className="animate-fade-in">
                <h1 className="text-3xl font-black text-slate-800 mb-8">{room ? 'Oda İncelemesi' : 'Tur İncelemesi'}</h1>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden group">
                    <img src={item.images ? item.images[0] : item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={lang === 'tr' ? (item.nameTR || item.titleTR) : (item.nameEN || item.titleEN)} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-[#056BFD]">
                      {room ? `${room.size} m² GENİŞLİK` : tour?.duration}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-6">{lang === 'tr' ? (item.nameTR || item.titleTR) : (item.nameEN || item.titleEN)}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD]">
                        <span className="material-symbols-outlined text-2xl">group</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Kapasite</span>
                        <span className="text-xs font-black text-slate-800 uppercase">{room ? `${room.capacity} Kişi` : tour?.maxParticipants}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD]">
                        <span className="material-symbols-outlined text-2xl">{room ? 'bed' : 'schedule'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{room ? 'Yatak' : 'Süre'}</span>
                        <span className="text-xs font-black text-slate-800 uppercase">{room ? room.bed : tour?.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD]">
                        <span className="material-symbols-outlined text-2xl">{room ? 'visibility' : 'location_on'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{room ? 'Manzara' : 'Konum'}</span>
                        <span className="text-xs font-black text-slate-800 uppercase">{room ? room.view : tour?.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-2xl">task_alt</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Durum</span>
                        <span className="text-xs font-black text-green-700 uppercase">Uygun</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-10 pt-8 border-t border-slate-100">
                    {(room ? (room.features || "") : "").split(',').filter(f => f).map((f, i) => (
                      <span key={i} className="text-[10px] font-black bg-slate-50 text-slate-500 px-4 py-2 rounded-xl uppercase tracking-wider">{f.trim()}</span>
                    ))}
                    {tour && tour.includedServices?.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-[10px] font-black bg-blue-50 text-blue-500 px-4 py-2 rounded-xl uppercase tracking-wider">{lang === 'tr' ? s.tr : s.en}</span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
                    <button 
                      onClick={() => toggleFavorite({ id: item.id, name: lang === 'tr' ? (item.nameTR || item.titleTR) : (item.nameEN || item.titleEN), type: room ? 'hotel' : 'tour', image: item.images ? item.images[0] : item.image })}
                      className={`flex-1 py-5 rounded-2xl font-black transition-all shadow-sm uppercase tracking-widest text-sm flex items-center justify-center gap-2 border-2 ${favorites.some(f => f.id === item.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-[#056BFD] text-[#056BFD] hover:bg-blue-50'}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.some(f => f.id === item.id) ? "'FILL' 1" : "" }}>favorite</span> 
                      {favorites.some(f => f.id === item.id) ? 'Favorilerimde' : 'Favorilere Ekle'}
                    </button>
                    <button 
                      onClick={() => setStep('form')}
                      className="flex-1 bg-[#056BFD] text-white py-5 rounded-2xl font-black hover:bg-[#0040a0] transition-colors shadow-xl shadow-blue-500/30 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                      Rezervasyon Yap <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // STEP 2: FORM
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep('review')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-[#056BFD] shadow-sm transition-colors border border-slate-200">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <h1 className="text-3xl font-black text-slate-800">Rezervasyon Detayları</h1>
                </div>
                
                {/* Guest Info Form */}
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0073bc]">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Misafir ve İletişim Bilgileri</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Adınız</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Örn: Ahmet"
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Soyadınız</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Örn: Yılmaz"
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">E-posta</label>
                        <input 
                          type="email" 
                          required
                          placeholder="ahmet@ornek.com"
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Telefon</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="05xx xxx xx xx"
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extra Requests Section */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0073bc]">
                        <span className="material-symbols-outlined">edit_note</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Ek İstekler ve Notlar</h2>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-4 font-bold uppercase tracking-wider">Otelden özel bir ricanız varsa lütfen belirtiniz</p>
                    <textarea 
                      rows="4"
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all resize-none"
                      placeholder="Örn: Balayı konsepti, Havalimanı transferi, Sessiz oda..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-[#003580]">
                    <span className="material-symbols-outlined text-lg">info</span>
                    <p className="text-[11px] font-bold uppercase">Rezervasyonu tamamlayarak <button type="button" className="underline">İptal Koşullarını</button> ve <button type="button" className="underline">Mesafeli Satış Sözleşmesini</button> kabul etmiş sayılırsınız.</p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-[#003580] p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-black uppercase tracking-widest text-[10px] opacity-60 mb-2">Konaklama Özeti</h3>
                    <div className="text-xl font-black leading-tight">{hotel ? (lang === 'tr' ? hotel.nameTR : hotel.nameEN) : (lang === 'tr' ? tour?.titleTR : tour?.titleEN)}</div>
                    {hotel && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(hotel.category)].map((_, i) => <span key={i} className="material-symbols-outlined text-[14px] text-[#fcc01a]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                      </div>
                    )}
                  </div>
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12">{room ? 'hotel' : 'explore'}</span>
                </div>
                
                  <div className="p-8 space-y-8">
                    {/* Dates */}
                    {room && (
                      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                        <div className="text-center flex-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Giriş</div>
                          <div className="text-sm font-black text-slate-800">{checkIn || 'Seçilmedi'}</div>
                        </div>
                        <div className="px-4">
                          <span className="material-symbols-outlined text-slate-200">arrow_forward</span>
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Çıkış</div>
                          <div className="text-sm font-black text-slate-800">{checkOut || 'Seçilmedi'}</div>
                        </div>
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="border-b border-slate-100 pb-6">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-3">{room ? 'Oda ve Konsept' : 'Tur Detayı'}</div>
                      <div className="flex gap-4">
                        <img 
                          src={room ? ((room.images && room.images.length > 0) ? room.images[0] : (room.image || hotel?.images?.[0])) : (tour?.images?.[0] || tour?.image)} 
                          className="w-20 h-20 object-cover rounded-xl shadow-sm" 
                          alt={lang === 'tr' ? (item.nameTR || item.titleTR) : (item.nameEN || item.titleEN)} 
                        />
                        <div>
                          <div className="text-sm font-black text-slate-800 mb-1">{lang === 'tr' ? (item.nameTR || item.titleTR) : (item.nameEN || item.titleEN)}</div>
                          <div className="bg-blue-50 text-[#0073bc] text-[10px] font-black px-2 py-1 rounded uppercase inline-block">{room ? 'Ultra Her Şey Dahil' : tour?.duration}</div>
                          <div className="text-[11px] text-slate-400 font-bold mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">group</span> {adults} Yetişkin{children > 0 ? `, ${children} Çocuk` : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>{room ? `${nights} Gece Konaklama` : 'Tur Katılım Ücreti'}</span>
                        <span>₺{totalPrice.toLocaleString()}</span>
                      </div>
                    <div className="flex justify-between text-xs font-bold text-green-600">
                      <span>Online Ödeme İndirimi</span>
                      <span>-₺0</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-black text-slate-800 uppercase">Ödenecek Tutar</span>
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#003580]">₺{totalPrice.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">KDV Dahil</div>
                      </div>
                    </div>
                  </div>

                  {step === 'review' ? (
                    <button 
                      onClick={() => setStep('form')}
                      className="w-full bg-[#0073bc] hover:bg-[#0054cb] text-white font-black py-4 rounded-xl transition-all shadow-xl hover:shadow-[#0073bc]/20 uppercase text-sm tracking-widest active:scale-[0.98]"
                    >
                      Rezervasyon Formuna Geç
                    </button>
                  ) : (
                    <button 
                      onClick={handleBooking}
                      className="w-full bg-[#0073bc] hover:bg-[#0054cb] text-white font-black py-4 rounded-xl transition-all shadow-xl hover:shadow-[#0073bc]/20 uppercase text-sm tracking-widest active:scale-[0.98]"
                    >
                      Rezervasyonu Onayla
                    </button>
                  )}
                </div>
              </div>

              {/* Secure Info */}
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3 border border-green-100">
                <span className="material-symbols-outlined text-green-600">verified_user</span>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Kredi kartı bilgileriniz 256-bit SSL ile şifrelenmektedir.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
