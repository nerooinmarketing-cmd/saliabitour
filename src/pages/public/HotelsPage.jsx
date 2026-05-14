import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { amenityIcons } from '../../data/hotels';

export default function HotelsPage() {
  const { t, lang } = useLanguage();
  const { hotels } = useData();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const filtered = hotels
    .filter(h => h.status !== 'inactive')
    .filter(hotel => {
      const name = lang === 'tr' ? hotel.nameTR : hotel.nameEN;
      const location = hotel.location || '';
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || hotel.category === parseInt(selectedCategory);
      return matchSearch && matchCategory;
    });

  return (
    <div className="pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 capitalize">
          {search ? `${search} ${t('hotels.title')}` : t('hotels.title')}
        </h1>
        <p className="text-lg text-slate-500 mt-2">{filtered.length} {lang === 'tr' ? 'otel bulundu' : 'hotels found'}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Horizontal Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-700">{lang === 'tr' ? 'Yıldız Sayısı' : 'Star Rating'}:</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === 'all' ? 'bg-[#dae2ff] text-[#001847]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {t('admin.reservations.all')}
              </button>
              {[5, 4, 3].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat.toString())} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === cat.toString() ? 'bg-[#dae2ff] text-[#001847]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {cat} {lang === 'tr' ? 'Yıldız' : 'Stars'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="text-[#0054cb] text-xs font-bold uppercase whitespace-nowrap">{t('filters.reset')}</button>
        </div>

        {/* Hotel Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(hotel => (
            <Link key={hotel.id} to={`/hotels/${hotel.slug}`} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="relative h-56 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={hotel.images[0]} alt={lang === 'tr' ? hotel.nameTR : hotel.nameEN} />
                {hotel.featured && <span className="absolute top-4 left-4 bg-[#0054cb] text-white px-3 py-1 rounded-lg text-xs font-bold">{t('common.featured')}</span>}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#934700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold">{hotel.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(hotel.category)].map((_, i) => <span key={i} className="material-symbols-outlined text-[#934700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{lang === 'tr' ? hotel.nameTR : hotel.nameEN}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                  <span className="material-symbols-outlined text-sm">location_on</span>{hotel.location}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map(a => (
                    <span key={a} className="flex items-center gap-1 px-2 py-1 bg-[#f3f2ff] rounded text-xs text-slate-600">
                      <span className="material-symbols-outlined text-sm">{amenityIcons[a]?.icon}</span>
                      {lang === 'tr' ? amenityIcons[a]?.tr : amenityIcons[a]?.en}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">{lang === 'tr' ? 'Başlayan fiyat' : 'From'}</span>
                    <div className="text-lg font-bold text-slate-800">₺{hotel.roomTypes[0]?.price.toLocaleString()} <span className="text-sm font-normal text-slate-400">{t('hotels.perNight')}</span></div>
                  </div>
                  <span className="px-4 py-2 bg-[#0054cb] text-white rounded-lg text-sm font-bold">{t('tours.viewDetails')}</span>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
              <p className="text-lg">{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
