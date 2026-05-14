import { useLanguage } from '../../contexts/LanguageContext';
import { siteContent } from '../../data/content';

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const text = lang === 'tr' ? siteContent.aboutText.tr : siteContent.aboutText.en;

  return (
    <div className="pt-28 pb-20 px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-6">{t('about.title')}</h1>
        <p className="text-xl text-slate-600 leading-relaxed">{text}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJC2F5sUwuu8JmM2RNDGCSWfZgTNUyyWURt3OKM_wlaAs39Fcp6KWgJ_DyMUuPShrFpmkHM8zGLOJ2CliFVjjPuSfnVw6j5TRpsV4Rva7MzGXOvvV4H8xyY_3DVzadJhyFOjhTTYQmd_rqOqE6f9ZaRLkcBx7ZjB02z7Tvn2hBfZkuuiBUUdil__QFuxwR5hABrXavEYh83BuA1lzCJ3GyGOe_hQzBS19Mz40sWDYTFc1Sepsdn0SKZ8Acamsdy4Oy0iRJ3RgYMMt9" alt="Our Story" className="w-full h-[400px] object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{t('about.story')}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {lang === 'tr' 
              ? '2010 yılından bu yana, dünyayı keşfetmek isteyen gezginlere unutulmaz deneyimler sunuyoruz. Tutkulu ekibimizle her bir seyahati özenle planlıyor, detaylara verdiğimiz önemle fark yaratıyoruz.'
              : 'Since 2010, we have been offering unforgettable experiences to travelers who want to explore the world. With our passionate team, we carefully plan every trip and make a difference with our attention to detail.'}
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#f3f2ff] p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#0054cb] mb-2">{t('about.mission')}</h3>
              <p className="text-sm text-slate-600">{lang === 'tr' ? 'Müşterilerimize en kaliteli ve güvenilir seyahat deneyimini sunmak.' : 'To provide our customers with the highest quality and most reliable travel experience.'}</p>
            </div>
            <div className="bg-[#f3f2ff] p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#0054cb] mb-2">{t('about.vision')}</h3>
              <p className="text-sm text-slate-600">{lang === 'tr' ? 'Dünya çapında tanınan ve tercih edilen lider turizm markası olmak.' : 'To become a globally recognized and preferred leading tourism brand.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
