import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import SearchSidebar from '../../components/common/SearchSidebar';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { hotels, tours } = useData();
  const [recTab, setRecTab] = useState('Antalya Otelleri');
  
  const featuredTours = tours.filter(tour => tour.featured && tour.status !== 'inactive').slice(0, 3);

  const categories = [
    { label: 'Kurban Bayramı Sanatçı Otelleri', icon: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop' },
    { label: 'Kurban Bayramı Otelleri', icon: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=200&h=200&fit=crop' },
    { label: 'Kurban Bayramı Turları', icon: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&h=200&fit=crop' },
    { label: 'Uçaklı Kıbrıs Otelleri', icon: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=200&h=200&fit=crop' },
    { label: 'Termal Oteller', icon: 'https://images.unsplash.com/photo-1544161515-4ae6b918abd8?w=200&h=200&fit=crop' },
    { label: 'Yakın Bölge Otelleri', icon: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=200&h=200&fit=crop' },
    { label: 'Vizesiz Balkan Turları', icon: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=200&h=200&fit=crop' },
    { label: 'Asya ve Uzak Doğu Turları', icon: 'https://images.unsplash.com/photo-1464817739973-0128fe79aa19?w=200&h=200&fit=crop' },
    { label: 'Erken Rezervasyon Gemi Turları', icon: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=200&h=200&fit=crop' },
    { label: 'İzole Havuzlu Oteller', icon: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=200&h=200&fit=crop' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Box (Sidebar) - Left */}
          <SearchSidebar />

          {/* Right Side Promos */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Main Big Promo */}
            <div 
              onClick={() => navigate('/hotels/sherwood-hotels')}
              className="flex bg-[#24292E] rounded-sm overflow-hidden h-[230px] relative shadow-sm border border-slate-200 cursor-pointer group"
            >
              {/* Left Content Area */}
              <div className="w-[45%] p-6 flex flex-col text-white z-10 relative">
                 <h3 className="font-bold text-xl leading-tight">Sy Hotels Luxury Belek</h3>
                 <p className="text-[11px] text-white/80 mb-4 mt-1">Antalya - Serik</p>
                 
                 <div className="text-primary text-[12px] font-bold mb-4 leading-tight bg-white/10 w-fit px-2 py-1 rounded">
                   Erken Rezervasyon<br/>%30 İndirim + 9 Taksit
                 </div>
                 
                 <div className="mt-auto">
                    <div className="text-white/60 text-[11px] line-through">6.370,00 TL</div>
                    <div className="text-4xl font-black tracking-tighter">4.459<span className="text-sm font-bold tracking-normal">,00 TL</span></div>
                 </div>
                 
                 <button className="mt-3 bg-primary text-white px-4 py-1.5 text-[11px] font-bold rounded-sm w-fit hover:bg-secondary transition-colors shadow-lg">
                   Fırsatı İncele
                 </button>
              </div>

              {/* Red Swoosh Divider */}
              <div className="absolute left-[45%] -translate-x-[60%] top-[-20%] bottom-[-20%] w-[120px] bg-primary rounded-[50%] z-10 opacity-90 transition-transform group-hover:scale-110"></div>
              {/* White curve shadow trick */}
              <div className="absolute left-[45%] -translate-x-[50%] top-[-20%] bottom-[-20%] w-[120px] bg-white rounded-[50%] z-[5]"></div>

              {/* Right Image Area */}
              <div className="w-[55%] relative z-0">
                 <img src="https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=800&h=600&fit=crop" className="w-full h-full object-cover" alt="Otel" />
                 
                 {/* Pagination Dots */}
                 <div className="absolute bottom-4 right-6 flex gap-1.5">
                   {[1, 2, 3, 4, 5, 6, 7].map(i => (
                     <div key={i} className={`w-2.5 h-2.5 rounded-full border border-white cursor-pointer ${i === 1 ? 'bg-primary border-primary' : 'bg-transparent'}`}></div>
                   ))}
                 </div>
              </div>
            </div>

            {/* 3 Small Promos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[160px]">
              {[
                { 
                  title: 'Şehir Otellerinde 1250 TL İndirim!', 
                  overlayText: 'Şehir Otellerinde\n1.250 ₺\'ye Varan\nİndirim Kuponu', 
                  img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
                  path: '/hotels?q=şehir'
                },
                { 
                  title: 'Juzdan İle Öde\'ye Özel 7.500 TL\'ye Varan Chip Para Fırsatı!', 
                  overlayText: 'Juzdan ile Öde\'ye\nözel 7.500 TL\'ye\nvaran chip-para\nkazan!', 
                  img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop',
                  hideOverlayBackground: true,
                  path: '/tours?q=kampanya'
                },
                { 
                  title: 'Bn Hotel Thermal Wellness\'da Tatil Fırsatını Kaçırma!', 
                  overlayText: '', 
                  img: 'https://images.unsplash.com/photo-1544161515-4ae6b918abd8?w=400&h=300&fit=crop',
                  path: '/hotels/sherwood-hotels' // Mock detail
                },
              ].map((promo, i) => (
                <div key={i} onClick={() => navigate(promo.path)} className="bg-[#F0F0F0] rounded-sm border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-lg transition-all flex flex-col">
                  <div className="h-[75%] overflow-hidden relative">
                    <img src={promo.img} className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700" alt="Kampanya" />
                    {!promo.hideOverlayBackground && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                        {promo.overlayText && <h4 className="text-white font-black text-center text-[18px] leading-[1.1] drop-shadow-md whitespace-pre-line">{promo.overlayText}</h4>}
                      </div>
                    )}
                    {promo.hideOverlayBackground && promo.overlayText && (
                      <div className="absolute inset-0 flex p-4">
                        <h4 className="text-[#24292E] font-black text-[16px] leading-[1.1] drop-shadow-sm whitespace-pre-line bg-[#F0F0F0]/90 backdrop-blur-sm p-2 h-fit rounded-lg">{promo.overlayText}</h4>
                      </div>
                    )}
                  </div>
                  <div className="h-[25%] p-2 flex items-center justify-center border-t border-slate-200">
                    <p className="text-[#24292E] text-[10px] font-bold text-center leading-tight line-clamp-2 px-2">{promo.title}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Categories Row (Round squares at the bottom) */}
        <div className="flex overflow-x-auto gap-8 pt-10 pb-4 scrollbar-hide no-scrollbar items-center justify-center w-full">
          {[
            { q: 'antalya', label: 'Antalya Otelleri', img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=200&h=200&fit=crop', type: 'hotel' },
            { q: 'kıbrıs', label: 'Kıbrıs Otelleri', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=200&h=200&fit=crop', type: 'hotel' },
            { q: 'termal', label: 'Termal Oteller', img: 'https://images.unsplash.com/photo-1544161515-4ae6b918abd8?w=200&h=200&fit=crop', type: 'hotel' },
            { q: 'şehir', label: 'Şehir Otelleri', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop', type: 'hotel' },
            { q: 'yurtdisi', label: 'Yurtdışı Turları', img: 'https://images.unsplash.com/photo-1464817739973-0128fe79aa19?w=200&h=200&fit=crop', type: 'tour' },
            { q: 'kultur', label: 'Kültür Turları', img: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=200&h=200&fit=crop', type: 'tour' },
            { q: 'gemi', label: 'Gemi Turları', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=200&h=200&fit=crop', type: 'tour' },
            { q: 'bayram', label: 'Bayram Turları', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop', type: 'tour' },
          ].map((cat, i) => (
            <div key={i} onClick={() => navigate(cat.type === 'hotel' ? `/hotels?q=${cat.q}` : `/tours?q=${cat.q}`)} className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
              <div className={`w-[95px] h-[95px] rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-sm ${i === 0 ? 'border-primary scale-105 shadow-md' : 'border-transparent group-hover:border-primary group-hover:-translate-y-1'}`}>
                <img src={cat.img} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" alt={cat.label} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 relative">

        {/* Banner Header */}
        <div className="bg-[#24292E] text-white flex justify-between items-center px-6 py-4 rounded-t-md mb-6 shadow-md border-b-4 border-primary">
          <h2 className="text-3xl font-black italic tracking-tight">ByTour Öneriyor!</h2>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold bg-[#14171a] px-4 py-1.5 rounded text-white shadow-inner">Bu Otellerde %50'ye Varan İndirim Fırsatı Var!</span>
            <button className="bg-primary text-white px-6 py-1.5 rounded font-black text-sm hover:bg-secondary transition-colors uppercase tracking-wider shadow-lg">Hemen İncele!</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 bg-white overflow-x-auto no-scrollbar relative">
          {['Antalya Otelleri', 'Ege Otelleri', 'Kıbrıs Otelleri', 'Termal Oteller', 'Şehir Otelleri', 'Kapadokya Otelleri', 'İstanbul\'a Yakın Oteller'].map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setRecTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-r border-slate-100 ${recTab === tab ? 'bg-primary text-white' : 'text-[#24292E] hover:bg-[#F0F0F0]'}`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 px-4 border-l border-slate-100">
            <button className="text-slate-300 hover:text-[#24292E]"><span className="material-symbols-outlined">arrow_back_ios</span></button>
            <button className="text-slate-300 hover:text-[#24292E]"><span className="material-symbols-outlined">arrow_forward_ios</span></button>
          </div>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {hotels
            .filter(h => h.status !== 'inactive')
            .filter(h => recTab === 'Antalya Otelleri' ? h.location.includes('Antalya') : 
                        recTab === 'Ege Otelleri' ? (h.location.includes('Bodrum') || h.location.includes('Muğla') || h.location.includes('Fethiye')) :
                        recTab === 'Kıbrıs Otelleri' ? h.location.includes('Kıbrıs') :
                        recTab === 'Termal Oteller' ? h.nameTR.toLowerCase().includes('thermal') :
                        h.location.includes(recTab.split(' ')[0]))
            .slice(0, 4).map((hotel, idx) => {
            const oldPrice = hotel.roomTypes[0]?.price * 1.6 || 8500;
            const newPrice = hotel.roomTypes[0]?.price || 5300;
            return (
              <div key={idx} onClick={() => navigate(`/hotels/${hotel.slug}`)} className="bg-[#F0F0F0] flex flex-col group cursor-pointer hover:shadow-lg transition-all border border-slate-200 rounded-sm overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img src={hotel.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={hotel.nameTR} />
                  {/* Fire Red Discount Tag */}
                  <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-md">
                    %40 İNDİRİM
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col text-center bg-[#F0F0F0]">
                  <h3 className="text-[#24292E] font-black text-sm leading-tight mb-1">{hotel.nameTR}</h3>
                  <p className="text-slate-500 text-[11px] mb-4">{hotel.location}</p>
                  
                  <div className="mt-auto">
                    <div className="bg-white border border-slate-200 text-[#24292E] text-[11px] font-bold px-2 py-2 rounded-sm mb-4 flex items-center justify-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-primary">sell</span>
                      Erken Rezervasyon %40 İndirim + 9 Taksit
                    </div>
                    
                    <div className="text-slate-400 text-xs line-through mb-1">
                      {oldPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </div>
                    <div className="text-[#24292E] text-2xl font-black">
                      {newPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-sm font-bold">TL</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* View All Link */}
        <div onClick={() => navigate('/hotels?q=antalya')} className="bg-[#F0F0F0] text-center py-3 border border-slate-200 text-[#24292E] font-bold text-sm hover:bg-slate-200 cursor-pointer transition-colors flex items-center justify-center gap-1 rounded-sm">
          Antalya Otelleri <span className="material-symbols-outlined text-sm">play_arrow</span>
        </div>

        {/* Bottom Asymmetric Promo Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <div onClick={() => navigate('/tours')} className="lg:col-span-2 relative h-[300px] group cursor-pointer overflow-hidden rounded-sm">
            <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Yurt Dışı Turları" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#24292E] to-transparent p-6">
              <div className="bg-primary text-white px-6 py-3 inline-block font-black text-lg rounded-sm shadow-lg">
                Yurt Dışı Turları
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div onClick={() => navigate('/tours?q=bayram')} className="relative h-[142px] group cursor-pointer overflow-hidden rounded-sm bg-[#24292E]">
              <img src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&h=200&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" alt="Promo" />
              <div className="absolute inset-0 p-4 flex flex-col justify-center">
                <div className="text-white text-lg font-black leading-tight">1,5 Gün İzinle<br/>9 Günlük Kurban Bayramı Tatili</div>
                <div className="flex items-end gap-2 mt-2">
                  <div className="bg-primary text-white px-3 py-1 font-black text-2xl flex items-center rounded shadow">85 <span className="text-sm ml-1">€</span></div>
                  <div className="bg-[#F0F0F0] text-[#24292E] text-[10px] font-black px-2 py-1 leading-tight rounded border border-slate-300">'dan Başlayan<br/>Fiyatlarla</div>
                </div>
              </div>
            </div>
            <div onClick={() => navigate('/hotels?q=kıbrıs')} className="relative h-[142px] group cursor-pointer overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Promo" />
              <div className="absolute bottom-4 left-4">
                <div className="bg-[#24292E] text-white px-4 py-2 font-black text-sm shadow-lg border-l-4 border-primary">Kıbrıs Otelleri</div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
