import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { amenityIcons } from '../../data/hotels';

export default function HotelDetailPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { hotels } = useData();
  const hotel = hotels.find(h => h.slug === slug);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Lightbox State
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    index: 0
  });

  const openLightbox = (imgs, idx = 0) => {
    setLightbox({
      isOpen: true,
      images: imgs,
      index: idx
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  };

  // Scroll takibi ile menü senkronizasyonu
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'rooms', 'amenities', 'location'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveTab(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hotel) return <div className="py-40 text-center font-black text-slate-400 uppercase tracking-widest">Otel bulunamadı.</div>;

  const name = lang === 'tr' ? hotel.nameTR : hotel.nameEN;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen">
      {/* 1. ÜST BAŞLIK VE ÖZET BAR */}
      <div className="bg-white border-b border-slate-100 py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-[#fcc01a]">
                {[...Array(hotel.category)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
              </div>
              <span className="text-[10px] font-black bg-blue-50 text-[#0073bc] px-2 py-0.5 rounded uppercase tracking-tighter">{hotel.location}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{name}</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">BAŞLAYAN GECELİK</div>
              <div className="text-2xl font-black text-[#056BFD]">₺{hotel.roomTypes[0]?.price.toLocaleString()}<span className="text-sm text-slate-400 font-bold ml-1">'den</span></div>
            </div>
            <button onClick={() => scrollToSection('rooms')} className="bg-[#056BFD] text-white px-8 py-3 rounded-2xl font-black hover:bg-[#0054cb] transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              ODA SEÇİMİ YAP
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pb-20">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* SOL ALAN: Galeri ve İçerik */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* DEV GALERİ (Premium Grid) */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div 
                className="col-span-3 row-span-2 relative group cursor-pointer overflow-hidden border-r-2 border-white"
                onClick={() => openLightbox(hotel.images, 0)}
              >
                <img src={hotel.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                  <span className="text-white font-black text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined">zoom_in</span> Tüm Fotoğrafları İncele
                  </span>
                </div>
              </div>
              <div className="col-span-1 row-span-1 overflow-hidden border-b-2 border-white cursor-pointer" onClick={() => openLightbox(hotel.images, 1)}>
                <img src={hotel.images[1] || hotel.images[0]} className="w-full h-full object-cover hover:scale-110 transition-all duration-500" alt="" />
              </div>
              <div className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer" onClick={() => openLightbox(hotel.images, 2)}>
                <img src={hotel.images[2] || hotel.images[0]} className="w-full h-full object-cover hover:scale-110 transition-all duration-500" alt="" />
                {hotel.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white pointer-events-none">
                    <span className="text-2xl font-black">+{hotel.images.length - 3}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Fotoğraf</span>
                  </div>
                )}
              </div>
            </div>

            {/* İÇERİK NAVİGASYON (Sticky) */}
            <div className="flex bg-white rounded-3xl p-2 shadow-xl border border-slate-100 sticky top-[100px] z-30 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'GENEL BAKIŞ', icon: 'info' },
                { id: 'rooms', label: 'ODA SEÇENEKLERİ', icon: 'bed' },
                { id: 'amenities', label: 'TESİS ÖZELLİKLERİ', icon: 'pool' },
                { id: 'location', label: 'KONUM & ULAŞIM', icon: 'map' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[11px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#056BFD] text-white shadow-xl' : 'text-slate-400 hover:text-slate-800'}`}
                >
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* BÖLÜMLER */}
            <div className="space-y-16">
              
              {/* Genel Bakış */}
              <section id="overview" className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-10 bg-[#056BFD] rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Otel Hakkında</h3>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
                    "{lang === 'tr' ? hotel.descriptionTR : hotel.descriptionEN}"
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-slate-50">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] mx-auto mb-4 group-hover:bg-[#056BFD] group-hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-3xl">waves</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PLAJ DURUMU</div>
                    <div className="text-sm font-black text-slate-800 uppercase">{hotel.sea || 'Denize Sıfır'}</div>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] mx-auto mb-4 group-hover:bg-[#056BFD] group-hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-3xl">restaurant</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PANSİYON</div>
                    <div className="text-sm font-black text-slate-800 uppercase">{hotel.concept}</div>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] mx-auto mb-4 group-hover:bg-[#056BFD] group-hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-3xl">location_city</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ŞEHİR MERKEZİ</div>
                    <div className="text-sm font-black text-slate-800 uppercase">2 KM</div>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#056BFD] mx-auto mb-4 group-hover:bg-[#056BFD] group-hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-3xl">flight</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HAVALİMANI</div>
                    <div className="text-sm font-black text-slate-800 uppercase">45 KM</div>
                  </div>
                </div>
              </section>

              {/* Oda Listesi (Tatil Sepeti Stili) */}
              <section id="rooms" className="scroll-mt-32 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-1.5 h-10 bg-[#056BFD] rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Oda Seçeneklerinizi İnceleyin</h3>
                </div>
                
                {hotel.roomTypes.map((room, idx) => (
                  <div key={idx} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-700">
                    <div className="md:w-[320px] h-[400px] md:h-auto relative overflow-hidden shrink-0 flex flex-col bg-slate-50">
                      <div className="flex-1 relative overflow-hidden cursor-pointer" onClick={() => openLightbox(room.images?.length > 0 ? room.images : [room.image || hotel.images[0]], 0)}>
                        <img 
                          src={(room.images && room.images.length > 0) ? room.images[0] : (room.image || hotel.images[0])} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          alt="" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#056BFD] shadow-sm">
                          {room.size} m² GENİŞLİK
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                        </div>
                      </div>
                      {room.images && room.images.length > 1 && (
                        <div className="p-2 grid grid-cols-4 gap-1.5 bg-white border-t border-slate-100">
                          {room.images.slice(0, 4).map((img, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:border-[#056BFD] transition-all" onClick={() => openLightbox(room.images, i)}>
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{lang === 'tr' ? room.nameTR : room.nameEN}</h4>
                          <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            ANINDA ONAY
                          </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                          <div className="flex items-center gap-3 group/item">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-[#056BFD] transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-xl">group</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{room.capacity} KİŞİ</span>
                          </div>
                          <div className="flex items-center gap-3 group/item">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-[#056BFD] transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-xl">bed</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{room.bed}</span>
                          </div>
                          <div className="flex items-center gap-3 group/item">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-[#056BFD] transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{room.view}</span>
                          </div>
                          <div className="flex items-center gap-3 group/item">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-[#056BFD] transition-colors shadow-sm">
                              <span className="material-symbols-outlined text-xl">task_alt</span>
                            </div>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">İPTAL HAKKI</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                          {(room.features || "").split(',').map((f, i) => (
                            <span key={i} className="text-[9px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">{f.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-10 pt-8 border-t-2 border-dashed border-slate-100">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GECELİK SATIŞ FİYATI</div>
                          <div className="text-3xl font-black text-slate-800">₺{room.price.toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={() => navigate(`/checkout?room=${room.id}&hotel=${hotel.id}`)}
                          className="bg-[#056BFD] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#003580] transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-xs"
                        >
                          ODA SEÇ VE İLERLE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Tesis Özellikleri */}
              <section id="amenities" className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 scroll-mt-32">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-1.5 h-10 bg-[#056BFD] rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tesis Olanakları</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {hotel.amenities.map(key => (
                    <div key={key} className="flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-[2.5rem] transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2 group border border-transparent hover:border-blue-100">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#056BFD] shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">
                          {amenityIcons[key]?.icon || 'star'}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center leading-tight">
                        {lang === 'tr' ? amenityIcons[key]?.tr : amenityIcons[key]?.en}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* SAĞ ALAN: Akıllı Fiyat Paneli (Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 sticky top-[100px] space-y-8 animate-in slide-in-from-right-8 duration-700">
              <div className="bg-[#003580] -mx-10 -mt-10 p-8 rounded-t-[3rem] text-center">
                <div className="text-white font-black text-xl uppercase tracking-tighter">REZERVASYONUNU TAMAMLA</div>
                <div className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mt-1">GÜVENLİ & HIZLI İŞLEM</div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-500/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KONAKLAMA TARİHLERİ</span>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#056BFD] transition-colors">calendar_month</span>
                  </div>
                  <div className="font-black text-slate-700 text-sm">01 Haziran 2026 - 06 Haziran 2026</div>
                  <div className="text-[10px] text-[#056BFD] font-black mt-1 uppercase tracking-tighter">TOPLAM 5 GECE</div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-500/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MİSAFİR SAYISI</span>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#056BFD] transition-colors">person_add</span>
                  </div>
                  <div className="font-black text-slate-700 text-sm">2 Yetişkin, 0 Çocuk</div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOPLAM ÖDENECEK</div>
                    <div className="text-xs text-slate-400 font-bold tracking-tight italic">Tüm vergiler dahildir.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-[#056BFD] tracking-tighter">₺{(hotel.roomTypes[0]?.price * 5).toLocaleString()}</div>
                    <div className="text-[9px] text-green-600 font-black uppercase tracking-widest mt-1 shadow-sm inline-block">EN İYİ FİYAT GARANTİSİ</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => scrollToSection('rooms')}
                  className="w-full bg-[#056BFD] text-white py-6 rounded-[2rem] font-black text-lg hover:bg-[#003580] transition-all shadow-2xl shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-4 group"
                >
                  ŞİMDİ REZERVE ET
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                </button>
              </div>

              <div className="flex items-center gap-4 justify-center text-slate-400 font-black">
                <span className="material-symbols-outlined text-xl">verified_user</span>
                <span className="text-[10px] uppercase tracking-[0.2em]">BYGLOBAL GÜVENCESİYLE</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300" onClick={closeLightbox}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 text-white z-10">
            <div className="font-black text-sm tracking-widest uppercase opacity-60">
              {lightbox.index + 1} / {lightbox.images.length} FOTOĞRAF
            </div>
            <button onClick={closeLightbox} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative flex items-center justify-center px-4 md:px-20">
            <button 
              onClick={prevImage}
              className="absolute left-6 md:left-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <span className="material-symbols-outlined text-3xl">chevron_left</span>
            </button>

            <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
              <img 
                src={lightbox.images[lightbox.index]} 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500" 
                alt="" 
              />
            </div>

            <button 
              onClick={nextImage}
              className="absolute right-6 md:right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <span className="material-symbols-outlined text-3xl">chevron_right</span>
            </button>
          </div>

          {/* Thumbnails Footer */}
          <div className="p-8 flex justify-center gap-3 overflow-x-auto no-scrollbar" onClick={e => e.stopPropagation()}>
            {lightbox.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setLightbox(prev => ({ ...prev, index: i }))}
                className={`w-20 h-14 rounded-lg overflow-hidden cursor-pointer transition-all border-2 shrink-0 ${lightbox.index === i ? 'border-[#056BFD] scale-110 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
