import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Gerçek login işlemi (AuthContext üzerinden)
      await login(email, password);
      // Başarılıysa yönlendir
      const fullRedirect = redirect + (window.location.search.replace('?redirect=' + redirect, '').replace('redirect=' + redirect, ''));
      navigate(fullRedirect);
    } catch (err) {
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f4f4f4] px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#003580] p-8 text-center text-white">
          <h1 className="text-2xl font-black mb-2">Hoş Geldiniz</h1>
          <p className="text-blue-100 text-sm font-medium">Rezervasyonunuza devam etmek için lütfen giriş yapın.</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1 block">E-posta Adresi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">mail</span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Şifre</label>
                <button type="button" className="text-[10px] font-bold text-[#0073bc] hover:underline">Şifremi Unuttum</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">lock</span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0073bc] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0073bc] hover:bg-[#0054cb] text-white font-black py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-sm tracking-wider"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm font-medium">Henüz üye değil misiniz?</p>
            <Link to="/register" className="text-[#0073bc] font-black text-sm hover:underline mt-1 block">Hemen Ücretsiz Kayıt Olun</Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-slate-200 p-2.5 rounded-lg hover:bg-slate-50 transition-all">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-xs font-bold text-slate-600">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 p-2.5 rounded-lg hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[#1877F2]">facebook</span>
              <span className="text-xs font-bold text-slate-600">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
