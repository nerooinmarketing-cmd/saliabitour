import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { tourCategories } from '../../data/tours';

export default function ToursPage() {
  const { t, lang } = useLanguage();
  const { tours } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const filtered = tours
    .filter(t => t.status !== 'inactive')
    .filter(tour => {
      const name = lang === 'tr' ? tour.titleTR : tour.titleEN;
      const location = tour.location || '';
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || tour.category === selectedCategory;
      return matchSearch && matchCategory;
    });

  return (
    <div className="pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 capitalize">
          {search ? `${search} ${t('tours.title')}` : t('tours.title')}
        </h1>
        <p className="text-lg text-slate-500 mt-2">{filtered.length} {t('tours.found')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Horizontal Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-700">{t('filters.theme')}:</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === 'all' ? 'bg-[#dae2ff] text-[#001847]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {t('admin.reservations.all')}
              </button>
              {tourCategories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === cat.id ? 'bg-[#dae2ff] text-[#001847]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {lang === 'tr' ? cat.nameTR : cat.nameEN}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="text-[#0054cb] text-xs font-bold uppercase whitespace-nowrap">{t('filters.reset')}</button>
        </div>

        {/* Tour Listings */}
        <div className="space-y-6">
          {filtered.map(tour => (
            <Link key={tour.id} to={`/tours/${tour.slug}`} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row group hover:shadow-md transition-shadow">
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={tour.images[0]} alt={lang === 'tr' ? tour.titleTR : tour.titleEN} />
                {tour.featured && <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#0054cb]">{t('tours.bestSeller')}</span>}
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-[#934700]">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">{tour.rating}</span>
                      <span className="text-xs text-slate-400">({tour.reviewCount} {t('tours.reviews')})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{lang === 'tr' ? tour.titleTR : tour.titleEN}</h3>
                  <div className="flex gap-4 mb-3">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-sm">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-sm">group</span>
                      <span className="text-sm">{t('tours.maxGroup')} {tour.maxParticipants}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{lang === 'tr' ? tour.descriptionTR : tour.descriptionEN}</p>
                </div>
                <div className="flex items-end justify-between pt-4 border-t border-slate-100 mt-4">
                  <div>
                    <span className="text-xs text-slate-400">{t('tours.startingFrom')}</span>
                    <div className="text-xl font-bold text-slate-800">₺{tour.price.toLocaleString()} <span className="text-sm font-normal text-slate-400">{t('tours.perPersonShort')}</span></div>
                  </div>
                  <span className="px-5 py-2 rounded-lg bg-[#0054cb] text-white text-sm font-bold shadow-lg shadow-[#0054cb]/20">{t('tours.viewDetails')}</span>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
              <p className="text-lg">{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
