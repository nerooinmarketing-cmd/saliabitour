import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { blogPosts } from '../../data/content';

export default function BlogPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="pt-28 pb-20 px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800">{t('blog.title')}</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
            <div className="h-48 overflow-hidden relative">
              <img src={post.image} alt={lang === 'tr' ? post.titleTR : post.titleEN} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#0054cb] uppercase">
                {post.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span>{post.date}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span>{post.author}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 hover:text-[#0054cb] transition-colors cursor-pointer">
                {lang === 'tr' ? post.titleTR : post.titleEN}
              </h2>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {lang === 'tr' ? post.excerptTR : post.excerptEN}
              </p>
              <button className="text-[#0054cb] font-bold text-sm flex items-center gap-1 hover:underline">
                {t('blog.readMore')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
