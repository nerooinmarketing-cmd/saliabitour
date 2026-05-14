import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import WhatsAppButton from '../components/common/WhatsAppButton';
import SearchSidebar from '../components/common/SearchSidebar';
import { useSettings } from '../contexts/SettingsContext';

export default function PublicLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { menus, topBarMenus, uiElements, salesOffices } = useSettings();
  const navLinks = menus.filter(m => m.active);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 4000);
  };

  const notifications = [
    { id: 1, text: 'Erken rezervasyon fırsatları başladı!', time: '2 saat önce', icon: 'sell' },
    { id: 2, text: 'Yeni tur rotaları eklendi', time: '1 gün önce', icon: 'explore' },
    { id: 3, text: 'Kurban Bayramı otelleri açıldı', time: '3 gün önce', icon: 'hotel' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      {uiElements.topAnnouncement.visible && (
        <div 
          className="py-2 px-4 text-center text-xs font-bold text-white flex items-center justify-center gap-4"
          style={{ backgroundColor: uiElements.topAnnouncement.bgColor }}
        >
          <span>{uiElements.topAnnouncement.text}</span>
          {uiElements.topAnnouncement.linkPath && (
            <Link to={uiElements.topAnnouncement.linkPath} className="bg-white text-primary px-3 py-1 rounded-md text-[10px] font-black uppercase hover:bg-[#F0F0F0] transition-colors">
              {uiElements.topAnnouncement.linkText}
            </Link>
          )}
        </div>
      )}

      {/* Utility Bar */}
      <div className="bg-white border-b border-slate-100 hidden lg:block relative z-[60]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-10 flex justify-end items-center gap-6 text-[11px] text-[#24292E] font-medium">
          {topBarMenus.filter(m => m.active).map(menu => {
            if (menu.isPhone) {
              return (
                <div key={menu.id} className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">{menu.icon}</span>
                  <span className="font-bold text-[#24292E]">{menu.value}</span>
                </div>
              );
            }
                <div key={menu.id} className="relative group flex items-center gap-1 cursor-pointer hover:text-primary transition-colors py-2">
                  <span className="material-symbols-outlined text-sm">{menu.icon}</span>
                  {menu.value}
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                  
                  {/* Dropdown for offices */}
                  <div className="absolute top-full right-0 mt-0 w-72 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 py-3 hidden group-hover:block z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Arrow */}
                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-l border-t border-slate-100 rotate-45"></div>
                    
                    <div className="px-5 py-2 border-b border-slate-50 mb-1">
                      <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">{t('public.offices')}</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {salesOffices.map(office => (
                        <div key={office.id} className="px-5 py-4 hover:bg-slate-50 transition-all flex flex-col gap-1 border-b border-slate-50 last:border-0 group/item">
                          <span className="font-black text-[#24292E] text-xs group-hover/item:text-primary transition-colors">{office.name}</span>
                          <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">call</span>
                            <span className="text-[11px] font-bold">{office.phone}</span>
                          </div>
                          {office.mapUrl && (
                            <a href={office.mapUrl} target="_blank" rel="noreferrer" className="text-primary text-[10px] font-black hover:underline flex items-center gap-1 mt-2 bg-red-50 w-fit px-2 py-1 rounded">
                              <span className="material-symbols-outlined text-[12px]">map</span>
                              {t('public.viewOnMap')}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            return (
              <Link key={menu.id} to={menu.path} className="hover:text-primary transition-colors flex items-center gap-1">
                {menu.icon && <span className="material-symbols-outlined text-sm">{menu.icon}</span>}
                {menu.value}
              </Link>
            );
          })}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 w-full z-50 bg-white shadow-sm">
        <nav className="flex justify-between items-center h-20 px-6 lg:px-8 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg group-hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-[#24292E]">
                  by<span className="text-primary">tour</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Premium Travel</span>
              </div>
            </Link>
            
            <div className="hidden xl:flex gap-5">
              {navLinks.map(link => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className={`text-[13px] font-bold transition-colors ${location.pathname + location.search === link.path ? 'text-primary' : 'text-[#24292E] hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#24292E] hover:text-primary relative transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-white"></span>
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#24292E]">{t('public.notifications')}</h3>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-sm">{n.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#24292E]">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link to="/admin/login" className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 hover:bg-[#F0F0F0] transition-colors group">
              <span className="material-symbols-outlined text-[#24292E] group-hover:text-primary transition-colors">account_circle</span>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[11px] font-bold text-[#24292E]">{t('public.login')}</div>
                <div className="text-[9px] text-slate-500">{t('public.orRegister')}</div>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 text-[#24292E] hover:bg-[#F0F0F0] rounded-lg"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t border-[#F0F0F0] animate-fade-in overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition-colors ${location.pathname + location.search === link.path ? 'text-primary bg-red-50' : 'text-[#24292E] hover:bg-[#F0F0F0]'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Left Button */}
      {uiElements.leftStickyPromo.visible && (
        <Link to={uiElements.leftStickyPromo.path} className="hidden xl:flex fixed left-0 top-1/2 -translate-y-1/2 bg-primary text-white py-4 px-2 rounded-r-lg z-50 cursor-pointer hover:bg-secondary transition-colors items-center justify-center writing-vertical shadow-lg">
          <span className="transform -rotate-180 writing-vertical-rl text-sm font-black tracking-widest whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>{uiElements.leftStickyPromo.text}</span>
          <span className="material-symbols-outlined transform -rotate-90 mt-2 text-lg">chevron_right</span>
        </Link>
      )}

      {/* Sticky Right Buttons */}
      {uiElements.rightStickyButtons.visible && (
        <div className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-4 z-50 items-end">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-white text-[#24292E] px-4 py-2 rounded-l-full shadow-[0_0_15px_rgba(0,0,0,0.1)] font-bold text-sm flex items-center gap-2 hover:bg-[#F0F0F0] transition-colors border border-r-0 border-slate-200">
            <span className="material-symbols-outlined text-lg">arrow_upward</span> {t('public.backToTop')}
          </button>
          <button className="bg-white p-3 rounded-l-full shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:bg-[#F0F0F0] transition-colors border border-r-0 border-slate-200">
            <div className="w-10 h-10 bg-[#24292E] rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined">headset_mic</span>
            </div>
          </button>
          <Link to="/contact" className="bg-primary text-white px-6 py-3 rounded-l-md shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
            <span className="material-symbols-outlined">call</span> {t('public.callUs')}
          </Link>
        </div>
      )}

      {/* Page Content */}
      <main>
        {location.pathname === '/tours' || location.pathname === '/hotels' ? (
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
            <div className="hidden lg:block w-[300px] shrink-0 sticky top-28 h-fit">
              <SearchSidebar />
            </div>
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full mt-20 bg-[#24292E] text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-8 lg:px-12 max-w-[1200px] mx-auto">
          <div className="space-y-4">
            <span className="text-2xl font-black text-white">by<span className="text-primary">tour</span></span>
            <p className="text-sm text-slate-400 leading-relaxed">{t('footer.description')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">{t('footer.explore')}</span>
            <Link to="/tours" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('nav.tours')}</Link>
            <Link to="/hotels" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('nav.hotels')}</Link>
            <Link to="/blog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('nav.blog')}</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">{t('footer.support')}</span>
            <Link to="/contact" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('footer.contactUs')}</Link>
            <Link to="/about" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('footer.aboutUs')}</Link>
            <Link to="/contact" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('footer.faq')}</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">{t('footer.legal')}</span>
            <Link to="/about" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/about" className="text-xs uppercase tracking-wider text-slate-400 hover:text-primary transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-slate-700 py-8 bg-[#1a1e22]">
          <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{t('newsletter.title')}</h3>
              <p className="text-sm text-slate-400">{t('newsletter.subtitle')}</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-[400px]">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')} 
                className="flex-1 px-4 py-3 bg-[#24292E] border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors" 
              />
              <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-secondary transition-colors shadow-lg">
                {t('newsletter.subscribe')}
              </button>
            </form>
          </div>
          {newsletterSuccess && (
            <div className="max-w-[1200px] mx-auto px-8 mt-4">
              <div className="bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {t('public.newsletterSuccess')}
              </div>
            </div>
          )}
        </div>
        
        <div className="py-6 text-center bg-[#14171a]">
          <p className="text-xs uppercase tracking-wider text-slate-500">{t('footer.copyright')}</p>
        </div>
      </footer>

      {/* WhatsApp Float */}
      {uiElements.whatsapp.visible && (
        <WhatsAppButton number={uiElements.whatsapp.number} message={uiElements.whatsapp.message} />
      )}
    </div>
  );
}
