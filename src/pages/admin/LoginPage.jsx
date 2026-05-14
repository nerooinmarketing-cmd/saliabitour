import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      let errorMsg = res.error || 'Giriş başarısız';
      if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/wrong-password')) {
        errorMsg = 'Hatalı şifre girdiniz. Firebase\'de hesabı oluştururken girdiğiniz şifre ile ekrandaki şifre uyuşmuyor. Lütfen Firebase Console üzerinden şifrenizi sıfırlayıp tekrar deneyin.';
      } else if (errorMsg.includes('auth/user-not-found')) {
        errorMsg = 'Kullanıcı bulunamadı. Lütfen e-posta adresini doğru yazdığınızdan emin olun.';
      } else if (errorMsg.includes('auth/operation-not-allowed')) {
        errorMsg = 'E-posta/Şifre ile giriş yöntemi Firebase Console üzerinde aktif değil.';
      } else if (errorMsg.includes('auth/too-many-requests')) {
        errorMsg = 'Çok fazla başarısız deneme yaptınız. Lütfen biraz bekleyip tekrar deneyin veya şifrenizi sıfırlayın.';
      }
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#056BFD] tracking-tight mb-2">byglobal</h1>
          <p className="text-slate-500 font-medium">{t('admin.login.title')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('admin.login.email')}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f3f2ff] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#056BFD] transition-all outline-none"
                placeholder="admin@byglobal.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.login.password')}</label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f3f2ff] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#056BFD] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#056BFD] text-white py-4 rounded-xl font-bold hover:bg-[#0054cb] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
            {t('admin.login.loginBtn')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">Demo: admin@byglobal.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
