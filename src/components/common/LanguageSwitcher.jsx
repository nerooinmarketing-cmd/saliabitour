import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSwitcher({ variant = 'light' }) {
  const { lang, switchLanguage } = useLanguage();
  const isLight = variant === 'light';

  return (
    <div className="relative group">
      <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-sm ${isLight ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 hover:bg-slate-800'}`}>
        <span className="material-symbols-outlined text-xl">language</span>
        <span>{lang === 'tr' ? 'TR' : 'EN'}</span>
        <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">expand_more</span>
      </button>
      <div className={`absolute right-0 top-full mt-1 w-40 rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] ${isLight ? 'bg-white border-slate-100' : 'bg-slate-800 border-slate-700'}`}>
        <button
          onClick={() => switchLanguage('tr')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${lang === 'tr' ? 'text-[#0054cb] font-bold bg-blue-50' : isLight ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          <span className="flex items-center gap-3"><span className="text-base">🇹🇷</span> Türkçe</span>
          {lang === 'tr' && <span className="material-symbols-outlined text-sm">check</span>}
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${lang === 'en' ? 'text-[#0054cb] font-bold bg-blue-50' : isLight ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          <span className="flex items-center gap-3"><span className="text-base">🇺🇸</span> English</span>
          {lang === 'en' && <span className="material-symbols-outlined text-sm">check</span>}
        </button>
      </div>
    </div>
  );
}
