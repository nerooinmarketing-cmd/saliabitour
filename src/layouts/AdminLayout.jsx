import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const sidebarLinks = [
  { path: '/admin', icon: 'dashboard', labelKey: 'admin.sidebar.dashboard', exact: true },
  { path: '/admin/tours', icon: 'explore', labelKey: 'admin.sidebar.tours' },
  { path: '/admin/hotels', icon: 'hotel', labelKey: 'admin.sidebar.hotels' },
  { path: '/admin/reservations', icon: 'confirmation_number', labelKey: 'admin.sidebar.reservations' },
  { path: '/admin/customers', icon: 'group', labelKey: 'admin.sidebar.customers' },
  { path: '/admin/payments', icon: 'payments', labelKey: 'admin.sidebar.payments' },
  { path: '/admin/content', icon: 'article', labelKey: 'admin.sidebar.content' },
  { path: '/admin/media', icon: 'perm_media', labelKey: 'admin.sidebar.media' },
  { path: '/admin/settings', icon: 'settings', labelKey: 'admin.sidebar.settings' },
];

export default function AdminLayout() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.path;
    return location.pathname.startsWith(link.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const marginClass = isCollapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen ${sidebarWidth} border-r bg-white border-slate-100 flex flex-col p-4 z-50 transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2`}>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-extrabold text-[#056BFD] tracking-tight">byglobal</h1>
              <p className="text-xs text-slate-500 font-semibold">{t('admin.sidebar.adminPanel')}</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-[#056BFD] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{isCollapsed ? 'menu' : 'menu_open'}</span>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
          {sidebarLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive(link) ? 'text-[#056BFD] bg-blue-50 font-bold' : 'text-slate-500 hover:text-[#056BFD] hover:bg-slate-50'}`}
              title={isCollapsed ? t(link.labelKey) : ''}
            >
              <span className="material-symbols-outlined" style={isActive(link) ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap">{t(link.labelKey)}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 py-2">
          <Link to="/admin/tours/new" className={`bg-[#056bfd] text-white rounded-xl py-3 flex items-center justify-center hover:bg-[#0054cb] transition-colors text-sm font-bold ${isCollapsed ? 'px-0' : 'px-4 gap-2'}`}>
            <span className="material-symbols-outlined text-lg">add</span>
            {!isCollapsed && <span className="whitespace-nowrap">{t('admin.sidebar.addTour')}</span>}
          </Link>
        </div>
      </aside>

      {/* Top Bar */}
      <header className={`sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md border-slate-100 flex justify-between items-center h-16 px-4 lg:px-8 transition-all duration-300 ${marginClass}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden md:flex items-center bg-[#f3f2ff] px-4 py-2 rounded-full w-80 focus-within:ring-2 focus-within:ring-[#056BFD]">
            <span className="material-symbols-outlined text-slate-400 text-lg mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full" placeholder={t('admin.topbar.searchPlaceholder')} type="text" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="hover:bg-slate-100 rounded-full p-2 relative text-slate-600 transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{t('admin.topbar.superAdmin')}</p>
            </div>
            <div className="relative group">
              <img alt="Admin" className="w-9 h-9 rounded-full border-2 border-white shadow-sm cursor-pointer" src={user?.avatar} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-lg">settings</span>
                  {t('admin.sidebar.settings')}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <span className="material-symbols-outlined text-lg">logout</span>
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`p-4 lg:p-8 min-h-[calc(100vh-64px)] transition-all duration-300 ${marginClass}`}>
        <Outlet />
      </main>
    </div>
  );
}
