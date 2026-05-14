import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { siteContent } from '../../data/content';

export default function ContactPage() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="pt-28 pb-20 px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-6">{t('contact.title')}</h1>
        <p className="text-xl text-slate-600">{t('contact.getInTouch')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f3f2ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#0054cb]">location_on</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">{t('contact.address')}</h3>
              <p className="text-slate-600">{lang === 'tr' ? siteContent.address.tr : siteContent.address.en}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f3f2ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#0054cb]">phone</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Telefon</h3>
              <p className="text-slate-600">{siteContent.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f3f2ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#0054cb]">mail</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">E-posta</h3>
              <p className="text-slate-600">{siteContent.contactEmail}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <p className="text-green-700 text-sm font-bold">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.name')}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0054cb]/20 focus:border-[#0054cb] outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.email')}</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0054cb]/20 focus:border-[#0054cb] outline-none transition-all" 
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.subject')}</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0054cb]/20 focus:border-[#0054cb] outline-none transition-all" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.message')}</label>
              <textarea 
                rows="5" 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0054cb]/20 focus:border-[#0054cb] outline-none transition-all"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="w-full md:w-auto px-8 py-4 bg-[#0054cb] text-white rounded-xl font-bold hover:bg-[#056bfd] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gönderiliyor...
                </>
              ) : (
                t('contact.send')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
