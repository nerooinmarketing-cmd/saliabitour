import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

export default function TourDetailPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const { tours } = useData();
  const tour = tours.find(t => t.slug === slug);

  if (!tour) return <div className="pt-28 text-center py-20"><p className="text-xl text-slate-400">{t('common.noResults')}</p></div>;

  const title = lang === 'tr' ? tour.titleTR : tour.titleEN;
  const desc = lang === 'tr' ? tour.descriptionTR : tour.descriptionEN;
  
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

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
        <Link to="/" className="hover:text-[#0054cb]">{t('nav.home')}</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link to="/tours" className="hover:text-[#0054cb]">{t('nav.tours')}</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#0054cb]">{title}</span>
      </nav>

      <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">{title}</h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center text-[#934700]">
          {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{i < Math.floor(tour.rating) ? 'star' : 'star_half'}</span>)}
          <span className="ml-2 text-sm font-bold text-slate-700">{tour.rating} ({tour.reviewCount} {t('tours.reviews')})</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1 text-slate-500 text-sm"><span className="material-symbols-outlined text-lg">location_on</span>{tour.location}</div>
      </div>

      {/* Gallery */}
      <div 
        className="rounded-3xl overflow-hidden mb-12 h-[500px] relative group cursor-pointer shadow-2xl"
        onClick={() => openLightbox(tour.images, 0)}
      >
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src={tour.images[0]} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10 opacity-100">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3 text-white transition-all hover:bg-white hover:text-[#056BFD]">
            <span className="material-symbols-outlined">zoom_in</span>
            <span className="font-black text-sm uppercase tracking-widest">Tüm Fotoğrafları İncele</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('tourDetail.highlights')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: 'schedule', label: t('tourDetail.duration'), value: tour.duration },
                { icon: 'group', label: t('tourDetail.groupSize'), value: `${tour.maxParticipants} ${t('tourDetail.upTo')}` },
                { icon: 'language', label: t('tourDetail.languages'), value: 'TR, EN' },
                { icon: 'verified', label: t('tourDetail.cancellation'), value: t('tourDetail.freeCancellation') },
              ].map((h, i) => (
                <div key={i} className="p-4 bg-[#f3f2ff] rounded-xl">
                  <span className="material-symbols-outlined text-[#0054cb] mb-2">{h.icon}</span>
                  <div className="text-xs font-bold text-slate-400">{h.label}</div>
                  <div className="text-sm font-bold">{h.value}</div>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{desc}</p>
          </section>

          {/* Itinerary */}
          {tour.itinerary.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">{t('tourDetail.itinerary')}</h2>
              <div className="space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e3e7ff]">
                {tour.itinerary.map((day, i) => (
                  <div key={i} className="relative pl-12 pb-8">
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 text-sm font-bold ${i === 0 ? 'bg-[#056bfd] text-white' : 'bg-[#dce1ff] text-[#0054cb]'}`}>
                      {day.day}
                    </div>
                    <h3 className="text-lg font-bold mb-1">{lang === 'tr' ? day.titleTR : day.titleEN}</h3>
                    <p className="text-slate-500">{lang === 'tr' ? day.descriptionTR : day.descriptionEN}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Included / Excluded */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f3f2ff] p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#0054cb]">check_circle</span>{t('tourDetail.included')}</h3>
              <ul className="space-y-3">
                {tour.includedServices.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-[#0054cb] text-lg">done</span>{lang === 'tr' ? s.tr : s.en}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f3f2ff] p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined">cancel</span>{t('tourDetail.notIncluded')}</h3>
              <ul className="space-y-3 text-slate-500">
                {tour.excludedServices.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-lg">close</span>{lang === 'tr' ? s.tr : s.en}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Booking Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-2xl font-bold text-[#0054cb]">₺{tour.price.toLocaleString()}</span>
                <span className="text-slate-400 text-sm ml-1">{t('tourDetail.total')}</span>
              </div>
              <div className="flex items-center gap-1 text-[#934700] text-sm font-bold">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {tour.rating}
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('tourDetail.date')}</label>
                <input type="date" className="w-full bg-[#faf8ff] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0054cb]/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('tourDetail.guestsLabel')}</label>
                <select className="w-full bg-[#faf8ff] border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0054cb]/20">
                  {[1,2,3,4,5,6].map(n => <option key={n}>{n} {t('tourDetail.guest')}</option>)}
                </select>
              </div>
            </div>
            <Link to={`/checkout?tour=${tour.id}`} className="block text-center w-full bg-[#0054cb] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#056bfd] transition-all mb-3">{t('tourDetail.bookExperience')}</Link>
            <p className="text-center text-xs text-slate-400">{t('tourDetail.noCharge')}</p>
          </div>
        </div>
      </div>
      {/* LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300" onClick={closeLightbox}>
          <div className="flex justify-between items-center p-6 text-white z-10">
            <div className="font-black text-sm tracking-widest uppercase opacity-60">
              {lightbox.index + 1} / {lightbox.images.length} FOTOĞRAF
            </div>
            <button onClick={closeLightbox} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-4 md:px-20">
            <button onClick={prevImage} className="absolute left-6 md:left-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <span className="material-symbols-outlined text-3xl">chevron_left</span>
            </button>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
              <img src={lightbox.images[lightbox.index]} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500" alt="" />
            </div>
            <button onClick={nextImage} className="absolute right-6 md:right-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <span className="material-symbols-outlined text-3xl">chevron_right</span>
            </button>
          </div>

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
